import subprocess,json,pathlib,hashlib
R=pathlib.Path(__file__).resolve().parents[1]
results=[]
for p in (R/'videos').glob('*.mp4'):
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)]));s=probe['streams'][0]
 assert (s['width'],s['height'],s['codec_name'],s['r_frame_rate'],s['pix_fmt'])==(1080,1920,'h264','30/1','yuv420p')
 assert float(probe['format']['duration'])==72 and int(s['nb_frames'])==2160
 log=subprocess.run(['ffmpeg','-hide_banner','-i',str(p),'-vf','blackdetect=d=0.5:pix_th=0.1,freezedetect=n=-50dB:d=2','-f','null','-'],capture_output=True)
 assert log.returncode==0
 (R/'reports'/f'{p.stem}-decode.log').write_bytes(log.stderr)
 assert b'black_start' not in log.stderr
 # Static holds are intentional independent thinking / reading time; review freeze intervals manually.
 (R/'reports'/f'{p.stem}-probe.json').write_text(json.dumps(probe,indent=2))
 for t in [12,25,32,40,46,55,65]:
  subprocess.run(['ffmpeg','-v','error','-ss',str(t),'-i',str(p),'-frames:v','1',str(R/'assets'/f'{p.stem}-{t}.png')],check=True)
 results.append(dict(file=p.name,seconds=72,bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),decode='PASS',black='PASS',freeze='REVIEW_INTENTIONAL_HOLDS',audio='NONE',iphone='DEVICE_TEST_PENDING'))
assert len(results)==3
(R/'reports'/'validation.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
