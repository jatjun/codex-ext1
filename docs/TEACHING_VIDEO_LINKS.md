# 数学动画入口

首页新增“数学动画小课堂”，三个链接分别打开独立的播放页：
- `#video-views-top-view`
- `#video-cube-opposite-face`
- `#video-yogurt-word-problem`

播放页使用原生 video controls/playsInline，提供返回和下载链接。源文件固定在视频交付提交 `4b45ea07a7ac6c119aff019996e28b2d376d34d1`，避免分支后续变化影响内容。视频不自动播放，首页不预载三条视频，不记录观看为掌握。

验证：129项逻辑测试通过；TypeScript/生产构建通过；公开产物检查通过。390×844本地浏览器点击三个入口均打开正确播放页，三片均读取到72秒、1080×1920，controls/playsInline为true，无横向溢出。此浏览器检查将本地已验证MP4注入相同远端请求，未假称验证真实远程流式播放。三条真实raw URL另以HTTP HEAD核验均200。

环境限制：GitHub Pages地址与GitHub Actions/Pages管理API被当前网络策略拒绝，不能在此直接核实线上发布状态。使用原有分支发布工作流，不启用Pages、不修改发布配置、不合并PR、不修改main。原课程计算、题目和学习记录逻辑不变。
