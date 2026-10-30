# 立体车模版质量报告

状态：RENDER_PASS

- FFprobe 实测：15 秒、1080×1920、H.264、yuv420p、30 fps、450 帧。
- 全片解码退出 0，解码 450 帧。
- blackdetect=d=0.1:pix_th=0.1:pic_th=0.98 没有 black_start 事件。
- 90×160 灰度缩略帧最低平均亮度 219.410/255，相邻完全相同帧对 0/449；用于辅助检测，不代表完成逐帧人工审查。
- 已检查三维视角以及编码前预览；最终 MP4 抽帧时间为 [0.5, 2.5, 4.9, 5.1, 7.5, 9.9, 10.1, 12.5, 14.5] 秒，九宫格已完成视觉检查。
- 观察到三维车身、玻璃、车轮和地面阴影，泡沫、冲洗、擦拭分段可识别，中文字幕未见缺字或画面裁切。边界时刻标题淡入淡出、汽车视角叠化属于预期转场。
- 不是照片级画质：模型轮廓和部件仍有简化，CPU 渲染存在少量残余颗粒。泡沫、水流和抹布为合成示意，不是三维流体或接触仿真。
- 静音。尚未验证本次新视频的客户端实际下载与手机播放；未自动上传 GitHub。

## FFprobe 原始输出

```json
{
    "programs": [

    ],
    "stream_groups": [

    ],
    "streams": [
        {
            "codec_name": "h264",
            "codec_type": "video",
            "width": 1080,
            "height": 1920,
            "pix_fmt": "yuv420p",
            "r_frame_rate": "30/1",
            "duration": "15.000000",
            "nb_read_frames": "450"
        }
    ],
    "format": {
        "format_name": "mov,mp4,m4a,3gp,3g2,mj2",
        "duration": "15.000000",
        "size": "2066999"
    }
}
```

完整解码日志 decode.log，编码日志 render.log，三维渲染日志 model_render.log，数值证据 validation.json 和 render_metrics.json。
