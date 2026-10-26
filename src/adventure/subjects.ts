import {expeditionFor} from './expedition-model';
export type Subject='math'|'chinese'|'english';
export const subjects={math:{title:'晶桥溪谷',groups:['第一组','第二组','第三组'],words:[] as string[]},chinese:{title:'词语森林',groups:['动物之家','水果之家','自然之家'],words:['小猫','小狗','狐狸','小鸟','苹果','香蕉','梨子','葡萄','大树','太阳','月亮','河水']},english:{title:'Word Forest',groups:['Animals 动物','Fruit 水果','Nature 自然'],words:['cat','dog','fox','bird','apple','banana','pear','grape','tree','sun','moon','water']}};
export type Level={title:string;groups:string[];words:string[];gateWords:string[];gatePrompt:string};
const extra:Record<Subject,Level[]>={
 chinese:[
 {title:'量词花园',groups:['用“一只”','用“一本”','用“一朵”'],words:['小兔','小鸭','蝴蝶','蜜蜂','故事书','字典','图画书','笔记本','红花','白云','黄花','桃花'],gateWords:['一只','小狐狸','捧着','一朵','花'],gatePrompt:'按顺序组成一句话：一只小狐狸捧着一朵花。'},
 {title:'动作故事谷',groups:['用脚做','用手做','用嘴做'],words:['走路','跑步','跳高','踢球','拍手','写字','画画','招手','说话','唱歌','朗读','吹气'],gateWords:['小狐狸','先','洗手','再','吃饭'],gatePrompt:'把故事排好：小狐狸先洗手再吃饭。'}],
 english:[
 {title:'Rainbow Garden',groups:['Red 红色','Yellow 黄色','Green 绿色'],words:['red apple','red rose','red hat','red car','yellow sun','yellow banana','yellow duck','yellow star','green leaf','green grass','green frog','green pear'],gateWords:['I','can','see','a','rainbow'],gatePrompt:'组成一句话：I can see a rainbow.（我能看见一道彩虹。）'},
 {title:'Action Valley',groups:['Animals 动物','Actions 动作','Food 食物'],words:['rabbit','fish','bear','lion','run','jump','swim','walk','bread','rice','milk','egg'],gateWords:['The','little','fox','can','jump'],gatePrompt:'组成一句话：The little fox can jump.（小狐狸会跳。）'}],
 math:[
 {title:'算式花园',groups:['结果是2','结果是3','结果是4'],words:['1＋1','4－2','6÷3','2×1','1＋2','5－2','6÷2','3×1','2＋2','6－2','8÷2','4×1'],gateWords:['1','2','3','4','5'],gatePrompt:'把数量从小到大排列：1 → 2 → 3 → 4 → 5。'},
 {title:'乘法星谷',groups:['结果是6','结果是8','结果是10'],words:['2×3','3×2','12÷2','4＋2','2×4','4×2','16÷2','5＋3','2×5','5×2','20÷2','6＋4'],gateWords:['2','4','6','8','10'],gatePrompt:'每次增加2，按顺序送入：2 → 4 → 6 → 8 → 10。'}]
};
export function levelFor(subject:Subject,level=0):Level{if(level>=3)return {...expeditionFor(subject,level),groups:[],words:[],gateWords:[],gatePrompt:'帮助三位精灵，前往回声之门。'};return extra[subject][level-1]||{...subjects[subject],gateWords:subject==='chinese'?['小狐狸','和','小鸟','一起','看月亮']:subject==='english'?['I','can','see','a','fox']:[],gatePrompt:subject==='chinese'?'组成一句话：小狐狸和小鸟一起看月亮。':subject==='english'?'组成一句话：I can see a fox.（我能看见一只狐狸。）':'把3颗紫色和2颗金色水晶带给花门。'};}
export function wordGroup(subject:Subject,word:string,level=0){return Math.floor(levelFor(subject,level).words.indexOf(word)/4);}
export const levelCount=10;
