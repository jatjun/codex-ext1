export function enemyForWave(round:number,index:number){const kinds=['追踪怪','疾行怪','重甲怪'] as const;return {name:kinds[index],hp:(index===2?5:3)+round-1,speed:index===0?1.3:index===1?2.1:.85};}
export function canStartWave(round:number,health:number[]){return round>=1&&round<3&&health.length===3&&health.every(h=>h===0);}
export function bossUnlocked(round:number,health:number[]){return round===3&&health.length===3&&health.every(h=>h===0);}
