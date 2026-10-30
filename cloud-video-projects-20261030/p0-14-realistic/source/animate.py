"""Composite original Blender car renders into a 15-second 2.5D animation.
No external models, photos, footage, music or network access.
"""
from pathlib import Path
import math,random,sys,subprocess,time,json
from PIL import Image,ImageDraw,ImageFilter
import numpy as np
from graphic_base import Art,ease,alpha,TEAL,INK,BACKGROUND

ROOT=Path(__file__).resolve().parents[1]
random.seed(18)
cars={k:Image.open(ROOT/'assets'/f'car_{k}.png').convert('RGBA').filter(ImageFilter.MedianFilter(3)) for k in ['hero','side','front']}
foam=[(random.uniform(105,438),random.uniform(460,627),random.uniform(4,13),random.random()*6.28) for _ in range(120)]
drops=[(random.uniform(55,505),random.uniform(0,1),random.uniform(6,17)) for _ in range(36)]
STAGES=[('01 / FOAM APPLICATION','曲面之上，细腻铺展','原创车模 · 泡沫动画演示'),
        ('02 / WATER IN MOTION','流动之间，净洗有序','立体车身 · 冲洗动作演示'),
        ('03 / FINISHING DETAILS','细节之处，打理从容','金属漆面 · 擦拭动作演示')]

def car_layer(t,i):
 im=cars[['hero','side','front'][i]]
 local=max(0,min(5,t-i*5))
 z=1.0+.035*ease(local/5)
 w=int(1080*z);h=int(860*z)
 im=im.resize((w,h),Image.Resampling.BICUBIC)
 out=Art();x=int((1080-w)/2+8*math.sin(t*.3));y=int(625+(860-h)/2)
 out.im.alpha_composite(im,(x,y))
 return out.im

def frame(t):
 a=Art();a.im=BACKGROUND.copy();a.d=ImageDraw.Draw(a.im)
 phase=min(2,int(t/5))
 a.text((32,43),'AUTO / CARE',17,TEAL,True)
 a.rect((396,40,508,67),'#FFFFFF',13)
 a.text((452,54),'3D STUDY',11,TEAL,anchor='mm')
 a.line([(32,80),(508,80)],'#C9DEDA',1)
 for i in range(3):
  x=32+i*162;a.rect((x,107,x+152,110),'#CDDEDA',2)
  f=max(0,min(1,(t-i*5)/5))
  if f:a.rect((x,107,x+max(2,152*f),110),TEAL,2)
 # Editorial headline spacing is stable on a phone; dissolve without double text.
 for i,(k,title,sub) in enumerate(STAGES):
  en=ease((t-i*5)/.4) if i else ease(t/.7)
  le=1-ease((t-((i+1)*5-.4))/.4) if i<2 else 1
  if en*le<=0:continue
  tx=Art();dy=10*(1-en)
  tx.text((32,146+dy),k,11,TEAL,True)
  parts=title.split('，')
  tx.text((30,184+dy),parts[0],39,INK,True)
  tx.text((30,237+dy),parts[1],39,INK,True)
  tx.text((32,301+dy),sub,15,'#5B7780')
  a.im.alpha_composite(alpha(tx.im,en*le))
 a.d=ImageDraw.Draw(a.im)
 # Fine technical halo and studio platform set the model apart from real footage.
 a.ellipse((65,385,500,761),None,(177,209,202,180),1)
 a.line([(32,735),(508,735)],'#C4DAD5',1)
 current=car_layer(t,phase)
 # Cross-dissolve the true 3D viewpoints, with independent slow dolly motion.
 if phase>0 and t-phase*5<.6:
  f=ease((t-phase*5)/.6)
  current=Image.blend(car_layer(t,phase-1),current,f)
 a.im.alpha_composite(current)
 fx=Art()
 if phase==0 or (phase==1 and t<7.5):
  amount=ease((t-.7)/2) if phase==0 else 1-ease((t-5)/2.5)
  for j,(x,y,r,seed) in enumerate(foam):
   if j/len(foam)>amount:continue
   y+=2*math.sin(seed+t)
   fx.ellipse((x-r,y-r,x+r,y+r),(245,255,253,220))
   fx.ellipse((x-r*.5,y-r*.6,x-r*.05,y-r*.16),(255,255,255,245))
  # Clip foam to the model image's actual opaque body/tyres, not its soft shadow.
  rgba=np.asarray(current)
  # Shadow catcher alpha can be opaque under the chassis; exclude its black RGB.
  mask=np.where((rgba[:,:,3]>245)&(rgba[:,:,:3].astype('uint16').sum(axis=2)>140),255,0).astype('uint8')
  fa=np.minimum(np.asarray(fx.im.getchannel('A')),mask)
  fx.im.putalpha(Image.fromarray(fa))
 a.im.alpha_composite(fx.im)
 fx=Art()
 if phase==0:
  for j in range(13):
   f=(t*.21+j*.083)%1;x=60+j*35+6*math.sin(t+j);y=585-f*230;r=3+j%4
   fx.ellipse((x-r,y-r,x+r,y+r),(255,255,255,int(170*math.sin(f*math.pi))), '#F7FFFF',1)
 if phase==1:
  u=t-5;op=ease(u/.7)*(1-ease((u-4.0)/.8))
  tip=(493,411+10*math.sin(u))
  for j in range(5):
   x=115+j*31+50*math.sin(u*1.7)
   fx.line([tip,(x,625+j*3)],(105,190,212,int((110-j*12)*op)),3)
  for x,seed,l in drops:
   y=420+((seed+u*.7)%1)*270
   fx.line([(x,y),(x-6,y+l)],(75,162,188,int(120*op)),1)
  fx.rect((486,391,523,414),'#234451',5)
  fx.line([(504,401),(535,364)],'#5B7A84',9)
 if phase==2:
  u=t-10
  if u<3.7:
   x=265+65*math.sin(u*1.9);y=545+9*math.sin(u*2)
   fx.rect((x-24,y-12,x+24,y+12),'#EADFC1',5,outline='#C2B799')
   for j in range(3):fx.line([(x-18,y-6+j*5),(x+17,y-6+j*5)],'#D5C9AD',1)
  for j,(x,y) in enumerate([(352,514),(430,566),(236,487)]):
   r=10*max(0,math.sin(u*2-j))**6
   if r>1:
    fx.line([(x-r,y),(x+r,y)],'#FFFFFF',1.5);fx.line([(x,y-r),(x,y+r)],'#FFFFFF',1.5)
 a.im.alpha_composite(fx.im);a.d=ImageDraw.Draw(a.im)
 a.rect((32,762,508,850),'#FFFFFF',18)
 for i,label in enumerate(['曲面泡沫','水流冲洗','细节打理']):
  x=49+i*157;active=phase==i
  a.ellipse((x,782,x+23,805),TEAL if active else '#E0ECE7')
  a.text((x+11.5,793.5),str(i+1),11,'#FFFFFF' if active else '#6E898E',True,anchor='mm')
  a.text((x+31,784),label,14,INK if active else '#8AA09F',True)
  a.text((x+31,810),['FOAM','RINSE','DETAIL'][i],9,TEAL if active else '#8AA09F')
 a.text((270,880),'原创动画模拟样片',17,TEAL,True,anchor='mt')
 a.text((270,911),'原创三维车模 / 合成清洁动画 / 非实拍',11,'#6B848A',anchor='mt')
 if t>13.4:
  lock=Art();lock.rect((119,354,421,395),(255,255,255,230),20)
  lock.text((270,374),'让洁净，更有质感',19,TEAL,True,anchor='mm')
  a.im.alpha_composite(alpha(lock.im,ease((t-13.4)/.5)))
 return a.im.convert('RGB')

if '--preview' in sys.argv:
 for t in [2.5,7.5,12.5,14.5]:frame(t).save(ROOT/'frames'/f'preview_{t:04.1f}.png')
else:
 cmd=['ffmpeg','-hide_banner','-nostdin','-y','-f','rawvideo','-pix_fmt','rgb24','-s','1080x1920','-r','30',
      '-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','20','-threads','2','-pix_fmt','yuv420p',
      '-movflags','+faststart',str(ROOT/'original_car_care.mp4')]
 start=time.monotonic()
 with (ROOT/'render.log').open('w') as log:
  p=subprocess.Popen(cmd,stdin=subprocess.PIPE,stdout=log,stderr=log)
  for n in range(450):
   p.stdin.write(frame(n/30).tobytes())
   if n%90==0:print('frame',n,'elapsed',round(time.monotonic()-start,1),flush=True)
  p.stdin.close();rc=p.wait()
 m={'returncode':rc,'wall_seconds':time.monotonic()-start,'frames':450,'fps':30,'audio':False}
 (ROOT/'render_metrics.json').write_text(json.dumps(m,indent=2));print(json.dumps(m))
 if rc:raise SystemExit(rc)
