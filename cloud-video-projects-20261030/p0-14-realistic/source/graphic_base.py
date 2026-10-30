"""Original procedural animation. Pillow + NumPy -> FFmpeg; no external assets.
Run: python3 -B source/render_animation.py [--preview]
All art coordinates are original, in a 540 x 960 logical canvas rendered at 2x.
"""
from pathlib import Path
import math, random, subprocess, time, json, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
Q = 2
FONT = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
BOLD = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
INK = '#142B3D'
TEAL = '#087D83'
fonts = {}

def font(n, bold=False):
    key = (n, bold)
    if key not in fonts:
        fonts[key] = ImageFont.truetype(BOLD if bold else FONT, int(n*Q))
    return fonts[key]

class Art:
    def __init__(self, size=(540,960), bg=(0,0,0,0)):
        self.im = Image.new('RGBA', (int(size[0]*Q),int(size[1]*Q)), bg)
        self.d = ImageDraw.Draw(self.im)
    def ellipse(self, box, fill, outline=None, width=1):
        self.d.ellipse(tuple(int(v*Q) for v in box), fill, outline, int(width*Q))
    def rect(self, box, fill, radius=0, outline=None, width=1):
        b=tuple(int(v*Q) for v in box)
        if radius:
            self.d.rounded_rectangle(b,int(radius*Q),fill,outline,int(width*Q))
        else:
            self.d.rectangle(b,fill,outline,int(width*Q))
    def poly(self, pts, fill):
        self.d.polygon([(int(x*Q),int(y*Q)) for x,y in pts], fill)
    def line(self, pts, fill, width=1):
        self.d.line([(int(x*Q),int(y*Q)) for x,y in pts],fill,int(width*Q),joint='curve')
    def text(self, xy, text, n, fill=INK, bold=False, anchor='lt'):
        self.d.text((int(xy[0]*Q),int(xy[1]*Q)),text,font=font(n,bold),fill=fill,anchor=anchor)

def ease(x):
    x=max(0,min(1,x)); return x*x*(3-2*x)

def alpha(im, a):
    out=im.copy();out.putalpha(out.getchannel('A').point(lambda v:int(v*max(0,min(1,a)))))
    return out

random.seed(14)
FOAM=[(random.uniform(45,437),random.uniform(83,155),random.uniform(5,14),random.random()*6.28) for _ in range(95)]
DROPS=[(random.uniform(0,540),random.uniform(-200,800),random.uniform(8,24),random.uniform(.7,1.5)) for _ in range(58)]

# Paint a smooth studio backdrop once; frame effects remain procedural.
yy,xx=np.mgrid[0:1920,0:1080].astype(np.float32)
glow=np.exp(-(((xx-800)/800)**2+((yy-950)/900)**2))
BG=np.empty((1920,1080,4),dtype=np.uint8)
for c,(lo,hi) in enumerate([(242,218),(248,243),(247,242)]):
    BG[:,:,c]=lo+(hi-lo)*glow
BG[:,:,3]=255
BACKGROUND=Image.fromarray(BG)

def car(t, phase):
    c=Art((490,235))
    # Original compact coupe profile, deliberately without any badge or branding.
    body=[(16,130),(28,110),(100,96),(142,50),(164,42),(263,42),
          (291,53),(341,96),(420,105),(460,121),(471,151),(460,168),
          (24,168),(12,154)]
    mask=Art((490,235));mask.poly(body,'white')
    grad=np.zeros((470,980,4),dtype=np.uint8)
    row=np.arange(470)/470
    stops=[(0,(86,222,220)),(.42,(47,197,201)),(.64,(15,142,160)),(1,(6,70,100))]
    for ch in range(3):
        grad[:,:,ch]=np.interp(row,[s[0] for s in stops],[s[1][ch] for s in stops])[:,None]
    grad[:,:,3]=np.asarray(mask.im.getchannel('A'))
    c.im.alpha_composite(Image.fromarray(grad));c.d=ImageDraw.Draw(c.im)
    c.poly([(114,94),(153,54),(168,50),(258,50),(282,60),(323,96)],'#173D52')
    c.poly([(126,89),(159,59),(173,56),(212,56),(212,91)],'#78B7C3')
    c.poly([(222,56),(255,56),(277,65),(310,91),(222,91)],'#507F94')
    c.poly([(141,88),(175,61),(199,61),(174,89)],(182,229,231,120))
    c.line([(214,53),(214,98)],'#C6F3EC',3)
    c.line([(104,101),(330,101),(421,113)],'#BDF7EC',2)
    c.line([(165,109),(165,153),(306,153),(318,109)],'#087B90',1)
    c.rect((272,110,290,114),'#D1FBED',2)
    c.poly([(312,89),(329,87),(338,94),(334,102),(316,101)],'#066D86')
    c.rect((431,120,460,129),'#FCF2C4',4)
    c.rect((23,123,40,131),'#FA9C83',3)
    c.line([(26,156),(459,156)],'#075B76',5)
    c.line([(338,111),(414,118)],(214,255,245,160),3)
    # Wheel wells, tyres, brushed alloy spokes.
    for x in (105,382):
        c.ellipse((x-43,123,x+43,209),'#16364B')
        c.ellipse((x-34,132,x+34,200),'#102A3B')
        c.ellipse((x-25,141,x+25,191),'#C7DCE0')
        c.ellipse((x-17,149,x+17,183),'#4F7588')
        for a in range(0,360,60):
            a=math.radians(a)+.025*math.sin(t)
            c.line([(x,166),(x+22*math.cos(a),166+22*math.sin(a))],'#DFF5F2',4)
        c.ellipse((x-6,160,x+6,172),'#153D51')
    # Foam remains inside the painted silhouette and grows, then washes away.
    amount=ease((t-.7)/2) if t<5 else 1-ease((t-5)/3.0)
    f=Art((490,235))
    if amount>0:
        for i,(x,y,r,a) in enumerate(FOAM):
            if i/len(FOAM)>amount:continue
            y+=2*math.sin(t*2+a)
            f.ellipse((x-r,y-r,x+r,y+r),(242,255,253,225))
            f.ellipse((x-r*.48,y-r*.62,x+r*.05,y-r*.1),(255,255,255,245))
        fa=np.minimum(np.asarray(f.im.getchannel('A')),np.asarray(mask.im.getchannel('A')))
        f.im.putalpha(Image.fromarray(fa));c.im.alpha_composite(f.im)
    # Moving clearcoat highlight and a microfiber pad, explicitly illustrative.
    if phase==2 and t<13.6:
        s=(t-10)/3.6
        x=145+185*(.5-.5*math.cos(s*math.pi*2))
        c.line([(x-40,119),(x+15,125)],'#E0FFF5',3)
        c.rect((x-28,99,x+27,123),'#F9DFA4',7,outline='#CBAA68')
        for y in [104,110,116]:c.line([(x-20,y),(x+18,y+2)],'#E9C882',1)
    return c.im

STAGES=[('FOAM / 01','细腻泡沫','泡沫铺展 · 清洁动作演示'),
        ('RINSE / 02','流动净洗','水流冲洗 · 动态线条演示'),
        ('DETAIL / 03','细节打理','轻柔擦拭 · 原创图形演示')]

def frame(t):
    a=Art();a.im=BACKGROUND.copy();a.d=ImageDraw.Draw(a.im)
    phase=min(2,int(t/5))
    # Subtle drifting rings create depth without photorealistic footage.
    x=419+17*math.sin(t*.35);y=440+12*math.cos(t*.5)
    a.ellipse((x-177,y-177,x+177,y+177),(203,235,229,100))
    a.ellipse((x-145,y-145,x+145,y+145),None,(255,255,255,160),1)
    a.text((36,48),'AUTO / CARE',17,TEAL,True)
    a.line([(36,79),(503,79)],'#C9DCD9',1)
    a.rect((394,43,504,69),'#FFFFFF',13)
    a.text((449,56),'2D MOTION',10,TEAL,anchor='mm')
    # Timeline markers.
    for i in range(3):
        x=36+i*159
        a.rect((x,108,x+149,111),'#D1E0DC',2)
        f=max(0,min(1,(t-i*5)/5))
        if f:a.rect((x,108,x+max(2,149*f),111),TEAL,2)
    # Fade outgoing type before incoming type to avoid overlapping Chinese glyphs.
    for i,(k,title,sub) in enumerate(STAGES):
        enter=ease((t-i*5)/.35) if i else ease(t/.6)
        leave=1-ease((t-((i+1)*5-.35))/.35) if i<2 else 1
        op=enter*leave
        if op<=0:continue
        tx=Art();dy=14*(1-enter)
        tx.text((36,145+dy),k,13,TEAL,True)
        tx.text((32,181+dy),title,54,INK,True)
        tx.text((36,256+dy),sub,17,'#54717C')
        a.im.alpha_composite(alpha(tx.im,op))
    a.d=ImageDraw.Draw(a.im)
    # Clean studio floor and a floating procedural camera move.
    a.ellipse((38,652,503,710),(197,220,216,190))
    a.ellipse((66,665,478,694),(163,196,192,160))
    a.line([(35,716),(505,716)],'#BFD6D2',1)
    zoom=1+.025*math.sin(t*.65)+.025*ease(t/1.2)
    cx=270+7*math.sin(t*.45);cy=530+4*math.sin(t*.8)
    carim=car(t,phase)
    carim=carim.resize((int(490*Q*zoom),int(235*Q*zoom)),Image.Resampling.BICUBIC)
    a.im.alpha_composite(carim,(int(cx*Q-carim.width/2),int(cy*Q-carim.height/2)))
    fx=Art()
    if phase==0:
        # Bubbles rise from the car with easing and independent drift.
        for i in range(18):
            s=(t*.23+i*.071)%1
            x=62+(i*73)%420+8*math.sin(t+i)
            y=580-s*255;r=4+(i%5)*2
            op=int(130*math.sin(s*math.pi)*ease(t/.6))
            fx.ellipse((x-r,y-r,x+r,y+r),(255,255,255,op),(255,255,255,min(255,op+30)),1)
            fx.ellipse((x-r*.4,y-r*.5,x,y-r*.1),(255,255,255,op))
    if phase==1:
        # Animated water jet crossing the car, then fine droplets falling.
        u=t-5;fade=ease(u/.5)*(1-ease((u-4.1)/.8))
        for k in range(6):
            start=(510+k*4,357+k*5)
            end=(110+38*math.sin(u*2)+k*14,578+k*7)
            fx.line([start,end],(61,174,204,int((90-k*9)*fade)),7-k*.7)
        for x,y,l,s in DROPS:
            y=(y+u*230*s)%420+305
            fx.line([(x,y),(x-8,y+l)],(53,163,192,int(135*fade)),2)
        fx.rect((481,337,521,361),'#173D52',5)
        fx.line([(501,347),(534,303)],'#4C6D7A',11)
    if phase==2:
        for i,(x,y) in enumerate([(112,447),(380,479),(437,550),(297,424)]):
            pulse=max(0,math.sin((t-10)*2.2-i*.9))**4
            r=13*pulse
            if r>1:
                fx.line([(x-r,y),(x+r,y)],(255,255,255,240),2)
                fx.line([(x,y-r),(x,y+r)],(255,255,255,240),2)
                fx.ellipse((x-2,y-2,x+2,y+2),'#FFFFFF')
    a.im.alpha_composite(fx.im)
    # Brief outlined bubble wipes at scene boundaries, never a blank screen.
    tr=Art()
    for boundary in [5,10]:
        u=(t-boundary+.25)/.7
        if 0<u<1:
            r=40+800*ease(u)
            tr.ellipse((520-r,540-r,520+r,540+r),None,(255,255,255,int(150*math.sin(u*math.pi))),22)
    a.im.alpha_composite(tr.im);a.d=ImageDraw.Draw(a.im)
    # Persistent caption card, usable at phone size.
    a.rect((36,752,504,859),(255,255,255,235),20)
    for i,(label,small) in enumerate([('泡沫','FOAM'),('冲洗','RINSE'),('打理','DETAIL')]):
        x=58+i*153
        active=i==phase
        a.ellipse((x,773,x+25,798),TEAL if active else '#E4EFEB')
        a.text((x+12.5,785),str(i+1),12,'#FFFFFF' if active else '#66838A',True,anchor='mm')
        a.text((x+36,773),label,18,INK if active else '#789098',True)
        a.text((x+36,802),small,9,TEAL if active else '#89A19F')
    a.text((270,883),'原创动画模拟样片',17,TEAL,True,anchor='mt')
    a.text((270,914),'非实拍影像  /  不代表真实服务效果',11,'#647F87',anchor='mt')
    # End lockup floats in with the camera, without an invented business claim.
    end=ease((t-13.1)/.65)
    if end:
        lock=Art();lock.rect((98,319,442,370),(255,255,255,240),25)
        lock.text((270,344),'让洁净，动起来',24,TEAL,True,anchor='mm')
        a.im.alpha_composite(alpha(lock.im,end))
    return a.im.convert('RGB')

def main():
    (ROOT/'frames').mkdir(parents=True,exist_ok=True)
    if '--preview' in sys.argv:
        for t in (2.5,7.5,12.5,14.5):frame(t).save(ROOT/'frames'/f'preview_{t:04.1f}.png')
        return
    cmd=['ffmpeg','-hide_banner','-nostdin','-y','-f','rawvideo','-pix_fmt','rgb24',
         '-s','1080x1920','-r','30','-i','pipe:0','-an','-c:v','libx264',
         '-preset','fast','-crf','20','-threads','2','-pix_fmt','yuv420p',
         '-movflags','+faststart',str(ROOT/'original_car_care.mp4')]
    start=time.monotonic()
    with (ROOT/'render.log').open('w') as log:
        proc=subprocess.Popen(cmd,stdin=subprocess.PIPE,stderr=log,stdout=log)
        try:
            for n in range(450):
                proc.stdin.write(frame(n/30).tobytes())
                if n%90==0:print(f'frame {n}/450, elapsed {time.monotonic()-start:.1f}s',flush=True)
            proc.stdin.close();rc=proc.wait()
        except BaseException:
            proc.kill();proc.wait();raise
    metrics={'returncode':rc,'wall_seconds':time.monotonic()-start,'frames':450,
             'width':1080,'height':1920,'fps':30,'audio':False}
    (ROOT/'render_metrics.json').write_text(json.dumps(metrics,indent=2))
    print(json.dumps(metrics),flush=True)
    if rc:raise SystemExit(rc)

if __name__=='__main__':main()
