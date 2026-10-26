import type {Subject} from './subjects';
export type Encounter={name:string;clue:string;answer:number;hint:string;groups?:number;each?:number;remove?:number};
export type Expedition={title:string;place:'desert'|'snow';runes:string[];encounters:Encounter[];oral:string;oralHint:string};
export function expeditionFor(subject:Subject,level:number):Expedition{
 const snow=level===4;
 const common={title:snow?'冰雪回声城堡':'星砂守护遗迹',place:snow?'snow' as const:'desert' as const};
 if(subject==='math')return {...common,runes:snow?['9','7','4']:['6','8','10'],encounters:snow?[3,5,8].map((remove,i)=>({name:['雪球精灵','冰晶精灵','雪松精灵'][i],clue:`12颗冰晶，融化${remove}颗`,answer:i,hint:`从12里面去掉${remove}，数数还亮着几颗。`,groups:3,each:4,remove})):[3,4,5].map((groups,i)=>({name:['沙丘精灵','石柱精灵','星砂精灵'][i],clue:`${groups}组，每组2颗`,answer:i,hint:`每组2颗，连续加${groups}次，或用${groups}乘2。`,groups,each:2})),oral:snow?'十二减三等于九。我从十二颗里拿走三颗，还剩九颗。':'三组，每组两颗，一共有六颗。因为二加二加二等于六。',oralHint:'用自己的话解释数量为什么变化；也可以照着说一遍。'};
 if(subject==='chinese')return {...common,runes:snow?['本','只','朵']:['小','短','低'],encounters:(snow?['一本书','一只小鸟','一朵花']:['大与小','长与短','高与低']).map((pair,i)=>({name:['圆圆精灵','绵绵精灵','亮亮精灵'][i],clue:snow?['一 □ 书','一 □ 小鸟','一 □ 花'][i]:['大 ↔ ？','长 ↔ ？','高 ↔ ？'][i],answer:i,hint:snow?`试着说“${pair}”，注意物品前面的量词。`:`这是一对意思相反的词：${pair}。`})),oral:snow?'我拿着一本书，看见一只小鸟和一朵花。':'大树高，小草低。长长的桥，短短的路。',oralHint:snow?'读清楚“本、只、朵”，再用一个量词造句。':'读一读，再说出另一对意思相反的词。'};
 return {...common,runes:snow?['snow','ice','cold']:['sun','moon','star'],encounters:(snow?['雪','冰','寒冷']:['太阳','月亮','星星']).map((word,i)=>({name:['Cloud Buddy','Moon Buddy','Star Buddy'][i],clue:`帮我找到“${word}”`,answer:i,hint:`读一读：${(snow?['snow','ice','cold']:['sun','moon','star'])[i]} 表示${word}。`})),oral:snow?'I can see snow. It is cold.':'I can see the sun, the moon and a star.',oralHint:'先慢慢跟读，再用 I can see… 说一句自己的话。'};
}
export type BattleState={freed:boolean[];shots:number;misses:number;hint:string};
export const freshBattle=():BattleState=>({freed:[false,false,false],shots:0,misses:0,hint:'走近精灵，选择知识符文，按 F 或点“发射”。'});
export function hitSpirit(s:BattleState,data:Expedition,target:number,rune:number):BattleState{
 if(!Number.isInteger(target)||!Number.isInteger(rune)||target<0||target>=3||rune<0||rune>=3||s.freed[target])return s;
 if(data.encounters[target].answer!==rune)return {...s,shots:s.shots+1,misses:s.misses+1,hint:'护盾轻轻弹开了。'+data.encounters[target].hint};
 return {...s,shots:s.shots+1,freed:s.freed.map((v,i)=>v||i===target),hint:'答对了！魔法消散，精灵恢复了。继续帮助其他精灵吧。'};
}
export const allFreed=(s:BattleState)=>s.freed.length===3&&s.freed.every(Boolean);
