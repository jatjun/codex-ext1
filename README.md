# codex-ext1
My codex claude projects

## 小小数学观察家 V1

基于本次上传“观察物体”第1～5页，提供两个原创动态观察场景：长方体视图、数字正方体相对面。包含关键预测、分支提示、6道配套题、中文可选朗读、本地记录及JSON导出。未接入真实AI；教材截图不随应用分发。

### Windows本地运行

安装 Node.js 22.12+（建议24 LTS）与Git，然后在PowerShell执行：

```powershell
git clone https://github.com/jatjun/codex-ext1.git
cd codex-ext1
git checkout feat/interactive-math-v1
npm ci
npm run dev
```

打开终端显示的本机地址（地址包含 /codex-ext1/）。生产构建：`npm run build`。逻辑测试：`npm test`。浏览器测试：`npx playwright install chromium`，然后 `npm run test:browser`。

### iPhone访问

电脑和iPhone连同一Wi-Fi，保持`npm run dev`运行；查看电脑局域网IPv4地址，在Safari访问 `http://电脑IP:5173/codex-ext1/`。按Windows提示允许Node在专用网络通信；不要把开发服务器暴露到公网。开发环境远程地址不等于可从手机访问的地址。中文声音取决于设备安装情况，无中文声音会显示文字回退说明。

### 文档与限制

见 [教材分析](docs/CURRICULUM_ANALYSIS.md)、[教学设计](docs/TEACHING_DESIGN.md)、[动画规范](docs/ANIMATION_SPEC.md)、[架构](docs/ARCHITECTURE.md)、[测试报告](docs/TEST_REPORT.md)、[后续工作](docs/NEXT_STEPS.md)。观察场景用正交方向讲解；不对教材斜视图中的姓名映射猜答案。记录只保存在当前浏览器，清理站点数据会删除记录，建议导出备份。

## GitHub Pages 单仓库部署

正式网站目标：[小小数学观察家](https://jatjun.github.io/codex-ext1/)（上线状态待真实部署验收）。唯一仓库为`jatjun/codex-ext1`。2026-10-23用户已同意Public并接受旧Git提交的作者姓名与邮箱公开风险；最终安全复查通过，无需历史重写。见 [公开前审查](docs/PRE_PUBLICATION_REVIEW.md)。

发布分支push后，自动运行逻辑测试、TypeScript与生产构建、公开产物检查及Chromium验证，通过后使用GitHub官方Pages artifact部署。deploy job只在PUBLICATION_REVIEW_APPROVED变量明确为true、仓库已Public、Pages Source为GitHub Actions、environment允许发布分支且本次提交仍为最新HEAD时工作。无需跨仓库Token、App或另一个部署仓库。

完整授权边界、Pages与environment网页配置、状态查看、回滚和排错见 [部署说明](docs/GITHUB_PAGES_DEPLOYMENT.md)。源码公开会同时公开可访问分支与Git历史，不只是静态产物。

学习记录保存在**当前设备当前浏览器的localStorage**，不跨设备同步，不默认上传。清除浏览器数据会删除记录，请按需JSON导出。GitHub Pages没有私有学习数据库；网站和源码公开并不意味着学习记录公开。不要把教材整页、密钥或真实儿童资料提交到仓库。

生产子路径本地验证：`npm run build`后执行`npm run preview`，打开`http://127.0.0.1:4173/codex-ext1/`。浏览器测试基于该生产构建运行，先执行`npm run build`。

### 混合运算扩展
依据新增第6～19页截图，增加酸奶分组与桃子装盒两个互动课程（13道分步/迁移题），以及10道可自选的数字应用题。包含剪窗花、纸花、串珠、购物与分组练习。原有观察物体课程保留。只公开原创SVG与课程数据，不上传教材截图；本轮并未逐题实现整个单元。

### 3D森林冒险
[直接试玩《小狐狸的晶桥奇遇》](https://jatjun.github.io/codex-ext1/#forest)：收集、跳跃、搬运水晶，三组各4颗修桥，再用3颗紫水晶＋2颗金水晶唤醒花门。支持WASD/方向键、空格、E及手机摇杆；无需登录和付费。详见[玩法与技术说明](docs/FOREST_ADVENTURE.md)。

3D冒险现有语数英各7关，共21条任务路线、5类场景；不是21张独立地图。第1～3关为森林搬运与分类，第4～5关为沙漠、冰雪符文战斗，第6～7关为霓光港口、云端学园。开场选关，通关后可继续下一关。

第6～7关先靠近猫头鹰导师按E交谈，进入数量工坊、句子/拼词卡片或翻牌配对小游戏。解题成功才给对应攻击蓄力，再选符文按F发射。英语另有可选的浏览器读词识别：**须每次主动同意后启动，语音可能由浏览器服务商在线处理**；只有识别文本匹配目标词才蓄力，不是专业发音评分。无语音支持时使用离线拼词，不会假装语音成功。

回声门原有的MediaRecorder录音回听仍完全在本页内存中，不上传，关闭即清理；它与上述可选在线语音识别是两项不同功能。本网站不保存识别文本或录音。

新增本机经验与等级：首次完成小游戏/解救守卫各20XP，首次通关60XP，每100XP升一级；重复完成同一任务不再奖励。Lv.2解锁紫色围巾与符文光效，Lv.4解锁金色围巾。只记录任务编号，保存在本浏览器localStorage；同一浏览器共享档案、不跨设备同步，清除网站数据会重置。等级不代表学业掌握程度。

右上角可选低／高／极致画质（默认高，记住选择）。极致增加后期辉光、更高像素密度和阴影；主要自动化使用低画质，单独验证极致渲染。点“字”开关森林提示；装满时可把水晶放回原处。详见 `docs/FOREST_ADVENTURE.md`。
