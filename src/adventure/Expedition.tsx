import {useEffect,useRef,useState} from 'react';
import {expeditionFor,freshBattle,allFreed} from './expedition-model';
import {makeExpedition,type ExpeditionAPI} from './expedition-world';
import {OralPractice} from './OralPractice';
import type {Subject} from './subjects';
import type {Quality} from './world';
import './expedition.css';
export function Expedition({subject,level}:{subject:Subject;level:number}){
 const data=expeditionFor(subject,level),canvas=useRef<HTMLCanvasElement>(null),world=useRef<ExpeditionAPI|null>(null);
 const [state,setState]=useState(freshBattle),[started,setStarted]=useState(false),[paused,setPaused]=useState(false),[selected,setSelected]=useState(0),[target,setTarget]=useState(-1),[oral,setOral]=useState(false),[won,setWon]=useState(false),[practiced,setPracticed]=useState(false),[error,setError]=useState(''),[pos,setPos]=useState({x:0,z:19});
 const [quality,setQuality]=useState<Quality>(()=>{try{return localStorage.getItem('forest-quality')==='low'?'low':'high';}catch{return 'high';}});
 function go(n:number){location.hash=(subject==='math'?'#forest':'#forest-'+subject)+'?level='+n;location.reload();}
 useEffect(()=>{try{world.current=makeExpedition(canvas.current!,data,quality,setState,setTarget,()=>setOral(true));}catch{setError('浏览器无法打开3D场景，请开启硬件加速或更换浏览器。');}const timer=setInterval(()=>{if(canvas.current)setPos({x:Number(canvas.current.dataset.x||0),z:Number(canvas.current.dataset.z||19)});},250);return()=>{clearInterval(timer);world.current?.destroy();};},[]);
 useEffect(()=>{const hide=()=>{if(document.hidden&&started&&!oral&&!won){setPaused(true);world.current?.pause(true);}};document.addEventListener('visibilitychange',hide);return()=>document.removeEventListener('visibilitychange',hide);},[started,oral,won]);
 function select(i:number){setSelected(i);world.current?.select(i);}
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(!paused&&!oral&&!won&&['1','2','3'].includes(e.key))select(Number(e.key)-1);};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[paused,oral,won]);
 function changeQuality(q:Quality){setQuality(q);world.current?.quality(q);try{localStorage.setItem('forest-quality',q);}catch{/* Local preference is optional. */}}
 function pause(v:boolean){setPaused(v);world.current?.pause(v);}
 function joystick(e:React.PointerEvent<HTMLDivElement>){const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.x-r.width/2)/40,z=(e.clientY-r.y-r.height/2)/40,len=Math.max(1,Math.hypot(x,z));world.current?.move(x/len,z/len);}
 const locations=data.place==='snow'?[[-12,-6],[12,2],[0,-16]]:[[-12,3],[11,-7],[-8,-16]],gate=data.place==='snow'?[12,-18]:[9,-19];
 return <div className={'forest-game expedition '+data.place}>
 <canvas ref={canvas} aria-label={data.title+'3D冒险：方向键移动，空格跳跃，数字键选符文，F发射'}/>
 <header className="exp-header"><button onClick={()=>go(0)}>← 关卡地图</button><strong>{data.title}</strong><label>画质 <select aria-label="画质" value={quality} onChange={e=>changeQuality(e.target.value as Quality)}><option value="high">高</option><option value="low">低</option></select></label>{started&&!won&&<button onClick={()=>pause(!paused)} aria-label={paused?'继续游戏':'暂停游戏'}>{paused?'▶':'Ⅱ'}</button>}</header>
 {!started&&!error&&<section className="exp-intro"><small>第 {level+1} 关 · {subject==='math'?'数学':subject==='chinese'?'语文':'英语'}冒险</small><h1>{data.title}</h1><p>三位精灵被迷雾困住了。<br/>带上知识符文，发射温柔的光，<br/>最后在回声之门开口说一说。</p><button className="forest-primary" onClick={()=>{setStarted(true);world.current?.start();}}>开始冒险 →</button><div className="exp-places"><button onClick={()=>go(3)}>沙漠遗迹</button><button onClick={()=>go(4)}>冰雪城堡</button></div></section>}
 {started&&!won&&<><section className="exp-mission"><small>守护者任务 · {state.freed.filter(Boolean).length}/3</small><h2>{allFreed(state)?'前往回声之门':'用知识唤醒精灵'}</h2><p>{allFreed(state)?'沿地图的金色星星走，进入门圈开始口说练习。':target>=0?data.encounters[target].clue:'按小地图寻找精灵，靠近后选择符文发射。'}</p><ol>{data.encounters.map((e,i)=><li key={i} className={state.freed[i]?'freed':''}>{state.freed[i]?'✓':i+1} {e.clue}</li>)}</ol></section>
 <aside className="exp-map" aria-label="场景地图"><svg viewBox="0 0 50 56"><rect width="50" height="56" rx="8" fill={data.place==='snow'?'#d9edf5':'#efdfb6'}/>{locations.map(([x,z],i)=><g key={i}><circle cx={x+25} cy={z+28} r="3" fill={state.freed[i]?'#64b89d':'#ab8abd'}/><text x={x+25} y={z+29} textAnchor="middle" fontSize="4" fill="white">{i+1}</text></g>)}<text x={gate[0]+25} y={gate[1]+29} textAnchor="middle" fontSize="8" fill="#bd8c28">★</text><circle cx={pos.x+25} cy={pos.z+28} r="2.3" fill="#df8c46" stroke="white"/></svg><small>橙点是你 · ★回声门</small></aside>
 <div className="exp-feedback" role="status">{state.hint}</div>
 <div className="exp-runes" aria-label="知识符文">{data.runes.map((r,i)=><button key={r} aria-pressed={i===selected} onClick={()=>select(i)}><small>{i+1}</small>{r}</button>)}</div>
 <div className="exp-controls"><div className="joystick" role="group" aria-label="触屏移动摇杆" onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);joystick(e);}} onPointerMove={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))joystick(e);}} onPointerUp={()=>world.current?.move(0,0)} onPointerCancel={()=>world.current?.move(0,0)}><span className="joystick-cross">＋</span><i>✦</i></div><div><button onClick={()=>world.current?.jump()}>↑ 跳跃</button><button className="spell-button" onClick={()=>world.current?.fire()}>✦ 发射 <small>{target>=0?data.encounters[target].name:'靠近精灵'}</small></button></div></div><div className="exp-help">方向键 / WASD 移动 · 空格跳跃 · 1/2/3 选符文 · F 发射</div></>}
 {paused&&!oral&&!won&&<div className="forest-overlay"><section className="forest-dialog"><h2>精灵在这里等你</h2><button onClick={()=>pause(false)}>继续冒险</button></section></div>}
 {oral&&!won&&<div className="forest-overlay"><OralPractice text={data.oral} hint={data.oralHint} english={subject==='english'} onDone={p=>{setPracticed(p);setOral(false);setWon(true);}}/></div>}
 {won&&<div className="forest-overlay win-overlay"><section className="forest-dialog"><div className="win-star">✦</div><h2>三位精灵恢复啦！</h2><p>你发射了 {state.shots} 次知识符文，帮助了3位朋友。</p><p>{practiced?'口说：已自行确认练习，未自动评判发音。':'口说：本次跳过，尚未完成练习。'}</p>{level===3&&<button className="forest-primary" onClick={()=>go(4)}>下一关：冰雪回声城堡 →</button>}<button onClick={()=>location.reload()}>再探险一次</button><button onClick={()=>go(0)}>返回关卡地图</button></section></div>}
 {error&&<div className="forest-overlay"><section className="forest-dialog"><p role="alert">{error}</p><button onClick={()=>go(0)}>返回森林</button></section></div>}
 </div>;
}
