import * as T from 'three';
export type Region='market'|'mine'|'castle';
export const regionPalette={market:{sky:'#d4abc1',floor:'#d6b899',base:'#936f69'},mine:{sky:'#182b46',floor:'#344960',base:'#1d3043'},castle:{sky:'#b7d7df',floor:'#d8d2b2',base:'#9da495'}};
type Builders={box:(x:number,y:number,z:number,w:number,h:number,d:number,c:string,p?:T.Object3D)=>T.Mesh;cylinder:(x:number,y:number,z:number,r:number,h:number,c:string,p?:T.Object3D)=>T.Mesh;cone:(x:number,y:number,z:number,r:number,h:number,c:string,p?:T.Object3D)=>T.Mesh;shape:(g:T.BufferGeometry,c:string,x:number,y:number,z:number,p?:T.Object3D)=>T.Mesh};
export function buildRegion(scene:T.Scene,place:Region,{box,cylinder,cone,shape}:Builders){
 const moving:T.Object3D[]=[];
 if(place==='market'){
  // Stalls stay outside the movement bounds. The central plaza remains traversable.
  for(const x of [-21,21])for(const z of [-15,-3,10]){box(x,1,z,4,2,5,'#a76b58');for(const dx of [-2,2])for(const dz of [-2.5,2.5])cylinder(x+dx,2.4,z+dz,.1,4.8,'#855f51');for(let i=0;i<6;i++)box(x-2+i*.8,4.8,z,.8,.18,6,i%2?'#fff0c9':'#e88096');for(let i=0;i<4;i++)shape(new T.IcosahedronGeometry(.4),'#eac154',x-1.2+i*.8,2.5,z);}
  for(let z=-20;z<20;z+=3)box(0,.17,z,5,.12,2.8,'#e5cfa6');
  for(let i=0;i<9;i++){const x=-16+i*4;cylinder(x,6.5,-7,.3,.6,['#f5b75c','#c37bc1','#78bbb2'][i%3]);}box(0,7,-7,34,.05,.05,'#906e7b');
  for(const x of [-8,8]){cylinder(x,.3,16,1.6,.6,'#8b6d7f');cone(x,1.4,16,1.3,2,'#76a27f');}
 }else if(place==='mine'){
  for(const x of [-22,22])for(let z=-24;z<=24;z+=6){const rock=shape(new T.DodecahedronGeometry(3),'#45546b',x,2,z);rock.scale.y=1.7;for(let k=0;k<3;k++){const crystal=shape(new T.OctahedronGeometry(.7),k%2?'#a489de':'#59c9d3',x+(x>0?-2:2),1+k*1.2,z+k*.6);crystal.scale.y=2;}}
  for(const z of [-19,-4,12]){for(const x of [-18,18])box(x,3.6,z,.7,7.2,.7,'#886b65');box(0,7.2,z,36,.8,.8,'#a4806a');}
  for(const x of [18,20])box(x,.2,0,.1,.1,46,'#b7c6c9');for(let z=-22;z<22;z+=2)box(19,.15,z,3,.12,.3,'#79685f');
  const cart=new T.Group();scene.add(cart);cart.position.set(19,0,0);box(0,.8,0,2,1.2,2.6,'#b38b65',cart);for(const x of [-1,1])for(const z of [-.8,.8]){const wheel=cylinder(x,.3,z,.32,.2,'#546576',cart);wheel.rotation.z=Math.PI/2;}shape(new T.OctahedronGeometry(.7),'#85d6de',0,1.8,0,cart);moving.push(cart);
 }else{
  for(const x of [-21,21]){box(x,2.7,0,2,5.4,49,'#a7b9c3');for(let z=-24;z<=24;z+=4)box(x,5.7,z,2.3,1,2,'#dce2d7');for(const z of [-22,18]){cylinder(x,4,z,3,8,'#b5c8cf');cone(x,9.6,z,3.6,4,'#7188b5');}}
  box(0,3,-26,40,6,2,'#b2c4ca');for(const x of [-6,6]){cylinder(x,5,-25,2,10,'#d7dfdb');cone(x,11,-25,2.5,3,'#a77bb1');box(x,7,-22.9,1.6,3,.1,'#e3a960');}box(0,2.5,-24.8,5,5,.3,'#726887');
  for(let z=-22;z<=20;z+=3)box(0,.16,z,5,.15,2.8,'#d29ba4');for(const x of [-9,9])for(const z of [5,15]){cylinder(x,.2,z,2.6,.3,'#748b77');for(let k=0;k<6;k++)shape(new T.IcosahedronGeometry(.4),'#e7afc9',x+Math.sin(k)*1.8,.6,z+Math.cos(k)*1.8);}
 }
 return (time:number)=>{moving.forEach(cart=>cart.position.z=Math.sin(time*.22)*17);};
}
