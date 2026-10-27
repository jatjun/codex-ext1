import {lootNames} from './combat-questions';
export type Upgrade='weapon'|'skill';
export type Forge={version:1;weapon:number;skill:number;spent:number[]};
const key='fox-forge-v1';
const safe=(v:unknown,max:number)=>typeof v==='number'&&Number.isInteger(v)&&v>=0?Math.min(max,v):0;
export function earnedMaterials(){try{const raw=JSON.parse(localStorage.getItem('fox-battle-loot-v1')||'null');return Array.from({length:4},(_,i)=>safe(raw?.counts?.[i],999));}catch{return [0,0,0,0];}}
export function readForge():Forge{try{const d=JSON.parse(localStorage.getItem(key)||'null');return {version:1,weapon:safe(d?.weapon,3),skill:safe(d?.skill,3),spent:Array.from({length:4},(_,i)=>safe(d?.spent?.[i],999))};}catch{return {version:1,weapon:0,skill:0,spent:[0,0,0,0]};}}
export function availableMaterials(f:Forge,earned=earnedMaterials()){return earned.map((n,i)=>Math.max(0,n-f.spent[i]));}
export function forgeCost(f:Forge,kind:Upgrade){const n=f[kind]+1;return kind==='weapon'?[n,1,0,0]:[0,0,n,1];}
export function upgradeForge(f:Forge,kind:Upgrade,earned:number[]):Forge|null{if(f[kind]>=3)return null;const cost=forgeCost(f,kind),available=availableMaterials(f,earned);if(cost.some((n,i)=>n>available[i]))return null;return {...f,[kind]:f[kind]+1,spent:f.spent.map((n,i)=>n+cost[i])};}
// A single localStorage write commits both the spend ledger and upgrade; earned loot remains an immutable total.
export function purchaseUpgrade(kind:Upgrade){const current=readForge(),next=upgradeForge(current,kind,earnedMaterials());if(!next)throw new Error('材料不足或已达到3级。');localStorage.setItem(key,JSON.stringify(next));return next;}
export function recipeText(cost:number[]){return cost.map((n,i)=>n?`${lootNames[i]}×${n}`:'').filter(Boolean).join('、');}
