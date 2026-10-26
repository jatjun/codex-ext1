export type StoryAttempt={id:string;step:number;answer:number;correct:boolean;hints:number;time:string};
const key='fox-story-attempts-v1';
function valid(row:unknown):row is StoryAttempt{
 if(!row||typeof row!=='object')return false;
 const r=row as StoryAttempt;
 return /^math:[7-9]:trial[0-2]$/.test(r.id)&&[0,1].includes(r.step)&&Number.isInteger(r.answer)&&r.answer>=0&&r.answer<=999&&typeof r.correct==='boolean'&&Number.isInteger(r.hints)&&r.hints>=0&&typeof r.time==='string'&&Number.isFinite(Date.parse(r.time));
}
function pick(r:StoryAttempt):StoryAttempt{return {id:r.id,step:r.step,answer:r.answer,correct:r.correct,hints:r.hints,time:r.time};}
export function readStoryAttempts():StoryAttempt[]{try{const raw=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(raw)?raw.filter(valid).slice(-200).map(pick):[];}catch{return [];}}
export function saveStoryAttempt(id:string,step:number,answer:number,correct:boolean,hints:number){
 const row={id,step,answer,correct,hints,time:new Date().toISOString()};
 if(!valid(row))return false;
 try{localStorage.setItem(key,JSON.stringify([...readStoryAttempts().slice(-199),row]));return true;}catch{return false;}
}
export function storyProgressJSON(rows:StoryAttempt[]){return JSON.stringify({version:1,kind:'story-step-attempts',attempts:rows.filter(valid).slice(-200).map(pick)},null,2);}
