import type {Attempt} from '../math-engine/model';
const key='math-observation-v1';
export function readRecords():Attempt[]{try{const x=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(x)?x.filter(r=>r&&typeof r.id==='string'&&typeof r.questionId==='string'&&typeof r.attempts==='number'&&typeof r.result==='string'):[];}catch{return [];}}
export function saveRecord(r:Attempt){const records=readRecords();const i=records.findIndex(x=>x.id===r.id);if(i<0)records.push(r);else records[i]=r;try{localStorage.setItem(key,JSON.stringify(records.slice(-500)));return true;}catch{return false;}}
export function exportRecords(){const url=URL.createObjectURL(new Blob([JSON.stringify(readRecords(),null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='数学学习记录.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
