# P0-EDU-VIDEO-01

面向三年级的三段72秒竖屏数学动画，完整中文文字，无旁白或音乐。

运行：`python3 educational-videos/scripts/render.py`；验证：`python3 educational-videos/scripts/validate.py`。脚本拒绝覆盖已有视频。需要环境预装 Python/Pillow、FFmpeg/libx264、Noto Sans CJK；本项目没有安装新依赖或使用付费 API。

source-audit 保留指定提交源码；lesson-data/timeline.json 保存每6秒一阶段的教学文字；assets 保存从成片抽取的关键帧。视频不是掌握证据，须由家长/教师观察独立作答和口头解释。

优先研究了 React Stage 与 MixedStage；main 没有课程依赖，采用现有 Pillow 离线逐帧生成，再用 FFmpeg 编码，避免新增 React/Remotion 依赖。六面绑定与数量守恒按原程序逻辑实现。

原创几何图形，无第三方图片、音乐。Noto CJK 使用系统字体（SIL OFL，未分发字体文件）；Pillow HPND，FFmpeg 当前系统构建含 libx264/GPL，仅调用现有可执行文件，不分发依赖。
