import {it,expect} from 'vitest';
import {routePuzzle,routeCorrect,routeValue} from '../src/adventure/RouteGame';
import {trialsFor,trialCorrect} from '../src/adventure/campaign';
import {expeditionFor} from '../src/adventure/expedition-model';
for(const subject of ['math','chinese','english'] as const)for(const level of [10,11,12])it(`${subject}运输关${level}路线校验与场景`,()=>{const d=expeditionFor(subject,level);expect(d.place).toBe(['railway','orchard','reef'][level-10]);for(let i=0;i<3;i++){const p=routePuzzle(subject,level,i),t=trialsFor(subject,level)[i];expect(routeCorrect(p,[0,1,0])).toBe(true);expect(routeCorrect(p,[0,0,0])).toBe(false);expect(trialCorrect(t,'[0,1,0]')).toBe(true);for(const bad of ['[]','[0,1]','[0,1,1]','["0",1,0]','bad'])expect(trialCorrect(t,bad)).toBe(false);if(subject==='math'){expect(routeValue(p,[0])).toBe(14+i*2);expect(routeValue(p,[0,1,0])).toBe(13+i*2);}}});
