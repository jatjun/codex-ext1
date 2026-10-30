"""Verify the actual encoded video and retain machine-readable QA evidence."""
from pathlib import Path
import subprocess,json,hashlib
import numpy as np
from PIL import Image,ImageDraw,ImageFont

ROOT=Path(__file__).resolve().parents[1]
VIDEO=ROOT/'original_car_care.mp4'
probe_cmd=['ffprobe','-v','error','-count_frames','-show_entries',
 'stream=codec_name,codec_type,width,height,pix_fmt,r_frame_rate,duration,nb_read_frames:format=duration,size,format_name',
 '-of','json',str(VIDEO)]
p=subprocess.run(probe_cmd,capture_output=True,text=True,check=True)
(ROOT/'ffprobe.json').write_text(p.stdout)
probe=json.loads(p.stdout);s=probe['streams'][0]
assert s['codec_name']=='h264' and s['width']==1080 and s['height']==1920
assert s['r_frame_rate']=='30/1' and s['nb_read_frames']=='450'
assert abs(float(probe['format']['duration'])-15)<.001

cmd=['ffmpeg','-hide_banner','-nostdin','-i',str(VIDEO),'-vf',
 'blackdetect=d=0.1:pix_th=0.1:pic_th=0.98,scale=90:160,format=gray',
 '-an','-f','rawvideo','-pix_fmt','gray','pipe:1']
r=subprocess.run(cmd,capture_output=True)
(ROOT/'decode.log').write_bytes(r.stderr)
assert r.returncode==0
frames=np.frombuffer(r.stdout,dtype=np.uint8).reshape(-1,160,90)
assert len(frames)==450
deltas=np.abs(np.diff(frames.astype(np.float32),axis=0)).mean(axis=(1,2))
black=[line for line in r.stderr.decode().splitlines() if 'black_start:' in line]
assert not black
times=[.5,2.5,4.9,5.1,7.5,9.9,10.1,12.5,14.5]
sheet=Image.new('RGB',(810,1500),'#E8F2EF');draw=ImageDraw.Draw(sheet)
for i,t in enumerate(times):
    dest=ROOT/'frames'/f'encoded_{t:04.1f}.png'
    subprocess.run(['ffmpeg','-y','-v','error','-ss',str(t),'-i',str(VIDEO),
        '-frames:v','1','-threads','1',str(dest)],check=True)
    with Image.open(dest) as im:sheet.paste(im.resize((270,480)),((i%3)*270,(i//3)*500))
    draw.text(((i%3)*270+8,(i//3)*500+481),f'{t:.1f}s',fill='#173D52')
sheet.save(ROOT/'frames'/'encoded_contact_sheet.jpg',quality=92)
metrics={'probe_pass':True,'full_decode_exit':r.returncode,'decoded_frames':len(frames),
 'black_events':black,'min_frame_mean_luma':float(frames.mean(axis=(1,2)).min()),
 'min_adjacent_frame_mean_abs_diff':float(deltas.min()),
 'max_adjacent_frame_mean_abs_diff':float(deltas.max()),
 'identical_adjacent_thumbnail_pairs':int((deltas==0).sum()),
 'sampled_times':times,'size_bytes':VIDEO.stat().st_size,
 'sha256':hashlib.file_digest(VIDEO.open('rb'),'sha256').hexdigest()}
(ROOT/'validation.json').write_text(json.dumps(metrics,indent=2))
(ROOT/'SHA256SUMS.txt').write_text(metrics['sha256']+'  original_car_care.mp4\n')
print(json.dumps(metrics,indent=2))
