# SOURCE_VERIFIED

仓库 jatjun/codex-ext1；来源 feat/interactive-math-v1；commit `5cbce17c1a7d4f36fd74d5deaf1c4f7371147ca6`。源码来源通过git固定提交读取，独立审计逐字比对快照；文件摘要见source-files.json。source_id为原始题目ID或清楚标注的函数/数组结构定位；不声称结构定位是原题自带ID。

初始工作区干净；batch-02目录无冲突后创建；不覆盖第一批三片。main最新SHA为4b7f9603a03e1207d3f701667b0e7926cf7bd708；新分支基于已交付视频提交4b45ea0延续工作。独立分支feat/edu-video-batch-02。

|视频|学科|原题来源与定位|原答案|迁移来源|迁移答案|
|---|---|---|---|---|---|
|bus|数学|src/lessons/practice.ts / bus|29|practice.ts/books|17本|
|beads|数学|src/lessons/practice.ts / beads|2|practice.ts/bread|6元|
|books|数学|src/lessons/practice.ts / books|17|mixed.ts/paper-left|67张|
|rabbits|数学|src/lessons/practice.ts / rabbits|3|mixed.ts/peaches-practice|5盒|
|notebooks|数学|src/lessons/practice.ts / notebooks|4|practice.ts/towels|27元|
|towels|数学|src/lessons/practice.ts / towels|27|mixed.ts/flowers-double|10朵|
|groups|数学|src/lessons/practice.ts / groups|9|mixed.ts/peaches-total|5盒|
|bread|数学|src/lessons/practice.ts / bread|6|practice.ts/towels|27元|
|distance|数学|src/lessons/practice.ts / distance|900|adventure/model.ts/deposit(level0)|12颗|
|band|数学|src/lessons/practice.ts / band|27|adventure/story-model.ts/storyFor(7,0)|12枚|
|peaches|数学|src/lessons/mixed.ts / peaches-key / peaches-total|(25＋15)÷8|mixed.ts/peaches-practice|5盒|
|equal-groups|数学|src/adventure/model.ts / level=0 / bridgeReady / deposit|12颗|adventure/campaign.ts/trialsFor(math,5)[0]|4个|
|average|数学|src/adventure/Academy.tsx / paths.数学[4]|每人2块|adventure/Academy.tsx/paths.数学[4]|每人3块|
|clock|数学|src/adventure/Academy.tsx / paths.数学[6]|3时|adventure/Academy.tsx/paths.数学[6]|6时|
|patterns|数学|src/adventure/subjects.ts / math level=2 / gateWords|10|adventure/subjects.ts/math level1 gateWords|5|
|cargo-route|数学|src/adventure/RouteGame.tsx / routePuzzle(math,10,0)|13箱|adventure/RouteGame.tsx/routePuzzle(math,10,1)|15箱|
|chinese-words|语文|src/adventure/Academy.tsx / paths.语文[0,1,2]|树|adventure/Academy.tsx/paths.语文[3]|指认苹果、梨|
|chinese-measure|语文|src/adventure/expedition-model.ts / chinese level=4 encounters|本|adventure/Academy.tsx/paths.语文[4]|条|
|chinese-opposites|语文|src/adventure/expedition-model.ts / chinese level=3 encounters|小|adventure/Academy.tsx/paths.语文[5]|少|
|chinese-sentence|语文|src/adventure/campaign.ts / trialsFor(chinese,5)[0]|小狐狸在森林里看书。|adventure/campaign.ts/trialsFor(chinese,5)[1]|小鸟在天空中飞翔。|
|chinese-sequence|语文|src/adventure/RouteGame.tsx / routePuzzle(chinese,10,0)|先洗手，再吃饭，最后收碗。|adventure/RouteGame.tsx/routePuzzle(chinese,10,1)|先挖坑，再播种，最后浇水。|
|english-words|英语|src/adventure/Academy.tsx / paths.英语[0,2]|fox|adventure/subjects.ts/subjects.english.words|树和水|
|english-colors|英语|src/adventure/Academy.tsx / paths.英语[1]|red|adventure/subjects.ts/english level1 groups|绿色|
|english-numbers|英语|src/adventure/Academy.tsx / paths.英语[3]|two|adventure/Academy.tsx/paths.英语[3]|three|
|english-weather|英语|src/adventure/Academy.tsx / paths.英语[4]|sunny|adventure/Academy.tsx/paths.英语[4]|rainy|
|english-body|英语|src/adventure/Academy.tsx / paths.英语[5]|hand|adventure/Academy.tsx/paths.英语[5]|eye|
|english-actions|英语|src/adventure/Academy.tsx / paths.英语[6]|run|adventure/Academy.tsx/paths.英语[6]|swim|
|english-greetings|英语|src/adventure/Academy.tsx / paths.英语[7]|Good morning!|adventure/Academy.tsx/paths.英语[7]|Good night!|
|english-sentence|英语|src/adventure/subjects.ts / english level=0 / gateWords|I can see a fox.|adventure/subjects.ts/english level1 gateWords|I can see a rainbow.|
|english-spelling|英语|src/adventure/campaign.ts / trialsFor(english,5)[0]|s,u,n|adventure/campaign.ts/trialsFor(english,6)[0]|r,e,d|

本批不是网页全部内容的穷尽覆盖。已覆盖practice.ts全部10道固定应用题、桃子括号主课、分组/平均分/整点/数列/装卸，以及所列语文与英语基础主题。

未单独成片：随机战斗题库的全部生成组合、家长自定义本地题库（不读取儿童数据）、语文脚/手/嘴动作分类的所有项目、所有水果/自然物/颜色变式、每个关卡的战斗玩法/装备/奖励。已有上视图、相对面、酸奶视频保持原路径，可复用，不重复渲染。识字分类与英语认词视频只覆盖明确列出的词，不宣称完整词表均已动画讲解。

网站当前无法从本环境直接访问，故“当前网页知识点”以实际发布源分支固定提交为依据，未宣称已逐页抓取线上站点。
