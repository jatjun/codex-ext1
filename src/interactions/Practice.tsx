import {useState} from 'react';
import {practice} from '../lessons/practice';
import {createAttempt,answerRecord,type Attempt} from '../math-engine/model';
import {saveRecord} from '../progress/storage';
export function Practice(){
 const[index,setIndex]=useState<number|null>(null),[record,setRecord]=useState<Attempt|null>(null),[value,setValue]=useState(''),[feedback,setFeedback]=useState(''),[error,setError]=useState(false);
 const q=index===null?null:practice[index];
 function persist(r:Attempt){setRecord(r);setError(!saveRecord(r));}
 function begin(i:number){setIndex(i);setValue('');setFeedback('');persist(createAttempt('mixed-practice',practice[i].id));}
 function submit(){if(!q||!record||record.correct||!value)return;const r=answerRecord(record,value,value===q.answer);if(!r.correct&&r.attempts>=2)r.explained=true;persist(r);setFeedback(r.correct?'答对了！请说说每一步求的是什么。':r.attempts===1?q.hint:q.explanation);}
 return <section><p className="eyebrow">混合运算 · 自选练习</p><h1>把一个问题，分成几步。</h1><p>任选一题。数字键盘可以直接点，不需要键盘输入。</p><div className="practice-picks">{practice.map((p,i)=><button key={p.id} aria-pressed={index===i} onClick={()=>begin(i)}>第{i+1}题 · 教材第{p.page}页</button>)}</div>{q&&<article className="question"><h2>{q.text}</h2><label>我的答案 <input aria-label="我的答案" inputMode="numeric" value={value} disabled={record?.correct} onChange={e=>setValue(e.target.value.replace(/\D/g,'').slice(0,4))}/></label><div className="number-pad">{'1234567890'.split('').map(n=><button key={n} disabled={record?.correct} onClick={()=>setValue(v=>(v+n).replace(/^0+(?=\d)/,'').slice(0,4))}>{n}</button>)}<button disabled={record?.correct} onClick={()=>setValue(v=>v.slice(0,-1))}>退一位</button><button onClick={submit} disabled={!value||record?.correct}>检查答案</button></div><p role="status">{feedback}</p><button disabled={record?.correct} onClick={()=>{if(record){persist({...record,hints:record.hints+1});setFeedback(q.hint);}}}>一个小提示</button>{record?.correct&&<p>{q.formula}</p>}</article>}{error&&<p role="alert">浏览器无法保存本题记录，请检查存储权限。</p>}</section>;
}
