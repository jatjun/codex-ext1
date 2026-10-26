import {useState} from 'react';
import {readStoryAttempts,storyProgressJSON} from './story-progress';
import {advancedTitles} from './story-model';
export function StoryProgress(){
 const [rows]=useState(readStoryAttempts),[message,setMessage]=useState('');
 function download(){const url=URL.createObjectURL(new Blob([storyProgressJSON(rows)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='fox-story-progress.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);setMessage('已请求下载JSON；请查看浏览器下载列表。');}
 return <section className="story-progress" aria-label="应用题学习足迹"><h3>应用题学习足迹</h3><p>仅保存在当前浏览器，最多保留200次分步提交。经验和装备不代表已经掌握；此处显示原始尝试，不把最终答对当作独立完成。</p>{!rows.length?<p>还没有应用题提交记录。</p>:<><button onClick={download}>导出应用题记录 JSON</button><p>共 {rows.length} 次提交，下面显示最近20次。提示次数是该步主动点击提示的累计次数，不包括自动错误反馈和数量演示。</p><ol>{rows.slice(-20).reverse().map((r,i)=>{const [,level,trial]=r.id.split(':');return <li key={i}><strong>{advancedTitles[Number(level)-7]} · 题{Number(trial.slice(-1))+1} · 第{r.step+1}步</strong><span>回答 {r.answer} · {r.correct?'正确':'需要再试'} · 主动提示 {r.hints} 次</span><time dateTime={r.time}>{new Date(r.time).toLocaleString('zh-CN')}</time></li>;})}</ol></>}<p role="status">{message}</p></section>;
}
