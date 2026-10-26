import type {Hero} from './campaign';
export const equipment=[
 {id:'seed-staff',name:'萌芽法杖',level:7,color:'#f2bd58',description:'集市宝箱守卫掉落，法杖和光弹变成金色。'},
 {id:'crystal-lantern',name:'萤石提灯',level:8,color:'#60d9db',description:'矿洞宝箱守卫掉落，提灯和光弹变成青色。'},
 {id:'dawn-shield',name:'晨曦护盾',level:9,color:'#d89de8',description:'城堡宝箱守卫掉落，护盾和光弹变成紫色。'},
] as const;
export type EquipmentId=typeof equipment[number]['id'];
export function unlockedEquipment(hero:Hero){return equipment.filter(e=>hero.awards.some(id=>new RegExp(`^(math|chinese|english):${e.level}:spirit2$`).test(id)));}
export function validEquipment(hero:Hero,id:unknown):EquipmentId|''{return unlockedEquipment(hero).find(e=>e.id===id)?.id||'';}
