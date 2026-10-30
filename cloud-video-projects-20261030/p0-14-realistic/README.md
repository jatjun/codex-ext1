# 原创汽车美容动画：立体车模版

本项目使用现有 Blender 4.3.2、Python、Pillow、NumPy 和 FFmpeg。没有安装软件、联网下载模型或图片、调用付费 API，也没有上传 GitHub。

## 与平面版的区别

汽车由自建三维网格和几何体组成，具有真实透视、轮拱切口、轮胎厚度、轮毂和刹车盘、车窗、金属漆、棚灯反射及地面阴影。它不是从真实汽车照片描摹或导入的品牌模型，没有车标。

三维部分采用 CPU Cycles 渲染三个静态视角，合成部分添加连续推拉、平移、视角叠化、泡沫、水流和擦拭动作。**这是三维车模渲染与 2.5D 合成动画，不是 450 帧完整三维物理模拟，也不是实拍。**

整片持续标注“原创动画模拟样片”和“原创三维车模 / 合成清洁动画 / 非实拍”。汽车比例和部件属于概念设计，未声明与真实车型一致。没有真实服务效果、价格、评价或商家背书。

## 文件

- `original_car_care.mp4`：静音竖屏动画成片。
- `source/original_car.blend`：可编辑三维模型、材质、灯光和摄像机。
- `source/build_car.py`：从零构建三维车模和三个视角渲染的源码。
- `source/animate.py`：合成动画与 MP4 编码源码。
- `source/graphic_base.py`：沿用前版的基础绘图代码；不需要前版目录。
- `source/validate_animation.py`：规格检查、完整解码、抽帧验证。
- `assets/car_*.png`：本项目自己渲染的三维汽车，不是外部素材。
- `production_report.md`、`quality_report.md`：实际计时、验收证据及局限。

## 重现

```sh
blender -b -t 2 --python source/build_car.py
python3 -B source/animate.py
python3 -B source/validate_animation.py
```

只生成预览：`python3 -B source/animate.py --preview`。

重现会覆盖此目录同名输出，请在项目副本内操作。字体为系统预装 Noto Sans CJK Regular/Bold，源码中包含绝对字体路径，项目包不分发字体或第三方软件本体。

MP4 及项目包只保存在当前云端工作目录。本地路径不等于已验证用户下载，文件保留期限未确认。
