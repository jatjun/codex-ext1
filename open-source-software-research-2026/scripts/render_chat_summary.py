from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import csv
B=Path(__file__).resolve().parents[1];V=B/'visual'
font='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc';bold='/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
def f(n,b=False):return ImageFont.truetype(bold if b else font,n)
def page(title,sub):
 im=Image.new('RGB',(1200,1600),'white');d=ImageDraw.Draw(im);d.rectangle((0,0,1200,12),fill='#216581');d.text((60,45),title,font=f(42,True),fill='#15394b');d.text((60,112),sub,font=f(22),fill='#526575');return im,d
def tx(d,xy,s,n=25,b=False,c='#233f50'):d.text(xy,s,font=f(n,b),fill=c)
rs=list(csv.DictReader((B/'data/github_projects.csv').open(encoding='utf-8-sig')))
im,d=page('2026 开源软件研究｜图文摘要 1/2','基准日期：2026-10-31 · 文档研究 · 未安装或运行候选软件')
for x,num,lab in [(60,'92','候选元数据已核验'),(440,'30','重点文档分析'),(820,'29','取得许可证原文')]:
 d.rounded_rectangle((x,175,x+320,300),15,fill='#edf4f8');tx(d,(x+20,185),num,45,True);tx(d,(x+20,253),lab,23)
tx(d,(60,340),'九大领域覆盖',30,True)
cats=[('A','AI Agent与自动化'),('B','本地AI与知识库'),('C','儿童教育组件'),('D','个人效率'),('E','视频与内容创作'),('F','Excel / BOM / 企业'),('G','开发与低代码'),('H','家庭自托管'),('I','隐私安全备份')]
for i,(c,lab)in enumerate(cats):
 y=402+i*48;n=sum(r['category']==c for r in rs);tx(d,(65,y),lab,23);d.rectangle((365,y+4,365+n*32,y+30),fill='#287a95');tx(d,(390+n*32,y-2),str(n),23)
tx(d,(60,875),'候选中 Star 前八（不是全球榜）',30,True)
for i,r in enumerate(rs[:8]):
 y=937+i*49;n=int(r['stars']);tx(d,(65,y),r['name'][:24],22);w=int(n/int(rs[0]['stars'])*510);d.rectangle((410,y+5,410+w,y+30),fill='#3a8798');tx(d,(930,y),f'{n:,}',22)
d.rounded_rectangle((60,1375,1140,1530),14,fill='#fff3de');tx(d,(80,1390),'研究状态：REWORK，属于部分交付',28,True);tx(d,(80,1440),'Star/Fork 已核验；完整深研、Windows 精确兼容与评分证据仍需补充。',22);tx(d,(80,1480),'高 Star 不等于适合你；自托管不等于离线；没有实际性能测试。',22)
im.save(V/'CHAT_REPORT_01.png')
im,d=page('2026 开源软件研究｜图文摘要 2/2','优先解决实际问题；以下是验证优先级，不建议全部安装')
items=[('AnythingLLM','个人文件问答','先用有权处理的脱敏资料检查引用准确性'),('Super Productivity','任务与待回复追踪','先减少漏项，再考虑邮件自动化'),('OpenRefine','Excel清洗与料号规范化','先验证固定格式的去重、合并与异常报告'),('Ollama','本地模型运行','确需离线推理时再加；优先Win11台式机'),('KeePassXC','本地密码管理','需要备份与恢复计划；移动端需另选兼容客户端')]
for i,(name,use,note)in enumerate(items):
 y=180+i*158;d.rounded_rectangle((60,y,1140,y+138),12,fill='#edf4f8');tx(d,(82,y+12),f'{i+1}. {name}',29,True);tx(d,(82,y+57),use,24);tx(d,(82,y+96),note,22)
tx(d,(60,1010),'你的下一步：只做一个小验证',31,True)
for i,s in enumerate(['第1天：选一种你经常做的BOM / Excel核对任务。','第2天：准备3组合成样本，人工标出正确差异。','第3—5天：做导入、比较、异常提示和导出的小原型。','第6—7天：核对漏报、误报、操作时间，再决定继续。']):tx(d,(70,1075+i*52),s,25)
d.rounded_rectangle((60,1320,1140,1530),14,fill='#fff3de');tx(d,(80,1336),'商业判断：有市场证据，尚无你的客户付款证据',27,True);tx(d,(80,1385),'优先验证表格清洗、BOM差异交付；不要先做完整平台。',23);tx(d,(80,1430),'部分竞品存在真实付费用户，但不代表会购买你的产品。',23);tx(d,(80,1475),'公司数据未经批准不上传；精确比较先采用确定性规则。',23)
im.save(V/'CHAT_REPORT_02.png')
print('两张对话展示图已生成。')
