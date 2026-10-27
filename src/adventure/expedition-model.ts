import {advancedTitles} from './story-model';
import {trialsFor,type Trial} from './campaign';
import type {Subject} from './subjects';
export type Encounter={name:string;clue:string;answer:number;hint:string;groups?:number;each?:number;remove?:number};
export type Expedition={title:string;place:'desert'|'snow'|'harbor'|'sky'|'market'|'mine'|'castle'|'railway'|'orchard'|'reef';trials?:Trial[];spokenWords?:string[];runes:string[];encounters:Encounter[];oral:string;oralHint:string};
export function expeditionFor(subject:Subject,level:number):Expedition{
 if(level>=5){const trials=trialsFor(subject,level);const words=level===5?['sun','moon','star']:['red','blue','green'];return {title:level>=10?['彩虹分流车站','风铃果园','珊瑚邮递海湾'][level-10]:level>=7?advancedTitles[level-7]:level===5?'霓光港口工坊':'云端星象学园',place:level>=10?(['railway','orchard','reef'] as const)[level-10]:level>=7?(['market','mine','castle'] as const)[level-7]:level===5?'harbor':'sky',trials,spokenWords:subject==='english'&&level<7?words:undefined,runes:subject==='english'&&level<7?words:['星光','清风','雷鸣'],encounters:trials.map((t,i)=>({name:(level>=7?['荆棘小怪','水晶小怪','宝箱守卫']:['迷雾守卫','泡泡守卫','星环守卫'])[i],clue:`${i+1}号守卫 · 先找导师完成挑战`,answer:i,hint:'需要先完成对应的导师小游戏才能发射。'})),oral:subject==='english'?'I am ready for a new adventure.':'我先观察，再尝试，遇到困难也能找到办法。',oralHint:'说说你完成了什么挑战，以及怎么想出来的。'};}
 const snow=level===4;
 const common={title:snow?'冰雪回声城堡':'星砂守护遗迹',place:snow?'snow' as const:'desert' as const};
 if(subject==='math')return {...common,runes:snow?['9','7','4']:['6','8','10'],encounters:snow?[3,5,8].map((remove,i)=>({name:['雪球精灵','冰晶精灵','雪松精灵'][i],clue:`12颗冰晶，融化${remove}颗`,answer:i,hint:`从12里面去掉${remove}，数数还亮着几颗。`,groups:3,each:4,remove})):[3,4,5].map((groups,i)=>({name:['沙丘精灵','石柱精灵','星砂精灵'][i],clue:`${groups}组，每组2颗`,answer:i,hint:`每组2颗，连续加${groups}次，或用${groups}乘2。`,groups,each:2})),oral:snow?'十二减三等于九。我从十二颗里拿走三颗，还剩九颗。':'三组，每组两颗，一共有六颗。因为二加二加二等于六。',oralHint:'用自己的话解释数量为什么变化；也可以照着说一遍。'};
 if(subject==='chinese')return {...common,runes:snow?['本','只','朵']:['小','短','低'],encounters:(snow?['一本书','一只小鸟','一朵花']:['大与小','长与短','高与低']).map((pair,i)=>({name:['圆圆精灵','绵绵精灵','亮亮精灵'][i],clue:snow?['一 □ 书','一 □ 小鸟','一 □ 花'][i]:['大 ↔ ？','长 ↔ ？','高 ↔ ？'][i],answer:i,hint:snow?`试着说“${pair}”，注意物品前面的量词。`:`这是一对意思相反的词：${pair}。`})),oral:snow?'我拿着一本书，看见一只小鸟和一朵花。':'大树高，小草低。长长的桥，短短的路。',oralHint:snow?'读清楚“本、只、朵”，再用一个量词造句。':'读一读，再说出另一对意思相反的词。'};
 return {...common,runes:snow?['snow','ice','cold']:['sun','moon','star'],encounters:(snow?['雪','冰','寒冷']:['太阳','月亮','星星']).map((word,i)=>({name:['Cloud Buddy','Moon Buddy','Star Buddy'][i],clue:`帮我找到“${word}”`,answer:i,hint:`读一读：${(snow?['snow','ice','cold']:['sun','moon','star'])[i]} 表示${word}。`})),oral:snow?'I can see snow. It is cold.':'I can see the sun, the moon and a star.',oralHint:'先慢慢跟读，再用 I can see… 说一句自己的话。'};
}
export type BattleState={freed:boolean[];charges:boolean[];shots:number;misses:number;hint:string};
export const freshBattle=():BattleState=>({freed:[false,false,false],charges:[false,false,false],shots:0,misses:0,hint:'走近精灵，选择知识符文，按 F 或点“发射”。'});
export function hitSpirit(s:BattleState,data:Expedition,target:number,rune:number):BattleState{
 if(!Number.isInteger(target)||!Number.isInteger(rune)||target<0||target>=3||rune<0||rune>=3||s.freed[target])return s;
 if(data.trials&&!s.charges[target])return {...s,hint:'符文还没有能量。请先找导师完成小游戏或匹配读词。'};
 if(data.encounters[target].answer!==rune)return {...s,shots:s.shots+1,misses:s.misses+1,hint:'护盾轻轻弹开了。'+data.encounters[target].hint};
 return {...s,charges:s.charges.map((v,i)=>i===target?false:v),shots:s.shots+1,freed:s.freed.map((v,i)=>v||i===target),hint:'答对了！魔法消散，精灵恢复了。继续帮助其他精灵吧。'};
}
export const allFreed=(s:BattleState)=>s.freed.length===3&&s.freed.every(Boolean);

export function expeditionLayout(place:Expedition['place']){return {positions:place==='snow'?[[-12,-6],[12,2],[0,-16]]:place==='market'?[[-12,7],[12,-3],[0,-17]]:place==='mine'?[[-13,-3],[12,7],[0,-18]]:place==='castle'?[[-12,-9],[12,-9],[0,-18]]:[[-12,3],[11,-7],[-8,-16]],gate:place==='snow'?[12,-18]:['market','mine','castle'].includes(place)?[0,-22]:[9,-19]};}
