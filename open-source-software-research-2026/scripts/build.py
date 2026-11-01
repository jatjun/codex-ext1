import json,csv,html,re,datetime
from pathlib import Path
B=Path(__file__).resolve().parents[1]; D=B/'data';R=B/'reports';V=B/'visual'
def read(f):return json.loads((D/'raw'/f).read_text())
def val(x):return x.get('value',{}) if x.get('status')=='fulfilled' else {}
def content(v):return v.get('result',{}).get('structuredContent',{}).get('content','')
def write(p,s):p.write_text(s,encoding='utf-8')
meta={};fail=[]
for f in ['metadata.json','additional.json','fixes.json','missing.json']:
 for x in read(f):
  v=val(x)
  try:m=json.loads(content(v))
  except:fail.append(v.get('repo'));continue
  if isinstance(m,dict) and 'stargazers_count'in m:meta[m['full_name'].lower()]=m
  else:fail.append(v.get('repo'))
seeds=json.loads((D/'seeds.json').read_text()); cats={x['repo'].lower():x['category'] for x in seeds}
cats.update({'ankitects/anki':'C','pola-rs/polars':'F','harry0703/moneyprinterturbo':'E','learningequality/studio':'C','obsproject/obs-studio':'E','audacity/audacity':'E','blender/blender':'E','kovidgoyal/calibre':'H','freecad/freecad':'F','scratchfoundation/scratch-editor':'C','libreoffice/core':'F'})
exclude={'jandedobbeleer/oh-my-posh','serverless-dns/serverless-dns','sindresorhus/awesome','awesome-selfhosted/awesome-selfhosted'}
meta={k:m for k,m in meta.items() if k not in exclude}
docs={}
for f in ['documents.json','extra_documents.json']:
 for x in read(f):
  v=val(x)
  if content(v):docs[(v['repo'].lower(),v['path'])]=v['result']['structuredContent']
issues={val(x).get('repo','').lower():val(x).get('result',{}).get('structuredContent',{}).get('issues',[]) for x in read('issues.json')}
verified_complaints={}
for x in read('complaints_verified.json'):
 v=val(x); it=v.get('result',{}).get('structuredContent',{}).get('issue')
 if it:
  k=v['repo'].lower();verified_complaints[k]=it
  issues[k]=[it]+[a for a in issues.get(k,[]) if a.get('issue_number')!=it.get('issue_number')]
commits={val(x).get('repo','').lower():val(x).get('result',{}).get('structuredContent',{}).get('commits',[]) for x in read('commits.json')}
releases={val(x).get('repo','').lower():val(x).get('releases',[]) for x in read('releases.json')}
CN={'A':'AI Agent 与自动化','B':'本地 AI 与知识库','C':'儿童教育组件','D':'个人效率','E':'视频与内容创作','F':'Excel/BOM/企业工具','G':'开发与低代码','H':'家庭自托管','I':'隐私安全备份'}
# 人工分析记录：项目|作用|两个场景|设备与维护判断|关键限制|八维暂定分
raw='''ollama/ollama|本地模型运行器，省去手动编译推理引擎|脱敏合同离线摘要;语文课文提问草稿|Win11 原生；模型下载后可本地推理；16GB 显存优先小模型量化；Win10 老 CPU 不宜重推理|云模型另收费且需联网；模型许可独立；不能保证大模型全装入显存|22,12,11,9,8,8,7,6
Mintplex-Labs/anything-llm|面向个人的文档问答桌面/服务端工作台|脱敏BOM历史检索;家庭PDF资料问答|Windows 桌面入口降低门槛；服务端浏览器需另维护；手机访问需常在线主机|引用仍需人工核对；扫描PDF、复杂Excel结构不保证准确|23,12,10,8,8,8,7,6
super-productivity/super-productivity|任务清单、专注计时和工作记录|待回复事项清单;每周任务复盘|桌面与Web使用；无需GPU；低配机优先轻量清单|不是全自动邮件助手；提醒依赖应用在线和权限|22,13,11,9,7,9,7,5
openrefine/openrefine|通过浏览器交互清洗表格数据|BOM料号规范化;供应商名称去重|本地Java服务加浏览器；CPU即可；8GB需控制文件规模|公司禁安装仍需批准的内网主机；不能自动理解BOM层级语义|23,11,10,9,7,9,7,6
keepassxreboot/keepassxc|本地加密密码数据库|个人账号整理;应急恢复资料记录|Windows桌面，无GPU；离线可用；iOS需独立兼容客户端|不能把数据库和唯一密钥放同处；移动端并非官方同一客户端|19,12,11,10,8,10,7,5
laurent22/joplin|笔记、附件和待办管理|项目研究笔记;会议待回复记录|Windows/iOS应用；同步服务可选；无GPU|手机不是纯浏览器方案；付费云同步与软件免费分开|21,12,11,9,8,8,7,5
syncthing/syncthing|设备间文件同步|研究目录同步;家庭文件分发|CPU运行；两端需在线才能直接同步；Windows版本要求再核对|同步不是备份；误删也会同步；iOS支持需另选方案|21,11,9,9,8,10,7,5
mltframework/shotcut|传统非线性视频剪辑器|商家产品短片;儿童演示视频剪辑|Windows桌面；Win11优先；老机用代理素材；无手机编辑承诺|不是AI生成视频；素材版权另核；导出耗时未知|21,12,10,9,8,10,7,5
restic/restic|加密、去重、可恢复的备份程序|研究文件版本备份;小企业获批目录备份|CPU/命令行；老机可调度但需在线；存储容量另算|非程序员需协助设置与恢复演练；丢密钥不可恢复|22,8,10,10,8,9,8,6
gristlabs/grist-core|带关系数据与公式的协作表格|结构化BOM台账;报价追踪|浏览器访问批准服务器；自托管维护中等；无需GPU|不是复杂Excel无损替代；权限、备份、公式沙箱需验证|23,10,9,8,8,8,6,7
NousResearch/hermes-agent|具有记忆、工具和计划任务的个人Agent|只读资料研究;个人每日任务摘要|README现已宣称原生Windows支持，也可WSL；本地执行不强制Docker；模型端另选|网关与升级仍需核验；终端权限大；记忆和第三方工具可能外传数据|23,8,9,6,7,6,4,7
OpenHands/OpenHands|在隔离开发环境执行代码任务的Agent|隔离分支修复;生成小工具草稿|浏览器交互；运行时隔离和后端维护较重；Win11更合适|不替代审查；模型费用和容器运维；不适合作为老笔记本常驻入口|18,7,7,6,8,5,4,7
anomalyco/opencode|终端里的AI编程助手|改报告脚本;阅读代码并解释|开发者工作流；Windows路径及工具依赖按版本验证|不是手机任务管理；模型服务可收费；命令执行需限权|20,9,9,7,8,6,5,7
n8n-io/n8n|把多个服务连接起来的可视化自动化|个人到期提醒;获批表格到摘要流程|浏览器编辑；自托管需Node或容器运维；CPU即可|Sustainable Use许可限制；邮件写入和发送需单独授权；云集成不离线|22,9,8,7,8,6,5,7
langgenius/dify|构建模型应用、知识库和工作流的平台|企业获批知识问答;受控题目生成|浏览器；多服务部署维护较重；Win11可评估Docker/WSL|多租户和前端品牌有附加条件；不是儿童教学成品|22,9,7,6,8,6,5,6
langflow-ai/langflow|可视化组装模型与工具链的开发工具|RAG原型;验证模型调用流程|浏览器界面，Python依赖；适合原型，不宜直接公开编辑入口|理解模型链仍需技术；生产认证与升级需另审|18,8,8,7,8,7,5,7
ggml-org/llama.cpp|可精细控制量化模型推理的底层工具|离线模型基准设计;小型专用推理服务|Windows CPU/CUDA可选；需命令参数和模型格式知识|比Ollama维护难；不是完整知识库或Agent|19,7,10,8,9,9,7,7
open-webui/open-webui|本地或远程模型的浏览器聊天前端|家庭多模型对话;获批文件问答|浏览器和移动浏览器入口；后端主机需在线；容器是选项|品牌条款；工具、网页检索、外部模型可外传数据|23,11,9,7,8,7,6,6
danny-avila/LibreChat|多供应商模型的聊天与工具界面|多模型比较;团队聊天入口|本轮仓库重定向未成功跟随，当前部署要求UNKNOWN|关键原文未取得；禁止给出确定评分与推荐|UNKNOWN
infiniflow/ragflow|偏重复杂文档解析的RAG系统|扫描PDF检索;脱敏文档证据定位|服务依赖较多；Win11研究机优先；老机不优先|高资源与运维门槛；Excel问答不等于确定性BOM比较|22,7,6,5,8,6,5,7
learningequality/kolibri|可离线分发教学内容、练习与学习记录的平台|家庭离线练习;家长查看进度|浏览器客户端；主机与内容包需预先准备；无强制GPU|中文三年级课程适配未核实；不是中文AI虚拟教师|20,10,9,8,7,9,7,5
scratchfoundation/scratch-gui|Scratch可视化互动编程界面的旧仓库|分数动画;英语词卡小游戏|浏览器交互思路适合儿童；旧仓库已归档迁移，采用新编辑器前另核|不是完整教学/错题系统；旧源码不应新建生产分叉|20,10,8,5,5,9,6,6
manimCommunity/manim|用代码生成数学动画的渲染组件|分数变化动画;周长面积演示|Python和渲染依赖；Windows可研究；不要求4060才能用|视频生成不等于交互；非程序员长期改代码负担较高|19,6,8,7,8,9,7,6
k2-fsa/sherpa-onnx|离线语音识别、合成等工具组件|中文口头答题输入;受控题目朗读|多平台CPU推理选项；具体模型和中文质量需实测|组件不是教学系统；儿童语音准确率UNKNOWN；模型许可独立|20,6,8,7,8,9,7,7
go-vikunja/vikunja|浏览器任务与项目管理服务|家庭待办共享;待回复列表|浏览器/手机入口；服务端常在线且需备份；CPU即可|不自动读取邮件；比单机清单多运维和认证成本|21,11,8,8,7,9,6,5
remotion-dev/remotion|用React代码和模板渲染视频的框架|商品模板视频;知识卡片批量视频|需要前端开发与渲染环境；Win11更合适|不是免费无限商用承诺；不是生成式视频模型|21,6,8,7,8,5,7,7
jianchang512/pyVideoTrans|视频转录、字幕、翻译及配音工作流|已有产品片加字幕;教学视频字幕整理|Windows入口；CPU或GPU视转录后端；模型下载依赖网络|翻译/TTS后端可能付费联网；配音授权和错译人工审核|22,10,10,7,7,6,5,6
Stirling-Tools/Stirling-PDF|通过界面执行PDF拆合、转换等操作|脱敏PDF批量整理;资料页提取|浏览器/桌面选项以当前版本为准；无需默认GPU|根MIT不涵盖全部目录；OCR准确性与高级功能费用另查|22,11,9,8,8,7,6,6
paperless-ngx/paperless-ngx|带OCR和检索的自托管文档档案库|家庭票据归档;获批合同检索|浏览器访问；OCR可耗CPU；服务备份与升级中高负担|不等于复杂Excel解析；不要在未授权家用机存公司合同|21,8,7,7,8,8,6,6
pandas-dev/pandas|用Python可靠处理结构化表格的数据组件|BOM层级差异;Excel批量报表|CPU即可；Win11/Win10按文件规模；需AI协助写可审计脚本|不是可直接使用的图形产品；型号/替代料/单位规则需人工定义|24,5,10,8,9,9,7,8'''
profiles={}
for l in raw.splitlines():
 repo,desc,cases,device,risk,s=l.split('|');profiles[repo.lower()]={'desc':desc,'cases':cases.split(';'),'device':device,'risk':risk,'scores':None if s=='UNKNOWN' else list(map(int,s.split(',')))}
weights=[25,15,12,12,10,10,8,8];dims=['实际问题','易用性','设备适配','维护稳定','社区','总成本','隐私安全','扩展商业']
for p in profiles.values():
 if p['scores']: p['scores']=[min(a,b-1) for a,b in zip(p['scores'],weights)]
top=['Mintplex-Labs/anything-llm','super-productivity/super-productivity','openrefine/openrefine','ollama/ollama','keepassxreboot/keepassxc','laurent22/joplin','mltframework/shotcut','gristlabs/grist-core','syncthing/syncthing','restic/restic']
def license_doc(k):return next((v for (r,p),v in docs.items() if r==k and p!='README.md'),None)
def mdtable(head,rows):return '| '+' | '.join(head)+' |\n|'+'|'.join(['---']*len(head))+'|\n'+''.join('| '+' | '.join(str(x).replace('|','／').replace('\n',' ') for x in r)+' |\n' for r in rows)
def title(k):return meta.get(k.lower(),{}).get('name',k.split('/')[-1])
def stars(k):return meta.get(k.lower(),{}).get('stargazers_count','UNKNOWN')
def link(k):return 'https://github.com/'+k
rows=[]
for k,m in sorted(meta.items(),key=lambda z:-z[1]['stargazers_count']):
 p=profiles.get(k,{});cs=commits.get(k,[]); rs=[x for x in releases.get(k,[]) if not x['draft'] and not x['prerelease']];ld=license_doc(k)
 rows.append(dict(name=m['name'],github_url=m['html_url'],official_website=m.get('homepage') or 'UNKNOWN',description=p.get('desc',m.get('description')),category=cats.get(k,'UNKNOWN'),stars=m['stargazers_count'],forks=m['forks_count'],contributors='UNKNOWN',latest_commit=cs[0].get('created_at','UNKNOWN') if cs else 'UNKNOWN',pushed_at=m['pushed_at'],latest_release=(rs[0]['tag_name']+' '+str(rs[0]['published_at'])) if rs else 'UNKNOWN',activity_90d='样本内'+str(sum(str(c.get('created_at',''))>='2026-08-02' for c in cs))+'条；非90天总数' if cs else 'UNKNOWN',open_issues_including_pr=m['open_issues_count'],archived=m['archived'],license_metadata=(m.get('license')or{}).get('spdx_id','UNKNOWN'),license_url=ld.get('display_url') if ld else m['html_url']+'/tree/'+m['default_branch'],license_text_verified=bool(ld),commercial_restrictions=p.get('risk','UNKNOWN；需核对原文及子目录'),os=p.get('device','UNKNOWN'),docker_required='UNKNOWN；不能由可自托管推断',browser='见重点分析；其余UNKNOWN',chinese_ui='UNKNOWN',chinese_speech='UNKNOWN',fully_offline='取决于本地模型/工具及预下载；未实测' if k in profiles else 'UNKNOWN',paid_api_required='按后端选择；未完成逐功能核验' if k in profiles else 'UNKNOWN',cpu_ram_gpu=p.get('device','UNKNOWN'),suitable=p.get('cases',['UNKNOWN'])[0],unsuitable=p.get('risk','UNKNOWN'),risk=p.get('risk','UNKNOWN'),sources=m['html_url'],verified_at='2026-10-31',confidence='元数据高；功能文档中；运行UNKNOWN'))
with (D/'github_projects.csv').open('w',newline='',encoding='utf-8-sig') as f:
 w=csv.DictWriter(f,fieldnames=rows[0]);w.writeheader();w.writerows(rows)
score_rows=[]
for k,p in profiles.items():
 score_rows.append({'project':k,**{d:s if p['scores'] else 'UNKNOWN' for d,s in zip(dims,p['scores'] or [None]*8)},'total':sum(p['scores']) if p['scores'] else 'UNKNOWN','confidence':'暂定/文档研究；非性能测试','gate':'BLOCKED归档' if meta.get(k,{}).get('archived') else '条件通过：见许可证/权限/硬件门禁','evidence':link(k)+'/blob/'+meta.get(k,{}).get('default_branch','main')+'/README.md'})
with (D/'project_scores.csv').open('w',newline='',encoding='utf-8-sig')as f:
 w=csv.DictWriter(f,fieldnames=score_rows[0]);w.writeheader();w.writerows(score_rows)
count=len(rows);high=sum(r['stars']>=10000 for r in rows);huge=sum(r['stars']>=100000 for r in rows);lic=sum(r['license_text_verified'] for r in rows)
summary=f'''研究基准与采集日期：2026-10-31（UTC，日内快照，不是当日收盘）。候选 {count} 个，精确元数据核验 {count} 个；≥1万 Star {high} 个，≥10万 Star {huge} 个；原始许可证文件取得 {lic} 个；另对12项具体用户故障报告取得详情（不代表当前故障率）。30 项重点文档分析（LibreChat受阻），不等于30项完整深度验证。没有安装或运行任何候选软件。

最有收益的顺序是：先用一个任务清单、一个文档问答入口、一个表格清洗工具；再决定是否需要模型运行器和自动化。不要同时部署多个聊天平台、多个工作流平台。

推荐是进一步验证的优先级，不是“全部已证实好用”。GitHub元数据完整度高，功能、Win10精确版本、中文质量、90天全量维护、付款需求证据仍不完整。研究整体须附限制阅读，未达到原请求全部验收条件。
'''
write(B/'RESEARCH_SCOPE.md','# 范围与边界\n\n'+summary+'\n覆盖A–I九类；公司数据只在批准边界内处理。Windows 10到2026年的安全更新资格、ESU及硬件升级需另核；不得把它默认成安全的公网常在线主机。不得部署、推送或触达客户。\n')
write(B/'RESEARCH_METHOD.md','''# 方法与评分\n\n目录：证据 → 筛选 → 门禁 → 暂定分 → 计划。\n\n使用GitHub连接工具只读获取仓库JSON、README、许可证、Release和Issue；原响应保存在data/raw。没有从Star推算功能/收入。Awesome目录仅作发现参考；未完成全网搜索。命令行网络代理无法连接。\n\n'''+mdtable(['维度','权重'],zip(dims,weights))+'''\n每项重点分析八维分为研究者暂定判断，不能理解为用户实测。实际问题依据场景；易用性依据交互和配置；设备依据README平台信息（Win10版本未核）；维护依据依赖复杂性；社区依据提交/Issue样本而非Star；成本依据本地/外部后端与许可；隐私依据数据路径；扩展依据接口与许可。分值没有使用满分，误差估计±8–12分，不应按1分差排序。关键未知不补为满分；LibreChat全项UNKNOWN。\n\n85–100高度关注；70–84进一步验证；55–69有条件；40–54暂不优先；0–39不适合。门禁优先于总分：归档源码不推荐新分叉；许可证不清不商业化；公司未批准不处理企业数据；主机不在线不能承诺定时执行；硬件超限停止。\n\nopen_issues_count包含PR；pushed_at不等于最近默认分支提交。提交样本最多5条，不是90天完整统计。Release取接口返回首个非draft/prerelease，未分页穷尽；无返回不是无发布。贡献者未分页统计标UNKNOWN。\n''')
write(R/'01_EXECUTIVE_SUMMARY.md','# 执行摘要\n\n'+summary)
land=''
for c,n in CN.items():
 sub=[r for r in rows if r['category']==c];land+=f'\n## {c} {n}\n\n'+mdtable(['项目','Star','定位/适配边界'],[(r['name'],r['stars'],r['description'])for r in sub])
write(R/'02_OPEN_SOURCE_LANDSCAPE.md','# 九领域全景\n\n'+land)
write(R/'03_TOP_100_PROJECTS.md',f'# 候选清单（实际{count}项，文件名沿用目标结构）\n\n不是全球Top 100；仅为本轮相关候选按精确Star排列。低Star教育组件因需求匹配纳入。\n\n'+mdtable(['项目','类别','Star','Fork','归档','许可证元数据'],[(f"[{r['name']}]({r['github_url']})",r['category'],r['stars'],r['forks'],r['archived'],r['license_metadata'])for r in rows])+'\n## ≥100,000 Star\n\n'+', '.join(r['name']for r in rows if r['stars']>=100000))
deeptext='# 30项重点文档分析\n\n目录：'+ ' · '.join(title(k)for k in profiles)+'\n\n证据层级：官方README只确认“官方声称提供”；Issue确认“有人报告”，不确认普遍故障；无本地运行测试。每个案例均为拟议流程。\n'
for k,p in profiles.items():
 m=meta.get(k,{});rd=docs.get((k,'README.md'));ld=license_doc(k); sc=p['scores'];deeptext+=f"\n## {title(k)}\n\n{p['desc']}。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。\n\n官方仓库：{link(k)}；官网：{m.get('homepage') or 'UNKNOWN'}；Star：{stars(k)}（2026-10-31）。归档：{m.get('archived','UNKNOWN')}。\n\n### 功能与证据\n\n"
 if rd:
  # 可追溯原句：不将整份README当作测试
  text=re.sub('<[^>]+>',' ',rd['content']); lines=[s.strip() for s in text.splitlines() if len(s.strip())>60 and not s.strip().startswith(('!','[','|','```','http','>'))]
  deeptext+=f"官方文档：[README]({rd['display_url']})，文件SHA `{rd['sha']}`。摘录仅表明文档陈述：\n\n> "+(lines[0][:350] if lines else '详见原文')+'\n\n'
 else:deeptext+='README取得受阻；官方功能原文UNKNOWN，不给予确定性推荐。\n\n'
 deeptext+='社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。\n\n### 两个拟议案例\n\n'
 for j,c in enumerate(p['cases'],1):deeptext+=f'{j}. {c} → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。\n\n'
 deeptext+=f"### 安装与设备分析\n\n{p['device']}。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。\n\n### 成本、许可与门禁\n\n"
 deeptext+=(f"取得[原始许可]({ld['display_url']})（SHA `{ld['sha']}`）；不是仅依据GitHub许可证标签。"if ld else '原始许可证未成功取得：UNKNOWN，阻断商业再分发判断。')
 deeptext+=f" {p['risk']}。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。\n\n### 社区反馈样本\n\n"
 for it in issues.get(k,[])[:3]:deeptext+=f"- [{it.get('title')}]({it.get('url')})：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。\n"
 if not issues.get(k):deeptext+='未取得可用Issue样本；不能声称没有问题。\n'
 deeptext+=f"\n### 二次开发与评分\n\n先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。{p['risk']}。\n\n"
 if sc:
  reasons=[p['cases'][0]+'直接对应需求', '交互/配置门槛见设备段，未经用户试用',p['device'],'依赖与升级复杂度，非稳定性实测','最近提交及Issue样本，非长期健康结论','API/存储/电费另计','取决于本地路径、工具权限与后端','组件可复用；商业许可证门禁独立']
  deeptext+=mdtable(['维度','分/权重','证据与判断'],[(d,f'{s}/{w}',e)for d,s,w,e in zip(dims,sc,weights,reasons)])+f"\n暂定总分 {sum(sc)}；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。\n"
 else:deeptext+='总分UNKNOWN；证据阻断，不纳入排名。\n'
write(R/'04_TOP_30_DEEP_RESEARCH.md',deeptext)
sections={
'05_AI_AGENTS_AUTOMATION':('AI Agent与自动化','Hermes适合个人持续任务，OpenHands面向隔离软件开发，OpenCode面向终端编程；不能当作完全替代品。n8n处理确定性连接与定时流程，Dify处理模型应用，Langflow处理模型链原型。先有一个重复流程再引入工作流平台。Hermes当前README确认原生Windows入口，不能沿用“只支持WSL”的旧结论；支持声明不等于本机稳定测试。', ['NousResearch/hermes-agent','OpenHands/OpenHands','anomalyco/opencode','n8n-io/n8n','langgenius/dify','langflow-ai/langflow']),
'06_LOCAL_AI_KNOWLEDGE':('本地AI与知识库','个人先试AnythingLLM桌面，确需手机/多人入口才评估Open WebUI；LibreChat本轮重定向受阻，不能确定排名。Ollama省配置，llama.cpp可控但技术门槛高，LocalAI偏服务接口兼容。只选一个主入口。检索引用不是正确性保证，BOM精确差异应交给结构化规则。', ['ollama/ollama','ggml-org/llama.cpp','mudler/LocalAI','open-webui/open-webui','Mintplex-Labs/anything-llm','danny-avila/LibreChat','infiniflow/ragflow']),
'07_CHILDREN_EDUCATION':('三年级儿童教育','没有证据表明本轮发现了完整、成熟、中文三年级AI教学成品。Kolibri偏内容与学习记录；Scratch偏互动创作；Manim偏预渲染动画。MathJax只负责公式显示。sherpa-onnx语音组件可用不代表儿童普通话识别准确。建议先做一课十分钟分数/面积教学，固定题库、受控提示、独立作答后揭晓、错题记录与家长复核；不开放任意Agent工具或网页。教材版权、内容适龄、儿童数据最小化均需核验。', ['learningequality/kolibri','scratchfoundation/scratch-gui','scratchfoundation/scratch-editor','manimCommunity/manim','k2-fsa/sherpa-onnx']),
'08_PRODUCTIVITY_TOOLS':('个人效率','优先Super Productivity管理任务，已有成熟清单则无需迁移。Joplin适合笔记与会议记录，Vikunja适合需要共享和浏览器入口的家庭/小团队；只有共享价值超过服务器维护成本才自托管。邮件先人工添加“待回复/到期日”，确认连续两周减少漏项后再考虑只读邮件分类。不要默认自动发送。', ['super-productivity/super-productivity','laurent22/joplin','go-vikunja/vikunja']),
'09_VIDEO_CREATION':('视频与内容创作','Shotcut/Kdenlive剪辑已有素材；pyVideoTrans做转录字幕翻译；Remotion按代码模板合成视频，均不等于文本生成视觉场景。MoneyPrinterTurbo需核对素材与模型服务；FFmpeg是处理引擎，不是非程序员的一键产品。高质量生成视频可能涉及付费模型、显存、版权与审核，16GB卡不保证任意模型可用。OBS/Audacity/Blender分别覆盖录制、音频与三维制作，学习成本不同。自动发布需要平台授权，本轮只研究不执行。', ['mltframework/shotcut','Kdenlive/kdenlive','jianchang512/pyVideoTrans','remotion-dev/remotion','harry0703/MoneyPrinterTurbo']),
'10_BUSINESS_EXCEL_TOOLS':('Excel、BOM与企业文件','推荐先用OpenRefine清洗，Grist承载关系台账，pandas执行可重复比较；三者不互相等价。Excel单元格差异不能替代BOM业务差异：必须定义料号/版本/数量/单位/替代料/父子路径、重复行、多层展开与缺失值。用人工标注的脱敏样本比较漏报误报；原文件只读，输出差异表与规则版本。公司电脑禁止安装时，浏览器需要企业批准的内网主机，不意味着可把数据发到个人服务器。LibreOffice主开发源非GitHub镜像，不能以镜像提交判断整体维护。', ['openrefine/openrefine','gristlabs/grist-core','pandas-dev/pandas','SheetJS/sheetjs','Stirling-Tools/Stirling-PDF','paperless-ngx/paperless-ngx']),
'11_DEV_SELFHOST_PRIVACY':('开发、自托管与隐私','暂不新建低代码全家桶。Appsmith/ToolJet/Budibase仍需要数据库、认证、备份与升级；免费社区版不保证企业功能全免费。家庭先做密码库和可恢复备份；Syncthing是同步，restic/Kopia是备份。Immich/Nextcloud/Home Assistant只有明确照片、文件或家居需求才值得长期服务。Win11不开机时不能承担持续任务；Win10老设备先核安全更新、磁盘与内存余量，不公开暴露服务。远程访问也必须认证、授权和可撤回。', ['AppsmithOrg/appsmith','ToolJet/ToolJet','Budibase/budibase','syncthing/syncthing','restic/restic','kopia/kopia','keepassxreboot/keepassxc'])}
for f,(t,s,ks)in sections.items():
 write(R/(f+'.md'),'# '+t+'\n\n'+s+'\n\n'+mdtable(['方案','Star（2026-10-31）','依据/下一步'],[(f'[{title(k)}]({link(k)})',stars(k),profiles.get(k.lower(),{}).get('device','仅元数据核验；安装/中文/离线UNKNOWN'))for k in ks])+'\n成本、原文证据与风险详见[重点分析](04_TOP_30_DEEP_RESEARCH.md)。\n')
comp='# 横向比较\n\n各组至少三种代表方案；定位不同不强作替代。Star精确快照与归档状态见数据表，维护样本见原始提交；未用Star推断易用性。\n'
for _,(t,s,ks) in list(sections.items())[:6]:comp+='\n## '+t+'\n\n'+s+'\n\n'+mdtable(['方案','Star','适合人群/设备','关键代价'],[(title(k),stars(k),profiles.get(k.lower(),{}).get('device','UNKNOWN'),profiles.get(k.lower(),{}).get('risk','UNKNOWN'))for k in ks[:6]])
comp+='\n## 本地运行引擎专项\n\nOllama：个人易用入口；llama.cpp：底层可控；LocalAI：服务端兼容接口。三者模型文件、量化、上下文和并发决定内存，未测吞吐。优先Ollama，只有明确性能/格式缺口再研究llama.cpp。LocalAI安装路径与当前Windows支持未深核，暂不优先。\n'
write(R/'12_COMPARISON_MATRIX.md',comp)
write(R/'13_USER_FIT_RANKING.md','# 适配性暂定排序\n\n不是经过用户试用的精确测量；分数误差±8–12。商业/安全/归档门禁独立，Top10优先级另外考虑时间与重叠。\n\n'+mdtable(['项目','暂定分','门禁'],[(s['project'],s['total'],s['gate'])for s in sorted(score_rows,key=lambda s:-(s['total'] if isinstance(s['total'],int)else -1))]))
complaints='# 社区问题原始样本\n\n按评论数检索每个重点仓库最多3条，存在历史/热度选择偏差；不代表最常见抱怨，不用于故障率排名。请求、自动化告警不等于实际用户抱怨。搜索工具未返回的创建日期、版本、状态均UNKNOWN（另有12项详情已补回）；采集日期2026-10-31不等于发帖日期。未读取所有评论，不能确定当前版本仍受影响。\n'
for k,its in issues.items():
 complaints+='\n## '+k+'\n\n'
 if not its:complaints+='UNKNOWN：未取得样本。\n'
 for it in its:
  body=re.sub(r'\s+',' ',it.get('body')or'')[:650]
  complaints+=f"- [{it.get('title')}]({it.get('url')})。创建日期：{it.get('created_at') or 'UNKNOWN'}；状态：{it.get('state') or 'UNKNOWN'}；版本：UNKNOWN。原文节选：{body}\n\n"
write(R/'14_COMMUNITY_COMPLAINTS.md',complaints)
write(R/'15_BUSINESS_OPPORTUNITIES.md','''# 商业机会：全部处于“值得验证”\n\n本轮没有取得真实客户付款证据。项目Star、赞助链接、厂商付费套餐均不能证明用户能盈利；Issue只证明项目用户遇到问题，不能证明本地小商家愿意购买服务。\n\n|方式|候选|客户为何可能付费（假设）|成本/许可阻断|裁决|\n|---|---|---|---|---|\n|使用工具提供服务|OpenRefine+pandas|清洗报价/BOM并提供可审计差异|业务规则、隐私、人工复核|优先验证；没有付款证据|\n|数据/内容服务|Shotcut+pyVideoTrans|现有素材剪辑、准确字幕与交付效率|素材/配音权利、API费、返工|值得验证|\n|部署维护|Grist、备份工具|迁移、权限与恢复保障|持续支持时间、责任边界|有技术支持能力后再考虑|\n|二次开发|受控教学组件|针对年级课程和家长记录|教材版权、儿童隐私、效果证据缺失|先验证一课，不做平台|\n|多租户托管/换牌|n8n/Dify/Open WebUI/Remotion|统一入口|附加许可及收费条件，见原文|当前不建议|\n|通用AI聊天平台|多种前端|差异不明|替代充分、维护重|不值得现在商业化|\n\nMIT/BSD通常允许修改与再分发但保留声明；Apache另有专利与NOTICE义务；GPL分发与AGPL网络交互义务需按具体使用方式核对，不能把AGPL写成“不能商用”。模型权重、数据集、字体、音乐、商标不自动随代码许可授权。n8n是受限源码许可；Dify是附加条件许可；Open WebUI当前品牌条款包含特定例外；Remotion有规模/使用主体收费条款；Stirling PDF各目录不同。正式报价/再分发前逐版本审查。\n\n测算框架：收入−API−存储/电费−素材授权−获客−返工−维护工时×目标时薪。先用公开/合成样本测人工耗时；本轮不接触用户、不推广、不收费。\n''')
write(R/'16_RECOMMENDED_COMBINATIONS.md','''# 五个方向的最小组合\n\n1. **AI工作台**：AnythingLLM优先，确需本地模型加Ollama；确需移动共享才以Open WebUI替换/补充入口。先不重写统一平台。\n2. **儿童教学**：Scratch迁移后的编辑器/自制轻页面交互 + 固定题库 + 可选sherpa-onnx；Kolibri承担内容记录的可行性另核。组件可用不等于完整教学系统，Manim只输出动画。\n3. **个人效率**：Super Productivity或现有清单二选一；研究笔记需要时才加Joplin。待回复先手工，再讨论n8n只读分类。\n4. **企业文件**：OpenRefine清洗 + pandas确定性BOM比较；确需协作台账再用Grist。服务只能放批准主机，不能绕过公司禁安装要求。\n5. **视频副业**：Shotcut编辑已有合法素材，字幕负担明显才加pyVideoTrans；固定模板批量化有收益后再评估Remotion许可。\n\n现有AI-Digital-Employee为规划稿。Hermes可复用工具、网关和计划任务，n8n可复用连接编排；持久状态、审批、幂等、断电恢复与结果验证仍需单独验证。不能宣称完整替代其架构，不修改该目录。\n''')
toptext='# 最适合用户的Top10（验证优先级）\n\n不是按分数强制排序，不建议全部安装。学习时间为规划估计，未实测。\n'
for i,k in enumerate(top,1):
 p=profiles[k.lower()];m=meta[k.lower()];toptext+=f"\n## {i}. {title(k)}\n\n用途：{p['desc']}；推荐因为：{p['cases'][0]}。Star {stars(k)}（2026-10-31）；最近推送 {m['pushed_at']}（不等于长期健康）。设备：{p['device']}。\n\n费用/离线：源代码许可见重点分析，本地处理路径可能无需API；云、模型、同步、存储另计。非程序员：先原版和最少配置；预计了解2–4小时，验证一周，服务端或命令行再留额外一天。维护：桌面更新较轻，服务器/备份需月度检查。\n\n与现有项目：复用现成能力，避免重写同类基础功能。不推荐条件：{p['risk']}。\n"
write(R/'17_TOP_10_RECOMMENDATIONS.md',toptext)
actions='# Top5实施计划（本轮不执行）\n\n只从最急迫的一个开始，前一项未产生收益不扩展。时长为研究者预算。\n'
for k in top[:5]:
 p=profiles[k.lower()];actions+=f"\n## {title(k)}\n\n- 第一天（1–2小时）：了解{p['desc']}，阅读当前版本平台与许可说明，确认数据边界。\n- 第一周（2–4小时）：以10–20条合成/脱敏样本验证“{p['cases'][0]}”，记录手工基线、错误和恢复方法。\n- 第一个月：连续三次完成同类任务、有可复核输出且净节省时间才继续；任务类以减少漏项为标准，模型类以引用正确率与不外传为标准。\n- 预期收益：减少重复整理；收益量UNKNOWN。失败风险：{p['risk']}。\n- 停止条件：两次排障累计超过4小时仍无收益、数据边界无法证明、成本超过预设预算、准确性达不到任务要求。\n- 替代：保留现有人工/商业工具；没有必要为了开源迁移。\n"
write(R/'18_TOP_5_ACTION_PLAN.md',actions)
limitations='''# 风险、未知与未完成项\n\n- P0完成仓库边界检查；P1完成相关候选发现，但未完成全网系统搜索。P2完成精确元数据，原文许可仅覆盖重点集；Contributors、全部项目平台/中文/资源要求仍UNKNOWN。\n- P3选30重点；P4为文档与Issue样本分析，未达到每项完整功能分类、两例独有流程、具体版本抱怨和90天全量维护的要求。P5暂定评分不能作为精确实测排名。P6无付款证据。P7交付报告与图表。P8独立审查以review为准；P9结论附限制。\n- 连接工具可读GitHub；shell代理proxy:8080连接失败。未访问Reddit/HN/AlternativeTo，不能伪造“全网调查完成”。官网链接不表示已阅读全部官方文档。\n- LibreChat与ente旧地址返回重定向JSON，未取得完整仓库元数据；不纳入精确排名。404候选被纠错或剔除，原响应保留。\n- 90天窗口2026-08-02至2026-10-31，提交样本最多5条，无法推断总提交数或长期维护健康。Release列表未穷尽分页，工具未返回不代表没有Release。\n- Windows 11并不保证每个版本可用；Windows 10最低版本、ESU与Docker/WSL支持须单独核对。未测RAM、GPU、速度、中文、移动浏览器或中国大陆网络。\n- 公司电脑仅有浏览器不等于允许向家庭/云服务器上传；需企业批准，默认只用公开合成数据。自托管不等于离线；Agent工具/模型/嵌入/OCR均可能走云。\n- 许可证文本取得不等于法律意见；必须审查子目录、发行版本、模型和资产。无实际安装/运行/部署、无付费调用、无真实用户触达、无提交或推送。\n'''
write(R/'19_RISKS_AND_LIMITATIONS.md',limitations)
verdict='''# 最终裁决\n\n真正值得先花时间的是：一个任务清单（Super Productivity）、一个个人文件问答入口（AnythingLLM）、一个表格清洗工具（OpenRefine）。需要本地推理再加Ollama；密码管理基础薄弱时KeePassXC收益更直接。已有好用工具就保留，不因Star迁移。\n\n可以减少现有开发计划：成熟模型聊天/文档问答界面、剪辑器、任务清单、数据清洗、同步和备份不宜重写。BOM语义规则、儿童受控教学与现有数字员工授权/状态层仍有定制空间，但要先用小样本证明缺口。\n\n暂不优先：OpenHands/多Agent框架不适合作为非程序员日常待办替代；RAGFlow/多套低代码平台运维较重；Manim不是现成互动教学；Remotion不是无代码视频神器；n8n/Dify/Open WebUI不能默认自由换牌托管；已归档Scratch旧仓库和filebrowser不宜新建长期分叉。\n\n商业优先研究脱敏表格/BOM差异交付，其次合法现有素材的字幕剪辑。均没有客户付款证据，只能称值得验证。不要现在开发通用AI平台或数字员工全家桶。\n\n本轮为可追溯的部分研究交付，不能宣称原请求所有证据要求已完成。\n'''
write(R/'20_FINAL_VERDICT.md',verdict)
sources='# 来源登记\n\n访问日期均2026-10-31；Github文件保留SHA；原始连接工具JSON位于raw，12份用户故障详情见complaints_verified.json。许可证和README为当前默认分支快照，不保证同某Release完全一致。\n\n'
for k,m in meta.items():
 sources+=f"- [{m['full_name']}]({m['html_url']})：元数据；updated_at={m['updated_at']}，pushed_at={m['pushed_at']}。官网 {m.get('homepage') or 'UNKNOWN'}（仅登记）。\n"
for (k,p),v in docs.items():sources+=f"- [{k}/{p}]({v['display_url']})：SHA {v['sha']}；原始文本见documents/extra_documents.json。\n"
write(D/'sources.md',sources)
write(D/'verification_log.md','# 核验日志\n\n'+summary+'\n原仓库HEAD：964c8b719a578d96ef09e9f9475b0ab062da07b3；分支work；初始干净；新目录创建，无覆盖。\n\n命令行git ls-remote失败：Failed to connect to proxy port 8080；改用已连接Github工具，不绕过代理。fetch_file LICENSE部分404，随后尝试LICENSE.md/LICENSE.txt/COPYING。搜索Issue首次参数per_page无效，改用topn成功；未以失败响应补数据。\n\n被剔除的不相关项：oh-my-posh、serverless-dns；Awesome仅发现目录不计软件。失效/重定向尝试：'+', '.join(str(x)for x in sorted(set(fail)) if x)+'。原失败响应见raw。\n')
# HTML只用原创SVG与内联样式，主体完整嵌入全部Markdown
charts=[]
def bar(name,labels,values,unit=''):
 h=55+len(labels)*29; maxv=max(values or [1]) or 1
 s=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 {h}" role="img" aria-label="{html.escape(name)}"><rect width="850" height="{h}" fill="white"/><text x="15" y="24" font-size="18">{html.escape(name)}</text>'
 for i,(lab,v)in enumerate(zip(labels,values)):
  y=45+i*29;s+=f'<text x="12" y="{y+15}" font-size="12">{html.escape(lab[:29])}</text><rect x="230" y="{y}" width="{v/maxv*490}" height="20" fill="#28678b"/><text x="{235+v/maxv*490}" y="{y+15}" font-size="12">{v}{unit}</text>'
 s+='</svg>';n=f'chart-{len(charts)+1:02d}.svg';write(V/'charts'/n,s);charts.append((name,s));return s
bar('九大领域候选数量',[CN[c] for c in CN],[sum(r['category']==c for r in rows)for c in CN])
bar('候选Star前15（非全球榜）',[r['name']for r in rows[:15]],[r['stars']for r in rows[:15]])
sortedsc=sorted([s for s in score_rows if isinstance(s['total'],int)],key=lambda s:-s['total'])
bar('适配性暂定分前15（误差±8–12）',[title(s['project'])for s in sortedsc[:15]],[s['total']for s in sortedsc[:15]])
bar('AnythingLLM八维得分（百分比等效图）',dims,[round(a/b*100)for a,b in zip(profiles[top[0].lower()]['scores'],weights)],'%')
maint=[]
for k in top:
 cs=commits.get(k.lower(),[]);maint.append(sum(str(c.get('created_at',''))>='2026-08-02' for c in cs))
bar('最近90天内取得的提交样本数（最多5，非全量）',[title(k)for k in top],maint)
# 比较矩阵用实际研究文字，不凭空填yes/no
matrix=mdtable(['项目','功能','Win11/Win10设备及部署判断','费用/风险'],[(title(k),profiles[k.lower()]['desc'],profiles[k.lower()]['device'],profiles[k.lower()]['risk'])for k in top])
write(V/'assets'/'SOURCES_AND_LICENSES.md','# 素材与许可\n\n所有SVG为研究数据原创，无第三方Logo/截图，无虚构UI。图表数据来自data/*.csv及提交样本，采集2026-10-31。报告原创排版；所引第三方README/Issue/许可原文权利仍属于原作者，仅作注明来源研究引用。\n')
def mdhtml(s):
 out=[];table=False;ul=False
 for line in s.splitlines():
  e=html.escape(line)
  e=re.sub(r'\[([^\]]+)\]\((https?://[^ )]+)\)',r'<a href="\2">\1</a>',e)
  e=re.sub(r'\*\*([^*]+)\*\*',r'<strong>\1</strong>',e)
  if line.startswith('|'):
   if re.match(r'^\|[\s:|\-]+$',line):continue
   if not table:out.append('<div class="scroll"><table>');table=True
   out.append('<tr>'+''.join('<td>'+x.strip()+'</td>'for x in e.strip('|').split('|'))+'</tr>');continue
  if table:out.append('</table></div>');table=False
  if line.startswith('#'):n=len(line)-len(line.lstrip('#'));out.append(f'<h{min(n+1,6)}>'+e.lstrip('#').strip()+f'</h{min(n+1,6)}>')
  elif line.strip():out.append('<p>'+e+'</p>')
 if table:out.append('</table></div>')
 return '\n'.join(out)
css='''body{font-family:"Noto Sans CJK SC","Microsoft YaHei",sans-serif;color:#183443;background:#fff;line-height:1.75;margin:auto;max-width:1120px;padding:24px}h1,h2,h3{line-height:1.3;color:#174c69}section{margin:35px 0;border-top:1px solid #c7d6df;padding-top:20px}svg{width:100%;height:auto}table{border-collapse:collapse;width:100%;font-size:13px}td{border:1px solid #c6d5df;padding:8px;vertical-align:top}tr:first-child{background:#eaf1f6;font-weight:bold}.scroll{overflow-x:auto}a{color:#116394;word-break:break-all}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:15px}.card{border:1px solid #b8cedb;border-radius:8px;padding:16px}nav a{display:inline-block;margin:5px}p{overflow-wrap:anywhere}@page{size:A4;margin:15mm}@media print{body{padding:0;max-width:none;font-size:10pt}nav{display:none}section{break-before:page}svg,.card,tr{break-inside:avoid}.scroll{overflow:visible}table{font-size:8pt}h2,h3,h4{break-after:avoid}a{color:inherit;text-decoration:none}}'''
body='<h1>2026 开源软件全景与个人适配研究</h1><p>2026-10-31 · 文档研究 · 未运行候选软件 · 部分证据未完成</p>'+mdhtml(summary)
body+='<nav>'+''.join(f'<a href="#r{i}">{f.stem}</a>'for i,f in enumerate(sorted(R.glob('*.md'))))+'</nav>'
for n,s in charts:body+='<section><h2>'+n+'</h2>'+s+'</section>'
body+='<section><h2>功能覆盖 / Windows适配 / 成本与部署难度对照</h2><p>三项矩阵合并阅读；文字判断不是资源实测。UNKNOWN保持未知，Windows 10最低版本未全面核验。</p>'+mdhtml(matrix)+'</section>'
body+='<section><h2>直接使用 / 组合 / 二次开发决策</h2><div class="cards"><div class="card">现有成品已解决问题 → 直接使用 → 不新建同类工具</div><div class="card">只有数据或接口缺口 → 配置/导入导出/外接脚本 → 小组合</div><div class="card">业务规则独有且价值已证实 → 定制BOM规则或教学流程 → 保留可维护边界</div><div class="card">许可、数据、硬件门禁不通过 → 停止 → 保留成熟替代</div></div></section>'
body+='<section><h2>Top10推荐卡片</h2><div class="cards">'+''.join('<div class="card"><h3>'+title(k)+'</h3><p>'+html.escape(profiles[k.lower()]['desc'])+'</p><p>Star '+str(stars(k))+' · 2026-10-31</p><p>'+html.escape(profiles[k.lower()]['risk'])+'</p></div>'for k in top)+'</div></section>'
body+='<section><h2>Top5路线图</h2>'+mdhtml(actions)+'</section>'
for i,f in enumerate(sorted(R.glob('*.md'))):body+=f'<section id="r{i}">'+mdhtml(f.read_text())+'</section>'
write(V/'OPEN_SOURCE_VISUAL_REPORT.html','<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>2026开源软件研究</title><style>'+css+'</style><main>'+body+'</main></html>')
write(B/'FINAL_SUMMARY.md','# 最终摘要\n\n'+summary+'\n'+verdict+'\n'+limitations)
files=sorted(R.glob('*.md'))
write(B/'README.md','# 2026开源软件研究\n\n'+summary+'\n## 阅读入口\n\n- [最终摘要](FINAL_SUMMARY.md)\n- [完整图文HTML](visual/OPEN_SOURCE_VISUAL_REPORT.html)（主体完全内嵌，离线可读，A4打印）\n- [独立审查](review/INDEPENDENT_REVIEW.md)\n- [最终验收](review/FINAL_ACCEPTANCE.md)\n- [范围](RESEARCH_SCOPE.md) / [方法](RESEARCH_METHOD.md) / [数据CSV](data/github_projects.csv) / [证据登记](data/sources.md)\n\n## 报告目录\n\n'+''.join(f'- [{p.stem}](reports/{p.name})\n'for p in files)+'\n## 再生成\n\n仅运行自写报告脚本 `python scripts/build.py`，不联网、不运行候选软件；读取已有JSON生成CSV/Markdown/SVG/HTML。PDF自动生成受阻：现有Chromium无法创建默认用户目录；指定/tmp目录后又因crashpad setsockopt权限错误退出。未安装依赖，也未伪造PDF。HTML已有A4样式，可在浏览器打印→保存为PDF。日志见data/pdf_generation.log。\n')
write(D/'statistics.json',json.dumps({'candidates':count,'metadata_verified':count,'deep_profiles':30,'deep_fully_verified':0,'high_stars_10000':high,'high_stars_100000':huge,'license_files_verified':lic,'issue_sample_projects':sum(bool(x)for x in issues.values()),'community_complaints_verified_projects':len(verified_complaints),'unresolved_identity':['LibreChat','ente'],'research_date':'2026-10-31'},ensure_ascii=False,indent=2))
print((D/'statistics.json').read_text())
