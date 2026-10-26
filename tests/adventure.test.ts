import {it,expect} from 'vitest';
import {freshAdventure,collectGem,deposit,bridgeReady,gateReady,finishAdventure} from '../src/adventure/model';
it('背包容量为4，不会丢失未收集水晶',()=>{let s=freshAdventure();for(let i=0;i<5;i++)s=collectGem(s,'mint');expect(s.bag).toHaveLength(4);expect(s.collected).toBe(4);});
it('三组各4颗才能修桥，搬运守恒且不能重复放入',()=>{let s=freshAdventure();for(let group=0;group<3;group++){for(let i=0;i<4;i++)s=collectGem(s,'mint');for(let i=0;i<4;i++)s=deposit(s,group);expect(s.bag.length+s.shrines.reduce((a,b)=>a+b,0)).toBe(s.collected);if(group<2)expect(bridgeReady(s)).toBe(false);}expect(bridgeReady(s)).toBe(true);expect(s.shrines).toEqual([4,4,4]);expect(deposit(s,0).shrines).toEqual([4,4,4]);});
it('错误颜色不扣除、不改变数学条件',()=>{const s=collectGem(freshAdventure(),'gold');expect(deposit(s,0).bag).toEqual(['gold']);expect(deposit(s,0).shrines).toEqual([0,0,0]);expect(deposit(s,'gate').gate).toEqual({gold:0,violet:0});});
it('花门要求3紫加2金，不能用任意5颗代替',()=>{let s=freshAdventure();s.shrines=[4,4,4];for(let i=0;i<3;i++){s=collectGem(s,'violet');s=deposit(s,'gate');}expect(gateReady(s)).toBe(false);s=collectGem(s,'violet');s=deposit(s,'gate');expect(s.gate.violet).toBe(3);expect(s.bag).toEqual(['violet']);for(let i=0;i<2;i++){s=collectGem(s,'gold');s=deposit(s,'gate');}expect(gateReady(s)).toBe(true);expect(finishAdventure(s).won).toBe(true);expect(finishAdventure(freshAdventure()).won).toBe(false);});
it('重复开始产生独立状态',()=>{const first=freshAdventure();first.shrines[0]=4;expect(freshAdventure().shrines).toEqual([0,0,0]);});
import {subjects} from '../src/adventure/subjects';
for(const subject of ['chinese','english'] as const)it(`${subject}词语分类选错不扣除，12词正确分类才能修桥`,()=>{let s=freshAdventure(subject);for(let group=0;group<3;group++){for(const word of subjects[subject].words.slice(group*4,group*4+4))s=collectGem(s,'mint',word);const before=[...s.labels];expect(deposit(s,(group+1)%3).labels).toEqual(before);for(let k=0;k<4;k++)s=deposit(s,group);}expect(s.labels).toEqual([]);expect(s.bag).toEqual([]);expect(bridgeReady(s)).toBe(true);});

import {levelFor} from '../src/adventure/subjects';
for(const subject of ['chinese','english','math'] as const)for(let level=0;level<3;level++)it(`${subject} 第${level+1}关分类与过桥任务可完成且错序不丢失`,()=>{
 const theme=levelFor(subject,level);let s=freshAdventure(subject,level);
 for(let group=0;group<3;group++)for(let k=0;k<4;k++){s=collectGem(s,'mint',theme.words[group*4+k]||'');s=deposit(s,group);}
 expect(bridgeReady(s)).toBe(true);
 if(theme.gateWords.length){s=collectGem(s,'violet',theme.gateWords[1]);const wrong=deposit(s,'gate');expect(wrong.bag).toEqual(s.bag);expect(wrong.gate).toEqual({violet:0,gold:0});s=collectGem(s,'violet',theme.gateWords[0]);s.selected=1;s=deposit(s,'gate');s=deposit(s,'gate');for(let i=2;i<5;i++){s=collectGem(s,i<3?'violet':'gold',theme.gateWords[i]);s=deposit(s,'gate');}}
 else for(let i=0;i<5;i++){s=collectGem(s,i<3?'violet':'gold');s=deposit(s,'gate');}
 expect(gateReady(s)).toBe(true);expect(finishAdventure(s).won).toBe(true);expect(s.bag).toHaveLength(0);
});
