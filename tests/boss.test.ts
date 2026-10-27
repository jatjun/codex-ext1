import {it,expect} from 'vitest';
import {freshBoss,bossQuestion,chargeBoss,strikeBoss} from '../src/adventure/boss-model';
it('三阶段数量、护盾与能量守恒，不能重复空击通关',()=>{let s=freshBoss();for(const answer of [6,8,10]){expect(bossQuestion(s.hp).answer).toBe(answer);expect(strikeBoss(s,3).hp).toBe(s.hp);expect(chargeBoss(s,answer+1).energy).toBe(false);s=chargeBoss(s,answer);expect(strikeBoss(s,11).energy).toBe(true);s=strikeBoss(s,3);expect(s.energy).toBe(false);}expect(s.hp).toBe(0);expect(strikeBoss(s,3)).toBe(s);});
import {unlockedEquipment,validEquipment} from '../src/adventure/equipment';
import {addAward,heroStats,saveHero,readHero} from '../src/adventure/campaign';
import {vi} from 'vitest';
it('树王胜利只奖励一次，刷新后保留守护冠和经验',()=>{let h={version:1 as const,awards:[] as string[]};expect(validEquipment(h,'forest-crown')).toBe('');h=addAward(h,'math:boss:clear');h=addAward(h,'math:boss:clear');expect(heroStats(h).xp).toBe(60);expect(unlockedEquipment(h).map(e=>e.id)).toEqual(['forest-crown']);let stored='';vi.stubGlobal('localStorage',{setItem:(_k:string,v:string)=>stored=v,getItem:()=>stored});saveHero(h);expect(validEquipment(readHero(),'forest-crown')).toBe('forest-crown');vi.unstubAllGlobals();});
