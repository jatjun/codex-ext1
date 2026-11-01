from pathlib import Path
import fitz,json,hashlib
from PIL import Image,ImageDraw
b=Path(__file__).resolve().parents[1];p=b/'visual/OPEN_SOURCE_VISUAL_REPORT.pdf';d=fitz.open(p);texts=[x.get_text()for x in d];text=''.join(texts)
checks={k:k in text for k in ['AnythingLLM','OpenRefine','REWORK','Duolingo','2026-10-31','Messner','目录','付费']}
bad=[]
for i,page in enumerate(d):
 for q in page.get_text('blocks'):
  if q[0]<0 or q[1]<0 or q[2]>page.rect.width+.5 or q[3]>page.rect.height+.5:bad.append(i+1)
report={'pages':len(d),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bookmarks':len(d.get_toc()),'links':sum(len(x.get_links())for x in d),'keyword_checks':checks,'blank_pages':[i+1 for i,t in enumerate(texts)if len(t.strip())<80],'out_of_page_text_pages':sorted(set(bad)),'null_glyphs_in_text':text.count('\x00'),'embedded_font':any('ResearchNotoSubset'in f[3]for f in d[0].get_fonts()),'research_verdict':'REWORK remains unchanged','compiled_at':'2026-11-01'}
assert all(checks.values())and not bad and not report['blank_pages']and report['null_glyphs_in_text']==0 and report['embedded_font']
(b/'review/PDF_VALIDATION.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
ix=[0,1,6,7,8,9,10,11,22,52,90,len(d)-1];ims=[]
for i in ix:
 pix=d[i].get_pixmap(matrix=fitz.Matrix(.7,.7),alpha=False);ims.append((i,Image.frombytes('RGB',[pix.width,pix.height],pix.samples)))
w=max(im.width for _,im in ims);h=max(im.height for _,im in ims)+24;sheet=Image.new('RGB',(w*3,h*4),'#dbe5ec');dr=ImageDraw.Draw(sheet)
for j,(i,im)in enumerate(ims):x=j%3*w;y=j//3*h;sheet.paste(im,(x,y+22));dr.text((x+8,y+3),f'Page {i+1}',fill='black')
sheet.save(b/'visual/assets/PDF_CONTACT_SHEET.jpg',quality=85)
(b/'review/PDF_VALIDATION.md').write_text(f'''# PDF生成与检查\n\n编制日期：2026-11-01；研究数据基准：2026-10-31。\n\n使用环境现有ReportLab、fontTools、PyMuPDF生成A4 PDF，无新装依赖，无运行候选软件。共{len(d)}页，中文字体嵌入，{report['bookmarks']}个书签，{report['links']}个链接；包含21份报告和5份方法/审查/来源附录。\n\n检查：PDF可解析、关键章节可检索、无空白页、无页面边界外文本、无缺字空码；选取12页渲染检查封面/目录/图表/矩阵/重点分析/付费证据/来源。表格按行分页并重复表头。未核对全部外部链接的联网可用性，未测所有手机阅读器。原来源中的装饰性不支持emoji省略，正文数据保留。\n\n研究完整性裁决仍为REWORK；排版检查不能替代事实核验。原报告内PDF缺失说明属于早期状态。\n\nPDF SHA256：{report['sha256']}\n\n字体来源：系统Noto Sans CJK SC，嵌入所需字符的子集；许可见visual/assets/NOTO_FONT_LICENSE.txt。图表均为原创矢量绘制，无虚构软件截图。\n''')
print(json.dumps(report,ensure_ascii=False))
