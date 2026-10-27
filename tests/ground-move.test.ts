import {it,expect} from 'vitest';
import {groundStep} from '../src/adventure/ground-move';
it('点击移动按速度前进且到达不越过目标',()=>{const step=groundStep(0,0,{x:3,z:4},2);expect(step.x).toBeCloseTo(1.2);expect(step.z).toBeCloseTo(1.6);expect(step.arrived).toBe(false);expect(groundStep(2.9,4,{x:3,z:4},.5)).toEqual({x:3,z:4,arrived:true});expect(groundStep(3,4,{x:3,z:4},1)).toEqual({x:3,z:4,arrived:true});});
