import {subjects,wordGroup,type Subject} from './subjects';
export type GemColor='mint'|'violet'|'gold';
export type AdventureState={subject:Subject;labels:string[];selected:number;bag:GemColor[];shrines:number[];gate:{violet:number;gold:number};won:boolean;collected:number;hint:string};
export const freshAdventure=(subject:Subject='math'):AdventureState=>({subject,labels:[],selected:0,bag:[],shrines:[0,0,0],gate:{violet:0,gold:0},won:false,collected:0,hint:subject==='math'?'找到绿色水晶，靠近它就能捡起来。每次最多搬4颗。':'收集词语后，在背包点选一个词语，再送到动物、水果或自然之家。'});
export const bridgeReady=(s:AdventureState)=>s.shrines.every(n=>n===4);
export const gateReady=(s:AdventureState)=>s.gate.violet===3&&s.gate.gold===2;
export function collectGem(s:AdventureState,color:GemColor,label=''):AdventureState{
 if(s.bag.length>=4)return {...s,hint:'背包满啦！把4颗水晶搬到发光的树桩。'};
 return {...s,bag:[...s.bag,color],labels:[...s.labels,label],collected:s.collected+1,hint:s.bag.length===3?(bridgeReady(s)?'背包装满啦！去花门放入水晶，再回来搬剩下的。':'装满4颗啦！去河边的树桩放入水晶。'):'水晶进背包了，继续找一找。'};
}
export function deposit(s:AdventureState,target:number|'gate'):AdventureState{
 if(target==='gate'){
  if(!bridgeReady(s))return s;
  const i=s.bag.findIndex(c=>c==='violet'?s.gate.violet<3:c==='gold'&&s.gate.gold<2);
  if(i<0||i>=s.bag.length)return {...s,hint:'花门还需要3颗紫水晶和2颗金水晶，去附近找找。'};
  const labels=[...s.labels];labels.splice(i,1);const bag=[...s.bag],color=bag.splice(i,1)[0] as 'violet'|'gold',gate={...s.gate,[color]:s.gate[color]+1};
  return {...s,bag,labels,selected:0,gate,hint:gate.violet+gate.gold===5?'3颗紫色＋2颗金色＝5颗！花门亮了，走进花门吧！':'水晶正在为花门充能，每颗都算数。'};
 }
 if(!Number.isInteger(target)||target<0||target>2)return s;
 if(s.shrines[target]===4)return {...s,hint:'这组已经有4颗啦，试试另外的树桩。'};
 const i=s.subject==='math'?s.bag.indexOf('mint'):s.selected;
 if(s.subject!=='math'&&s.bag.length){const word=s.labels[i];if(wordGroup(s.subject,word)!==target)return {...s,hint:'“'+word+'”不属于'+subjects[s.subject].groups[target]+'。读一读，再换一个家。'};}
if(i<0||i>=s.bag.length)return {...s,hint:'这个树桩需要绿色水晶。找到它们，再搬回来。'};
 const labels=[...s.labels];labels.splice(i,1);const bag=[...s.bag];bag.splice(i,1);const shrines=[...s.shrines];shrines[target]++;
 const all=shrines.every(n=>n===4);
 return {...s,bag,labels,selected:0,shrines,hint:s.subject!=='math'?(all?'词语都送对了！桥修好了，过河为花门收集3颗紫水晶和2颗金水晶。':'送对了！读一读背包里的下一个词语，再选择它的家。'):all?'每组4颗，3组就是12颗！晶桥修好了，过河去找花门。':shrines[target]===4?'这一组装满4颗！桥板升起来了。':'又放入1颗！看一看，这组还差几颗？'};
}
export function finishAdventure(s:AdventureState):AdventureState{return gateReady(s)?{...s,won:true}:s;}
