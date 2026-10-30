# P0-05 渲染验证

状态：RENDER_PASS

测试目录：/tmp/p0-05-video-_5zxu1o3。所有本轮生成文件仅位于此独立目录；未修改现有项目、安装依赖、访问外部素材、调用付费 API、发布或推送 Git。

## 实际结果

- FFmpeg 7.1.5，内置 testsrc2，30 fps，无外部素材。
- 渲染进程退出码：0。
- 实际渲染墙钟耗时：2.114 秒（Python time.monotonic，包含 FFmpeg 进程启动和 faststart 封装，不包含后续验证）。
- 文件：test_video.mp4。
- 文件大小：27658891 字节（26.38 MiB）。
- SHA-256：d45ad445c19c938adfa0f1e2594b3a854afab3c2c0c9cce44878294ed2b754bc。
- 无音轨；本轮未验证 AAC 编码或音画同步。

## 中文字体与字幕

fc-list :lang=zh family file 实际列出 Noto Sans CJK 与 Noto Serif CJK。
存在 Fontconfig 的 No writable cache directories 警告，但字体枚举成功；使用明确 fontfile 路径完成渲染，未安装字体。
字体：/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc。
字幕为烧录到画面的 drawtext，非独立字幕流：

- 0 ≤ t < 5：第一段：云端视频生成测试
- 5 ≤ t < 10：第二段：竖屏中文字幕验证
- 10 ≤ t < 15：第三段：十五秒测试完成

## FFprobe 实测

命令：
```sh
ffprobe -v error -count_frames -show_entries stream=index,codec_name,codec_type,width,height,pix_fmt,r_frame_rate,nb_read_frames,duration:format=duration,size,format_name -of json /tmp/p0-05-video-_5zxu1o3/test_video.mp4
```

```json
{
    "programs": [

    ],
    "stream_groups": [

    ],
    "streams": [
        {
            "index": 0,
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
        "size": "27658891"
    }
}
```

## 画面检查

- frame_02.png、frame_07.png、frame_12.png 抽取均退出 0，已逐张视觉检查。
- 三张均有测试画面和对应中文字幕，未见黑屏、缺字方框、乱码或字幕裁切。
- 测试源自带的色条、棋盘格与运动图案属于预期内容。
- 全片解码至 null，退出码 0；日志保存于 decode_blackdetect.log。
- blackdetect=d=0.1:pix_th=0.1:pic_th=0.98 未报告 black_start 事件。该检测不排除短于阈值的异常；视觉检查仅覆盖三个采样时刻。

## 实际渲染命令

```sh
ffmpeg -hide_banner -nostdin -f lavfi -i testsrc2=size=1080x1920:rate=30 -t 15 -vf 'drawtext=fontfile=/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc:textfile=/tmp/p0-05-video-_5zxu1o3/subtitle_1.txt:fontsize=52:fontcolor=white:box=1:boxcolor=black@0.75:boxborderw=24:x=(w-tw)/2:y=h-280:enable='"'"'gte(t,0)*lt(t,5)'"'"',drawtext=fontfile=/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc:textfile=/tmp/p0-05-video-_5zxu1o3/subtitle_2.txt:fontsize=52:fontcolor=white:box=1:boxcolor=black@0.75:boxborderw=24:x=(w-tw)/2:y=h-280:enable='"'"'gte(t,5)*lt(t,10)'"'"',drawtext=fontfile=/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc:textfile=/tmp/p0-05-video-_5zxu1o3/subtitle_3.txt:fontsize=52:fontcolor=white:box=1:boxcolor=black@0.75:boxborderw=24:x=(w-tw)/2:y=h-280:enable='"'"'gte(t,10)*lt(t,15)'"'"'' -c:v libx264 -preset ultrafast -crf 23 -threads 2 -pix_fmt yuv420p -movflags +faststart /tmp/p0-05-video-_5zxu1o3/test_video.mp4
```

完整日志：render.log；命令参数：render_command.json；计时：render_metrics.json。
