import * as T from 'three';
import type {Arena} from './arena-theme';
type Shape=(g:T.BufferGeometry,color:string,x:number,y:number,z:number,parent?:T.Object3D)=>T.Mesh;
export function buildArenaScenery(scene:T.Scene,theme:Arena,shape:Shape){const root=new T.Group();root.name=`arena-${theme}`;scene.add(root);const add=(g:T.BufferGeometry,c:string,x:number,y:number,z:number)=>shape(g,c,x,y,z,root);const glows:T.Mesh[]=[];let snow:T.Points|undefined;
 if(theme==='forest')for(let i=0;i<22;i++){const a=i*Math.PI/11,x=Math.cos(a)*20,z=Math.sin(a)*20;add(new T.CylinderGeometry(.5,.8,5,8),'#83685b',x,2,z);add(new T.SphereGeometry(3,16,12),i%2?'#759c92':'#7f8fa9',x,6,z);}
 if(theme==='mine'){
  for(let i=0;i<18;i++){const a=i*Math.PI/9,x=Math.cos(a)*20,z=Math.sin(a)*20;add(new T.DodecahedronGeometry(2.2),'#373655',x,1,z);for(let n=0;n<3;n++){const crystal=add(new T.ConeGeometry(.6+n*.15,2+n,6),['#7ce5e5','#b98afa','#f09ac8'][n],x+(n-1)*.7,2+n*.4,z);crystal.rotation.z=(n-1)*.3;(crystal.material as T.MeshStandardMaterial).emissive.set(['#145d70','#4c236b','#6e335e'][n]);glows.push(crystal);}}
  for(const x of [-.8,.8]){const rail=add(new T.BoxGeometry(.12,.12,29),'#c8cae0',x,0,0);rail.name='mine-rail';}for(let i=0;i<15;i++)add(new T.BoxGeometry(2.6,.1,.28),'#a8836c',0,-.03,-14+i*2);
  const cart=add(new T.BoxGeometry(2.4,1.2,1.8),'#c39363',17,1,8);cart.name='mine-cart';for(const x of [16,18])for(const z of [7.3,8.7]){const wheel=add(new T.CylinderGeometry(.4,.4,.2,12),'#59627c',x,.35,z);wheel.rotation.z=Math.PI/2;}add(new T.OctahedronGeometry(.6),'#82f4e4',17,2,8);
  const stream=add(new T.TorusGeometry(22,.4,8,64),'#49c9d0',0,-1,0);stream.rotation.x=Math.PI/2;(stream.material as T.MeshStandardMaterial).emissive.set('#226a8a');glows.push(stream);
 }else if(theme==='snow'){
  for(let z=-12;z<=14;z+=2)for(const x of [-.55,.55])add(new T.CylinderGeometry(.25,.25,.04,10),'#78a7bf',x,-.04,z+(x>0?.5:0));for(const x of [-8,8])for(const z of [-9,1,11]){const patch=add(new T.CylinderGeometry(2,2,.05,6),'#86c5d6',x,-.04,z);patch.rotation.y=z*.3;}

  for(let i=0;i<18;i++){const a=i*Math.PI/9,x=Math.cos(a)*22,z=Math.sin(a)*22;add(new T.ConeGeometry(3,7,7),'#7bacc2',x,2,z);add(new T.ConeGeometry(2.2,4.8,7),'#f2fcff',x,4,z);}
  const pond=add(new T.CylinderGeometry(3.5,3.5,.12,36),'#73c7df',18,-.02,2);pond.name='ice-pond';(pond.material as T.MeshStandardMaterial).metalness=.4;(pond.material as T.MeshStandardMaterial).roughness=.2;
  for(let i=0;i<9;i++){const ice=add(new T.ConeGeometry(.6,2+(i%3),6),'#a0e9ed',-18,1,-13+i*3);ice.rotation.z=.2;}
  const positions=new Float32Array(64*3);for(let i=0;i<64;i++){positions[i*3]=Math.sin(i*21.7)*19;positions[i*3+1]=(i%13)+1;positions[i*3+2]=Math.cos(i*13.3)*19;}const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(positions,3));snow=new T.Points(geometry,new T.PointsMaterial({color:'#ffffff',size:.13,transparent:true,opacity:.8}));snow.name='drifting-snow';root.add(snow);
 }
 return {update(time:number,dt:number){glows.forEach((m,i)=>(m.material as T.MeshStandardMaterial).emissiveIntensity=.85+Math.sin(time*.8+i)*.2);if(snow){const p=snow.geometry.getAttribute('position') as T.BufferAttribute;for(let i=0;i<p.count;i++){p.setY(i,p.getY(i)-dt*.65);if(p.getY(i)<.2)p.setY(i,13);p.setX(i,Math.sin(i*21.7)*19+Math.sin(time*.5+i)*.25);}p.needsUpdate=true;}},dispose(){if(snow){snow.geometry.dispose();(snow.material as T.PointsMaterial).dispose();}}};
}
