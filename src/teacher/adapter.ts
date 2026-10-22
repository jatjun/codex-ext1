import type {Question} from '../lessons/data';
export interface AITeacherAdapter {explain(question:Readonly<Question>,answer:string,attempts:number):string}
export const teacher:AITeacherAdapter={explain(q,a,n){if(a===q.answer)return '你找到了！请再用自己的话说说为什么。';if(n>1)return q.explanation+' 再观察一次，然后重试。';if(q.errors?.[a])return q.errors[a];return a==='所有的面'?'眼睛在一个位置时，有些面会被物体挡住。试着只看朝向眼睛的面。':q.hint;}};
export function speak(text:string):boolean{if(!('speechSynthesis'in window))return false;const voices=speechSynthesis.getVoices();const voice=voices.find(v=>v.lang.startsWith('zh'));if(!voice)return false;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.voice=voice;speechSynthesis.speak(u);return true;}
