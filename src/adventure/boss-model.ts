export type BossState={hp:number;energy:boolean;hits:number;rescues:number;hint:string};
export const freshBoss=():BossState=>({hp:3,energy:false,hits:0,rescues:0,hint:'躲开追来的泡泡怪，到符文台选择正确的数量，再靠近树王发射。'});
export function bossQuestion(hp:number){const groups=6-hp,each=2;return {groups,each,answer:groups*each,options:[groups*each-1,groups*each,groups*each+1]};}
export function chargeBoss(s:BossState,answer:number):BossState{if(s.hp<=0||!Number.isInteger(answer))return s;return answer===bossQuestion(s.hp).answer?{...s,energy:true,hint:'符文已点亮！靠近树王（10步内）按F发射。'}:{...s,hint:'再数一数：每圈2颗，看看一共有几圈。错误不会扣生命。'};}
export function strikeBoss(s:BossState,distance:number):BossState{if(s.hp<=0)return s;if(!s.energy)return {...s,hint:'树王还有护盾。先走到符文台，点亮正确数量。'};if(distance>10)return {...s,hint:'再靠近树王一点，符文能量会保留。'};return {...s,hp:s.hp-1,energy:false,hint:s.hp===1?'迷雾散开了！宝箱已出现。':'击中护盾！树王召唤了更多星果，重新观察符文台。'};}
