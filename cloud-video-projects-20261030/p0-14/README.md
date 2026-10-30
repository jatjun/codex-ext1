# P0-14 原创汽车美容动态图形样片

所有汽车造型、车轮、泡沫、水流、擦拭布、闪光、背景、镜头和转场均由本项目源码程序绘制，无外部图片或视频素材。使用系统预装 Noto CJK 字体，不安装依赖、不调用生成服务或付费 API。

## 文件

- `original_car_care.mp4`：15 秒、1080×1920、30 fps、H.264/yuv420p，静音。
- `source/render_animation.py`：全部动画绘制与编码源码。
- `source/validate_animation.py`：成片参数、全片解码和抽帧验证。
- `production_report.md`：制作说明、计时和来源记录。
- `quality_report.md`：成片质量检查和已知局限。
- `ffprobe.json`、`validation.json`、`render_metrics.json`：实际机器可读证据。
- `frames/encoded_*.png`：从最终 MP4 抽取的检查帧。
- `frames/encoded_contact_sheet.jpg`：九张最终编码帧检查图。
- `frames/preview_*.png`：编码前的创作预览，不作为最终成片验收证据。

## 在已有工具环境重现

需要 Python 3、Pillow、NumPy、FFmpeg、FFprobe 和源码中指定的系统 Noto CJK 字体路径。

```sh
python3 -B source/render_animation.py
python3 -B source/validate_animation.py
```

脚本会覆盖本目录内同名输出，重现时请使用此独立目录的副本。源程序不访问网络。

## 画面说明

0–5 秒：泡沫逐步铺展，气泡上升。

5–10 秒：水枪喷流和水滴运动，泡沫消退。

10–15 秒：微纤维布示意擦拭、闪光与结束文案。

全片持续标注“原创动画模拟样片”及“非实拍影像 / 不代表真实服务效果”。没有商家名称、商标、价格、评价或真实前后效果声明。

本目录是云端执行环境中的工作产物，未上传 GitHub 或其他外部存储。本地路径不能证明客户端已能下载；保留期限未确认。
