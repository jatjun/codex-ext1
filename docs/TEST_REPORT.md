# V1 测试报告

执行环境：Linux、Node 24.19.0、Chromium，2026-10-22。

|检查|实际结果|
|---|---|
|TypeScript严格类型检查与Vite生产构建|PASS|
|Vitest数学及状态规则|5/5 PASS：相对面总和、模型面数、方向尺寸、关键题门槛、首答与掌握分类、受控反馈不改变题目|
|Playwright浏览器流程|3/3 PASS：390px及1280px完整观察/错误重试/独立练习/迁移/刷新保存；数字盒完整流程、解释分支、播放暂停与重播|
|水平溢出|390px与1280px自动检查PASS|
|重播截图检查|发现并修复暂停转动残留；重新执行所有检查通过|
|git diff --check|PASS|

未执行：真实Windows、真实iPhone Safari、中文语音设备兼容性、长时间性能与儿童实测、动画逐帧暂停恢复计时、真实触屏拖动、JSON下载内容的浏览器自动断言。不能把Chromium手机宽度测试等同iPhone真机测试。

已知限制：暂停后继续会重新等待该教学步骤的完整时间；朗读仅在设备存在中文语音时可用。动画表达视角改变，不包含通用物体拆分/合并、纸盒展开和十进制操作。练习为选择题，尚无自由数字输入与开放式解释自动评分。AI是受控本地规则及预留接口，不具备真实大模型自适应。

复现：npm ci；npm run build；npm test；npx playwright install chromium；npm run test:browser。Linux存在/usr/bin/chromium时自动使用，否则使用Playwright浏览器。测试服务器需要允许本机监听。

## GitHub Pages 双仓库部署检查（2026-10-22）

- 源仓库GitHub元数据确认Private；远端发布分支HEAD与V1提交一致；修改前工作区干净。
- `npm ci`执行成功；增加Node.js类型依赖后生产构建通过。
- `npm test`：10/10 PASS（原5项 + 5项公开产物门槛测试）。
- `npm run build`：TypeScript与Vite生产构建PASS；关闭source map，base为`/codex-ext1-pages/`。
- `SOURCE_SHA=<完整SHA> npm run check:public`：PASS，仅5个允许公开的文件；不含图片、源码目录、测试、文档、map或记录样本；没有检测到密钥或外传API。
- `npm run test:browser`：生产构建子路径下5/5 Chromium测试PASS。390px和1280px完整学习流程、刷新持久化、资源无HTTP错误与JS异常、方向切换、拖动、调速、播放暂停继续、重播、JSON下载。
- 发布脚本Node语法检查PASS；Workflow YAML解析、只读权限及concurrency检查PASS；`git diff --check` PASS。
- WebKit：NOT_TESTED，环境未安装；真实iPhone Safari及Windows：NOT_TESTED。
- 真实跨仓库推送、GitHub Pages正式地址：NOT_TESTED，缺少可确认的目标仓库与长期部署凭据；不能将本地测试当作线上部署成功。
- GitHub连接器目标仓库查询404（可能不存在或未授权）；CLI GitHub REST访问Forbidden。未修改源仓库可见性，未创建或覆盖未经确认的目标仓库，未将临时连接凭据复制进Actions Secrets。

部署操作见GITHUB_PAGES_DEPLOYMENT.md。发布脚本的远端写入目前仅完成静态检查，首次实际运行仍需验证GitHub App/PAT授权、目标仓库空仓库初始化与Pages构建状态。
