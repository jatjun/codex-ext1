import {buildRegion,regionPalette,type Region} from './regions';
import {equipment,type EquipmentId} from './equipment';
import {expeditionLayout} from './expedition-model';
import {makeEffects} from './effects';
import {trialCorrect,heardWord} from './campaign';
import * as T from 'three';
import {allFreed,freshBattle,hitSpirit,type BattleState,type Expedition} from './expedition-model';
import type {Quality} from './world';
export type ExpeditionAPI={equip:(id:EquipmentId|'')=>void;rank:(level:number)=>void;solve:(index:number,value:string,spoken?:boolean)=>boolean;start:()=>void;pause:(p:boolean)=>void;move:(x:number,z:number)=>void;jump:()=>void;select:(i:number)=>void;fire:()=>void;quality:(q:Quality)=>void;destroy:()=>void};
export function makeExpedition(canvas:HTMLCanvasElement,data:Expedition,quality:Quality,onState:(s:BattleState)=>void,onTarget:(n:number)=>void,onPortal:()=>void):ExpeditionAPI{
 const advanced=['market','mine','castle'].includes(data.place),palette=advanced?regionPalette[data.place as Region]:undefined,layout=expeditionLayout(data.place);
 const snow=data.place==='snow',modern=!!data.trials,harbor=data.place==='harbor',scene=new T.Scene(),renderer=new T.WebGLRenderer({canvas,antialias:true});scene.background=new T.Color(palette?.sky||(modern?(harbor?'#192654':'#627fd7'):snow?'#c3d9f0':'#ead4bb'));scene.fog=new T.Fog(palette?.sky||(modern?(harbor?'#192654':'#627fd7'):snow?'#c3d9f0':'#ead4bb'),45,95);
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.shadowMap.type=T.PCFSoftShadowMap;
 const camera=new T.PerspectiveCamera(45,1,.1,130);camera.position.set(4,27,39);scene.add(new T.HemisphereLight('#fff4de',snow?'#7f99b5':'#a88b70',2.1));const sun=new T.DirectionalLight('#fff0d0',3);sun.position.set(-14,25,15);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-30,right:30,top:30,bottom:-30,far:90});scene.add(sun);
 const effects=makeEffects(renderer,scene,camera);
 const mats=new Map<string,T.MeshStandardMaterial>(),textures:T.Texture[]=[];function mat(color:string){let m=mats.get(color);if(!m){m=new T.MeshStandardMaterial({color,roughness:.7});mats.set(color,m);}return m;}
 function shape(geo:T.BufferGeometry,color:string,x:number,y:number,z:number,parent:T.Object3D=scene){const m=new T.Mesh(geo,mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,c:string,p:T.Object3D=scene)=>shape(new T.BoxGeometry(w,h,d),c,x,y,z,p);
 const ball=(x:number,y:number,z:number,r:number,c:string,p:T.Object3D=scene)=>shape(new T.SphereGeometry(r,16,10),c,x,y,z,p);
 const cone=(x:number,y:number,z:number,r:number,h:number,c:string,p:T.Object3D=scene)=>shape(new T.ConeGeometry(r,h,8),c,x,y,z,p);
 const cylinder=(x:number,y:number,z:number,r:number,h:number,c:string,p:T.Object3D=scene)=>shape(new T.CylinderGeometry(r,r,h,16),c,x,y,z,p);
 box(0,-1,0,48,2,54,palette?.base||(snow?'#a8c6de':'#b88e61'));box(0,.02,0,47,.15,53,palette?.floor||(modern?(harbor?'#344b83':'#aaa2e8'):snow?'#ecf5ff':'#e8c58b'));
 const details=new T.Group();scene.add(details);const obstacles:{x:number;z:number;r:number}[]=[];
 const animateRegion=advanced?buildRegion(scene,data.place as Region,{box,cylinder,cone,shape}):()=>{};
 if(advanced){/* Region-specific geometry is built above. */}else if(modern){
  // Independent harbor and sky academy landmarks.
  for(let x=-20;x<=20;x+=4)for(let z=-22;z<=22;z+=4){const tile=box(x,.115,z,3.85,.035,3.85,(Math.abs(x)<3)?(harbor?'#6487b2':'#d2b6df'):[harbor?'#40588b':'#9e9cdb',harbor?'#4c6099':'#b0a2de',harbor?'#5c6095':'#a5b0e2'][Math.abs(x+z)%3]);tile.receiveShadow=true;}
  for(const [x,z] of [[-10,13],[10,9],[-9,-9],[11,-16]]){cylinder(x,.17,z,3.2,.08,harbor?'#65588f':'#c6a3dd');for(let j=0;j<8;j++){const a=j*Math.PI/4;const flower=ball(x+Math.cos(a)*2.6,.4,z+Math.sin(a)*2.6,.3,['#f0b85d','#de82aa','#70cabc'][j%3]);flower.scale.y=.7;}}
  for(const x of [-15,15])for(const z of [17,1,-16]){cylinder(x,1.3,z,.1,2.6,'#5d6290');const lamp=ball(x,2.7,z,.24,'#ffe1a0');(lamp.material as T.MeshStandardMaterial).emissive.set('#eeb665');(lamp.material as T.MeshStandardMaterial).emissiveIntensity=2.5;}

  for(const x of [-19,19])for(const z of [-20,-6,10,22]){cylinder(x,1,z,1.5,2,harbor?'#3d6b8f':'#b6c4f0');cone(x,3,z,2,2,harbor?'#df72b4':'#dfb35e');}
  for(let i=0;i<9;i++){const x=-16+i*4;box(x,.14,-1,2.8,.12,4,['#5389b2','#796bb7','#bc82ba'][i%3]);}
  for(const [x,z] of [[-8,12],[9,8],[-9,-10],[10,-14]]){const g=new T.Group();g.position.set(x,0,z);scene.add(g);for(let k=0;k<4;k++){const petal=ball(Math.sin(k*1.57)*.6,1.4,Math.cos(k*1.57)*.6,.6,['#fc789c','#9c8aef','#59cab8'][k%3],g);petal.scale.y=1.7;}cylinder(x,.6,z,.2,1.2,'#496c85');}
  if(harbor){box(0,.16,-24,44,.2,4,'#225b8b');for(const x of [-13,12]){box(x,1,-24,5,1.2,2,'#b97158');box(x,3,-24,.15,4,.15,'#eed19b');const sail=shape(new T.ConeGeometry(1.7,3,3),'#f5cc83',x+1,3,-24);sail.rotation.z=.3;}}else{for(const x of [-12,0,12]){cylinder(x,1,-24,3,2,'#929cd6');const dome=ball(x,4,-24,3,'#c5d8fa');dome.scale.y=1.3;cone(x,8,-24,1.2,2,'#ecc666');}}
 }else if(snow){
  // A courtyard enclosed by ice towers, with a blue skating pond and raised snow banks.
  for(const x of [-18,18])for(const z of [-20,16]){cylinder(x,2.8,z,2,5.6,'#a3d6ee');cone(x,6.5,z,2.7,2.6,'#c9e7fa');for(let a=0;a<4;a++){const angle=a*Math.PI/2;box(x+Math.cos(angle)*1.8,5.8,z+Math.sin(angle)*1.8,.6,1,.6,'#effaff');}}
  box(0,.13,0,19,.12,10,'#92cde3');for(let i=0;i<12;i++){const x=i%2?22:-22,z=-23+Math.floor(i/2)*8;cone(x,2,z,1.8,4,'#74a4b0');cone(x,3,z,1.5,3,'#f6ffff');}
  for(let i=0;i<18;i++)ball((i%2?1:-1)*(20+i%3),.35,-23+i*2.7,1.2,'#f6ffff',details);
 }else{
  // A desert plaza: pyramid skyline, ruined columns, mosaic path and oasis at the edge.
  for(const [x,z,r] of [[-25,-22,6],[25,-22,5],[-25,19,4]]){const p=cone(x,3,z,r,6,'#c79860');p.rotation.y=Math.PI/4;}
  for(const x of [-18,18])for(const z of [-12,6]){cylinder(x,2,z,.8,4,'#b18b62');box(x,4.2,z,2.5,.5,2.5,'#ead3a0');for(let k=0;k<3;k++)box(x,.6+k*1.2,z,1.7,.12,1.7,'#c7a172');}
  for(let z=-21;z<=20;z+=3)box(0,.15,z,3,.12,2,'#f3dfb5');cylinder(19,.15,16,3,.2,'#65bfc0');
  for(let i=0;i<8;i++){const x=i%2?21:-21,z=-16+Math.floor(i/2)*10;cylinder(x,1.1,z,.3,2.2,'#649875',details);ball(x,2.2,z,.3,'#78ac79',details);box(x+.4,1.4,z,.8,.25,.3,'#649875',details);}
 }
 // Distinct landmarks within the play area, not just a different sky color.
 if(advanced){/* Keep new paths clear. */}else if(modern){
  for(const x of [-15,15]){const halo=shape(new T.TorusGeometry(3,.13,8,48),'#6de8df',x,5,-15);(halo.material as T.MeshStandardMaterial).emissive.set('#38acbc');(halo.material as T.MeshStandardMaterial).emissiveIntensity=3;}
 }else if(snow){
  box(0,2.5,-25,13,5,2,'#b9e2ef');box(0,5.3,-25,14,.6,3,'#f2fbff');
  for(const x of [-5,5]){cylinder(x,4,-24,1.3,8,'#96cce2');cone(x,8.8,-24,1.8,2,'#f3fcff');}
  for(const [x,z] of [[5,12],[-3,-5],[15,-10],[-15,14]]){obstacles.push({x,z,r:.65});cylinder(x,.8,z,.3,1.6,'#85a4af');for(let j=0;j<3;j++)cone(x,1.4+j*.8,z,1.4-j*.3,1.8,j%2?'#e8faff':'#7aabba');}
  for(const [x,z] of [[8,14],[-6,-4],[13,-13]]){for(let i=0;i<3;i++){const crystal=shape(new T.OctahedronGeometry(.45),'#8dd5f2',x+i*.4,.7+i*.2,z);crystal.scale.y=2;}}
 }else{
  const pyramid=shape(new T.ConeGeometry(4,7,4),'#ca9b60',-15,3.5,-18);pyramid.rotation.y=Math.PI/4;obstacles.push({x:-15,z:-18,r:3.3});
  for(const [x,z] of [[-4,10],[-5,-11],[10,7]]){obstacles.push({x,z,r:.65});cylinder(x,2.2,z,.55,4.4,'#ba8d60');box(x,4.5,z,1.8,.4,1.8,'#ebd09a');const banner=box(x+.75,3,z,.9,1.7,.08,'#d18a72');banner.rotation.z=.12;ball(x,4.9,z,.25,'#e8bf69');}
  for(let j=0;j<4;j++){const slab=box(12+j*.5,.1,14-j*.8,1.2,.15,.8,j%2?'#ba8b66':'#f1d9a2');slab.rotation.y=j*.25;}
 }
 for(const [x,z] of layout.positions){cylinder(x,.12,z,2.4,.15,snow?'#d2e8f5':'#d9b579');const ring=shape(new T.TorusGeometry(2.2,.06,6,40),snow?'#a8d5e6':'#f5dca5',x,.24,z);ring.rotation.x=Math.PI/2;}
 const sparkle:T.Mesh[]=[];for(let i=0;i<36;i++){const m=ball((i*13%43)-21,2+(i%7),((i*19)%48)-24,snow?.07:.04,snow?'#ffffff':'#ffe7a4',details);m.castShadow=false;sparkle.push(m);}
 function label(text:string,parent:T.Object3D,y:number,width=5){const c=document.createElement('canvas');c.width=768;c.height=160;const ctx=c.getContext('2d')!;ctx.fillStyle='#fffdf1';ctx.beginPath();ctx.roundRect(5,5,758,150,30);ctx.fill();ctx.fillStyle='#234f53';ctx.font='bold 58px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,384,80,720);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;textures.push(texture);const sprite=new T.Sprite(new T.SpriteMaterial({map:texture,depthTest:false,depthWrite:false,toneMapped:false}));sprite.position.y=y;sprite.scale.set(width,width*160/768,1);parent.add(sprite);}
 if(modern){const owl=new T.Group();owl.position.set(3,0,14);scene.add(owl);ball(0,1.2,0,.8,'#e7c59a',owl);for(const x of [-.3,.3]){ball(x,1.4,.65,.3,'#fff4d4',owl);ball(x,1.4,.92,.11,'#263e63',owl);}cone(0,2.3,0,.8,1.1,'#8854bd',owl);label('导师露米 · 靠近后交谈',owl,3.3,6);}
 // Friendly spirits: no violence, damage to the child, death or time pressure.
 const positions=layout.positions;
 const spirits=positions.map(([x,z],i)=>{const root=new T.Group();root.position.set(x,0,z);scene.add(root);const body=ball(0,1.25,0,1.1,'#bda9dd',root);body.scale.set(1,1.15,.85);for(const side of [-1,1]){ball(side*.38,1.5,.8,.19,'#fff9ef',root);ball(side*.38,1.5,.96,.08,'#34475d',root);cone(side*.6,2.4,0,.24,.65,'#e6c6e8',root);}const ring=shape(new T.TorusGeometry(1.6,.05,8,48),'#b0b5f0',0,1.25,0,root);ring.rotation.x=Math.PI/2;
  label(data.encounters[i].clue,root,3.5,6.2);const e=data.encounters[i];if(e.groups&&e.each){const counts=new T.Group();root.add(counts);for(let n=0;n<e.groups*e.each;n++){const removed=n>=e.groups*e.each-(e.remove||0);const gem=shape(new T.OctahedronGeometry(.14),removed?'#9b9eac':'#ffcc64',(n%e.each)*.45-(e.each-1)*.225,4.35+Math.floor(n/e.each)*.35,0,counts);if(removed)gem.scale.setScalar(.6);}}return {root,body,ring};});
 const portal=new T.Group();portal.position.set(layout.gate[0],0,layout.gate[1]);scene.add(portal);const arch=shape(new T.TorusGeometry(1.8,.25,12,40),'#82b8ba',0,2,0,portal);label('回声之门 · 先帮助3位精灵',portal,4.4,7);
 const fox=new T.Group();scene.add(fox);fox.position.set(0,0,19);const body=ball(0,1,0,.65,'#e99b51',fox);body.scale.set(.8,1,1);ball(0,1,.42,.38,'#fff1cd',fox);const head=ball(0,1.85,.25,.62,'#f1a65d',fox);for(const side of [-1,1]){cone(side*.38,2.45,.13,.27,.72,'#e68c43',fox);cone(side*.38,2.45,.24,.14,.43,'#ffdbba',fox);ball(side*.25,1.7,.7,.27,'#fff1cd',fox);ball(side*.25,1.98,.77,.07,'#354b4d',fox);}ball(0,1.72,.98,.085,'#354b4d',fox);const tail=ball(0,.9,-.8,.4,'#df8a44',fox);tail.scale.z=1.8;ball(0,1,-1.35,.28,'#fff1cd',fox);const feet=[[-.35,-.35],[.35,-.35],[-.35,.35],[.35,.35]].map(([x,z])=>ball(x,.3,z,.23,'#705746',fox));const scarf=shape(new T.TorusGeometry(.43,.09,6,20),'#4daba6',0,1.4,.05,fox);scarf.rotation.x=Math.PI/2;
 const gear=new T.Group();fox.add(gear);const gearGroups=equipment.map(e=>{const g=new T.Group();gear.add(g);g.visible=false;if(e.id==='seed-staff'){cylinder(.85,1.2,0,.07,2.4,'#8e6655',g);shape(new T.OctahedronGeometry(.3),e.color,.85,2.5,0,g);}else if(e.id==='crystal-lantern'){box(.85,.85,.1,.45,.6,.45,e.color,g);shape(new T.TorusGeometry(.22,.04,6,16),'#edd0a5',.85,1.4,.1,g);}else{const shield=shape(new T.CylinderGeometry(.55,.55,.16,6),e.color,-.7,1.1,.25,g);shield.rotation.x=Math.PI/2;ball(-.7,1.1,.38,.15,'#fff0c4',g);}return g;});let equipped:EquipmentId|''='';
 const chest=new T.Group();scene.add(chest);chest.position.set(positions[2][0]+2,0,positions[2][1]);chest.visible=false;box(0,.45,0,1.3,.8,.9,'#b98250',chest);const lid=box(0,.95,-.15,1.4,.25,1,'#f0cb77',chest);shape(new T.OctahedronGeometry(.3),'#ffe6a1',0,1.4,0,chest);
 const softShadowMaterial=new T.MeshBasicMaterial({color:'#121e45',transparent:true,opacity:.2,depthWrite:false});const softShadow=new T.Mesh(new T.CircleGeometry(.9,32),softShadowMaterial);softShadow.rotation.x=-Math.PI/2;scene.add(softShadow);
 let state=freshBattle(),selected=0,active=false,paused=false,dead=false,portalOpened=false,near=-1,joy={x:0,z:0},jumpY=0,vy=0,last=0,time=0,frame=0,cooldown=0;
 if(data.trials)state.hint='先找导师露米（地图◆），完成小游戏给符文蓄力。';
 let shot:{mesh:T.Mesh;start:T.Vector3;end:T.Vector3;age:number;target:number;rune:number}|null=null;
 const particles:{mesh:T.Mesh;life:number;v:T.Vector3}[]=[];const keys=new Set<string>();
 function notify(){onState({...state,freed:[...state.freed]});}
 function fire(){if(!active||paused||dead||shot||cooldown>0)return;if(near<0){state={...state,hint:'再靠近一点：离精灵6步以内才能发射。'};notify();return;}if(data.trials&&(!state.charges[near]||selected!==near)){state={...state,hint:'还不能攻击：先找导师完成对应挑战，再选同编号符文。'};notify();return;}const p=ball(fox.position.x,1.7,fox.position.z,.25,equipment.find(e=>e.id===equipped)?.color||'#fff1b0');shot={mesh:p,start:p.position.clone(),end:spirits[near].root.position.clone().add(new T.Vector3(0,1.5,0)),age:0,target:near,rune:selected};cooldown=.7;}
 function jump(){if(active&&!paused&&jumpY===0)vy=6.5;}
 function clear(){keys.clear();joy={x:0,z:0};}
 const down=(e:KeyboardEvent)=>{if(!active||paused||(e.target instanceof HTMLElement&&e.target.closest('input,select,textarea')))return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys.add(e.key.toLowerCase());if(!e.repeat){if(e.code==='Space')jump();if(e.key.toLowerCase()==='f')fire();}};const up=(e:KeyboardEvent)=>keys.delete(e.key.toLowerCase());window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',clear);
 const resize=()=>{renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);camera.aspect=canvas.clientWidth/canvas.clientHeight;camera.updateProjectionMatrix();effects.resize();};const observer=new ResizeObserver(resize);observer.observe(canvas);
 const gl=renderer.getContext(),ext=gl.getExtension('WEBGL_debug_renderer_info'),software=ext&&/swiftshader|llvmpipe|software/i.test(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL));
 function setQuality(q:Quality){quality=q;renderer.setPixelRatio(q==='low'?.65:Math.min(devicePixelRatio,q==='ultra'?2.5:2));renderer.shadowMap.enabled=q!=='low'&&!software;details.visible=q!=='low';renderer.toneMappingExposure=q==='ultra'?.9:1.05;sun.shadow.mapSize.set(q==='ultra'?2048:1024,q==='ultra'?2048:1024);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null;}canvas.dataset.quality=q;resize();}setQuality(quality);
 function tick(now:number){if(dead)return;const dt=Math.min((now-last)/1000||.016,.07);last=now;if(!paused){time+=dt;animateRegion(time);chest.visible=advanced&&state.freed[2];lid.rotation.x=chest.visible?-.6:0;cooldown=Math.max(0,cooldown-dt);
  if(active){let x=joy.x+(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),z=joy.z+(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);const len=Math.hypot(x,z);if(len>.1){x/=Math.max(1,len);z/=Math.max(1,len);const nx=T.MathUtils.clamp(fox.position.x+x*dt*6,-16,16),nz=T.MathUtils.clamp(fox.position.z+z*dt*6,-22,22);if(!obstacles.some(o=>Math.hypot(nx-o.x,fox.position.z-o.z)<o.r+.4))fox.position.x=nx;if(!obstacles.some(o=>Math.hypot(fox.position.x-o.x,nz-o.z)<o.r+.4))fox.position.z=nz;fox.rotation.y=Math.atan2(x,z);feet.forEach((f,i)=>f.position.y=.3+Math.sin(time*15+i*Math.PI/2)*.15);}vy-=dt*16;jumpY=Math.max(0,jumpY+vy*dt);if(jumpY===0)vy=0;fox.position.y=jumpY;
   const target=spirits.map((s,i)=>({i,d:state.freed[i]?Infinity:s.root.position.distanceTo(new T.Vector3(fox.position.x,0,fox.position.z))})).sort((a,b)=>a.d-b.d)[0];const n=target.d<6?target.i:-1;if(n!==near){near=n;onTarget(n);}
   if(allFreed(state)&&!portalOpened&&Math.hypot(fox.position.x-portal.position.x,fox.position.z-portal.position.z)<2){portalOpened=true;paused=true;clear();onPortal();}
  }
  spirits.forEach((s,i)=>{s.body.position.y=1.25+Math.sin(time*2+i)*.13;s.ring.rotation.z=time*.6;s.ring.visible=!state.freed[i];s.body.material=mat(state.freed[i]?'#8ed8bd':'#bda9dd');});tail.rotation.y=Math.sin(time*3)*.18;head.rotation.z=Math.sin(time*2)*.025;
  if(shot){shot.age+=dt;shot.mesh.position.lerpVectors(shot.start,shot.end,Math.min(1,shot.age/.45));if(shot.age>=.45){const old=state;state=hitSpirit(state,data,shot.target,shot.rune);for(let i=0;i<15;i++){const p=ball(shot.end.x,shot.end.y,shot.end.z,.09,state.misses>old.misses?'#e4c5ef':'#ffe59a');particles.push({mesh:p,life:1,v:new T.Vector3(Math.sin(i*2.4)*3,1+i%3,Math.cos(i*2.4)*3)});}scene.remove(shot.mesh);shot.mesh.geometry.dispose();shot=null;notify();}}
  for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;p.mesh.position.addScaledVector(p.v,dt);p.mesh.scale.setScalar(Math.max(0,p.life));if(p.life<=0){p.mesh.removeFromParent();p.mesh.geometry.dispose();particles.splice(i,1);}}
  sparkle.forEach((m,i)=>{m.position.y-=dt*(snow?.6:.1);if(m.position.y<.4)m.position.y=7;m.position.x+=Math.sin(time+i)*dt*.1;});
 }
 softShadow.position.set(fox.position.x,.22,fox.position.z);softShadow.scale.setScalar(1-jumpY*.1);
 arch.material=mat(allFreed(state)?'#ffe29d':'#82b8ba');canvas.dataset.x=fox.position.x.toFixed(2);canvas.dataset.z=fox.position.z.toFixed(2);canvas.dataset.place=data.place;canvas.dataset.equipment=equipped;canvas.dataset.chest=String(chest.visible);canvas.dataset.running=String(active&&!paused);canvas.dataset.freed=state.freed.filter(Boolean).length.toString();
 const distance=camera.aspect<.8?30:23;camera.position.lerp(new T.Vector3(fox.position.x*.7+4,distance,fox.position.z+distance*.75),.07);camera.lookAt(fox.position.x*.7,0,fox.position.z-3);effects.render(quality==='ultra');frame=requestAnimationFrame(tick);}
 frame=requestAnimationFrame(tick);notify();
 return {equip(id){equipped=id;gearGroups.forEach((g,i)=>g.visible=equipment[i].id===id);},rank(level){scarf.material=mat(level>=4?'#e7b447':level>=2?'#b06cea':'#4daba6');},solve(index,value,spoken=false){if(!data.trials||!Number.isInteger(index)||index<0||index>2||state.freed[index])return false;const valid=spoken?!!data.spokenWords&&heardWord(value,data.spokenWords[index]):trialCorrect(data.trials[index],value);if(valid){state={...state,charges:state.charges.map((v,i)=>v||i===index),hint:'挑战完成！对应符文已蓄力，去守卫旁选择它再发射。'};notify();}return valid;},start(){active=true;},pause(p){paused=p;clear();},move(x,z){joy={x,z};},jump,fire,select(i){if(Number.isInteger(i)&&i>=0&&i<3)selected=i;},quality:setQuality,destroy(){dead=true;cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',clear);scene.traverse(o=>{if(o instanceof T.Mesh)o.geometry.dispose();if(o instanceof T.Sprite)o.material.dispose();});mats.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());effects.destroy();softShadowMaterial.dispose();renderer.dispose();}};
}
