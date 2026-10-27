import {routePuzzle,routeCorrect,type RoutePuzzle} from './RouteGame';
import {storyFor,storyAnswers,advancedLanguage,type Story} from './story-model';
import type {Subject} from './subjects';
export type Trial={mode:'count'|'order'|'pairs'|'story'|'route';route?:RoutePuzzle;story?:Story;prompt:string;tokens:string[];expected:string;target?:number;pairs?:[string,string][]};
export function trialsFor(subject:Subject,level:number):Trial[]{
 if(level>=10)return [0,1,2].map(i=>({mode:'route' as const,prompt:'规划分流路线，把货物运到目的地。',tokens:[],route:routePuzzle(subject,level,i),expected:'[0,1,0]'}));
 if(level>=7)return [0,1,2].map(i=>{if(subject==='math'){const story=storyFor(level,i);return {mode:'story' as const,prompt:'解开两步任务，为守卫符文充能。',tokens:[],story,expected:JSON.stringify(storyAnswers(story))};}const content=advancedLanguage(subject,level,i);return {mode:'order' as const,...content,expected:content.tokens.map((_,n)=>n).join(',')};});
 if(subject==='math')return [0,1,2].map(i=>level===5?{mode:'count',prompt:`给炼金锅放入 ${i+2} 组星果，每组 2 个。`,tokens:[],target:(i+2)*2,expected:String((i+2)*2)}:{mode:'pairs',prompt:'翻开符石，找出算式和结果的两对伙伴。',tokens:[],pairs:[[`${i+2}＋2`,String(i+4)],[`${i+3}×2`,String((i+3)*2)]],expected:'0,1'});
 if(subject==='chinese')return [0,1,2].map(i=>level===5?{mode:'order',prompt:'按“谁 → 在 → 哪里 → 做什么”的顺序排句子。',tokens:[['小狐狸','在','森林里','看书'],['小鸟','在','天空中','飞翔'],['小兔','在','花园里','种花']][i],expected:'0,1,2,3'}:{mode:'pairs',prompt:'翻牌寻找意思相反的词。',tokens:[],pairs:[[['大','小'],['高','低']],[['长','短'],['多','少']],[['上','下'],['前','后']]][i] as [string,string][],expected:'0,1'});
 const words=level===5?['sun','moon','star']:['red','blue','green'];return words.map(word=>({mode:'order',prompt:`拼出 ${word}，或选择语音识别读出这个词。`,tokens:word.split(''),expected:word.split('').map((_,i)=>i).join(',')}));
}
export function trialCorrect(trial:Trial,value:string){if(trial.mode==='route'){try{return routeCorrect(trial.route!,JSON.parse(value));}catch{return false;}}if(trial.mode==='story'){try{const answers=JSON.parse(value);return Array.isArray(answers)&&answers.length===2&&answers.every((n,i)=>Number.isInteger(n)&&n===storyAnswers(trial.story!)[i]);}catch{return false;}}if(trial.mode==='order'){const ids=value.split(',').map(Number);return ids.length===trial.tokens.length&&new Set(ids).size===ids.length&&ids.every(i=>Number.isInteger(i)&&i>=0&&i<trial.tokens.length)&&ids.map(i=>trial.tokens[i]).join('')===trial.tokens.join('');}return value===trial.expected;}
export type Hero={version:1;awards:string[]};
const key='fox-hero-v1';
export function readHero():Hero{try{const d=JSON.parse(localStorage.getItem(key)||'null');return {version:1,awards:Array.isArray(d?.awards)?[...new Set(d.awards.filter((v:unknown)=>typeof v==='string'&&/^(math|chinese|english):(?:[0-9]|1[0-2]):(trial[0-2]|spirit[0-2]|clear)$/.test(v)))].slice(0,273) as string[]:[]};}catch{return {version:1,awards:[]};}}
export function addAward(h:Hero,id:string):Hero{return h.awards.includes(id)?h:{version:1,awards:[...h.awards,id]};}
export function heroStats(h:Hero){const xp=h.awards.reduce((n,id)=>n+(id.endsWith(':clear')?60:20),0);return {xp,level:Math.floor(xp/100)+1,title:xp>=300?'星光守护者':xp>=100?'符文学徒':'森林旅人',next:100-xp%100};}
export function saveHero(h:Hero){try{localStorage.setItem(key,JSON.stringify(h));return true;}catch{return false;}}
export function heardWord(transcript:string,word:string){return transcript.toLowerCase().trim().replace(/^[.!?,。！？]+|[.!?,。！？]+$/g,'').trim()===word.toLowerCase();}
