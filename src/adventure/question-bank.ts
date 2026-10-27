import {combatQuestion,type CombatQuestion,type Difficulty} from './combat-questions';
export type QuestionSource='auto'|'mixed'|'custom';
export type BankQuestion=CombatQuestion&{id:string;enabled:boolean;difficulty:Difficulty};
const key='fox-custom-questions-v1';
export function validateBank(input:unknown):BankQuestion[]{
 const raw=input as {version?:number;questions?:unknown[]};
 if(!raw||raw.version!==1||!Array.isArray(raw.questions)||raw.questions.length>100)throw new Error('需要version为1的题库，最多100题。');
 const ids=new Set<string>();return raw.questions.map((value,i)=>{const q=value as BankQuestion;if(!q||typeof q.id!=='string'||!/^q[\w-]{1,60}$/.test(q.id)||ids.has(q.id))throw new Error(`第${i+1}题ID无效或重复。`);ids.add(q.id);
 if(typeof q.prompt!=='string'||!q.prompt.trim()||q.prompt.length>300||typeof q.answer!=='string'||!q.answer.trim()||q.answer.length>80||typeof q.hint!=='string'||q.hint.length>200||typeof q.enabled!=='boolean'||!['easy','normal','hard'].includes(q.difficulty))throw new Error(`第${i+1}题内容不完整或长度超限。`);
 const arithmetic=q.prompt.trim().match(/^(\d+)\s*([+＋\-－×÷])\s*(\d+)\s*[=＝]\s*[?？]$/);if(arithmetic){const op=arithmetic[2].replace('＋','+').replace('－','-');if(arithmeticQuestion(Number(arithmetic[1]),op,Number(arithmetic[3])).answer!==q.answer.trim())throw new Error(`第${i+1}题算式答案不正确。`);}
 const options=q.options;if(options!==undefined&&(!Array.isArray(options)||options.length<2||options.length>4||options.some(o=>typeof o!=='string'||!o.trim()||o.length>80)||new Set(options).size!==options.length||!options.includes(q.answer)))throw new Error(`第${i+1}题选项需2～4项，互不重复并包含正确答案。`);
 if(!options&&!/^\d{1,3}$/.test(q.answer))throw new Error('数字输入题答案必须为0～999；其他答案请使用选择题。');
 return {id:q.id,enabled:q.enabled,difficulty:q.difficulty,prompt:q.prompt.trim(),answer:q.answer.trim(),hint:q.hint,kind:'家长自定义',...(options?{options:[...options]}:{})};});
}
export function readBank(){try{return validateBank(JSON.parse(localStorage.getItem(key)||'{"version":1,"questions":[]}'));}catch{return [];}}
export function saveBank(questions:BankQuestion[]){const safe=validateBank({version:1,questions});localStorage.setItem(key,JSON.stringify({version:1,questions:safe}));return safe;}
export function bankJSON(questions:BankQuestion[]){return JSON.stringify({version:1,questions:validateBank({version:1,questions})},null,2);}
export function arithmeticQuestion(a:number,op:string,b:number){if(!Number.isInteger(a)||!Number.isInteger(b)||a<0||b<0||a>999||b>999)throw new Error('请填写0～999的整数。');const answer=op==='+'?a+b:op==='-'?a-b:op==='×'?a*b:op==='÷'&&b!==0?a/b:NaN;if(!Number.isInteger(answer)||answer<0||answer>999)throw new Error('结果必须为0～999整数，除法须整除且除数非0。');return {prompt:`${a} ${op} ${b} ＝ ？`,answer:String(answer)};}
export class QuestionDeck{
 private recent:string[]=[];private index=0;
 constructor(private random= Math.random){}
 next(difficulty:Difficulty,bank:BankQuestion[]=[],source:QuestionSource='auto'):CombatQuestion{
  const custom=bank.filter(q=>q.enabled&&q.difficulty===difficulty);const useCustom=custom.length>0&&(source==='custom'||source==='mixed'&&this.index%2===0);let q:CombatQuestion;
  if(useCustom){const fresh=custom.filter(c=>!this.recent.includes(c.prompt));const pool=fresh.length?fresh:custom.filter(c=>c.prompt!==this.recent.at(-1));q=(pool.length?pool:custom)[Math.floor(this.random()*(pool.length||custom.length))];}
  else{let attempt=0;do{const kind=(this.index+Math.floor(this.random()*6)+attempt)%6;q=combatQuestion(difficulty,kind,this.random);attempt++;}while(this.recent.includes(q.prompt)&&attempt<24);}
  if(this.recent.includes(q.prompt)&&!useCustom){let seed=this.index+37;for(let retry=0;retry<100&&this.recent.includes(q.prompt);retry++){q=combatQuestion(difficulty,(this.index+retry)%6,()=>{seed=seed*16807%2147483647;return seed/2147483647;});}}
  this.index++;this.recent=[...this.recent.slice(-7),q.prompt];
  if(q.options){const options=[...q.options];for(let i=options.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[options[i],options[j]]=[options[j],options[i]];}return {...q,options};}return {...q};
 }
}
