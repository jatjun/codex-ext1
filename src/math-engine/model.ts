export type Direction = 'front'|'right'|'back'|'left'|'top';
export const angles: Record<Direction,[number,number]> = {front:[0,0],right:[0,-90],back:[0,-180],left:[0,-270],top:[-90,0]};
export const faces = {front:1,back:6,right:3,left:4,top:5,bottom:2} as const;
export function opposite(n:number){if(!Number.isInteger(n)||n<1||n>6)throw new Error('面上数字须为1～6');return 7-n;}
export function viewSize(d:Direction){return d==='top'?[160,100]:d==='left'||d==='right'?[100,70]:[160,70];}
export type Attempt = {id:string;lessonId:string;questionId:string;time:string;firstAnswer:string|null;correct:boolean;attempts:number;hints:number;replays:number;explained:boolean;result:'尚未完成'|'独立正确'|'提示后正确'|'讲解后正确'};
export function createAttempt(lessonId:string,questionId:string):Attempt{return {id:crypto.randomUUID(),lessonId,questionId,time:new Date().toISOString(),firstAnswer:null,correct:false,attempts:0,hints:0,replays:0,explained:false,result:'尚未完成'};}
export function answerRecord(r:Attempt,answer:string,correct:boolean):Attempt{return {...r,firstAnswer:r.firstAnswer??answer,attempts:r.attempts+1,correct,result:correct?(r.explained?'讲解后正确':r.hints||r.replays||r.attempts?'提示后正确':'独立正确'):'尚未完成'};}
export function nextStep(step:number,solved:boolean){return step===2&&!solved?step:Math.min(4,step+1);}
