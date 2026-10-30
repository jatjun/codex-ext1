import pathlib,subprocess,json,hashlib,sys
from PIL import Image,ImageChops
R=pathlib.Path(__file__).resolve().parents[1];plan=json.loads((R/'lesson-data/plan.json').read_text());only=next((a.split('=',1)[1].split(',') for a in sys.argv if a.startswith('--only=')),None);results=[]
if only:results=[r for r in json.loads((R/'reports/validation.json').read_text()) if r['slug'] not in only]
for item in plan:
 if only and item['slug'] not in only:continue
 p=R/'videos'/(item['slug']+'.mp4');assert p.is_file(),p
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)]));s=probe['streams'][0]
 assert len(probe['streams'])==1 and s['codec_name']=='h264' and s['pix_fmt']=='yuv420p'
 assert [s['width'],s['height'],s['r_frame_rate'],s['nb_frames']]==[1080,1920,'30/1','1920']
 assert float(probe['format']['duration'])==64 and p.stat().st_size<100*1024*1024
 (R/'reports'/(p.stem+'-probe.json')).write_text(json.dumps(probe,indent=2))
 check=subprocess.run(['ffmpeg','-hide_banner','-nostats','-i',str(p),'-vf','blackdetect=d=0.5:pix_th=0.1,freezedetect=n=-50dB:d=2','-f','null','-'],capture_output=True)
 assert check.returncode==0;assert b'black_start' not in check.stderr
 (R/'reports'/(p.stem+'-decode.log')).write_bytes(check.stderr)
 for t in [12,28,44,52,62]:
  dest=R/'assets'/f'{p.stem}-{t}.png'
  if not dest.exists():subprocess.run(['ffmpeg','-v','error','-ss',str(t),'-i',str(p),'-frames:v','1',str(dest)],check=True)
 # Subject-only sample excludes title, subtitles, and progress bar.
 a=Image.open(R/'assets'/f'{p.stem}-12.png').crop((70,460,1030,1350));b=Image.open(R/'assets'/f'{p.stem}-44.png').crop((70,460,1030,1350))
 movement=ImageChops.difference(a,b).getbbox() is not None
 assert movement,(p,'subject did not change')
 results.append(dict(slug=p.stem,title=item['title'],subject=item['subject'],file='videos/'+p.name,seconds=64,bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),source=item['source_file']+'#'+item['source_id'],decode='PASS',format='PASS',black='PASS',subject_change='PASS',freeze='READING_HOLDS_REQUIRE_REVIEW',audio='NONE',iphone='DEVICE_TEST_PENDING'))
 print(p.stem,'TECHNICAL_PASS',flush=True)
results.sort(key=lambda result:next(i for i,p in enumerate(plan) if p['slug']==result['slug']))
assert len(results)==len(plan)
(R/'reports/validation.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
# Four contact sheets, one row per lesson; individual frames stay available.
for start in range(0,len(plan),8):
 sheet=Image.new('RGB',(1350,480*min(8,len(plan)-start)),'white')
 for row,item in enumerate(plan[start:start+8]):
  for col,t in enumerate([12,28,44,52,62]):
   im=Image.open(R/'assets'/f"{item['slug']}-{t}.png");im.thumbnail((270,480));sheet.paste(im,(col*270,row*480))
 sheet.save(R/'assets'/f'encoded-contact-{start//8+1}.jpg')
print('ALL',len(results),'PASS; TOTAL_BYTES',sum(r['bytes'] for r in results),flush=True)
