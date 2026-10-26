import type {WebGLRenderer,Scene,Camera} from 'three';
import {Vector2} from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
export function makeEffects(renderer:WebGLRenderer,scene:Scene,camera:Camera){let composer:EffectComposer|undefined;let bloom:UnrealBloomPass|undefined;let output:OutputPass|undefined;function resize(){if(composer){const size=renderer.getSize(new Vector2());composer.setPixelRatio(Math.min(renderer.getPixelRatio(),2.5));composer.setSize(size.x,size.y);}}return {resize,render(ultra:boolean){if(!ultra){renderer.render(scene,camera);return;}if(!composer){composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));bloom=new UnrealBloomPass(new Vector2(512,512),.32,.35,1.8);composer.addPass(bloom);output=new OutputPass();composer.addPass(output);resize();}composer.render();},destroy(){bloom?.dispose();output?.dispose();composer?.dispose();}};}
