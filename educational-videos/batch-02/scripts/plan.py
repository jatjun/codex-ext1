import json,pathlib
R=pathlib.Path(__file__).resolve().parents[1];inventory=json.loads((R/'lesson-data/website-inventory.json').read_text());out=[]
def add(slug,title,source,ident,model,nums,captions,question,answer,transfer,transfer_answer,subject='数学'):
 assert len(captions)==4
 out.append(dict(slug=slug,title=title,subject=subject,source_file=source,source_id=ident,source_commit='5cbce17c1a7d4f36fd74d5deaf1c4f7371147ca6',model=model,nums=nums,question=question,answer=answer,transfer=transfer,transfer_answer=transfer_answer,stages=['一起帮小伙伴解决一个问题。',question,'先暂停想一想：你会怎样做？',*captions,transfer],summary='先说出理由，再独立试一题。'))
p={q['id']:q for q in inventory['practice']}
def practice(id,title,model,nums,cs,transfer,ta):
 q=p[id];add(id,title,'src/lessons/practice.ts',id,model,nums,cs,q['text'],q['answer'],transfer,ta);out[-1]['original']=q
practice('bus','公交车：先下车，再上车','bus',[24,13,18],['先看下车：从24人中去掉13人。','24－13＝11，还剩11人。','再把上车的18人加入：11＋18＝29。','验证：24－13＋18＝29人。'],'迁移：80本书卖25本、再卖38本，剩几本？','17本')
practice('beads','串珠：先算条数，再比较','beads',[72,56,8],['每8颗串一条。红珠72÷8＝9条。','黄珠56÷8＝7条。每格表示一条。','把9条和7条对齐，多出2条。','验证：9－7＝2条。16是颗数，不是条数。'],'迁移：5元面包与3元面包各买3个，差几元？','6元')
practice('books','剩下几本书：先合并已卖数量','books',[80,25,38],['把两周卖出的数量合起来：25＋38。','25＋38＝63，两周共卖63本。','从80本里去掉63本：80－63＝17。','验证：63＋17＝80本。'],'迁移：96张纸，剪14张和15张，剩几张？','67张')
practice('rabbits','兔子进笼：先求总数，再平均分','combine-average',[13,11,8],['先合并兔子：13＋11＝24只。','分给8个笼子，每个笼子一样多。','24÷8＝3，每笼3只。','验证：8×3＝24只，全部分完。'],'迁移：18个和12个桃子，每盒6个，几盒？','5盒')
practice('notebooks','购物：先扣铅笔钱，再求每本价钱','notebooks',[19,3,4],['19元里含铅笔钱和4本笔记本的钱。','先扣铅笔3元：19－3＝16元。','16元平均分成4份：16÷4＝4。','验证：4×4＋3＝19元，每本4元。'],'迁移：毛巾12元，每条便宜3元，买3条几元？','27元')
practice('towels','毛巾降价：每条便宜，再买三条','towels',[12,3,3],['先看一条：12元减3元。','12－3＝9，每条现在9元。','这样的价格有3份：9×3＝27元。','验证：(12－3)×3＝27元。'],'迁移：小明8朵，小红少3朵，小军是小红2倍，几朵？','10朵')
practice('groups','学习小组：男生女生一起分','combine-divide',[16,20,4],['所有学生都要分组：16＋20＝36人。','每4人圈成一组，不能漏掉女生。','36÷4＝9，一共9组。','验证：9×4＝36人，全部分完。'],'迁移：两篮25个和15个桃子，每盒8个，几盒？','5盒')
practice('bread','面包价差：每个多2元，三个多多少','bread',[5,3,3],['先比一个面包：5－3＝2元。','每个多2元，这样的差共有3份。','2×3＝6，三个面包多花6元。','验证：5×3－3×3＝15－9＝6元。'],'迁移：每条12元毛巾便宜3元，买3条几元？','27元')
practice('distance','走到中点：为什么还要乘2','distance',[300,150,2],['先把已经走的两段合起来。','300＋150＝450米，这才到中点。','全程有两段450米：450×2＝900米。','验证：900的一半是450米。'],'迁移：每组4颗水晶，3组一共几颗？','12颗')
practice('band','鼓号队：先算鼓手，再找号手','band',[81,6,9],['先看鼓手：6行，每行9人。','6×9＝54，鼓手共54人。','总人数81减去鼓手54：81－54＝27。','验证：54＋27＝81，号手27人。'],'迁移：30枚金币买3袋种子，每袋6枚，还剩几枚？','12枚')
q=next(l for l in inventory['lessons'] if l['id']=='peaches')
add('peaches','桃子装盒：括号把两篮放在一起','src/lessons/mixed.ts','peaches-key / peaches-total','combine-divide',[25,15,8],['先合两篮：25＋15＝40个。','括号表示两篮的总数：(25＋15)。','40个按每盒8个分组，得到5盒。','验证：(25＋15)÷8＝5盒，5×8＝40。'],q['questions'][0]['text'],'(25＋15)÷8','迁移：18个和12个桃子，每盒6个，几盒？','5盒');out[-1]['original']=q
add('equal-groups','晶桥水晶：三组一样多','src/adventure/model.ts','level=0 / bridgeReady / deposit','equal-groups',[3,4],['先给第一组放4颗水晶。','每组都放4颗，共3组。','4＋4＋4＝12，也可写3×4＝12。','验证：3组，每组4颗，共12颗。'],'每组4颗水晶，3组一共多少颗？','12颗','迁移：给炼金锅放2组星果，每组2个，共几个？','4个')
add('average','平均分点心：每人必须一样多','src/adventure/Academy.tsx','paths.数学[4]','average',[6,3],['先拿出6块点心，准备分给3人。','依次给每人1块，再给每人1块。','每人2块：6÷3＝2。','验证：3人×2块＝6块，没有剩下。'],'6块点心平均分给3人，每人几块？','每人2块','迁移：6块点心平均分给2人，每人几块？','每人3块')
add('clock','整点钟面：先看长针，再看短针','src/adventure/Academy.tsx','paths.数学[6]','clock',[3,6],['整点时，长的分针指向12。','短的时针指向3，读作3时。','换一个钟：分针仍在12，时针指6。','验证：这个钟读6时。长短两针要分清。'],'观察钟面：时针指3、分针指12，是几时？','3时','迁移：时针指6、分针指12，是几时？','6时')
add('patterns','找规律：每次增加2','src/adventure/subjects.ts','math level=2 / gateWords','patterns',[2,4,6,8,10],['先比2和4：多了2。','4到6、6到8，也都是多2。','下一步8＋2＝10。每次增加2。','验证：2、4、6、8、10。'],'2、4、6、8，接下来是多少？','10','迁移：1、2、3、4，接下来是多少？','5')
add('cargo-route','货物运输：装货加，卸货减','src/adventure/RouteGame.tsx','routePuzzle(math,10,0)','cargo',[10,4,3,2],['起点10箱，装4箱：10＋4＝14。','送出3箱：14－3＝11。','最后装2箱：11＋2＝13箱。','验证：10＋4－3＋2＝13箱。'],'10箱货物，装4箱、卸3箱、再装2箱，最后几箱？','13箱','迁移：从12箱出发，同样装4、卸3、装2，几箱？','15箱')
def lang(slug,title,source,ident,model,nums,question,answer,cs,transfer,ta,subject):add(slug,title,source,ident,model,nums,cs,question,answer,transfer,ta,subject)
lang('chinese-words','识字：把树、水、日、月送回家','src/adventure/Academy.tsx','paths.语文[0,1,2]','words',['树','水','日','月'],'看看图：哪一张卡表示树？','树',['先看树干和树冠，把“树”送到树旁。','流动的水，对应“水”。','太阳对应“日”，月亮对应“月”。','验证：图和字一一对应，再自己指认。'],'迁移：苹果和梨，分别是哪一种水果？','指认苹果、梨','语文')
lang('chinese-measure','量词：一本书、一只鸟、一朵花','src/adventure/expedition-model.ts','chinese level=4 encounters','measure',['一本书','一只小鸟','一朵花'],'一 □ 书，应该填哪个字？','本',['书用“本”：一本书。','小鸟用“只”：一只小鸟。','花用“朵”：一朵花。','验证：量词要和具体物品搭配。'],'迁移：一 □ 鱼，应该填哪个字？','条','语文')
lang('chinese-opposites','反义词：看见相反的意思','src/adventure/expedition-model.ts','chinese level=3 encounters','opposites',['大','小','长','短','高','低'],'“大”的反义词是什么？','小',['同样的形状，一大一小。','把两条线对齐，一长一短。','看两根柱子，一高一低。','验证：大—小、长—短、高—低。'],'迁移：“多”的反义词是什么？','少','语文')
lang('chinese-sentence','整理句子：谁，在哪里，做什么','src/adventure/campaign.ts','trialsFor(chinese,5)[0]','sentence',['小狐狸','在','森林里','看书'],'把词卡排成句子：小狐狸 / 在 / 森林里 / 看书。','小狐狸在森林里看书。',['先找“谁”：小狐狸。','接着说“在森林里”，说明地点。','最后接上“看书”，说明做什么。','验证：小狐狸在森林里看书。'],'迁移：小鸟 / 在 / 天空中 / 飞翔，怎样排？','小鸟在天空中飞翔。','语文')
lang('chinese-sequence','先、再、最后：把做事顺序排清楚','src/adventure/RouteGame.tsx','routePuzzle(chinese,10,0)','sentence',['先洗手','再吃饭','最后收碗'],'洗手、吃饭、收碗，怎样排顺序？','先洗手，再吃饭，最后收碗。',['第一站：先洗手。','第二站：再吃饭。','第三站：最后收碗。','验证：用先、再、最后说清楚顺序。'],'迁移：挖坑、播种、浇水，怎样排？','先挖坑，再播种，最后浇水。','语文')
lang('english-words','看图认词：fox、cat、apple、banana','src/adventure/Academy.tsx','paths.英语[0,2]','english-words',['fox','cat','apple','banana'],'哪张词卡表示狐狸？','fox',['先看狐狸的尾巴，把fox送给狐狸。','cat对应小猫，注意猫耳朵和胡须。','apple对应苹果，banana对应香蕉。','验证：看图后自己选词，不只记位置。'],'迁移：tree和water分别表示什么？','树和水','英语')
lang('english-colors','颜色词：red和blue','src/adventure/Academy.tsx','paths.英语[1]','colors',['red','blue'],'红色对应red还是blue？','red',['先观察红色物体，再配上red。','换成蓝色，配上blue。','看清颜色，再找对应词卡。','验证：red红色，blue蓝色。'],'迁移：green对应什么颜色？','绿色','英语')
lang('english-numbers','数字词：two和three','src/adventure/Academy.tsx','paths.英语[3]','numbers',['two','three'],'两颗星星应配哪张词卡？','two',['一颗一颗数，先看到两颗。','两颗配two，不把字母数当星星数。','再加入一颗，三颗配three。','验证：two是2，three是3。'],'迁移：三颗星星，应该选two还是three？','three','英语')
lang('english-weather','天气词：sunny和rainy','src/adventure/Academy.tsx','paths.英语[4]','weather',['sunny','rainy'],'晴天应配哪张词卡？','sunny',['看到太阳和晴朗天空，配sunny。','云下面落下雨滴，配rainy。','不看词卡位置，根据天气来选。','验证：sunny晴朗的，rainy下雨的。'],'迁移：窗外正在下雨，选sunny还是rainy？','rainy','英语')
lang('english-body','身体部位：hand和eye','src/adventure/Academy.tsx','paths.英语[5]','body',['hand','eye'],'哪张词卡表示手？','hand',['先伸出一只手，把hand配给它。','看看眼睛，把eye配给它。','指一指图，再找对应的词。','验证：hand手，eye眼睛。'],'迁移：指一指自己的眼睛，应选哪个词？','eye','英语')
lang('english-actions','动作词：run和swim','src/adventure/Academy.tsx','paths.英语[6]','actions',['run','swim'],'跑步应该配哪个词？','run',['观察小人迈步向前：run，跑步。','换到水里划水前进：swim，游泳。','两个动作的场景和身体姿势不同。','验证：run跑步，swim游泳。'],'迁移：在水里游泳，应该选run还是swim？','swim','英语')
lang('english-greetings','问候：Good morning和Good night','src/adventure/Academy.tsx','paths.英语[7]','greetings',['Good morning!','Good night!'],'早上见面，说哪句问候？','Good morning!',['早上见面，说Good morning!','晚上准备睡觉，说Good night!','先看场景，再选合适的问候语。','验证：morning早晨，night夜晚。'],'迁移：晚上睡觉前，应该说哪一句？','Good night!','英语')
lang('english-sentence','组句：I can see a fox','src/adventure/subjects.ts','english level=0 / gateWords','sentence',['I','can','see','a','fox'],'把词卡排成：我能看见一只狐狸。','I can see a fox.',['先放I，说的是“我”。','接着can see，表示“能看见”。','再接a fox，表示“一只狐狸”。','验证：I can see a fox.'],'迁移：I / can / see / a / rainbow，怎样排？','I can see a rainbow.','英语')
lang('english-spelling','拼词：把s、u、n排成sun','src/adventure/campaign.ts','trialsFor(english,5)[0]','sentence',['s','u','n'],'表示太阳的单词sun，字母顺序是什么？','s,u,n',['先观察太阳，再看完整单词sun。','第一个字母是s。','把u、n依次接上，组成sun。','验证：sun表示太阳，顺序是s、u、n。'],'迁移：red表示红色，字母顺序是什么？','r,e,d','英语')
(R/'lesson-data/plan.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));print('planned',len(out))
