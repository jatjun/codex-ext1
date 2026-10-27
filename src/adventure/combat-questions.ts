export type Difficulty='easy'|'normal'|'hard';
export type CombatQuestion={prompt:string;answer:string;options?:string[];hint:string;kind:string};
export function combatQuestion(difficulty:Difficulty,index:number,random= Math.random):CombatQuestion{
 const pick=(max:number)=>1+Math.floor(Math.max(0,Math.min(.999999,random()))*max),limit=difficulty==='easy'?9:difficulty==='normal'?30:90;
 const a=pick(limit),b=pick(difficulty==='easy'?5:9),kind=index%6;
 if(kind===0){const op=pick(difficulty==='easy'?2:4);const prompt=op===1?`${a} ＋ ${b}`:op===2?`${a+b} － ${b}`:op===3?`${a} × ${b}`:`${a*b} ÷ ${b}`;return {kind:'口算',prompt:prompt+' ＝ ？',answer:String(op===1?a+b:op===2?a:op===3?a*b:a),hint:op===4?'想一想：除数乘几等于被除数？':'按运算符号计算，可以先分组或凑整十。'};}
 if(kind===1)return {kind:'填空',prompt:`□ ＋ ${b} ＝ ${a+b}`,answer:String(a),hint:'总数减去已经知道的一部分。'};
 if(kind===2){const c=pick(limit);return {kind:'比较大小',prompt:`${a} ＋ ${b} ○ ${c}`,answer:a+b>c?'>':a+b<c?'<':'=',options:['>','<','='],hint:'先算左边，再比较两边的数。'};}
 if(kind===3){const g=pick(difficulty==='easy'?3:8);return {kind:'选算式',prompt:`${g}袋，每袋${b}颗。一共有多少颗？选出表示总数的算式。`,answer:`${g} × ${b}`,options:[`${g} × ${b} ＋ 1`,`${g} × ${b}`,`${g} － ${b}`],hint:'每袋一样多，用乘法表示相同数量的几组。'};}
 if(kind===4){const g=pick(difficulty==='easy'?3:8),extra=pick(5);return {kind:'应用题',prompt:`${g}盘果子，每盘${b}个，另外还有${extra}个。一共多少个？`,answer:String(g*b+extra),hint:'先求盘里的总数，再加上另外的。'};}
 const step=pick(difficulty==='easy'?3:7),start=pick(9);return {kind:'找规律',prompt:`${start}，${start+step}，${start+step*2}，□`,answer:String(start+step*3),hint:'相邻两个数，每次增加多少？'};
}
export function correctCombatAnswer(q:CombatQuestion,value:string){return value.trim()===q.answer;}
export const lootNames=['星叶碎片','月光矿石','琥珀种子','彩虹羽毛'];
export function claimBattleLoot(){try{let raw;try{raw=JSON.parse(localStorage.getItem('fox-battle-loot-v1')||'null');}catch{raw=null;}const counts=Array.isArray(raw?.counts)&&raw.counts.length===4?raw.counts.map((v:unknown)=>typeof v==='number'&&Number.isInteger(v)&&v>=0?Math.min(v,999):0):[0,0,0,0];const total=counts.reduce((a:number,b:number)=>a+b,0),index=total%4;counts[index]=Math.min(999,counts[index]+1);localStorage.setItem('fox-battle-loot-v1',JSON.stringify({version:1,counts}));return {name:lootNames[index],counts,saved:true};}catch{return {name:'星叶碎片',counts:[1,0,0,0],saved:false};}}
