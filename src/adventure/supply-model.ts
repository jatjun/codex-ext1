export type Supply={hp:number;ammo:number;points:number;shield:number;weapon:'wand'|'burst';drops:number};
export const freshSupply=():Supply=>({hp:100,ammo:0,points:0,shield:0,weapon:'wand',drops:0});
export function earnSupply(s:Supply):Supply{return {...s,ammo:Math.min(99,s.ammo+3),points:Math.min(99,s.points+1)};}
export function spendShot(s:Supply){const cost=s.weapon==='burst'?2:1;if(s.hp<=0||s.ammo<cost)return null;return {...s,ammo:s.ammo-cost};}
export function skillSupply(s:Supply,skill:'heal'|'shield',level=0):Supply{if(s.points<2||s.hp<=0||skill==='heal'&&s.hp===100||skill==='shield'&&s.shield>=60)return s;return skill==='heal'?{...s,points:s.points-2,hp:Math.min(100,s.hp+30+Math.min(3,Math.max(0,level))*5)}:{...s,points:s.points-2,shield:Math.min(60,s.shield+30+Math.min(3,Math.max(0,level))*5)};}
export function hurtSupply(s:Supply,damage:number):Supply{if(!Number.isFinite(damage)||damage<0)return s;const absorbed=Math.min(s.shield,damage);return {...s,shield:s.shield-absorbed,hp:Math.max(0,s.hp-(damage-absorbed))};}
export function pickupSupply(s:Supply,kind:'heart'|'ammo'|'gear'):Supply{return {...s,drops:s.drops+1,...(kind==='heart'?{hp:Math.min(100,s.hp+25)}:kind==='ammo'?{ammo:Math.min(99,s.ammo+4)}:{points:Math.min(99,s.points+2)})};}
