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

打开终端显示的本机地址（默认 http://localhost:5173）。生产构建：`npm run build`。逻辑测试：`npm test`。浏览器测试：`npx playwright install chromium`，然后 `npm run test:browser`。

### iPhone访问

电脑和iPhone连同一Wi-Fi，保持`npm run dev`运行；查看电脑局域网IPv4地址，在Safari访问 `http://电脑IP:5173`。按Windows提示允许Node在专用网络通信；不要把开发服务器暴露到公网。开发环境远程地址不等于可从手机访问的地址。中文声音取决于设备安装情况，无中文声音会显示文字回退说明。

### 文档与限制

见 [教材分析](docs/CURRICULUM_ANALYSIS.md)、[教学设计](docs/TEACHING_DESIGN.md)、[动画规范](docs/ANIMATION_SPEC.md)、[架构](docs/ARCHITECTURE.md)、[测试报告](docs/TEST_REPORT.md)、[后续工作](docs/NEXT_STEPS.md)。观察场景用正交方向讲解；不对教材斜视图中的姓名映射猜答案。记录只保存在当前浏览器，清理站点数据会删除记录，建议导出备份。
