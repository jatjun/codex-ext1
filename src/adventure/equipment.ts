import type {Hero} from './campaign';
export const equipment=[
 {id:'leaf-wand',name:'叶晶法杖',level:14,color:'#9edb87',description:'补给战中拾取小怪装备掉落后解锁。'},
 {id:'forest-crown',name:'树王守护冠',level:13,color:'#8fd6a0',description:'击败迷雾树王首次获得，守护冠与光弹变成青绿色。'},
 {id:'seed-staff',name:'萌芽法杖',level:7,color:'#f2bd58',description:'集市宝箱守卫掉落，法杖和光弹变成金色。'},
 {id:'crystal-lantern',name:'萤石提灯',level:8,color:'#60d9db',description:'矿洞宝箱守卫掉落，提灯和光弹变成青色。'},
 {id:'dawn-shield',name:'晨曦护盾',level:9,color:'#d89de8',description:'城堡宝箱守卫掉落，护盾和光弹变成紫色。'},
] as const;
export type EquipmentId=typeof equipment[number]['id'];
export function unlockedEquipment(hero:Hero){return equipment.filter(e=>hero.awards.some(id=>e.id==='leaf-wand'?id==='math:boss:gear':e.id==='forest-crown'?id==='math:boss:clear':new RegExp(`^(math|chinese|english):${e.level}:spirit2$`).test(id)));}
export function validEquipment(hero:Hero,id:unknown):EquipmentId|''{return unlockedEquipment(hero).find(e=>e.id===id)?.id||'';}
