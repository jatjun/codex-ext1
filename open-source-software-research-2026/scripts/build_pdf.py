"""Build an offline A4 PDF from existing, redacted research. No network or candidate execution."""
from pathlib import Path
import re,csv,json,html,math,hashlib,shutil
from xml.sax.saxutils import escape
from fontTools.ttLib import TTFont as SourceFont
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.cu2quPen import Cu2QuPen
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate,PageTemplate,Frame,Paragraph,Spacer,PageBreak,LongTable,TableStyle,KeepTogether,Image
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.graphics.shapes import Drawing,Rect,String,Line,Polygon
B=Path(__file__).resolve().parents[1]; V=B/'visual'; A=V/'assets';A.mkdir(exist_ok=True)
REPORTS=sorted((B/'reports').glob('*.md')); extra=[B/'RESEARCH_SCOPE.md',B/'RESEARCH_METHOD.md',B/'review/INDEPENDENT_REVIEW.md',B/'review/FINAL_ACCEPTANCE.md',B/'data/sources.md']
alltext=''.join(p.read_text() for p in REPORTS+extra)+'开源软件研究详细图文报告基准日期编制日期目录第页用户适配候选数量评分维护样本功能部署成本示意不代表实测学习路线一周一个月项目统计输入输出停止条件置信度证据来源设备门禁雷达对照本地使用组合开发核验覆盖矩阵未知暂定甲乙丙壹贰叁肆伍陆柒捌玖拾ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,:;!?()[]+-/%≥→·—–（）：“”《》、。℃【】'
alltext+=Path(__file__).read_text()
fontpath=A/'ResearchNotoSubset.ttf'
if not fontpath.exists():
 src=SourceFont('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',fontNumber=2); cm=src.getBestCmap(); codes={ord(c) for c in alltext};codes.update(range(32,127));cmap={c:cm[c] for c in codes if c in cm}
 order=['.notdef']+sorted(set(cmap.values())- {'.notdef'}); gs=src.getGlyphSet();glyfs={};metrics={}
 for name in order:
  pen=TTGlyphPen(None);q=Cu2QuPen(pen,1.0,reverse_direction=True);gs[name].draw(q);glyfs[name]=pen.glyph();metrics[name]=src['hmtx'][name]
 fb=FontBuilder(src['head'].unitsPerEm,isTTF=True);fb.setupGlyphOrder(order);fb.setupCharacterMap(cmap);fb.setupGlyf(glyfs);fb.setupHorizontalMetrics(metrics);fb.setupHorizontalHeader(ascent=1160,descent=-288);fb.setupNameTable({'familyName':'Research Noto Subset','styleName':'Regular','uniqueFontIdentifier':'ResearchNotoSubset2026','fullName':'Research Noto Subset','psName':'ResearchNotoSubset'});fb.setupOS2(sTypoAscender=1160,sTypoDescender=-288,usWinAscent=1160,usWinDescent=288);fb.setupPost();fb.setupMaxp();fb.save(str(fontpath))
pdfmetrics.registerFont(TTFont('Research',str(fontpath)))
shutil.copyfile('/usr/share/doc/fonts-noto-cjk/copyright',A/'NOTO_FONT_LICENSE.txt')
INK=colors.HexColor('#18394b');TEAL=colors.HexColor('#246e89');LIGHT=colors.HexColor('#edf4f8');GRAY=colors.HexColor('#526575')
styles={
 'body':ParagraphStyle('body',fontName='Research',fontSize=9,leading=15,wordWrap='CJK',spaceAfter=6,textColor=INK,splitLongWords=True),
 'h0':ParagraphStyle('h0',fontName='Research',fontSize=22,leading=32,spaceAfter=17,textColor=INK,keepWithNext=True),
 'h1':ParagraphStyle('h1',fontName='Research',fontSize=16,leading=24,spaceBefore=12,spaceAfter=10,textColor=TEAL,keepWithNext=True),
 'h2':ParagraphStyle('h2',fontName='Research',fontSize=12,leading=20,spaceBefore=9,spaceAfter=6,textColor=INK,keepWithNext=True),
 'cell':ParagraphStyle('cell',fontName='Research',fontSize=7,leading=11,wordWrap='CJK',spaceAfter=0,textColor=INK,splitLongWords=True),
 'note':ParagraphStyle('note',fontName='Research',fontSize=8,leading=13,wordWrap='CJK',spaceAfter=8,textColor=GRAY),
 'cover':ParagraphStyle('cover',fontName='Research',fontSize=30,leading=45,spaceAfter=20,textColor=INK),
}
SUPPORTED=set(SourceFont(str(fontpath)).getBestCmap())
def inline(s):
 s=''.join(c for c in s if ord(c) in SUPPORTED or c in '\n\t');s=escape(s);s=re.sub(r'\[([^\]]+)\]\(([^)]+)\)',lambda m:f'<link href="{html.escape(m[2],quote=True)}" color="#246e89">{m[1]}</link>',s)
 s=re.sub(r'\*\*([^*]+)\*\*',r'\1',s);s=s.replace('`','');return s

def P(s,style='body'):return Paragraph(inline(str(s)),styles[style])
def table(headers,rows,widths=None):
 data=[[P(x,'cell')for x in headers]]+[[P(x,'cell')for x in row]for row in rows]
 t=LongTable(data,colWidths=widths or [W/len(headers)]*len(headers),repeatRows=1,hAlign='LEFT',splitByRow=1)
 t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),LIGHT),('GRID',(0,0),(-1,-1),.35,colors.HexColor('#c6d5df')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),5),('RIGHTPADDING',(0,0),(-1,-1),5),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5)]));return t
PAGEW,PAGEH=A4;W=PAGEW-84
class Doc(BaseDocTemplate):
 def __init__(self,path):
  super().__init__(str(path),pagesize=A4,leftMargin=42,rightMargin=42,topMargin=48,bottomMargin=45,title='2026开源软件研究：详细图文报告',author='Codex research',pageCompression=1)
  self.addPageTemplates(PageTemplate(id='main',frames=[Frame(42,45,W,PAGEH-93,id='normal',leftPadding=0,rightPadding=0,topPadding=0,bottomPadding=0)],onPage=self.decoration))
 def beforeDocument(self):self.seq=0
 def decoration(self,c,doc):
  c.saveState();c.setFont('Research',7);c.setFillColor(GRAY);c.drawString(42,PAGEH-27,'2026开源软件研究｜基准2026-10-31｜文档研究，非运行测试');c.line(42,PAGEH-34,PAGEW-42,PAGEH-34);c.drawString(42,25,'阶段性成果 · 独立研究裁决 REWORK');c.drawRightString(PAGEW-42,25,f'第 {doc.page} 页');c.restoreState()
 def afterFlowable(self,flow):
  if isinstance(flow,Paragraph)and getattr(flow,'toclevel',None)is not None:
   self.seq+=1;k=f'section-{self.seq}';self.canv.bookmarkPage(k);self.canv.addOutlineEntry(flow.getPlainText()[:100],k,flow.toclevel,False);self.notify('TOCEntry',(flow.toclevel,flow.getPlainText(),self.page,k))
def heading(s,level=0):
 p=P(s,'h0' if level==0 else 'h1');p.toclevel=level;return p
story=[]
story+=[Spacer(1,65),P('2026 开源软件研究','cover'),P('个人适配性与商业机会\n详细图文报告','h0'),Spacer(1,20),P('研究基准：2026-10-31　｜　PDF编制：2026-11-01'),P('92个候选 · 30项重点文档分析 · 九大领域 · 付费需求补充研究'),Spacer(1,25),P('阅读提示','h1'),P('本PDF整合已有研究、原创数据图表和付费需求补充材料。未安装或运行候选软件。30项重点分析中，尚无项目达到原任务要求的全部深度核验条件。独立研究裁决仍为REWORK。'),P('排版与PDF文件检查通过不代表软件功能、硬件性能、商业可行性或研究完整性通过验收。原报告中“PDF未生成”是早期交付状态，本次已补充PDF。'),P('所有疑似凭据摘录已脱敏。图表不使用虚构软件截图。字体为环境预装Noto的嵌入子集。'),PageBreak(),heading('目录与阅读路线')]
toc=TableOfContents();toc.levelStyles=[ParagraphStyle('toc0',fontName='Research',fontSize=10,leading=17,spaceBefore=6,wordWrap='CJK'),ParagraphStyle('toc1',fontName='Research',fontSize=8,leading=13,leftIndent=14,wordWrap='CJK')];story.append(toc)
story+=[Spacer(1,15),P('快速阅读：先看图表总览、17推荐、18计划、20裁决与21付费证据。需要查证时再看04重点分析、14社区反馈及附录来源。','note'),PageBreak(),heading('图表总览：从热门到实际收益')]
rs=list(csv.DictReader((B/'data/github_projects.csv').open(encoding='utf-8-sig')));sc=list(csv.DictReader((B/'data/project_scores.csv').open(encoding='utf-8-sig')))
CN={'A':'AI Agent与自动化','B':'本地AI与知识库','C':'儿童教育组件','D':'个人效率','E':'视频内容创作','F':'Excel/BOM企业','G':'开发与低代码','H':'家庭自托管','I':'隐私安全备份'}
def bar(title,labels,values,maxv=None,unit=''):
 hh=40+len(labels)*24;d=Drawing(W,hh);d.add(String(0,hh-17,title,fontName='Research',fontSize=12,fillColor=INK));maxv=maxv or max(values or [1]) or 1
 for i,(lab,v)in enumerate(zip(labels,values)):
  y=hh-48-i*24;d.add(String(0,y+4,str(lab)[:25],fontName='Research',fontSize=8,fillColor=INK));d.add(Rect(160,y,270*v/maxv,14,fillColor=TEAL,strokeColor=None));d.add(String(436,y+3,f'{v:,}{unit}',fontName='Research',fontSize=8,fillColor=INK))
 return d
story+=[P('1. 九大领域候选数量','h1'),bar('候选覆盖数量',[CN[k]for k in CN],[sum(r['category']==k for r in rs)for k in CN]),P('仅为本轮相关候选，不是全球项目总量。同一产品的组件仓库可能分别计数。','note')]
story+=[P('2. Star排名','h1'),bar('候选Star前12（2026-10-31）',[r['name']for r in rs[:12]],[int(r['stars'])for r in rs[:12]]),P('Star是关注度，不作为实际收益或付费需求证据。','note'),PageBreak()]
valid=sorted([r for r in sc if r['total'].isdigit()],key=lambda x:-int(x['total']))
story+=[heading('图表总览：评分、维护与成本'),P('3. 用户适配暂定分','h1'),bar('暂定分前12（满分100，误差约±8–12）',[r['project'].split('/')[-1]for r in valid[:12]],[int(r['total'])for r in valid[:12]],100),P('评分依据仍不充分，不应按一分差做决策。归档、许可证、企业数据边界等独立门禁优先于总分。','note')]
dims=['实际问题','易用性','设备适配','维护稳定','社区','总成本','隐私安全','扩展商业'];weights=[25,15,12,12,10,10,8,8];a=next(r for r in sc if r['project'].lower()=='mintplex-labs/anything-llm')
story+=[P('4. 评分维度等效图','h1'),bar('AnythingLLM各维度得分/权重（百分比）',dims,[round(int(a[d])/w*100)for d,w in zip(dims,weights)],100,'%'),P('各维未给满分；易用性、速度、引用质量均未在用户设备上实测。','note'),PageBreak()]
top=['anything-llm','super-productivity','openrefine','ollama','keepassxc','joplin','shotcut','grist-core','syncthing','restic'];sel=[next(r for r in rs if r['name'].lower()==n)for n in top]
counts=[int(re.search(r'样本内(\d+)',r['activity_90d'])[1])if re.search(r'样本内(\d+)',r['activity_90d'])else 0 for r in sel]
story+=[heading('图表总览：维护与部署边界'),P('5. 维护样本','h1'),bar('90天窗口内取得的提交样本（每项目最多5条）',[r['name']for r in sel],counts,5),P('窗口为2026-08-02至2026-10-31；这是最近提交抽样，不是90天提交总数。不能用来衡量项目总体维护强弱。','note')]
story+=[P('6. 成本与部署难度对照（定性估计）','h1'),table(['方案类型','例子','部署与维护','主要成本'],[['桌面成品','KeePassXC / Shotcut','较低；仍需更新与备份','时间、存储、素材'],['本地AI工作台','AnythingLLM + Ollama','中；模型、驱动、引用核验','显存、模型存储、电费'],['浏览器服务','Grist / Vikunja','中；主机在线、认证与恢复','服务器/存储/运维'],['复杂模型平台','Dify / RAGFlow','较高；多服务及模型后端','运维、API或GPU'],['受限小脚本','pandas BOM差异','开发中等；规则固定后可控','测试、业务规则与维护']],[80,130,170,W-380]),P('以上为架构判断，不是测得的工时、资源占用或报价。','note'),PageBreak()]
story+=[heading('图表总览：功能与设备矩阵'),P('7. 功能覆盖矩阵','h1'),table(['方案','核心覆盖','不能默认具备'],[['AnythingLLM','文档问答、知识索引','确定性BOM比较、零幻觉'],['Ollama','本地模型运行','完整知识库/完整Agent'],['Super Productivity','任务、工作记录','自动读写邮件'],['OpenRefine','清洗、去重、数据整理','多层BOM语义规则'],['Grist','关系台账、协作表格','全部Excel格式/公式保真'],['Shotcut / pyVideoTrans','剪辑 / 字幕翻译工作流','任意文本生成高质量场景'],['Kolibri / Scratch / sherpa','内容记录 / 互动 / 语音组件','完整中文三年级AI教师'],['Syncthing / restic','同步 / 备份','同步自动等同可恢复备份']],[100,185,W-285])]
story+=[P('8. Windows与移动设备适配','h1'),table(['设备','优先角色','门禁与未知'],[['Win11 / 32GB / 4060Ti 16GB','按需本地AI、小工具开发、视频处理','模型大小/量化/上下文决定内存，未测速度'],['Win10 / i3 / 8GB','轻量清单、记录、限量数据处理','安全更新资格、最低版本、CPU和磁盘需核；不优先重型RAG'],['iPhone / iPad','受控Web入口的浏览与交互','主机需在线；桌面软件不自动支持手机浏览器'],['公司禁安装电脑','企业批准的浏览器工作流','不代表允许上传到个人电脑/云；需企业授权']],[130,185,W-315]),PageBreak()]
story+=[heading('图表总览：选择与行动'),P('9. 使用方式决策图','h1')]
for txt in ['现有成品已满足 → 直接使用，避免重写基础工具','缺少数据格式/接口 → 配置或外接脚本，小规模组合','业务规则确实独有 → 定制BOM比较或受控教学流程','许可证/数据/硬件门禁不通过 → 停止并保留成熟替代']:
 story+=[table(['决策'],[[txt]],[W]),Spacer(1,8)]
story+=[P('10. 最终Top10推荐卡片','h1')]
for i,r in enumerate(sel,1):
 story.append(KeepTogether([P(f'{i}. {r["name"]} · {int(r["stars"]):,} Star','h2'),P(r['description']),P('边界：'+r['risk'],'note')]))
story+=[PageBreak(),heading('图表总览：Top5实施路线'),P('11. 五个优先尝试方向','h1'),table(['方向','第一天','第一周','第一个月'],[['AnythingLLM','确认资料处理权限','小批文件核对引用','重复使用仍省时才保留'],['任务清单','列待回复与到期日','记录漏项和维护耗时','比现有方法更省事才继续'],['OpenRefine','明确清洗字段规则','对照人工标准答案','换一组同类数据仍有效'],['Ollama','确认离线必要性','小模型资源与质量验证','收益超过配置维护成本'],['KeePassXC','了解密钥和恢复','测试备份与解锁','能恢复、使用习惯可持续']],[90,130,145,W-365]),P('以上是计划，不是本轮执行结果。一次只尝试一个；超过预设时间/预算或无法证明数据边界就停止。','note'),P('建议你的第一个小项目','h1'),P('固定模板BOM / Excel差异：准备3组合成样本，人工标注标准答案；原型只做导入、字段匹配、差异/异常和导出。精确差异采用确定性规则，AI只辅助解释。不要先做账号系统、聊天平台、自动发布或完整PLM。'),PageBreak()]
# Markdown parser preserves all existing text, tables, links; chapter sections gain bookmarks.
def addmd(path,label=None):
 lines=path.read_text().splitlines();i=0;first=True
 while i<len(lines):
  line=lines[i].strip()
  if not line:i+=1;continue
  if line.startswith('|'):
   block=[]
   while i<len(lines)and lines[i].strip().startswith('|'):
    ss=lines[i].strip();i+=1
    if re.fullmatch(r'[\s|:\-]+',ss):continue
    block.append([x.strip()for x in ss.strip('|').split('|')])
   if block:
    n=max(map(len,block));block=[row+['']*(n-len(row))for row in block]
    # Wide tables use compact font and width weighted by actual column content.
    if n>=6:widths=[W/n]*n
    else:
     lens=[min(50,max(len(re.sub(r'\([^)]*\)','',row[j])) for row in block))for j in range(n)];s=sum(max(10,x)**.5 for x in lens);widths=[W*max(10,x)**.5/s for x in lens]
    story.append(table(block[0],block[1:],widths))
   continue
  m=re.match(r'^(#{1,6})\s+(.+)',line)
  if m:
   depth=len(m[1]);txt=m[2]
   if first and depth==1:
    story.append(heading((label+'｜'if label else '')+txt,0));first=False
   elif depth==2:story.append(heading(txt,1))
   else:story.append(P(txt,'h2'))
  elif line.startswith('```'):
   i+=1;code=[]
   while i<len(lines)and not lines[i].startswith('```'):code.append(lines[i]);i+=1
   story.append(P('\n'.join(code),'note'))
  else:story.append(P(line,'note'if line.startswith('>')else'body'))
  i+=1
for path in REPORTS:
 addmd(path,path.stem[:2]);story.append(PageBreak())
for j,path in enumerate(extra,1):addmd(path,f'附录{j}');story.append(PageBreak())
# remove trailing forced page
if isinstance(story[-1],PageBreak):story.pop()
out=V/'OPEN_SOURCE_VISUAL_REPORT.pdf';Doc(out).multiBuild(story)
print(json.dumps({'pdf':str(out),'bytes':out.stat().st_size,'reports':len(REPORTS),'font_embedded':True},ensure_ascii=False))
