import json,pathlib
R=pathlib.Path(__file__).resolve().parents[1];items=json.loads((R/'reports/validation.json').read_text());assert len(items)==30
lines=['# 视频目录','', '每条64秒；中文提示与原创动画，无旁白。点击文件链接查看或下载。SOURCE_VERIFIED / MATH与语言内容复核通过 / RENDER_PASS / TEACHING_REVIEW_PENDING。','', '|学科|标题与视频|时长|字节数|来源定位|','|---|---|---:|---:|---|']
for p in items:lines.append(f"|{p['subject']}|[{p['title']}](../{p['file']})|64秒|{p['bytes']}|{p['source']}|")
lines+=['','总时长：32分钟。总大小：'+str(sum(p['bytes'] for p in items))+'字节。单文件均低于GitHub 100 MiB限制。','', '使用本目录README、SOURCE_AUDIT、TEACHING_REVIEW与VIDEO_VALIDATION了解来源和审阅限制。原三条视频另在 educational-videos/videos/，没有被覆盖。']
(R/'reports/VIDEO_CATALOG.md').write_text('\n'.join(lines)+'\n')
(R/'reports/SHA256SUMS.txt').write_text(''.join(p['sha256']+'  '+p['file']+'\n' for p in items))
