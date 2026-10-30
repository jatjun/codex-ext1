import type {Question} from './data';
export type Practice=Question&{page:number;formula:string};
export const practice:Practice[]=[
 {id:'bus',page:6,text:'公交车原有24人，下车13人，上车18人，现在有多少人？',formula:'24－13＋18＝11＋18＝29',answer:'29',hint:'先求下车后剩多少人，再加上新上车的人。',explanation:'24－13＝11，11＋18＝29（人）。'},
 {id:'beads',page:14,text:'红珠72颗，黄珠56颗，每8颗同色珠串一条。红珠比黄珠多串几条？',formula:'72÷8－56÷8＝9－7＝2',answer:'2',hint:'先分别求出两种珠子能串几条，再比较。',explanation:'红9条、黄7条，多2条；也可(72－56)÷8＝2。16是多的颗数，不是条数。'},
 {id:'books',page:15,text:'书店进80本书，上周卖25本，本周卖38本，还剩多少本？',formula:'80－(25＋38)＝80－63＝17',answer:'17',hint:'两周卖掉的都要从总数扣除。',explanation:'25＋38＝63，80－63＝17（本）。'},
 {id:'rabbits',page:15,text:'原有13只兔子，又买11只，平均放进8个笼子，每笼几只？',formula:'(13＋11)÷8＝24÷8＝3',answer:'3',hint:'先确定要分的兔子总数。',explanation:'13＋11＝24，24÷8＝3（只）。'},
 {id:'notebooks',page:15,text:'1支自动铅笔3元，4本同价笔记本，合计19元。每本笔记本几元？',formula:'(19－3)÷4＝16÷4＝4',answer:'4',hint:'先扣除铅笔的钱，剩下的才是4本笔记本的钱。',explanation:'19－3＝16，16÷4＝4（元）。'},
 {id:'towels',page:15,text:'毛巾原价每条12元，每条便宜3元，买3条需几元？',formula:'(12－3)×3＝9×3＝27',answer:'27',hint:'每一条都便宜3元，先求新单价。',explanation:'12－3＝9，9×3＝27（元）。'},
 {id:'groups',page:16,text:'男生16人，女生20人，每4人一个学习小组，共几组？',formula:'(16＋20)÷4＝36÷4＝9',answer:'9',hint:'男生和女生都要分组。',explanation:'16＋20＝36，36÷4＝9（组）。'},
 {id:'bread',page:17,text:'买3个每个5元的面包，比买3个每个3元的面包多花几元？',formula:'(5－3)×3＝2×3＝6',answer:'6',hint:'每个贵多少？这样的差有几份？',explanation:'每个多2元，3个多6元。也可5×3－3×3。'},
 {id:'distance',page:17,text:'走了300米，再走150米到家与学校的中点，全程多少米？',formula:'(300＋150)×2＝450×2＝900',answer:'900',hint:'到中点只走完全程的一半。',explanation:'到中点450米，全程是它的2倍，共900米。'},
 {id:'band',page:19,text:'鼓号队81人，鼓手排6行，每行9人，其余是号手。号手多少人？',formula:'81－6×9＝81－54＝27',answer:'27',hint:'先求鼓手人数，再从总人数扣除。',explanation:'6×9＝54，81－54＝27（人）。'},
].map(q=>({...q,options:[]}));
