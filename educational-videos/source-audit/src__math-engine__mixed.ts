export type MixedKind = 'yogurt' | 'peaches';
export function multiplyAdd(each:number, groups:number, extra:number) {
  check(each,groups,extra); return {grouped:each*groups,total:each*groups+extra};
}
export function combineDivide(first:number,second:number,size:number) {
  check(first,second,size);
  if(size===0||(first+second)%size!==0)throw new Error('需要能整分的非零每盒数量');
  return {total:first+second,boxes:(first+second)/size};
}
function check(...values:number[]){if(values.some(n=>!Number.isSafeInteger(n)||n<0||n>1000))throw new Error('数量超出教学范围');}
export const yogurt=multiplyAdd(6,3,4);
export const peaches=combineDivide(25,15,8);
export type Point={x:number;y:number};
// Stable object identities survive every regrouping. Layout never computes answers.
export function positions(kind:MixedKind,step:number):Point[]{
  const total=kind==='yogurt'?yogurt.total:peaches.total;
  return Array.from({length:total},(_,i)=>{
    if(kind==='yogurt') {
      if(step>=3)return {x:48+(i%8)*54,y:90+Math.floor(i/8)*62};
      if(i>=18)return {x:385+(i-18)%2*42,y:100+Math.floor((i-18)/2)*50};
      const group=Math.floor(i/6),item=i%6;
      return {x:35+group*112+(item%2)*36,y:90+Math.floor(item/2)*52};
    }
    if(step>=3){const box=Math.floor(i/8),item=i%8;return {x:32+box*94+(item%2)*32,y:80+Math.floor(item/2)*40};}
    if(step>=1)return {x:45+(i%10)*44,y:90+Math.floor(i/10)*45};
    const second=i>=25,index=second?i-25:i;
    return {x:(second?295:35)+(index%5)*34,y:70+Math.floor(index/5)*38};
  });
}
