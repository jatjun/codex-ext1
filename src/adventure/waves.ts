export function enemyForWave(round:number,index:number){index=index%3;const kinds=['追踪怪','疾行怪','重甲怪'] as const;return {name:kinds[index],hp:(index===2?5:3)+round-1,speed:index===0?1.3:index===1?2.1:.85};}
export function enemyCount(round:number,dense=false){return dense?round+3:3;}
export function waveSpawn(index:number){return {x:[-13,13,0,-14,14,6][index],z:[-5,-5,-13,2,2,-12][index]};}
export function canStartWave(round:number,health:number[],dense=false){return round>=1&&round<3&&health.length===enemyCount(round,dense)&&health.every(h=>h===0);}
export function bossUnlocked(round:number,health:number[],dense=false){return round===3&&health.length===enemyCount(round,dense)&&health.every(h=>h===0);}
