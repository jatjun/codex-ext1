from PIL import Image,ImageDraw,ImageFont
import math,subprocess,json,pathlib
from functools import lru_cache
R=pathlib.Path(__file__).resolve().parents[1]
F='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
@lru_cache(None)
def font(n):return ImageFont.truetype(F,n)
def ease(x):
 x=max(0,min(1,x));return x*x*(3-2*x)
lessons=[('views-top-view',['从上面看，为什么只看到上面？','桌上有一个长方体。一起换个位置看！','物体固定，眼睛从前上方移到正上方。','猜一猜：正上方能直接看到哪个面？','想一想，再继续。','慢慢移到正上方，留意前面怎样变化。','上面朝向眼睛，前面不朝向眼睛。','验证：从正上方，直接看到上面。','迁移：同一个球，换方向看，轮廓呢？','先自己说说理由。','球从前、侧、上看，轮廓都是圆形。','总结：方向改变，看到的面可能不同。']),('cube-opposite-face',['数字正方体：1的对面为什么是6？','一起寻找数字盒上藏起来的面！','前面1，右面3，上面5。','已知：相对两面的数的和是7。','1的对面是多少？先独立想3秒。','前和后相对：7－1＝6。','慢慢绕到背后，追踪同一个盒子。','看到了6！前1和后6隔着盒子相对。','慢慢回到原位，数字没有换面。','迁移：新盒相对和是9，上面2。','下面是多少？想好再看：9－2＝7。','总结：先找相对面，再用总和减已知数。']),('yogurt-word-problem',['酸奶应用题：先分清每组和额外数量','帮小伙伴数酸奶：哪些是同样多的组？','蓝色每组6盒，共3组；橙色另外4盒。','4＋6×3 应先算什么？','先自己想3秒。额外4盒属于每组吗？','三个相同的组：6×3＝18盒。','再把另外4盒移过来，总数没有变。','18＋4＝22盒，4＋6×3＝22。','验证：3组各6盒，加另外4盒，共22盒。','迁移：玩具车25元，4只狗，每只8元。','总价？25＋8×4＝25＋32＝57元。','总结：分清每组、几组和额外数量。'])]
def frame(k,t):
 im=Image.new('RGB',(1080,1920),'#f4f5ec');d=ImageDraw.Draw(im)
 def text(s,y,size=44,color='#173d48'):
  # all text bounded and measured
  lines=[];line=''
  for c in s:
   if d.textlength(line+c,font=font(size))>880:lines.append(line);line=''
   line+=c
  lines.append(line)
  for i,l in enumerate(lines):
   box=d.textbbox((100,y+i*(size+22)),l,font=font(size));assert box[0]>=80 and box[2]<=1000 and box[3]<1800
   d.text((100,y+i*(size+22)),l,font=font(size),fill=color)
 text('数学观察小课堂  /  三年级',130,36)
 text(lessons[k][1][0],240,52)
 step=min(11,int(t//6));text(lessons[k][1][step],1370,44)
 d.rounded_rectangle((80,1720,1000,1732),6,fill='#d4dfd8');d.rounded_rectangle((80,1720,80+920*t/72,1732),6,fill='#248a87')
 text('可以暂停，先说出你的想法。',1630,30)
 if k<2:
  az=.55;el=.42
  if k==0:el=.42+(math.pi/2-.42)*ease((t-24)/12);az=.55*(1-ease((t-24)/12))
  else:az=.55+math.pi*ease((t-36)/9)-math.pi*ease((t-48)/9)
  ca,sa,ce,se=math.cos(az),math.sin(az),math.cos(el),math.sin(el)
  eye=(sa*ce,se,ca*ce);right=(ca,0,-sa);up=(-sa*se,ce,-ca*se)
  dot=lambda a,b:sum(x*y for x,y in zip(a,b))
  dims=(1,1,1) if k==1 else (1.6,.7,1)
  faces=[((0,0,1),'1' if k else '前','#75b7ce'),((0,0,-1),'6' if k else '后','#b3b9de'),((1,0,0),'3' if k else '右','#f2bd73'),((-1,0,0),'4' if k else '左','#e69a83'),((0,1,0),'5' if k else '上','#89c9af'),((0,-1,0),'2' if k else '下','#d7afcb')]
  for n,label,col in faces:
   if dot(n,eye)<=1e-7:continue
   axis=next(i for i,v in enumerate(n) if v);others=[i for i in range(3) if i!=axis];pts=[]
   for a,b in [(-1,-1),(1,-1),(1,1),(-1,1)]:
    v=[0,0,0];v[axis]=n[axis]*dims[axis];v[others[0]]=a*dims[others[0]];v[others[1]]=b*dims[others[1]];pts.append((540+210*dot(v,right),850-210*dot(v,up)))
   d.polygon(pts,fill=col,outline='#173d48',width=5);cx=sum(p[0] for p in pts)/4;cy=sum(p[1] for p in pts)/4

   if dot(n,eye)>.28:d.text((cx,cy),label,font=font(64),fill='#173d48',anchor='mm')
  if k==0 and t>=54:d.ellipse((430,1100,650,1320),fill='#e9b56f',outline='#173d48',width=4)
  if k==1 and 24<=t<27:text('想一想：'+str(3-int(t-24)),1170,48)
 else:
  p=ease((t-36)/6)
  for i in range(22):
   if i<18:g=i//6;j=i%6;x=185+g*245+(j%2)*65;y=680+(j//2)*100
   else:x=850+(i-18)%2*65;y=730+(i-18)//2*100
   tx=200+(i%6)*125;ty=620+(i//6)*115;x=x*(1-p)+tx*p;y=y*(1-p)+ty*p
   d.rounded_rectangle((x-23,y-30,x+23,y+35),8,fill='#55a4b4' if i<18 else '#df9668',outline='#173d48',width=3)
  if t<36:
   for g in range(3):d.rounded_rectangle((145+g*245,620,290+g*245,970),15,outline='#43858a',width=4)
  text('6 × 3 = 18' if 30<=t<42 else '18 + 4 = 22' if t>=42 else '3组蓝色  ＋  另外4盒',1120,52)
 return im
if __name__=='__main__':
 for k,(name,_) in enumerate(lessons):
  out=R/'videos'/f'{name}.mp4'
  if out.exists():raise RuntimeError('Refuse overwrite')
  cmd=['ffmpeg','-v','error','-f','rawvideo','-pix_fmt','rgb24','-s','1080x1920','-r','30','-i','-','-an','-c:v','libx264','-preset','ultrafast','-crf','24','-pix_fmt','yuv420p','-profile:v','baseline','-level','4.0','-movflags','+faststart',str(out)]
  proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
  for i in range(2160):proc.stdin.write(frame(k,i/30).tobytes())
  proc.stdin.close();assert proc.wait()==0
  print(name,'done',flush=True)
 (R/'lesson-data'/'timeline.json').write_text(json.dumps(lessons,ensure_ascii=False,indent=2))
