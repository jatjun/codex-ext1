import type {Supply} from './supply-model';
import {canStartWave} from './waves';
export type WaveReward='ammo'|'heal'|'points';
export type RewardClaim={round:number;kind:WaveReward};
export const rewardNames:Record<WaveReward,string>={ammo:'补充弹药 +6',heal:'恢复生命 +25',points:'技能点 +2'};
export function rewardGain(s:Supply,kind:WaveReward){return kind==='ammo'?Math.min(6,99-s.ammo):kind==='heal'?Math.min(25,100-s.hp):Math.min(2,99-s.points);}
export function claimWaveReward(s:Supply,claims:RewardClaim[],round:number,health:number[],dense:boolean,kind:WaveReward){if(s.hp<=0||!canStartWave(round,health,dense)||claims.some(c=>c.round===round)||rewardGain(s,kind)<=0)return null;const gain=rewardGain(s,kind);return {supply:{...s,...(kind==='ammo'?{ammo:s.ammo+gain}:kind==='heal'?{hp:s.hp+gain}:{points:s.points+gain})},claims:[...claims,{round,kind}]};}
