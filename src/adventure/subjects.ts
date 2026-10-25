export type Subject='math'|'chinese'|'english';
export const subjects={math:{title:'晶桥溪谷',groups:['第一组','第二组','第三组'],words:[] as string[]},chinese:{title:'词语森林',groups:['动物之家','水果之家','自然之家'],words:['小猫','小狗','狐狸','小鸟','苹果','香蕉','梨子','葡萄','大树','太阳','月亮','河水']},english:{title:'Word Forest',groups:['Animals 动物','Fruit 水果','Nature 自然'],words:['cat','dog','fox','bird','apple','banana','pear','grape','tree','sun','moon','water']}};
export function wordGroup(subject:Subject,word:string){return Math.floor(subjects[subject].words.indexOf(word)/4);}
