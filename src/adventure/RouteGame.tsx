import {useEffect,useState} from 'react';
export type RoutePuzzle={start:number;goal:string;stops:{instruction:string;options:[string,string];correct:number;delta?:[number,number]}[]};
export function routeValue(p:RoutePuzzle,path:number[]){let value=p.start;path.forEach((choice,i)=>{value+=p.stops[i].delta?.[choice]||0;});return value;}
export function routeCorrect(p:RoutePuzzle,path:unknown){return Array.isArray(path)&&path.length===p.stops.length&&path.every((v,i)=>Number.isInteger(v)&&v===p.stops[i].correct);}
export function RouteGame({puzzle,onSubmit}:{puzzle:RoutePuzzle;onSubmit:(s:string)=>void}){
 const [travel,setTravel]=useState(0);const [path,setPath]=useState<number[]>([]),[moving,setMoving]=useState(false),[paused,setPaused]=useState(false),[message,setMessage]=useState('');const stop=puzzle.stops[path.length];
 useEffect(()=>{if(!moving||paused)return;const timer=setInterval(()=>setTravel(v=>Math.min(1,v+1/14)),50);return()=>clearInterval(timer);},[moving,paused]);
 useEffect(()=>{if(moving&&travel>=1)setMoving(false);},[moving,travel]);
 function choose(n:number){if(moving||!stop)return;if(n!==stop.correct){setMessage('这条支路不符合任务。货物留在原站，观察路标后再试。');return;}setMessage('路线接通，运输中……');setPath([...path,n]);setTravel(0);setMoving(true);}
 return <section className="route-game"><h3>运输目标：{puzzle.goal}</h3><p>沿三个路口规划运输路线。错误分流不会丢失货物。</p><div className="route-track" aria-label={`已通过${path.length}个路口`}><span className={'route-cart'+(moving?' moving':'')} style={{left:`${(path.length-(moving?1-travel:0))*27}%`,animationPlayState:paused?'paused':'running'}}>🚂<b>{puzzle.start?routeValue(puzzle,path):'📦'}</b></span><div>起点 ━━━ ① ━━━ ② ━━━ ③</div></div>{moving?<button onClick={()=>setPaused(!paused)}>{paused?'继续运输':'暂停运输'}</button>:stop?<><p>{stop.instruction}</p><div className="route-branches">{stop.options.map((text,i)=><button key={i} onClick={()=>choose(i)}>↗ {text}</button>)}</div></>:<><p>货物送达！说说你为什么选这条路线。</p><button onClick={()=>onSubmit(JSON.stringify(path))}>交付运输任务</button></>}<p role="status">{message}</p><button onClick={()=>{setPath([]);setMoving(false);setPaused(false);setMessage('重新规划路线。');}}>重新运输</button></section>;
}
export function routePuzzle(subject:string,level:number,i:number):RoutePuzzle{
 if(subject==='math'){const start=10+i*2;return {start,goal:`从${start}箱货物出发，先装4箱、再卸3箱、最后装2箱。`,stops:[{instruction:'装货站：再装4箱，选择对应支路。',options:['装4箱','卸4箱'],correct:0,delta:[4,-4]},{instruction:'配送站：送出3箱。',options:['装3箱','卸3箱'],correct:1,delta:[3,-3]},{instruction:'补给站：再装2箱。',options:['装2箱','卸2箱'],correct:0,delta:[2,-2]}]};}
 const chinese=[['先洗手','再吃饭','最后收碗'],['先挖坑','再播种','最后浇水'],['先看图','再找路','最后送信']][(level-10+i)%3];const english=[['red','apple','tree'],['blue','water','fish'],['green','leaf','frog']][(level-10+i)%3];const words=subject==='chinese'?chinese:english;
 return {start:0,goal:subject==='chinese'?'按先、再、最后的顺序运送故事卡。':'Follow the route: '+words.join(' → '),stops:words.map((word,n)=>({instruction:subject==='chinese'?`第${n+1}站应该做什么？`:`Deliver: ${word}`,options:n===1?[subject==='chinese'?'最后收尾的卡':'stone',word]:[word,subject==='chinese'?'顺序不对的卡':'cloud'],correct:n===1?1:0}))};
}
