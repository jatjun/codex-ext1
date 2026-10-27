import {it,expect} from 'vitest';
import {freshBoss,bossQuestion,chargeBoss,strikeBoss} from '../src/adventure/boss-model';
it('三阶段数量、护盾与能量守恒，不能重复空击通关',()=>{let s=freshBoss();for(const answer of [6,8,10]){expect(bossQuestion(s.hp).answer).toBe(answer);expect(strikeBoss(s,3).hp).toBe(s.hp);expect(chargeBoss(s,answer+1).energy).toBe(false);s=chargeBoss(s,answer);expect(strikeBoss(s,11).energy).toBe(true);s=strikeBoss(s,3);expect(s.energy).toBe(false);}expect(s.hp).toBe(0);expect(strikeBoss(s,3)).toBe(s);});
