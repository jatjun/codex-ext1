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
