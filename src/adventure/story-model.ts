import type {Subject} from './subjects';
export type StoryStep={a:number|'previous';b:number;op:'+'|'-'|'×'|'÷';question:string;unit:string;hint:string};
export type Story={text:string;steps:[StoryStep,StoryStep]};
export function calculate(a:number,op:StoryStep['op'],b:number){switch(op){case '+':return a+b;case '-':return a-b;case '×':return a*b;case '÷':if(!b||a%b)throw new Error('Story division must be exact');return a/b;}}
export function storyAnswers(story:Story){let previous=0;return story.steps.map(s=>previous=calculate(s.a==='previous'?previous:s.a,s.op,s.b));}
const step=(a:StoryStep['a'],op:StoryStep['op'],b:number,question:string,unit:string,hint:string):StoryStep=>({a,op,b,question,unit,hint});
export function storyFor(level:number,i:number):Story{
 if(level===7){const coins=30+i*10,price=6+i,packs=3+i;return {text:`狐狸带了${coins}枚金币，在集市买${packs}袋种子，每袋${price}枚金币。还剩多少枚金币？`,steps:[step(packs,'×',price,'买种子一共花多少枚金币？','枚','先求几袋的总价：每袋价格要相加几次？'),step(coins,'-',packs*price,'付款后，还剩多少枚金币？','枚','剩下的钱＝带来的钱－刚才算出的总价。')]};}
 if(level===8){const first=12+i*6,second=8+i*2,per=4;return {text:`矿洞里找到${first}颗蓝晶和${second}颗紫晶，所有水晶每${per}颗装一辆矿车，需要几辆矿车？`,steps:[step(first,'+',second,'两种水晶合起来有多少颗？','颗','先合并两种水晶，再按每车的数量分组。'),step('previous','÷',per,'一共需要几辆矿车？','辆','总颗数除以每辆装的颗数，得到车辆数。')]};}
 const total=36+i*12,day1=9+i*3,day2=7+i*3;return {text:`城堡有${total}份粮食，第一天用了${day1}份，第二天用了${day2}份，还剩多少份？`,steps:[step(day1,'+',day2,'两天一共用了多少份粮食？','份','先把两天用掉的合起来。'),step(total,'-',day1+day2,'仓库里还剩多少份粮食？','份','总量减去两天合计用量；综合算式需要括号。')]};
}
export const advancedTitles=['彩灯种子集市','萤石矿车洞窟','晨曦守护城堡'];
export function advancedLanguage(subject:Subject,level:number,i:number){
 const chinese=[
  [['早晨','小狐狸','在集市','买种子'],['中午','小兔','在摊位前','挑水果'],['傍晚','小熊','在商店里','数零钱']],
  [['早晨','小狐狸','在矿洞','找水晶'],['中午','小兔','在轨道旁','推矿车'],['傍晚','小熊','在灯光下','看地图']],
  [['傍晚','小鸟','在城堡','送粮食'],['清晨','小狐狸','在城门前','迎接朋友'],['午后','小兔','在花园里','浇花']],
 ];
 const english=[
  [['I','buy','seeds'],['We','carry','apples'],['I','count','coins']],
  [['We','carry','crystals'],['I','push','the','cart'],['We','find','blue','crystals']],
  [['We','protect','the','castle'],['I','open','the','gate'],['We','share','the','food']],
 ];
 return subject==='chinese'?{prompt:'按“时间 → 谁 → 在哪里 → 做什么”整理冒险日志。',tokens:chinese[level-7][i]}:{prompt:'按“主语 → 动作 → 物品”的顺序拼出任务句。',tokens:english[level-7][i]};
}

export function storyExplanation(story:Story){
 const answers=storyAnswers(story);
 const lines=story.steps.map((s,i)=>`${s.a==='previous'?answers[i-1]:s.a} ${s.op} ${s.b} ＝ ${answers[i]}（${s.unit}）`);
 const [first,second]=story.steps;
 const group=`(${first.a} ${first.op} ${first.b})`;
 const expression=second.a==='previous'?`${group} ${second.op} ${second.b}`:`${second.a} ${second.op} ${group}`;
 return {lines,combined:`${expression} ＝ ${answers[1]}（${second.unit}）`};
}
