# 网页知识点动画 · 第二批

30条新增视频：数学16条、语文5条、英语9条。每条64秒，1080×1920、30fps、H.264 Baseline、yuv420p、faststart。中文文字与原创几何动画，无旁白、无音乐。英语部分是认词/组句示意，不提供发音示范或发音评价。

来源：`jatjun/codex-ext1` 的 `feat/interactive-math-v1`，固定提交 `5cbce17c1a7d4f36fd74d5deaf1c4f7371147ca6`。完整原题、提示、解释和网页活动见 source-audit 与 lesson-data/website-inventory.json。结构定位代替原源码没有提供的题目ID；不为它们伪造原ID。

依赖均为环境已有：Python/Pillow、FFmpeg/libx264、Noto Sans CJK。无新依赖、付费API、第三方图片或音乐。逻辑画布540×960，经Lanczos缩放输出1080×1920；不声称原生1080绘图。Noto CJK系统字体OFL、不分发字体；Pillow HPND、现有FFmpeg/libx264为GPL构建，仅调用环境程序，不分发依赖。

复现：
```
python3 educational-videos/batch-02/scripts/plan.py
python3 educational-videos/batch-02/scripts/audit.py
python3 educational-videos/batch-02/scripts/render.py
python3 educational-videos/batch-02/scripts/validate.py
```

默认拒绝覆盖视频；中断恢复可用 `render.py --resume`，先检查现有成片的时长和帧数。`--only=slug1,slug2`只选择指定视频。临时渲染使用 `.rendering.mp4`，仅编码完成才改为正式文件名，验证器不将临时文件视为成片。

流程：0–8秒引入，8–16秒原题，16–24秒思考，24–48秒三步讲解，48–56秒验证，56–60秒迁移思考，60–64秒参考答案。可随时暂停。迁移题和摘要文字不代表学生已经掌握。

这30条覆盖已列出的具体活动，不代表穷尽整个网站、每种随机题或完整小学课程。原三条视频保持原路径，未覆盖原文件。网站入口仅更新独立网页分支，线上发布仍受已有授权边界限制。

[完整30条视频目录](reports/VIDEO_CATALOG.md) · [来源与覆盖范围](reports/SOURCE_AUDIT.md) · [教学审阅](reports/TEACHING_REVIEW.md) · [技术验证](reports/VIDEO_VALIDATION.md)
