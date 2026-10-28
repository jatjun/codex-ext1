import type {Supply} from './supply-model';
export type BattleSkill='dash'|'frost';
export type BattleSkills={dash:number;dashCooldown:number;frost:number;frostCooldown:number};
export const freshSkills=():BattleSkills=>({dash:0,dashCooldown:0,frost:0,frostCooldown:0});
export function tickSkills(s:BattleSkills,seconds:number):BattleSkills{if(!Number.isFinite(seconds)||seconds<0)return s;return {dash:Math.max(0,s.dash-seconds),dashCooldown:Math.max(0,s.dashCooldown-seconds),frost:Math.max(0,s.frost-seconds),frostCooldown:Math.max(0,s.frostCooldown-seconds)};}
export function castSkill(s:BattleSkills,supply:Supply,kind:BattleSkill,blocked=false,level=0){const cost=kind==='dash'?1:2;if(blocked||supply.hp<=0||supply.points<cost||(kind==='dash'?s.dashCooldown:s.frostCooldown)>0)return null;return {supply:{...supply,points:supply.points-cost},skills:kind==='dash'?{...s,dash:.22,dashCooldown:4}:{...s,frost:4+Math.min(3,Math.max(0,level))*.5,frostCooldown:8}};}
export function dashStep(x:number,z:number,direction:{x:number;z:number},seconds:number){const length=Math.hypot(direction.x,direction.z);if(!length||!Number.isFinite(length)||!Number.isFinite(seconds)||seconds<=0)return {x,z};return {x:Math.max(-16,Math.min(16,x+direction.x/length*22*seconds)),z:Math.max(-15,Math.min(16,z+direction.z/length*22*seconds))};}
export const enemyMovementScale=(slow:number)=>slow>0?.3:1;
