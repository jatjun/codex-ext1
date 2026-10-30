import {useEffect,useRef,useState} from 'react';
import {positions,type MixedKind,type Point} from '../math-engine/mixed';
export function MixedStage({kind,step,playing,speed}:{kind:MixedKind;step:number;playing:boolean;speed:number}){
  const [points,setPoints]=useState(()=>positions(kind,step));
  const current=useRef(points), motion=useRef<{from:Point[];to:Point[];elapsed:number}|null>(null);
  useEffect(()=>{motion.current={from:current.current,to:positions(kind,step),elapsed:0};},[kind,step]);
  useEffect(()=>{
    if(!playing)return;
    let frame=0,previous=0;
    function tick(now:number){
      const m=motion.current;
      if(m){m.elapsed+=previous?Math.min(now-previous,80)*speed:0;const t=Math.min(1,m.elapsed/1600),e=t*t*(3-2*t);
        const next=m.to.map((p,i)=>({x:m.from[i].x+(p.x-m.from[i].x)*e,y:m.from[i].y+(p.y-m.from[i].y)*e}));
        current.current=next;setPoints(next);
      }
      previous=now;frame=requestAnimationFrame(tick);
    }
    frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
  },[playing,speed,step]);
  return <div className="mixed-stage"><svg viewBox="0 0 500 310" role="img" aria-label={kind==='yogurt'?'22盒酸奶，蓝色18盒和橙色4盒':'40个桃子，绿色25个和橙色15个'}>
    <text x="250" y="28" textAnchor="middle">{kind==='yogurt'?(step>=3?'合在一起，逐盒数一数':'每组6盒，共3组；另外4盒'):(step>=3?'每盒8个，看看能装几盒':step>=1?'两篮合在一起，桃子一个也没少':'第一篮25个，第二篮15个')}</text>
    {kind==='yogurt'&&step<3&&Array.from({length:3},(_,i)=><rect key={i} x={15+i*112} y={60} width={94} height={170} rx={14} fill="#e6f2ed" stroke="#8db8ac"/>)}
    {kind==='peaches'&&step>=3&&Array.from({length:5},(_,i)=><g key={i}><rect x={12+i*94} y={55} width={84} height={180} rx={12} fill="#fff0d5" stroke="#b28650"/><text x={54+i*94} y={260} textAnchor="middle">第{i+1}盒</text></g>)}
    {points.map((p,i)=><g key={i} data-object={i} transform={`translate(${p.x} ${p.y})`}>
      {kind==='yogurt'?<><path d="M-12 -14 L12 -14 L9 13 L-9 13 Z" fill={i<18?'#55a4b4':'#df9668'}/><path d="M-14 -14 H14" stroke="#234b43" strokeWidth="3"/></>:<><circle r="12" fill={i<25?'#84b796':'#e7a06f'}/><path d="M0 -8 Q-3 0 0 8 M0 -12 Q8 -22 10 -12" fill="none" stroke="#526f48" strokeWidth="2"/></>}
    </g>)}
  </svg><p className="soft">{step===4?'演示完成，可重播或继续练习。':step===2?'先回答下方的关键问题，再继续验证。':playing?'正在演示，可随时暂停。':'已暂停。点“播放”观看物体移动。'} 颜色只标记来源，移动不会改变总数。</p></div>;
}
