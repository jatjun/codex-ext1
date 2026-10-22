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

## 单仓库 GitHub Pages 迁移检查（2026-10-22）

- 公开前审查覆盖远端main、开发分支及全部3个可达提交、36个不同文件版本。无标签、无PR引用。发现两个开发提交作者/提交者含个人邮箱；用户明确选择暂不公开、先讨论历史清理。详见PRE_PUBLICATION_REVIEW.md。
- npm ci：PASS。
- npm test：11/11 PASS（原5项数学与交互规则，6项公开产物门槛/来源校验）。
- npm run build：TypeScript与Vite生产构建PASS；base=/codex-ext1/，source map关闭。
- npm run check:public：PASS，仅5个允许公开的静态文件，application=codex-ext1。无教材图、源码目录、文档、测试、map、真实记录或检测到的密钥。
- npm run test:browser：5/5 Chromium PASS，生产路径/codex-ext1/，390px及1280px。两场景、关键预测、错误分支、独立练习与迁移、刷新保存、方向、拖动、暂停继续、重播、速度与JSON下载均由现有测试覆盖。资源无HTTP错误、页面无JS异常。
- 新增上传前来源与哈希验证，测试错误SHA和修改后JS会被拒绝。
- Workflow YAML、build只读权限、deploy的Pages/OIDC权限、environment、concurrency及去除跨仓库凭据检查：PASS。Node脚本语法和git diff --check：PASS。
- GitHub托管Actions运行39809552910：build成功，包括逻辑测试、构建、公开检查、Chromium、哈希复核与artifact上传；deploy失败且无已执行步骤。随后新增显式公开审查变量开关，未设置为true时跳过deploy。
- 后续GitHub原始仓库元数据查询显示visibility=public、has_pages=true；与用户暂不公开的决定不一致。助手未执行可见性/Pages设置修改，已提示用户恢复Private并取消发布。当前网络访问正式URL遭代理CONNECT 403，线上页面与JS/CSS验证NOT_TESTED，不能认定网站已正常上线。取消旧运行的CLI请求返回Forbidden。
- WebKit、真实iPhone Safari、真实Windows：NOT_TESTED。

此前双仓库部署结果保存在Git历史中，当前配置与说明均以单仓库方案为准。不得把旧子路径或旧运行结果视为本次正式部署成功。
