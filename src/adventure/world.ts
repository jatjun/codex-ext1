import {makeEffects} from './effects';
import {levelFor,type Subject} from './subjects';
/*! Three.js 0.170.0
The MIT License

Copyright © 2010-2024 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {bridgeReady,collectGem,deposit,finishAdventure,freshAdventure,gateReady,type AdventureState,type GemColor} from './model';
export type Quality='low'|'high'|'ultra';
export type WorldAPI={rank:(level:number)=>void;quality:(q:Quality)=>void;hints:(show:boolean)=>void;drop:()=>void;select:(i:number)=>void;start:()=>void;pause:(v:boolean)=>void;sound:(v:boolean)=>void;jump:()=>void;act:()=>void;move:(x:number,z:number)=>void;destroy:()=>void};
export function makeWorld(canvas:HTMLCanvasElement,onState:(s:AdventureState)=>void,onNear:(label:string)=>void,onTrack:(x:number,z:number,gems:{x:number;z:number;color:GemColor}[])=>void,subject:Subject='math',level=0,quality:Quality='high'):WorldAPI{
 const theme=levelFor(subject,level);const detail=new T.Group();
 const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
 const gl=renderer.getContext(),debug=gl.getExtension('WEBGL_debug_renderer_info');const software=debug?/swiftshader|llvmpipe|software/i.test(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)):false;
 renderer.setPixelRatio(quality==='low'?.65:Math.min(devicePixelRatio,quality==='ultra'?2.5:2));renderer.shadowMap.enabled=quality!=='low'&&!software;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;
 const scene=new T.Scene();scene.add(detail);const sky=['#b4dacf','#e8d6c5','#c8c8e7'][level];scene.background=new T.Color(sky);scene.fog=new T.Fog(sky,48,100);
 const camera=new T.PerspectiveCamera(42,1,.1,160);camera.position.set(15,23,34);
 scene.add(new T.HemisphereLight('#e4fff2','#b3a0a0',2.5));const sun=new T.DirectionalLight('#fff0ce',3.4);sun.position.set(-16,30,15);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-35,right:35,top:35,bottom:-35,near:.5,far:90});sun.shadow.bias=-.0005;sun.shadow.normalBias=.04;scene.add(sun);
 const effects=makeEffects(renderer,scene,camera);
 const mats=new Map<string,T.MeshStandardMaterial>();
 function mat(color:string,roughness=.8,metalness=0){const key=color+roughness+metalness;if(!mats.has(key))mats.set(key,new T.MeshStandardMaterial({color,roughness,metalness}));return mats.get(key)!;}
 function mesh(g:T.BufferGeometry,m:T.Material,p:T.Object3D=scene){const o=new T.Mesh(g,m);o.castShadow=true;o.receiveShadow=true;p.add(o);return o;}
 function ball(x:number,y:number,z:number,s:number,color:string,p:T.Object3D=scene){const o=mesh(new T.SphereGeometry(s,12,8),mat(color),p);o.position.set(x,y,z);return o;}
 function box(x:number,y:number,z:number,w:number,h:number,d:number,color:string,p:T.Object3D=scene){const o=mesh(new T.BoxGeometry(w,h,d),mat(color),p);o.position.set(x,y,z);return o;}
 function cylinder(x:number,y:number,z:number,rt:number,rb:number,h:number,color:string,p:T.Object3D=scene){const o=mesh(new T.CylinderGeometry(rt,rb,h,12),mat(color),p);o.position.set(x,y,z);return o;}
 const rng=(seed:number)=>{let n=seed;return()=>{n=(n*1664525+1013904223)>>>0;return n/4294967296;}};const random=rng(104);
 // Two layered forest banks with a safe, clearly visible river gap.
 box(0,-1.9,14,52,4,28,'#986c4d');box(0,-.3,14,52,.8,28,'#90b268');
 box(0,-1.9,-20,52,4,26,'#986c4d');box(0,-.3,-20,52,.8,26,'#87ad70');
 const grass=mat('#b0c879');
 for(let i=0;i<90;i++){const x=random()*50-25,z=i<55?random()*26+1:-random()*24-8;const o=mesh(new T.SphereGeometry(.6+random()*1.4,7,5),grass);o.scale.y=.12;o.position.set(x,.04,z);}
 const waterGeo=new T.PlaneGeometry(60,8,60,8);waterGeo.rotateX(-Math.PI/2);const waterMat=new T.MeshStandardMaterial({color:'#45bbbe',roughness:.23,metalness:.15,transparent:true,opacity:.87});
 const water=mesh(waterGeo,waterMat);water.position.set(0,-.55,-3.5);water.castShadow=false;
 const foam:T.Mesh[]=[];for(let i=0;i<44;i++){const o=mesh(new T.CapsuleGeometry(.035,.6+random()*1.5,2,5),mat('#c5fff0'));o.rotation.z=Math.PI/2;o.position.set(random()*55-27,-.4,-random()*6-.4);o.castShadow=false;foam.push(o);}
 const falls:T.Mesh[]=[];for(let i=0;i<20;i++){const o=box(26+random()*1,-2.8,-6.5+random()*6,.15+random()*.25,4.5,.15,'#8adbd5');falls.push(o);}
 const bridge:T.Mesh[]=[];for(let i=0;i<12;i++){const plank=box(0,-.65,-.22-i*.58,3.4,.25,.46,i%2?'#e3c591':'#f1d4a5');plank.rotation.z=(i%3-1)*.09;bridge.push(plank);}
 for(const x of [-2,2]){for(const z of [1,-7.4]){cylinder(x,.65,z,.18,.23,1.4,'#996f4a');ball(x,1.42,z,.25,'#f6ce7d');}box(x,.8,-3.2,.09,.1,8.2,'#c8a77c');}
 const obstacles:{x:number;z:number;r:number}[]=[];
 function tree(x:number,z:number,scale=1){const g=new T.Group();scene.add(g);g.position.set(x,0,z);g.scale.setScalar(scale);cylinder(0,1.4,0,.36,.66,2.8,'#8f6a50',g);const colors=['#419b75','#5dad7a','#75bd82'];for(let j=0;j<5;j++){const a=j*2.4;ball(Math.sin(a)*.9,3.2+(j%2)*.9,Math.cos(a)*.8,1.7,colors[j%3],g);}ball(-.4,4.4,.2,1.25,'#9ccf89',g);obstacles.push({x,z,r:.7*scale});}
 for(let i=0;i<28;i++){const x=(i%2?1:-1)*(19+random()*7),z=i<16?2+random()*25:-10-random()*22;tree(x,z,.8+random()*.55);}
 for(const [x,z,s] of [[-12,9,1.1],[12,19,1.2],[-6,24,1.1],[9,9,1],[-15,-18,1.1],[13,-22,1.2],[6,-29,1.1]])tree(x,z,s);
 // Stepping-stone trails, flowers, mushrooms and fern-like foliage.
 for(let i=0;i<18;i++){const z=24-i*1.2,x=Math.sin(i*.55)*1.4;const o=cylinder(x,.11,z,.68,.72,.12,'#dfd5ae');o.scale.z=.65;o.rotation.y=i;}
 for(let i=0;i<12;i++)cylinder(Math.sin(i*.7)*1.5,.1,-9-i*1.2,.7,.76,.12,'#dfd5ae');
 for(let i=0;i<190;i++){const x=random()*49-24.5,z=i<120?random()*26+1:-random()*23-9;if(Math.abs(x)<3)continue;const color=['#ffdb8b','#f7c5bb','#dcdefc'][i%3];if(i%4===0){cylinder(x,.17,z,.045,.045,.35,'#60976a');ball(x,.38,z,.14,color);}else{const g=mesh(new T.ConeGeometry(.13,.45+random()*.3,3),mat(i%2?'#6ca878':'#96bf72'));g.position.set(x,.25,z);g.rotation.z=.2;}}
 for(const [x,z] of [[-9,17],[15,8],[-17,3],[10,-15],[-8,-25]]){cylinder(x,.25,z,.1,.14,.5,'#fff0ca');const cap=ball(x,.55,z,.48,'#e88e78');cap.scale.y=.55;ball(x+.13,.75,z,.07,'#fff5d5');ball(x-.16,.72,z+.1,.06,'#fff5d5');}
 for(let i=0;i<18;i++){const x=random()*46-23,z=i<10?random()*25+1:-random()*23-10;const rock=mesh(new T.DodecahedronGeometry(.5+random()*.45),mat('#b2c1ac'));rock.position.set(x,.35,z);rock.scale.y=.7;}
 const shrinePositions=[{x:-7,z:3},{x:0,z:4},{x:7,z:3}];const slots:T.Mesh[][]=[];const shrineLights:T.PointLight[]=[];
 shrinePositions.forEach((p,i)=>{cylinder(p.x,.4,p.z,1.05,1.22,.8,'#956f52');cylinder(p.x,.84,p.z,.99,1.04,.1,'#e6c993');const list:T.Mesh[]=[];for(let k=0;k<4;k++){const a=k*Math.PI/2+Math.PI/4;const o=mesh(new T.OctahedronGeometry(.24),new T.MeshStandardMaterial({color:'#779b89',emissive:'#2d8a66',emissiveIntensity:0,roughness:.3}));o.position.set(p.x+Math.sin(a)*.58,1.1,p.z+Math.cos(a)*.58);list.push(o);}slots.push(list);const light=new T.PointLight('#83ffe2',0,5);light.position.set(p.x,1.8,p.z);scene.add(light);shrineLights.push(light);cylinder(p.x,.06,p.z,1.6,1.6,.04,'#b4d1a0');});
 // A leafy arch at the destination.
 const portal=new T.Group();portal.position.set(0,0,-25);scene.add(portal);
 for(const side of [-1,1]){cylinder(side*2,2,0,.4,.6,4,'#91a58b',portal);for(let j=0;j<5;j++)ball(side*(2-j*.22),3.5+j*.18,0,.7,j%2?'#97bd84':'#65a77c',portal);}
 const arch=mesh(new T.TorusGeometry(2,.23,8,32,Math.PI),mat('#cce1a3'),portal);arch.position.y=2.5;
 const portalM=new T.MeshStandardMaterial({color:'#c3ffff',emissive:'#7cddcb',emissiveIntensity:.1,transparent:true,opacity:.15,side:T.DoubleSide});const portalDisc=mesh(new T.CircleGeometry(1.7,32),portalM,portal);portalDisc.position.set(0,2,.1);portalDisc.scale.y=1.2;
 const gateSlots:T.Mesh[]=[];for(let i=0;i<5;i++){const o=mesh(new T.OctahedronGeometry(.3),new T.MeshStandardMaterial({color:i<3?'#ac8ad6':'#e9c678',emissive:i<3?'#b297ff':'#ffe59c',emissiveIntensity:0}));o.position.set((i-2)*.72,.55,-22.7);gateSlots.push(o);}
 const colors:Record<GemColor,string>={mint:'#79ffe0',violet:'#c3a2ff',gold:'#ffdc75'};
 const gems:{mesh:T.Group;core:T.Mesh;color:GemColor;x:number;z:number;y:number;label:string;taken:boolean;returned:boolean}[]=[];
 function gem(x:number,z:number,color:GemColor,y=0,label=''){const g=new T.Group();g.position.set(x,1+y,z);scene.add(g);const core=mesh(new T.OctahedronGeometry(.43),new T.MeshStandardMaterial({color:colors[color],emissive:colors[color],emissiveIntensity:.65,metalness:.2,roughness:.15}),g);core.scale.y=1.4;const ring=mesh(new T.TorusGeometry(.65,.025,4,24),new T.MeshBasicMaterial({color:colors[color],transparent:true,opacity:.5}),g);ring.rotation.x=Math.PI/2;ring.position.y=-.6;gems.push({mesh:g,core,color,x,z,y,label,taken:false,returned:false});if(y>0){cylinder(x,.4,z,.8,1,.8,'#9a8063');}}
 for(const [x,z,y] of [[-12,18,0],[-14,14,0],[-16,8,0],[-10,5,0],[-4,14,0],[-8,20,.5],[-2,24,0],[5,21,0],[14,24,0],[16,15,0],[13,5,0],[6,12,.5]])gem(x,z,'mint',y,theme.words[gems.length]||'');
 for(const [x,z,c] of [[-8,-13,'violet'],[-12,-22,'violet'],[7,-15,'violet'],[12,-25,'gold'],[-5,-29,'gold']] as const)gem(x,z,c,0,theme.gateWords[gems.length-12]||'');
 // Original, articulated fox model: cream muzzle, ears, paws, scarf and springy tail.
 const fox=new T.Group();fox.scale.setScalar(1.25);scene.add(fox);fox.position.set(0,0,20);const body=new T.Group();fox.add(body);
 const torso=ball(0,.85,0,.58,'#e99449',body);torso.scale.set(.8,1.05,1.2);const chest=ball(0,.87,.38,.37,'#fff0cf',body);chest.scale.set(.85,1.1,.6);
 const head=new T.Group();head.position.set(0,1.48,.24);body.add(head);const skull=ball(0,0,0,.59,'#ee9c53',head);skull.scale.set(1,.87,.95);
 for(const side of [-1,1]){const ear=mesh(new T.ConeGeometry(.25,.65,4),mat('#d47a3f'),head);ear.position.set(side*.34,.5,-.08);ear.rotation.z=-side*.16;const inner=mesh(new T.ConeGeometry(.14,.4,3),mat('#ffdbb0'),head);inner.position.set(side*.34,.5,.025);inner.rotation.z=-side*.16;const cheek=ball(side*.24,-.16,.42,.29,'#fff0cf',head);cheek.scale.set(1,.7,1);ball(side*.245,.07,.49,.065,'#344a45',head);ball(side*.26,.095,.54,.023,'#ffffff',head);}
 const nose=ball(0,-.12,.71,.085,'#344a45',head);nose.scale.set(1,.7,.8);
 const legs:T.Group[]=[];for(const side of [-1,1])for(const back of [-1,1]){const leg=new T.Group();leg.position.set(side*.3,.55,back*.37);body.add(leg);const limb=ball(0,-.2,0,.17,'#c77a3d',leg);limb.scale.y=1.6;ball(0,-.42,.06,.18,'#604e3f',leg);legs.push(leg);}
 const tail=new T.Group();tail.position.set(0,.72,-.5);tail.rotation.x=-.7;body.add(tail);const tailBody=ball(0,.15,-.52,.38,'#dd8843',tail);tailBody.scale.set(1,1,1.9);const tip=ball(0,.22,-1.05,.27,'#fff0cf',tail);tip.scale.z=1.4;
 const scarf=mesh(new T.TorusGeometry(.36,.085,5,16),mat('#57b6ac'),body);scarf.rotation.x=Math.PI/2;scarf.position.set(0,1.2,.12);const scarfEnd=box(-.34,1,.05,.18,.5,.08,'#57b6ac',body);scarfEnd.rotation.z=-.4;
 const bagMesh=ball(0,1,-.48,.27,'#b88759',body);bagMesh.scale.set(1,.9,.7);
 const shadow=mesh(new T.CircleGeometry(.7,24),new T.MeshBasicMaterial({color:'#365c4d',transparent:true,opacity:.15}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.14;shadow.castShadow=false;
 const motes:{o:T.Mesh;seed:number}[]=[];for(let i=0;i<45;i++){const o=mesh(new T.SphereGeometry(.035+random()*.025,4,3),new T.MeshBasicMaterial({color:i%2?'#ffefab':'#c4fff1'}));o.position.set(random()*45-22,1+random()*5,random()*58-30);o.castShadow=false;motes.push({o,seed:random()*10});}
 const particles:{o:T.Mesh;v:T.Vector3;life:number}[]=[];
 function burst(x:number,y:number,z:number,color:string,count=16){for(let i=0;i<count;i++){const o=mesh(new T.OctahedronGeometry(.06+random()*.06),new T.MeshBasicMaterial({color}));o.position.set(x,y,z);o.castShadow=false;particles.push({o,v:new T.Vector3((random()-.5)*4,1+random()*4,(random()-.5)*4),life:1.2+random()});}}
 // Batch scenery by material. Animated objects retain their independent transforms.
 const dynamic=new Set<T.Object3D>([water,...foam,...falls,...bridge,...slots.flat(),...gateSlots,portalDisc,shadow,...motes.map(m=>m.o)]);
 fox.traverse(o=>{dynamic.add(o);if(o instanceof T.Mesh)o.castShadow=false;});gems.forEach(g=>g.mesh.traverse(o=>dynamic.add(o)));
 scene.updateMatrixWorld(true);
 const batches=new Map<T.Material,{geometries:T.BufferGeometry[];objects:T.Mesh[]}>();
 scene.traverse(o=>{if(o instanceof T.Mesh&&!dynamic.has(o)&&!Array.isArray(o.material)){const batch=batches.get(o.material)||{geometries:[],objects:[]};const geometry=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();geometry.applyMatrix4(o.matrixWorld);batch.geometries.push(geometry);batch.objects.push(o);batches.set(o.material,batch);}});
 batches.forEach((batch,material)=>{const geometry=mergeGeometries(batch.geometries);if(geometry){batch.objects.forEach(o=>{o.removeFromParent();o.geometry.dispose();});mesh(geometry,material);}batch.geometries.forEach(g=>g.dispose());});
 // Soft procedural halos: generated locally, with no external texture requests.
 const glowCanvas=document.createElement('canvas');glowCanvas.width=64;glowCanvas.height=64;const gc=glowCanvas.getContext('2d')!;const gradient=gc.createRadialGradient(32,32,0,32,32,32);gradient.addColorStop(0,'rgba(190,255,235,.7)');gradient.addColorStop(.3,'rgba(130,255,215,.25)');gradient.addColorStop(1,'rgba(130,255,215,0)');gc.fillStyle=gradient;gc.fillRect(0,0,64,64);const glowTexture=new T.CanvasTexture(glowCanvas);
 gems.forEach(g=>{const sprite=new T.Sprite(new T.SpriteMaterial({map:glowTexture,color:colors[g.color],transparent:true,depthWrite:false,blending:T.AdditiveBlending}));sprite.scale.set(2.4,2.4,1);g.mesh.add(sprite);});
 const wordTextures:T.CanvasTexture[]=[];
 const labels:T.Sprite[]=[];let showLabels=true;const labelPosition=new T.Vector3();
 function labelSprite(text:string,x:number,y:number,z:number,parent:T.Object3D=scene){const c=document.createElement('canvas');c.width=768;c.height=192;const ctx=c.getContext('2d')!;
 ctx.shadowColor='#173e3355';ctx.shadowBlur=12;ctx.shadowOffsetY=5;ctx.fillStyle='#fffdf4';ctx.beginPath();ctx.roundRect(12,10,744,162,36);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.strokeStyle='#b5cfb1';ctx.lineWidth=4;ctx.stroke();ctx.fillStyle='#183e2d';ctx.font='600 '+(text.length>10?64:86)+'px "Trebuchet MS", "Microsoft YaHei", sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,384,91,690);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();wordTextures.push(texture);const sprite=new T.Sprite(new T.SpriteMaterial({map:texture,depthTest:false,transparent:true,depthWrite:false,toneMapped:false}));sprite.position.set(x,y,z);sprite.scale.set(4.4,1.1,1);sprite.renderOrder=5;parent.add(sprite);labels.push(sprite);}
 gems.forEach(g=>labelSprite(g.label||(g.color==='mint'?'1颗 · 绿色':g.color==='gold'?'1颗 · 金色':'1颗 · 紫色'),0,1.25,0,g.mesh));shrinePositions.forEach((p,i)=>labelSprite(theme.groups[i],p.x,2.4,p.z));
 // Decorative rose arches, lanterns and flower beds have no collision or learning state.
 for(const side of [-1,1])for(const z of [15,-16,-28]){const x=side*18;cylinder(x,1.5,z,.09,.13,3,'#877451',detail);const lamp=ball(x,3,z,.3,'#ffe6a0',detail);(lamp.material as T.MeshStandardMaterial).emissive.set('#b98938');for(let j=0;j<7;j++){const a=j*Math.PI*2/7;const blossom=ball(x+Math.cos(a)*1.2,.3,z+Math.sin(a)*1.2,.25,level===1?'#f2abc2':level===2?'#b7a4ef':'#f5d697',detail);blossom.scale.y=.55;}}
 const butterflies:T.Group[]=[];for(let i=0;i<10;i++){const g=new T.Group();detail.add(g);g.position.set((i%2?1:-1)*(4+i),2,-20+i*4);for(const side of [-1,1]){const wing=ball(side*.15,0,0,.2,i%2?'#ffd789':'#e5b9ef',g);wing.scale.set(1,.12,1.4);}butterflies.push(g);}
 function setQuality(q:Quality){quality=q;renderer.setPixelRatio(q==='low'?.65:Math.min(devicePixelRatio,q==='ultra'?2.5:2));renderer.shadowMap.enabled=q!=='low'&&!software;renderer.shadowMap.needsUpdate=true;detail.visible=q!=='low';renderer.toneMappingExposure=q==='ultra'?.94:1.18;sun.intensity=q==='ultra'?2.8:3.4;canvas.dataset.quality=q;resize();}
 let state=freshAdventure(subject,level),active=false,paused=false,muted=true,near:number|'gate'|null=null,joy={x:0,z:0},vy=0,jumpY=0,t=0,last=0,frame=0,dead=false,lastHint=0,winTime=0;
 const keys=new Set<string>();let audio:AudioContext|null=null;
 function tone(freq=660){if(muted)return;try{audio??=new AudioContext();void audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.setValueAtTime(freq,audio.currentTime);o.frequency.exponentialRampToValueAtTime(freq*1.5,audio.currentTime+.16);g.gain.setValueAtTime(.07,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.35);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.4);}catch{/* Sound is optional. */}}
 function notify(){onState({...state,bag:[...state.bag],shrines:[...state.shrines],gate:{...state.gate}});}
 function act(){renderer.shadowMap.needsUpdate=true;if(!active||paused||state.won||near===null)return;const old=state;state=deposit(state,near);if(state.bag.length<old.bag.length){tone(440+state.collected*20);burst(fox.position.x,1.4,fox.position.z,near==='gate'?'#ffe3ab':'#9effdc');}notify();}
 function jump(){if(active&&!paused&&!state.won&&jumpY<=.01){vy=6.5;tone(220);}}
 const keydown=(e:KeyboardEvent)=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys.add(e.key.toLowerCase());if(!e.repeat){if(e.code==='Space')jump();if(e.key.toLowerCase()==='e')act();}};
 const keyup=(e:KeyboardEvent)=>keys.delete(e.key.toLowerCase());const clear=()=>{keys.clear();joy={x:0,z:0};};window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);window.addEventListener('blur',clear);
 const resize=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();effects.resize();};const observer=new ResizeObserver(resize);observer.observe(canvas);resize();setQuality(quality);
 function tick(now:number){if(dead)return;const dt=Math.min((now-last)/1000||.016,.1);last=now;if(!paused)t+=dt;
  if(!paused){
   const attr=waterGeo.attributes.position;for(let i=0;i<attr.count;i++){const x=attr.getX(i),z=attr.getZ(i);attr.setY(i,Math.sin(x*.55+t*1.4+z)*.065);}attr.needsUpdate=true;
   foam.forEach((o,i)=>{o.position.x+=dt*(.55+i%3*.15);if(o.position.x>29)o.position.x=-29;o.position.y=-.38+Math.sin(t*2+i)*.025;});falls.forEach((o,i)=>{o.scale.y=.8+Math.sin(t*3+i)*.2;});
   gems.forEach((g,i)=>{if(!g.taken){g.mesh.position.y=1+g.y+Math.sin(t*2+i)*.12;g.core.rotation.y=t*.7+i;}});
   butterflies.forEach((g,i)=>{g.position.y=2+Math.sin(t+i)*.5;g.rotation.y=t*.3+i;g.children.forEach((w,k)=>w.rotation.z=Math.sin(t*9+i)*(k?1:-1)*.6);});
   motes.forEach(({o,seed})=>{o.position.x+=Math.sin(t*.5+seed)*dt*.1;o.position.y+=Math.sin(t+seed)*dt*.12;});
   for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;p.v.y-=dt*3;p.o.position.addScaledVector(p.v,dt);p.o.rotation.x+=dt*3;p.o.scale.setScalar(Math.max(0,p.life));if(p.life<=0){scene.remove(p.o);p.o.geometry.dispose();(p.o.material as T.Material).dispose();particles.splice(i,1);}}
   let moving=false;
   if(active&&!state.won){let dx=joy.x+(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),dz=joy.z+(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);const length=Math.hypot(dx,dz);if(length>.08){dx/=Math.max(1,length);dz/=Math.max(1,length);moving=true;const nx=T.MathUtils.clamp(fox.position.x+dx*dt*5.4,-23.8,23.8),nz=T.MathUtils.clamp(fox.position.z+dz*dt*5.4,-31,26);const inRiver=nz<.8&&nz>-8;const safe=!inRiver||(bridgeReady(state)&&Math.abs(nx)<1.4);const blocked=obstacles.some(o=>Math.hypot(nx-o.x,nz-o.z)<o.r+.35);if(safe&&!blocked){fox.position.x=nx;fox.position.z=nz;}else if(!safe&&t-lastHint>4){state={...state,hint:bridgeReady(state)?'桥在河中央，沿着桥板安全过河。':'河水有点深。先给3个树桩各放4颗水晶，修好晶桥。'};notify();lastHint=t;}const target=Math.atan2(dx,dz);fox.rotation.y+=Math.atan2(Math.sin(target-fox.rotation.y),Math.cos(target-fox.rotation.y))*Math.min(1,dt*12);}
    vy-=dt*16;jumpY=Math.max(0,jumpY+vy*dt);if(jumpY===0)vy=0;fox.position.y=jumpY;
    for(const g of gems){if(g.returned){if(Math.hypot(fox.position.x-g.x,fox.position.z-g.z)<1.5)continue;g.returned=false;}if(!g.taken&&g.y>0&&Math.hypot(fox.position.x-g.x,fox.position.z-g.z)<1.3&&jumpY<g.y*.65&&state.bag.length<4&&t-lastHint>4){state={...state,hint:'这颗水晶高一点，按空格或点“跳跃”就能碰到它。'};notify();lastHint=t;}if(!g.taken&&Math.hypot(fox.position.x-g.x,fox.position.z-g.z)<1.1&&jumpY>=g.y*.65&&state.bag.length<4){state=collectGem(state,g.color,g.label);g.taken=true;g.mesh.visible=false;tone(g.color==='mint'?700:900);burst(g.x,1.2+g.y,g.z,colors[g.color],10);notify();}}
    const nextNear=fox.position.z<-19&&Math.hypot(fox.position.x,fox.position.z+23)<3?'gate':shrinePositions.findIndex(p=>Math.hypot(p.x-fox.position.x,p.z-fox.position.z)<2.3);const value=nextNear===-1?null:nextNear as number|'gate';if(value!==near){near=value;onNear(near===null?'':near==='gate'?'给花门放入1颗':`给第${near+1}组放入1颗`);}
    if(gateReady(state)&&Math.hypot(fox.position.x,fox.position.z+25)<1.5){state=finishAdventure(state);notify();tone(1046);winTime=t;burst(0,3,-25,'#ffe3a4',55);}
   }
   legs.forEach((leg,i)=>leg.rotation.x=moving?Math.sin(t*15+(i===0||i===3?0:Math.PI))*.65:Math.sin(t*2+i)*.03);
   body.position.y=moving?Math.sin(t*30)*.045:Math.sin(t*2)*.035;tail.rotation.y=Math.sin(t*(moving?9:2.5))*.25;head.rotation.z=Math.sin(t*1.8)*.035;
   if(state.won){fox.rotation.y+=dt*2;fox.position.y=Math.abs(Math.sin((t-winTime)*4))*.7;if(Math.floor(t*3)!==Math.floor((t-dt)*3)&&t-winTime<9)burst((random()-.5)*7,3,-25+(random()-.5)*5,['#ffe1a1','#9affd8','#dcc2ff'][Math.floor(random()*3)],10);}
  }
  labels.forEach(label=>{label.getWorldPosition(labelPosition);label.visible=showLabels&&active&&Math.hypot(labelPosition.x-fox.position.x,labelPosition.z-fox.position.z)<17;});
  shadow.position.set(fox.position.x,.14,fox.position.z);shadow.scale.setScalar(1-jumpY*.13);
  slots.forEach((list,i)=>list.forEach((o,k)=>{const m=o.material as T.MeshStandardMaterial;m.emissiveIntensity=k<state.shrines[i]?1.5:0;m.color.set(k<state.shrines[i]?'#8dffe0':'#779b89');}));shrineLights.forEach((o,i)=>o.intensity=state.shrines[i]*.45);
  const repaired=state.shrines.filter(n=>n===4).length*4;bridge.forEach((o,i)=>{o.visible=i<repaired;o.position.y=T.MathUtils.lerp(o.position.y,i<repaired?.12:-.65,.08);o.rotation.z=T.MathUtils.lerp(o.rotation.z,i<repaired?0:(i%3-1)*.09,.08);});
  gateSlots.forEach((o,i)=>{(o.material as T.MeshStandardMaterial).emissiveIntensity=i<3?(i<state.gate.violet?2:0):(i-3<state.gate.gold?2:0);});portalM.opacity=gateReady(state)?.6:.12;portalM.emissiveIntensity=gateReady(state)?2:.1;portalDisc.rotation.z=Math.sin(t)*.025;
  if(Math.floor(t*4)!==Math.floor((t-dt)*4))onTrack(fox.position.x,fox.position.z,gems.filter(g=>!g.taken));
  canvas.dataset.frame=String(Number(canvas.dataset.frame||0)+1);canvas.dataset.x=fox.position.x.toFixed(2);canvas.dataset.z=fox.position.z.toFixed(2);canvas.dataset.jump=jumpY.toFixed(2);canvas.dataset.running=String(active&&!paused);
  const target=active?new T.Vector3(fox.position.x*.76,0,fox.position.z-2):new T.Vector3(0,0,6);const distance=camera.aspect<.8?31:24;const desired=new T.Vector3(target.x+5,distance,target.z+distance*.9);camera.position.lerp(desired,active?.035:.02);camera.lookAt(target.x,.3,target.z);effects.render(quality==='ultra');frame=requestAnimationFrame(tick);
 }
 frame=requestAnimationFrame(tick);notify();
 return {rank(level){scarf.material=mat(level>=4?'#e7b447':level>=2?'#b06cea':'#4daba6');},quality:setQuality,hints(show){showLabels=show;},drop(){if(!active||paused||state.won||!state.bag.length)return;const i=state.selected;const g=gems.find(g=>g.taken&&g.label===state.labels[i]&&g.color===state.bag[i]);if(!g)return;g.taken=false;g.returned=true;g.mesh.visible=true;state={...state,bag:state.bag.filter((_,k)=>k!==i),labels:state.labels.filter((_,k)=>k!==i),selected:0,collected:state.collected-1,hint:'已把水晶放回地图原处。先去找当前需要的那一块吧。'};notify();},select(i){if(Number.isInteger(i)&&i>=0&&i<state.bag.length){state={...state,selected:i};notify();}},start(){active=true;paused=false;},pause(v){paused=v;clear();},sound(v){muted=!v;if(v)tone(520);},jump,act,move(x,z){joy={x,z};},destroy(){dead=true;cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);window.removeEventListener('blur',clear);scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>m.dispose());}});scene.traverse(o=>{if(o instanceof T.Sprite)o.material.dispose();});wordTextures.forEach(t=>t.dispose());glowTexture.dispose();effects.destroy();renderer.dispose();void audio?.close();}};
}
