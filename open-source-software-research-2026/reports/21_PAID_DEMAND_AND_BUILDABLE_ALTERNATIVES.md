# 付费需求证据与可实现的收费软件用途

核验日期：2026-10-31。此为追加研究，不改变原报告REWORK裁决；未运行候选或触达客户。官网动态价格为访问快照，不是历史价格保证；外币价格不包含税/区域差异。

## 证据分级

A：监管文件中的实际付费人数/营收，能证明特定厂商已收到付费。
B：具名机构案例或用户明确自述购买，存在选择偏差，不等于审计发票。
C：官方定价页，仅证明厂商收费，不能独立证明销量。
以上均不能直接证明中国大陆小企业愿意购买本用户的产品。

## 已取得的公开证据

|领域|证据|强度与限制|来源|
|---|---|---|---|
|Excel合并/清洗|Ablebits收录Markus Pålsson于2023-09-15的自述：试用数周后购买完整版，为合并不同工作表节省时间|B；厂商筛选刊登的购买自述，未见交易凭证；链接的Trustpilot个人页本轮访问受限|https://www.ablebits.com/purchase/customers-say.php |
|文件比较|Draftable在2026-09-21发布Messner Reeves案例，描述其旧比较软件续费困难后更换产品，考虑价格预算与文档管理集成|B；具名商业采购场景，厂商案例非独立审计，未披露合同金额|https://www.draftable.com/case-studies/messner-reeves-boosts-workflow-speed-and-efficiency-with-draftable |
|BOM管理|OpenBOM披露Xponent Power采用其系统，减少Excel/邮件流转问题|B（采用证据）；不能单凭案例确定付费金额或排除优惠|https://www.openbom.com/user-stories/go-anywhere-power-how-xponent-power-uses-openbom-to-build-sustainable-energy-solutions |
|PDF/创作软件|Adobe FY2025年报说明商业专业人士与消费者客户组订阅收入增长由Acrobat推动|A；不能把组别收入全部算作Acrobat，更不能全部算作AI问答|https://www.adobe.com/cc-shared/assets/investor-relations/pdfs/adbe-2025-annual-report.pdf |
|游戏化语言学习|Duolingo 2025年10-K披露截至2025-12-31约1220万付费订阅者，明确不含免费试用及家庭计划非付费成员|A；不证明三年级中文数学或本用户教学产品存在同样需求|https://www.sec.gov/Archives/edgar/data/1562088/000162828026012494/duol-20251231.htm |
|视频剪辑字幕|Descript提供Hobbyist等收费计划；本轮客户案例页面超时，未取得付费人数或营收|C；不可宣称已有独立付款证据|https://www.descript.com/pricing |
|流程自动化|Zapier Professional收费，官网有客户故事目录；未核付费人数/营收或具体客户付款|C；客户故事目录不等于付款证据|https://zapier.com/pricing |

## 收费产品与最小可做用途

|收费产品|核验的价格/模式|本用户可研究实现的子集（能力判断，未开发验证）|开源组件|主要差距|
|---|---|---|---|---|
|Ablebits Ultimate Suite|一次购买使用对应版本，含2年更新；页面币种依结算选择，本轮不写币种不明金额|固定格式Excel清洗、合并、去重、差异报告|OpenRefine、pandas、exceljs|不是70多个功能的完整Excel插件替代；复杂公式/格式/工作簿保真|
|Beyond Compare 5|Standard US$35/用户；Pro US$70/用户|限定CSV/Excel表格差异，按键匹配并导出|pandas及自写界面|不能承诺全部文件/文件夹/三方合并功能| 
|Draftable Compare|非法律用户US$129/用户/年；法律版US$261/用户/年|限定字段/表格差异；PDF特定结构提取后核对|pandas、PDF处理组件|不能承诺法律级Word/PDF排版修订追踪|
|OpenBOM|收费订阅，2026定价模型有调整，本轮不引用不确定金额|两版BOM父子路径、料号、数量、版本差异与异常清单|pandas、Grist可选|不做完整PLM、CAD/ERP集成、审批体系|
|Descript|Hobbyist按年付折合US$16/人/月，月付US$24/人/月|已有素材转录、字幕、基础剪辑与导出|pyVideoTrans、Shotcut、whisper.cpp|不保证文本编辑视频、云协作、生成媒体全功能|
|Zapier|Professional起价US$19.99/月，实际依账期/任务量核算|一个固定的获批表单→表格→提醒流程|n8n（受限源码许可）或自写脚本|不做9000+连接器平台；鉴权、重试、限额维护仍需承担|

价格来源：https://www.scootersoftware.com/shop 、https://www.draftable.com/pricing 、https://www.ablebits.com/purchase/index.php 、https://www.openbom.com/pricing 、https://www.descript.com/pricing 、https://zapier.com/pricing 。

## 建议

最优先研究固定模板Excel清洗/对账，其次BOM差异，再其次已有素材字幕制作。优先做一个文件输入、一个可审查输出，不建完整平台；公司电脑禁安装时，浏览器本地处理可作为目标，但文件解析是否外传必须另核，联网依赖也须区分。

为自己使用与对外出售是不同门槛。成熟商业工具若已便宜且解决问题，购买可能比自行维护划算。对外价值可能来自行业规则、数据迁移、保密边界、结果复核、支持与交付，不能只凭功能相似或价格更低。

以AI协助做出原型合理，但长期商业化需要准确性测试、更新和售后。不要现阶段做完整Acrobat、Duolingo、Zapier或PLM。BOM精确比较先用确定性规则，AI仅辅助解释，不作为唯一差异判断器。

未取得本用户目标客户实际付款、预算或报价接受证据，不给出预期收入或转化率。
