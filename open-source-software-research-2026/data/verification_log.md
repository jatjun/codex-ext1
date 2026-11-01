# 核验日志

研究基准与采集日期：2026-10-31（UTC，日内快照，不是当日收盘）。候选 92 个，精确元数据核验 92 个；≥1万 Star 82 个，≥10万 Star 12 个；原始许可证文件取得 29 个；另对12项具体用户故障报告取得详情（不代表当前故障率）。30 项重点文档分析（LibreChat受阻），不等于30项完整深度验证。没有安装或运行任何候选软件。

最有收益的顺序是：先用一个任务清单、一个文档问答入口、一个表格清洗工具；再决定是否需要模型运行器和自动化。不要同时部署多个聊天平台、多个工作流平台。

推荐是进一步验证的优先级，不是“全部已证实好用”。GitHub元数据完整度高，功能、Win10精确版本、中文质量、90天全量维护、付款需求证据仍不完整。研究整体须附限制阅读，未达到原请求全部验收条件。

原仓库HEAD：964c8b719a578d96ef09e9f9475b0ab062da07b3；分支work；初始干净；新目录创建，无覆盖。

命令行git ls-remote失败：Failed to connect to proxy port 8080；改用已连接Github工具，不绕过代理。fetch_file LICENSE部分404，随后尝试LICENSE.md/LICENSE.txt/COPYING。搜索Issue首次参数per_page无效，改用topn成功；未以失败响应补数据。

被剔除的不相关项：oh-my-posh、serverless-dns；Awesome仅发现目录不计软件。失效/重定向尝试：Anki/Anki, FujiwaraChoki/MoneyPrinterTurbo, MoneyPrinterTurbo/MoneyPrinterTurbo, danny-avila/LibreChat, danny-avila/librechat, ente-io/ente, learningequality/kolibri-studio, polarsource/polars, thunderbird/thunderbird-web-client。原失败响应见raw。
