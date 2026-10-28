import {it,expect} from 'vitest';
import {advanceBomb,throwerAction,type Bomb} from '../src/adventure/artillery';
import {enemyForWave,waveSpawn} from '../src/adventure/waves';
const fresh=():Bomb=>({age:0,exploded:false,x:0,z:0});
it('投弹提前预警，落点固定且只能伤害一次',()=>{const warned=advanceBomb(fresh(),1.79,{x:0,z:0});expect(warned.hit).toBe(false);const impact=advanceBomb(warned.bomb,.02,{x:0,z:0});expect(impact.hit).toBe(true);expect(advanceBomb(impact.bomb,.1,{x:0,z:0}).hit).toBe(false);expect(advanceBomb(impact.bomb,.5,{x:0,z:0}).done).toBe(true);});
it('走出橙圈、导师保护或冲刺无敌可避免该次伤害',()=>{expect(advanceBomb(fresh(),1.8,{x:2.2,z:0}).hit).toBe(false);const protectedHit=advanceBomb(fresh(),1.8,{x:0,z:0},true);expect(protectedHit.hit).toBe(false);expect(advanceBomb(protectedHit.bomb,.05,{x:0,z:0}).hit).toBe(false);});
it('暂停不推进投弹，跨过命中窗口仍正确结算',()=>{expect(advanceBomb(fresh(),0,{x:0,z:0}).bomb).toEqual(fresh());expect(advanceBomb(fresh(),2.3,{x:0,z:0})).toMatchObject({hit:true,done:true});expect(advanceBomb(fresh(),NaN,{x:0,z:0}).bomb).toEqual(fresh());});
it('远处靠近、近处后退，保持投掷距离，出手后5秒冷却',()=>{expect(throwerAction(12,0,.1,0)).toMatchObject({direction:1,fire:false});expect(throwerAction(3,0,.1,0)).toMatchObject({direction:-1,fire:true,cooldown:5});expect(throwerAction(6,2,1,0)).toEqual({direction:0,cooldown:1,fire:false});});
it('冰霜减慢投弹准备，导师安全区不移动不投弹',()=>{expect(throwerAction(6,1,1,2)).toMatchObject({cooldown:.7,fire:false});expect(throwerAction(6,1,1,0)).toMatchObject({cooldown:5,fire:true});expect(throwerAction(3,1,10,0,true)).toEqual({direction:0,cooldown:1,fire:false});});
it('投弹模式替换一只重甲怪，保留其他模式与后续波次生命',()=>{expect(enemyForWave(1,2).ranged).toBe(false);expect(enemyForWave(1,2,true)).toMatchObject({ranged:true,hp:5,name:'投弹怪'});expect(enemyForWave(3,2,true).hp).toBe(7);expect(enemyForWave(1,5,true).ranged).toBe(false);});

it('侧翼出生点不会被中央树王遮住或与其他出生点重合',()=>{expect(waveSpawn(2,true)).toEqual({x:11,z:-8});expect(new Set(Array.from({length:6},(_,i)=>JSON.stringify(waveSpawn(i,true)))).size).toBe(6);});
