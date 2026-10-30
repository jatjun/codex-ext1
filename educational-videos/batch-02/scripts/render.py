from PIL import Image,ImageDraw,ImageFont
from functools import lru_cache
import json,pathlib,subprocess,math,sys
R=pathlib.Path(__file__).resolve().parents[1];PLAN=json.loads((R/'lesson-data/plan.json').read_text());SIZE=(540,960)
@lru_cache(None)
def font(n):return ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',n)
def ease(x):
 x=max(0,min(1,x));return x*x*(3-2*x)
def lerp(a,b,p):return a+(b-a)*p
bounds=[]
def txt(d,s,x,y,n=22,width=460,col='#173d48',center=False):
 lines=[];line=''
 for c in str(s):
  if d.textlength(line+c,font=font(n))>width:lines.append(line);line=''
  line+=c
 lines.append(line)
 for i,line in enumerate(lines):
  xx=x-d.textlength(line,font=font(n))/2 if center else x;yy=y+i*(n+10)
  box=d.textbbox((xx,yy),line,font=font(n));assert 25<=box[0] and box[2]<=515 and box[1]>=20 and box[3]<=935,(s,box)
  d.text((xx,yy),line,font=font(n),fill=col)
def dot(d,x,y,c='#478eaa',r=7):d.ellipse((x-r,y-r,x+r,y+r),fill=c)
def icon(d,name,x,y,s=48,t=0):
 # Original geometric illustrations; no emoji or third-party art.
 if name in ['树','tree']:
  d.rectangle((x-s*.13,y,x+s*.13,y+s*.65),fill='#996d4d');d.ellipse((x-s*.65,y-s*.8,x+s*.65,y+s*.3),fill='#67a379')
 elif name in ['日','sun','sunny','太阳']:
  for i in range(8):
   a=i*math.pi/4;d.line((x+math.cos(a)*s*.65,y+math.sin(a)*s*.65,x+math.cos(a)*s*.95,y+math.sin(a)*s*.95),fill='#d49e39',width=4)
  d.ellipse((x-s*.5,y-s*.5,x+s*.5,y+s*.5),fill='#edba53')
 elif name in ['月','moon']:
  d.ellipse((x-s*.6,y-s*.6,x+s*.6,y+s*.6),fill='#d9b66c');d.ellipse((x-s*.25,y-s*.75,x+s*.85,y+s*.35),fill='#f3f6ed')
 elif name in ['水','water','rainy']:
  if name=='rainy':
   for dx in [-.4,0,.4]:d.ellipse((x+dx*s-s*.35,y-s*.6,x+dx*s+s*.35,y+s*.05),fill='#a0b8c5')
  for i in range(4):
   yy=y+(i%2)*s*.35;xx=x+(i-1.5)*s*.35;d.line((xx,yy,xx-8,yy+20),fill='#4a9abc',width=5)
 elif name in ['apple','苹果']:
  d.ellipse((x-s*.6,y-s*.4,x+s*.6,y+s*.6),fill='#d77c70');d.line((x,y-s*.35,x+7,y-s*.7),fill='#6a8461',width=5);d.ellipse((x+4,y-s*.85,x+s*.45,y-s*.5),fill='#6caa76')
 elif name in ['banana','梨']:
  if name=='梨':d.ellipse((x-s*.45,y-s*.1,x+s*.45,y+s*.65),fill='#d8c171');d.ellipse((x-s*.2,y-s*.5,x+s*.2,y+s*.2),fill='#d8c171')
  else:
   d.arc((x-s*.7,y-s*.8,x+s*.7,y+s*.8),10,160,fill='#e6bd54',width=max(8,int(s*.28)))
 elif name in ['fox','cat','小狐狸','小鸟','鸟','bird']:
  if name in ['小鸟','鸟','bird']:
   d.ellipse((x-s*.65,y-s*.3,x+s*.45,y+s*.4),fill='#70a6b6');d.polygon([(x+s*.4,y),(x+s*.8,y+s*.1),(x+s*.4,y+s*.2)],fill='#e5b667');dot(d,x+s*.2,y-s*.03,'#173d48',3)
  else:
   c='#dd9b64' if name in ['fox','小狐狸'] else '#a9b4b2';d.polygon([(x-s*.6,y-s*.6),(x-s*.1,y-s*.2),(x+s*.6,y-s*.6),(x+s*.65,y+s*.25),(x,y+s*.65),(x-s*.65,y+s*.25)],fill=c)
   for dx in [-.25,.25]:dot(d,x+dx*s,y,'#173d48',3)
   dot(d,x,y+s*.3,'#173d48',4)
 elif name in ['一本书','书','book']:
  d.polygon([(x-s*.65,y-s*.45),(x,y-s*.25),(x+s*.65,y-s*.45),(x+s*.65,y+s*.5),(x,y+s*.65),(x-s*.65,y+s*.5)],fill='#77a9b8');d.line((x,y-s*.25,x,y+s*.65),fill='#f5f5eb',width=3)
 elif name in ['一朵花','花']:
  d.line((x,y,x,y+s*.7),fill='#72a57c',width=5)
  for i in range(6):
   a=i*math.pi/3;dot(d,x+math.cos(a)*s*.35,y+math.sin(a)*s*.35,'#d8a0b5',s*.25)
  dot(d,x,y,'#e3bf6d',s*.22)
 elif name in ['一只小鸟']:icon(d,'bird',x,y,s)
 elif name in ['hand']:
  d.rounded_rectangle((x-s*.42,y-s*.05,x+s*.42,y+s*.65),12,fill='#dcae8c')
  for i,h in enumerate([.45,.7,.85,.7,.45]):d.rounded_rectangle((x-s*.5+i*s*.22,y-h*s,x-s*.34+i*s*.22,y+s*.15),6,fill='#dcae8c')
 elif name in ['eye']:
  d.ellipse((x-s*.8,y-s*.4,x+s*.8,y+s*.4),fill='white',outline='#173d48',width=3);dot(d,x,y,'#6093a2',s*.25);dot(d,x,y,'#173d48',s*.13)
 elif name in ['star']:
  pts=[(x+math.cos(-math.pi/2+i*math.pi/5)*s*(1 if i%2==0 else .45),y+math.sin(-math.pi/2+i*math.pi/5)*s*(1 if i%2==0 else .45)) for i in range(10)];d.polygon(pts,fill='#deb45b')
 else:
  d.rounded_rectangle((x-s*.7,y-s*.5,x+s*.7,y+s*.5),10,fill='#dbe9e1');txt(d,name,x,y-12,18,120,center=True)
def card(d,s,x,y,w=100):
 d.rounded_rectangle((x-w/2,y-21,x+w/2,y+25),8,fill='white',outline='#5d9793',width=2);txt(d,s,x,y-13,min(20,int(w/max(1,len(s))*.9)),w-8,center=True)
@lru_cache(None)
def base(k,stage,answer=False):
 p=PLAN[k];im=Image.new('RGB',SIZE,'#f3f6ed');d=ImageDraw.Draw(im)
 txt(d,p['subject']+'观察小课堂  /  '+str(k+1).zfill(2),40,30,16)
 txt(d,p['title'],40,77,27)
 txt(d,p['stages'][stage],40,720,21)
 txt(d,'可以暂停，先说出你的想法。',40,886,15)
 if answer:txt(d,'参考答案：'+p['transfer_answer'],40,825,18)
 return im

def draw_math(d,p,t,stage):
 m=p['model'];n=p['nums'];e=ease((t-24)/8);f=ease((t-32)/8);g=ease((t-40)/8)
 if m in ['combine-divide','combine-average','average','equal-groups']:
  if m=='equal-groups':a,b=0,n[0]*n[1];total=b;groups=n[0];per=n[1]
  elif m=='average':a,b=n[0],0;total=a;groups=n[1];per=total//groups
  else:
   a,b,c=n;total=a+b
   groups=c if m=='combine-average' else total//c;per=total//groups
  cols=min(5,groups);rows=math.ceil(groups/cols);bw=450/cols;bh=min(170,270/rows)
  if stage>=(3 if m=='equal-groups' else 4):
   for group in range(groups):
    x0=45+(group%cols)*bw;y0=280+(group//cols)*bh
    d.rounded_rectangle((x0,y0,x0+bw-8,y0+bh-12),10,outline='#7ca18f',width=2)
  for i in range(total):
   x=65+(i%15)*29;y=330+(i//15)*32
   group=i//per;item=i%per
   targetx=45+(group%cols)*bw+20+(item%2)*24;targety=300+(group//cols)*bh+(item//2)*22
   progress=ease((t-24-group*8)/5) if m=='equal-groups' else g
   if m in ['combine-divide','combine-average']:
    part=i if i<a else i-a;sx=(65 if i<a else 295)+(part%6)*27;sy=300+(part//6)*30
    x=lerp(sx,x,e);y=lerp(sy,y,e)
   dot(d,lerp(x,targetx,progress),lerp(y,targety,progress),'#77aa89' if i<a else '#d8a16e',6)
  txt(d,'每个点代表1'+('块点心' if m=='average' else '颗水晶' if m=='equal-groups' else '个单位'),270,625,18,440,center=True)
 elif m=='beads':
  a,b,c=n
  for row,num in enumerate([a//c,b//c]):
   for i in range(num):
    x=55+i*48;y=310+row*165
    if stage>=3:d.rounded_rectangle((x,y,x+35,y+88),6,fill='#d4e7cd' if row==0 and i>=7 and stage>=5 else '#e7e6dc',outline='#617f80',width=2)
    for j in range(c):
     index=i*c+j;sx=55+(index%18)*24;sy=300+row*165+(index//18)*20;progress=e if row==0 else f
     dot(d,lerp(sx,x+10+(j%2)*15,progress),lerp(sy,y+12+(j//2)*20,progress),'#ce8178' if row==0 else '#d4b553',4)
   txt(d,('红' if row==0 else '黄')+f'：{[a,b][row]}颗，每条{c}颗',55,y+98,18)
  if stage>=5:txt(d,'9条 － 7条 ＝ 2条',270,650,24,440,center=True)
 elif m=='distance':
  x0,x1,x2,x3=55,195,265,475;y=420
  d.line((x0,y,x3,y),fill='#8eaa9a',width=8)
  for x in [x0,x1,x2,x3]:d.line((x,y-12,x,y+12),fill='#284d4d',width=3)
  txt(d,'起点',x0+5,y+25,16,70,center=True);txt(d,'中点',x2,y+25,16,70,center=True);txt(d,'学校',x3,y+25,16,70,center=True)
  txt(d,'300米',125,y-55,19,100,center=True);txt(d,'150米',230,y-100,19,100,center=True)
  if stage>=4:txt(d,'一半：450米',170,540,22,240,center=True)
  if stage>=5:txt(d,'全程：450 × 2 = 900米',270,600,24,440,center=True)
  dot(d,lerp(x0,x2,e),y-30,'#dfaa68',12)
 elif m=='clock':
  hour=3 if stage<4 else 6;cx,cy,r=270,425,155
  d.ellipse((cx-r,cy-r,cx+r,cy+r),fill='white',outline='#55827f',width=5)
  for h in range(1,13):
   an=h*math.pi/6;txt(d,str(h),cx+math.sin(an)*(r-25),cy-math.cos(an)*(r-25)-12,22,50,center=True)
  d.line((cx,cy,cx,cy-r+50),fill='#587a9d',width=5)
  angle=hour*math.pi/6;d.line((cx,cy,cx+math.sin(angle)*75,cy-math.cos(angle)*75),fill='#be895e',width=10);dot(d,cx,cy,'#173d48',8)
  if stage>=3:txt(d,str(hour)+'时',270,630,28,200,center=True)
 elif m=='patterns':
  count=min(5,max(1,stage-1))
  for j in range(count):
   x=85+j*92
   for i in range(n[j]):dot(d,x+(i%2)*20-10,350+(i//2)*30,'#6d9fa9',7)
   txt(d,str(n[j]),x+1,540,25,50,center=True)
   if j<count-1:txt(d,'+2',x+48,590,16,60,center=True)
 elif m=='cargo':
  cargo=10 if t<30 else 14 if t<38 else 11 if t<46 else 13
  d.line((65,520,475,520),fill='#809d9b',width=5)
  labels=['起点','装4箱','卸3箱','装2箱']
  for i,label in enumerate(labels):
   x=65+i*135;dot(d,x,520,'#ba9568',8);txt(d,label,max(65,min(475,x)),560,17,100,center=True)
  x=65+135*sum(ease((t-start)/6) for start in [24,32,40])
  d.rounded_rectangle((x-28,430,x+28,500),8,fill='#699da7')
  txt(d,str(cargo),x,452,24,60,center=True)
  if stage>=5:txt(d,'10 + 4 - 3 + 2 = 13箱',270,320,24,440,center=True)
 elif m=='bread':
  a,b,c=n
  if stage>=3:txt(d,'小点表示1元',270,245,16,300,center=True)
  for row,value in enumerate([a,b]):
   for i in range(c):
    x=110+i*150;y=320+row*180
    d.rounded_rectangle((x-45,y,x+45,y+55),12,fill='#e2c28c');txt(d,str(value)+'元',x,y+65,22,100,center=True)
    if stage>=4 and row==0:txt(d,'差2元',x,515,18,100,center=True)
    if stage>=3:
     for coin in range(value):
      targetx=x-40+coin*18;targety=y-35
      startx=x-40+coin*18;starty=y-80
      px=lerp(startx,targetx,e);py=lerp(starty,targety,e)
      if row==0 and coin>=3:px=lerp(px,180+(i*2+coin-3)*35,g);py=lerp(py,610,g)
      dot(d,px,py,'#d79c70' if row==0 and coin>=3 else '#719eac',6)
  if stage>=5:
   txt(d,'2 × 3 = 6元',270,650,25,440,center=True)
 else:
  if m=='bus':total=n[0]+n[2];remove=n[1];initial=n[0]
  elif m=='books':total=n[0];remove=n[1]+n[2];initial=total
  elif m=='notebooks':total=n[0];remove=n[1];initial=total
  elif m=='towels':total=(n[0]-n[1])*n[2]+n[1];remove=n[1];initial=n[0]
  elif m=='band':total=n[0];remove=n[1]*n[2];initial=total
  else:raise ValueError(m)
  for i in range(total):
   x=65+(i%15)*29;y=330+(i//15)*29
   if m=='bus':
    if i<remove:x=lerp(x,490,e);y=lerp(y,270+i*20,e)
    if i>=initial:x=lerp(580,x,g);y=lerp(570,y,g)
   elif m=='books':
    if i<remove:
     progress=e if i<n[1] else f;x=lerp(x,360+(i%6)*24,progress);y=lerp(y,260+(i//6)*25,progress)
    else:x=lerp(x,65+((i-remove)%7)*34,g);y=lerp(y,560+((i-remove)//7)*26,g)
   elif m=='band':
    if i<remove:
     x=65+(i%9)*28;y=290+(i//9)*34;x=lerp(x,470+(i%2)*18,g);y=lerp(y,230+(i//2)*14,g)
    else:
     j=i-remove;x=350+(j%4)*35;y=300+(j//4)*35
   elif m in ['notebooks','towels']:
    if i<remove:x=lerp(x,490,e);y=lerp(y,270+i*25,e)
    elif m=='notebooks':
     j=i-remove;gx=75+(j//4)*110;gy=370+(j%4)*35;x=lerp(x,gx,g);y=lerp(y,gy,g)
    else:
     j=i-remove;targetx=80+(j//9)*145+(j%3)*23;targety=340+((j%9)//3)*35
     if i>=initial:x=lerp(580,targetx,g);y=targety
     else:x=lerp(x,targetx,g);y=lerp(y,targety,g)
   color='#d49b79' if i<remove else '#699faa'
   dot(d,x,y,color,6)
  unit='元' if m in ['notebooks','towels'] else '人' if m in ['bus','band'] else '本'
  txt(d,'每个点表示1'+unit+'；橙色表示取走部分',270,625,17,440,center=True)

def draw_lang(d,p,t,stage):
 m=p['model'];words=p['nums'];motion=ease((t-(stage*8))/3)
 if m=='sentence':
  n=len(words);w=min(88,450/n);gap=450/n
  for i,word in enumerate(words):
   target=45+gap*(i+.5);start=45+gap*(n-i-.5);progress=ease((t-24-i*3)/4)
   card(d,word,start if progress==0 else target,390 if progress==0 else lerp(440,500,progress),w)
  if p['slug']=='chinese-sentence':icon(d,'fox',155,305,42);icon(d,'树',360,300,50);icon(d,'book',270,585,42)
  elif p['slug']=='english-spelling':icon(d,'sun',270,310,65)
  elif p['slug']=='english-sentence':icon(d,'fox',270,305,65)
  else:
   for i in range(n):dot(d,45+gap*(i+.5),560,'#d6ab6a',18);txt(d,str(i+1),45+gap*(i+.5),545,20,50,center=True)
 elif m=='opposites':
  pair=min(2,max(0,stage-3));left,right=words[pair*2:pair*2+2]
  if pair==0:dot(d,155,425,'#7aa68a',80);dot(d,390,425,'#7aa68a',35)
  elif pair==1:d.line((60,400,245,400),fill='#719ca3',width=18);d.line((330,400,415,400),fill='#719ca3',width=18)
  else:d.rectangle((95,300,190,560),fill='#88aaa7');d.rectangle((350,440,445,560),fill='#88aaa7')
  if stage>=3:card(d,left,155,620);card(d,right,390,620)
 elif m=='colors':
  for i,(word,c) in enumerate(zip(words,['#cf7b75','#689fc4'])):
   x=150+i*240;dot(d,x,400,c,70)
   if stage>=3:card(d,word,lerp(390-i*240,x,ease((t-24)/8)),590)
 elif m=='numbers':
  count=2 if stage<5 else 3
  for i in range(count):icon(d,'star',150+i*120-(60 if count==3 else 0),420,40)
  if stage>=3:card(d,'two' if count==2 else 'three',270,600,150)
 elif m=='actions':
  swim=stage>=4;phase=t*4;cx=95+(t%8)/8*340;cy=420
  if swim:
   d.rectangle((45,465,495,570),fill='#c3e0e4');dot(d,cx,cy,'#c69776',18);d.line((cx-15,cy+25,cx-70,cy+40),fill='#426d78',width=8)
   d.line((cx-35,cy+30,cx-30+math.sin(phase)*35,cy-15),fill='#426d78',width=7)
  else:
   d.line((45,550,495,550),fill='#8aa38f',width=4);dot(d,cx,cy-45,'#c69776',18);d.line((cx,cy-25,cx,cy+35),fill='#426d78',width=8)
   for v in [-1,1]:d.line((cx,cy+35,cx+v*math.sin(phase)*30,cy+100),fill='#426d78',width=7);d.line((cx,cy,cx-v*math.sin(phase)*30,cy+25),fill='#426d78',width=7)
  if stage>=3:card(d,'swim' if swim else 'run',270,640,130)
 elif m=='greetings':
  night=stage>=4;icon(d,'moon' if night else 'sun',270,340,65)
  if night:d.rounded_rectangle((160,500,380,580),15,fill='#9eb4c1');d.ellipse((170,475,230,535),fill='#d8b295')
  else:icon(d,'hand',270+math.sin(t*2)*10,540,55)
  if stage>=3:card(d,words[1 if night else 0],270,650,260)
 else:
  if m=='words':icons=['树','水','日','月']
  elif m=='measure':icons=['一本书','一只小鸟','一朵花']
  elif m=='english-words':icons=['fox','cat','apple','banana']
  elif m=='weather':icons=['sunny','rainy']
  elif m=='body':icons=['hand','eye']
  else:raise ValueError(m)
  n=len(icons);gap=450/n
  for i,name in enumerate(icons):
   x=45+gap*(i+.5);icon(d,name,x,410,min(50,gap*.35),t)
   if stage>=3:
    progress=ease((t-24-i*3)/4);card(d,words[i],x,lerp(620,540,progress),gap-10)

def frame(k,t):
 stage=min(7,int(t//8));p=PLAN[k];im=base(k,stage,t>=60).copy();d=ImageDraw.Draw(im)
 if p['subject']=='数学':draw_math(d,p,t,stage)
 else:draw_lang(d,p,t,stage)
 d.rounded_rectangle((40,925,500,931),3,fill='#d5e1d6');d.rounded_rectangle((40,925,40+460*t/64,931),3,fill='#278e89')
 return im
if __name__=='__main__':
 for k,p in enumerate(PLAN):
  only=next((arg.split('=',1)[1] for arg in sys.argv if arg.startswith('--only=')),None)
  if only and p['slug'] not in only.split(','):continue
  out=R/'videos'/(p['slug']+'.mp4')
  if out.exists():
   if '--resume' not in sys.argv:raise RuntimeError('Refuse overwrite '+str(out))
   check=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(out)]));assert check['format']['duration']=='64.000000' and check['streams'][0]['nb_frames']=='1920';continue
  temp=out.with_suffix('.rendering.mp4')
  cmd=['ffmpeg','-v','error','-threads','2','-f','rawvideo','-pixel_format','rgb24','-video_size','540x960','-framerate','30','-i','-','-vf','scale=1080:1920:flags=lanczos','-an','-c:v','libx264','-threads','2','-preset','ultrafast','-crf','24','-pix_fmt','yuv420p','-profile:v','baseline','-level','4.0','-movflags','+faststart',str(temp)]
  proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
  try:
   for i in range(1920):proc.stdin.write(frame(k,i/30).tobytes())
   proc.stdin.close();assert proc.wait()==0;temp.rename(out);print(p['slug'],'RENDERED',flush=True)
  except BaseException:
   proc.stdin.close();proc.wait();raise
