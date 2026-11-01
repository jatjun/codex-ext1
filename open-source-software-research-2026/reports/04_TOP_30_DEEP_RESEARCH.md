# 30项重点文档分析

目录：ollama · anything-llm · super-productivity · OpenRefine · keepassxc · joplin · syncthing · shotcut · restic · grist-core · hermes-agent · OpenHands · opencode · n8n · dify · langflow · llama.cpp · open-webui · librechat · ragflow · kolibri · scratch-gui · manim · sherpa-onnx · vikunja · remotion · pyvideotrans · Stirling-PDF · paperless-ngx · pandas

证据层级：官方README只确认“官方声称提供”；Issue确认“有人报告”，不确认普遍故障；无本地运行测试。每个案例均为拟议流程。

## ollama

本地模型运行器，省去手动编译推理引擎。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/ollama/ollama；官网：https://ollama.com；Star：185426（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/ollama/ollama/blob/main/README.md)，文件SHA `6ccf0acbeff491cfffdd6fc972109801fd68fe36`。摘录仅表明文档陈述：

> Start building with open models. Access the latest releases locally or in the cloud with complete privacy.

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 脱敏合同离线摘要 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 语文课文提问草稿 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

Win11 原生；模型下载后可本地推理；16GB 显存优先小模型量化；Win10 老 CPU 不宜重推理。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/ollama/ollama/blob/main/LICENSE)（SHA `8e3dc978a7ca8c53f56bbedc5b558116140fc02e`）；不是仅依据GitHub许可证标签。 云模型另收费且需联网；模型许可独立；不能保证大模型全装入显存。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [pull model manifest: 500](https://github.com/ollama/ollama/issues/8873)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [AMD GPU & ROCm support](https://github.com/ollama/ollama/issues/738)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Add support for older AMD GPU gfx803, gfx802, gfx805 (e.g. Radeon RX 580, FirePro W7100)](https://github.com/ollama/ollama/issues/2453)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。云模型另收费且需联网；模型许可独立；不能保证大模型全装入显存。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 22/25 | 脱敏合同离线摘要直接对应需求 |
| 易用性 | 12/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 11/12 | Win11 原生；模型下载后可本地推理；16GB 显存优先小模型量化；Win10 老 CPU 不宜重推理 |
| 维护稳定 | 9/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 8/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 8/10 | API/存储/电费另计 |
| 隐私安全 | 7/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 6/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 83；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## anything-llm

面向个人的文档问答桌面/服务端工作台。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/mintplex-labs/anything-llm；官网：https://anythingllm.com；Star：67783（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/Mintplex-Labs/anything-llm/blob/master/README.md)，文件SHA `dfdcb624265b0f37627c366c1af2eda6b705d393`。摘录仅表明文档陈述：

> Chat with your docs, use AI Agents, hyper-configurable, multi-user, & no frustrating setup required.

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 脱敏BOM历史检索 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 家庭PDF资料问答 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

Windows 桌面入口降低门槛；服务端浏览器需另维护；手机访问需常在线主机。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/Mintplex-Labs/anything-llm/blob/master/LICENSE)（SHA `cc42d1d080250fb38c47b81ed8f9fb1d64dc2965`）；不是仅依据GitHub许可证标签。 引用仍需人工核对；扫描PDF、复杂Excel结构不保证准确。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [[CHORE]: Openssl version prevents the creation of workspaces](https://github.com/Mintplex-Labs/anything-llm/issues/898)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- ["QNN Engine is offline." when using a Snapdragon X/NPU](https://github.com/Mintplex-Labs/anything-llm/issues/2962)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [ 115 Illegal instruction Container exit - Solution in thread](https://github.com/Mintplex-Labs/anything-llm/issues/1331)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。引用仍需人工核对；扫描PDF、复杂Excel结构不保证准确。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 23/25 | 脱敏BOM历史检索直接对应需求 |
| 易用性 | 12/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 10/12 | Windows 桌面入口降低门槛；服务端浏览器需另维护；手机访问需常在线主机 |
| 维护稳定 | 8/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 8/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 8/10 | API/存储/电费另计 |
| 隐私安全 | 7/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 6/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 82；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## super-productivity

任务清单、专注计时和工作记录。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/super-productivity/super-productivity；官网：http://super-productivity.com?ref=github；Star：23295（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/super-productivity/super-productivity/blob/master/README.md)，文件SHA `97ffb7fb60b2f6faa65d75e35a19ac91ac3e921b`。摘录仅表明文档陈述：

> A to-do list, time tracker and daily planner for focused personal work. Private, offline-first and open source.

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 待回复事项清单 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 每周任务复盘 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

桌面与Web使用；无需GPU；低配机优先轻量清单。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/super-productivity/super-productivity/blob/master/LICENSE)（SHA `4ebcbdf9291d5317433929f0afb4c411513381cd`）；不是仅依据GitHub许可证标签。 不是全自动邮件助手；提醒依赖应用在线和权限。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [Sync stabilization: work queue and session handoff (tracker)](https://github.com/super-productivity/super-productivity/issues/10393)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [[Feature] Flatpak package](https://github.com/super-productivity/super-productivity/issues/25)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Consider adding Trello Integration](https://github.com/super-productivity/super-productivity/issues/293)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。不是全自动邮件助手；提醒依赖应用在线和权限。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 22/25 | 待回复事项清单直接对应需求 |
| 易用性 | 13/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 11/12 | 桌面与Web使用；无需GPU；低配机优先轻量清单 |
| 维护稳定 | 9/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 7/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 9/10 | API/存储/电费另计 |
| 隐私安全 | 7/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 5/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 83；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## OpenRefine

通过浏览器交互清洗表格数据。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/openrefine/openrefine；官网：https://openrefine.org/；Star：12085（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/OpenRefine/OpenRefine/blob/master/README.md)，文件SHA `455fc978442a7065ffcccd5aa0d167b839ac40c9`。摘录仅表明文档陈述：

> OpenRefine is a Java-based power tool that allows you to load data, understand it,

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. BOM料号规范化 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 供应商名称去重 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

本地Java服务加浏览器；CPU即可；8GB需控制文件规模。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/OpenRefine/OpenRefine/blob/master/LICENSE.txt)（SHA `d126f8ae6d7bad4f5240cd1d92171f4d174e3deb`）；不是仅依据GitHub许可证标签。 公司禁安装仍需批准的内网主机；不能自动理解BOM层级语义。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [Enhancement : Add fields for projects metadata](https://github.com/OpenRefine/OpenRefine/issues/1221)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Nothing is on the Web Page](https://github.com/OpenRefine/OpenRefine/issues/1717)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [OpenRefine on Spark ](https://github.com/OpenRefine/OpenRefine/issues/1433)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。公司禁安装仍需批准的内网主机；不能自动理解BOM层级语义。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 23/25 | BOM料号规范化直接对应需求 |
| 易用性 | 11/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 10/12 | 本地Java服务加浏览器；CPU即可；8GB需控制文件规模 |
| 维护稳定 | 9/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 7/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 9/10 | API/存储/电费另计 |
| 隐私安全 | 7/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 6/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 82；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## keepassxc

本地加密密码数据库。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/keepassxreboot/keepassxc；官网：https://keepassxc.org/；Star：29634（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/keepassxreboot/keepassxc/blob/develop/README.md)，文件SHA `f7af472f508fd9ddfa4693610a9a14e171e8c237`。摘录仅表明文档陈述：

> The [QuickStart Guide](https://keepassxc.org/docs/KeePassXC_GettingStarted.html) gets you started using KeePassXC on your Windows, macOS, or Linux computer using pre-compiled binaries from the [downloads page](https://keepassxc.org/download). Additionally, individual Linux distributions may ship their own versions, so please check your distribution

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 个人账号整理 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 应急恢复资料记录 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

Windows桌面，无GPU；离线可用；iOS需独立兼容客户端。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/keepassxreboot/keepassxc/blob/develop/COPYING)（SHA `a00aaf28c357bc0b9319103c02d3fee891d2c673`）；不是仅依据GitHub许可证标签。 不能把数据库和唯一密钥放同处；移动端并非官方同一客户端。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [Passkeys not working on certain sites](https://github.com/keepassxreboot/keepassxc/issues/10374)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Add Nitrokey Pro and PKCS#11 support](https://github.com/keepassxreboot/keepassxc/issues/255)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Support Auto-Type on Wayland](https://github.com/keepassxreboot/keepassxc/issues/2281)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。不能把数据库和唯一密钥放同处；移动端并非官方同一客户端。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 19/25 | 个人账号整理直接对应需求 |
| 易用性 | 12/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 11/12 | Windows桌面，无GPU；离线可用；iOS需独立兼容客户端 |
| 维护稳定 | 10/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 8/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 9/10 | API/存储/电费另计 |
| 隐私安全 | 7/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 5/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 81；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## joplin

笔记、附件和待办管理。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/laurent22/joplin；官网：https://joplinapp.org；Star：56954（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/laurent22/joplin/blob/dev/README.md)，文件SHA `6f9f342fa1f579f868cc40ae6ddb31bb2d94e2d4`。摘录仅表明文档陈述：

> **Joplin** is a free, open source note taking and to-do application, which can handle a large number of notes organised into notebooks. The notes are searchable, can be copied, tagged and modified either from the applications directly or from your own text editor. The notes are in [Markdown format](https://github.com/laurent22/joplin/blob/dev/readm

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 项目研究笔记 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 会议待回复记录 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

Windows/iOS应用；同步服务可选；无GPU。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/laurent22/joplin/blob/dev/LICENSE)（SHA `2bb93544540be10fcd06928d0064daa29caab7dd`）；不是仅依据GitHub许可证标签。 手机不是纯浏览器方案；付费云同步与软件免费分开。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [Android filesystem sync is broken after 2.6.3 update](https://github.com/laurent22/joplin/issues/5779)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Desktop: Joplin Freezing During Syncing and Decrypting On Linux Kernel 5.5+](https://github.com/laurent22/joplin/issues/2518)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [F-Droid](https://github.com/laurent22/joplin/issues/15)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。手机不是纯浏览器方案；付费云同步与软件免费分开。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 21/25 | 项目研究笔记直接对应需求 |
| 易用性 | 12/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 11/12 | Windows/iOS应用；同步服务可选；无GPU |
| 维护稳定 | 9/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 8/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 8/10 | API/存储/电费另计 |
| 隐私安全 | 7/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 5/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 81；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## syncthing

设备间文件同步。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/syncthing/syncthing；官网：https://syncthing.net/；Star：89925（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/syncthing/syncthing/blob/main/README.md)，文件SHA `3167b1b4d3a85927d7dc4cd6d1fb98e22cd12a66`。摘录仅表明文档陈述：

> Syncthing is a **continuous file synchronization program**. It synchronizes

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 研究目录同步 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 家庭文件分发 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

CPU运行；两端需在线才能直接同步；Windows版本要求再核对。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/syncthing/syncthing/blob/main/LICENSE)（SHA `d0a1fa1482eea82e19510e7920cbe3a03e41f691`）；不是仅依据GitHub许可证标签。 同步不是备份；误删也会同步；iOS支持需另选方案。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [Support for file encryption (e.g. non-trusted servers)](https://github.com/syncthing/syncthing/issues/109)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Use decentralized discovery (DHT)](https://github.com/syncthing/syncthing/issues/3388)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Inotify support](https://github.com/syncthing/syncthing/issues/9)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。同步不是备份；误删也会同步；iOS支持需另选方案。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 21/25 | 研究目录同步直接对应需求 |
| 易用性 | 11/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 9/12 | CPU运行；两端需在线才能直接同步；Windows版本要求再核对 |
| 维护稳定 | 9/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 8/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 9/10 | API/存储/电费另计 |
| 隐私安全 | 7/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 5/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 79；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## shotcut

传统非线性视频剪辑器。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/mltframework/shotcut；官网：https://www.shotcut.org；Star：15545（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/mltframework/shotcut/blob/master/README.md)，文件SHA `6b878f53252d686ea72b3bb5969af8bc44c19b8e`。摘录仅表明文档陈述：

> # Shotcut - a free, open source, cross-platform **video editor**

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 商家产品短片 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 儿童演示视频剪辑 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

Windows桌面；Win11优先；老机用代理素材；无手机编辑承诺。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/mltframework/shotcut/blob/master/COPYING)（SHA `94a9ed024d3859793618152ea559a168bbcbb5e2`）；不是仅依据GitHub许可证标签。 不是AI生成视频；素材版权另核；导出耗时未知。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [Error stabilizing the video int the version 19.06](https://github.com/mltframework/shotcut/issues/754)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Crackling audio during loud parts (race car)](https://github.com/mltframework/shotcut/issues/259)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [debian packages](https://github.com/mltframework/shotcut/issues/26)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。不是AI生成视频；素材版权另核；导出耗时未知。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 21/25 | 商家产品短片直接对应需求 |
| 易用性 | 12/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 10/12 | Windows桌面；Win11优先；老机用代理素材；无手机编辑承诺 |
| 维护稳定 | 9/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 8/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 9/10 | API/存储/电费另计 |
| 隐私安全 | 7/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 5/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 81；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## restic

加密、去重、可恢复的备份程序。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/restic/restic；官网：https://restic.net；Star：36898（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/restic/restic/blob/master/README.md)，文件SHA `578b865b57456b07ac0a08b6e8896375a0a51d24`。摘录仅表明文档陈述：

> restic is a backup program that is fast, efficient and secure. It supports the three major operating systems (Linux, macOS, Windows) and a few smaller ones (FreeBSD, OpenBSD).

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 研究文件版本备份 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 小企业获批目录备份 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

CPU/命令行；老机可调度但需在线；存储容量另算。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/restic/restic/blob/master/LICENSE)（SHA `29b2ee55a92ff2c5516d7b916224c85fa7e9139a`）；不是仅依据GitHub许可证标签。 非程序员需协助设置与恢复演练；丢密钥不可恢复。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [Implement Compression](https://github.com/restic/restic/issues/21)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Restic 0.10.0 always reports all directories "changed", adds duplicate metadata, when run on ZFS snapshots](https://github.com/restic/restic/issues/3041)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Allow "pulling" backups from remote servers](https://github.com/restic/restic/issues/299)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。非程序员需协助设置与恢复演练；丢密钥不可恢复。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 22/25 | 研究文件版本备份直接对应需求 |
| 易用性 | 8/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 10/12 | CPU/命令行；老机可调度但需在线；存储容量另算 |
| 维护稳定 | 10/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 8/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 9/10 | API/存储/电费另计 |
| 隐私安全 | 7/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 6/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 80；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## grist-core

带关系数据与公式的协作表格。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/gristlabs/grist-core；官网：https://www.getgrist.com；Star：12029（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/gristlabs/grist-core/blob/main/README.md)，文件SHA `ad775b46e2eb4fcb597aca97d9520b4318c699fc`。摘录仅表明文档陈述：

> Grist is a modern relational spreadsheet. It combines the flexibility of a spreadsheet with the robustness of a database.

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 结构化BOM台账 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 报价追踪 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

浏览器访问批准服务器；自托管维护中等；无需GPU。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/gristlabs/grist-core/blob/main/LICENSE.txt)（SHA `40b8ed334bd7578cea0e8e660d4fe914ee115866`）；不是仅依据GitHub许可证标签。 不是复杂Excel无损替代；权限、备份、公式沙箱需验证。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [Reference data of another Grist document](https://github.com/gristlabs/grist-core/issues/416)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Better support for self-hosting login solution](https://github.com/gristlabs/grist-core/issues/44)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Support for HTTP Basic Auth](https://github.com/gristlabs/grist-core/issues/160)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。不是复杂Excel无损替代；权限、备份、公式沙箱需验证。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 23/25 | 结构化BOM台账直接对应需求 |
| 易用性 | 10/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 9/12 | 浏览器访问批准服务器；自托管维护中等；无需GPU |
| 维护稳定 | 8/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 8/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 8/10 | API/存储/电费另计 |
| 隐私安全 | 6/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 7/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 79；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## hermes-agent

具有记忆、工具和计划任务的个人Agent。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/nousresearch/hermes-agent；官网：https://hermes-agent.nousresearch.com；Star：259007（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/NousResearch/hermes-agent/blob/main/README.md)，文件SHA `1f5cfb9b49f78a09f94c04e12b38fec478dcc722`。摘录仅表明文档陈述：

> **The self-improving AI agent built by [Nous Research](https://nousresearch.com).** It's the only agent with a built-in learning loop — it creates skills from experience, improves them during use, nudges itself to persist knowledge, searches its own past conversations, and builds a deepening model of who you are across sessions. Run it on a $5 VPS,

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 只读资料研究 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 个人每日任务摘要 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

README现已宣称原生Windows支持，也可WSL；本地执行不强制Docker；模型端另选。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/NousResearch/hermes-agent/blob/main/LICENSE)（SHA `75410e73319c72cd3e991a501c5455eb78f38375`）；不是仅依据GitHub许可证标签。 网关与升级仍需核验；终端权限大；记忆和第三方工具可能外传数据。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [Tracking: one gateway owns every local session (#106742) — post-merge fixes](https://github.com/NousResearch/hermes-agent/issues/134889)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [[skills-index-watchdog] Skills index is stale or degraded (degraded)](https://github.com/NousResearch/hermes-agent/issues/66616)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Automated Nous integration is blocked](https://github.com/NousResearch/hermes-agent/issues/88584)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。网关与升级仍需核验；终端权限大；记忆和第三方工具可能外传数据。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 23/25 | 只读资料研究直接对应需求 |
| 易用性 | 8/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 9/12 | README现已宣称原生Windows支持，也可WSL；本地执行不强制Docker；模型端另选 |
| 维护稳定 | 6/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 7/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 6/10 | API/存储/电费另计 |
| 隐私安全 | 4/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 7/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 70；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## OpenHands

在隔离开发环境执行代码任务的Agent。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/openhands/openhands；官网：https://openhands.dev；Star：92321（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/OpenHands/OpenHands/blob/main/README.md)，文件SHA `d2c59eb5c77b9afed050b5a2e28b79317f7fab18`。摘录仅表明文档陈述：

> The self-hosted developer control center for coding agents and automations.

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 隔离分支修复 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 生成小工具草稿 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

浏览器交互；运行时隔离和后端维护较重；Win11更合适。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/OpenHands/OpenHands/blob/main/LICENSE)（SHA `f6f60f52368bcc96f82fbe59ec65049c2c3af9db`）；不是仅依据GitHub许可证标签。 不替代审查；模型费用和容器运维；不适合作为老笔记本常驻入口。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [[Bug]: detect ports automatically instead of always using 3001](https://github.com/OpenHands/OpenHands/issues/17546)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Nightly Integration Tests Runs](https://github.com/OpenHands/OpenHands/issues/5318)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [[Bug]: SWE-bench reset_swe_env.py timeout](https://github.com/OpenHands/OpenHands/issues/2140)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。不替代审查；模型费用和容器运维；不适合作为老笔记本常驻入口。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 18/25 | 隔离分支修复直接对应需求 |
| 易用性 | 7/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 7/12 | 浏览器交互；运行时隔离和后端维护较重；Win11更合适 |
| 维护稳定 | 6/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 8/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 5/10 | API/存储/电费另计 |
| 隐私安全 | 4/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 7/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 62；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## opencode

终端里的AI编程助手。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/anomalyco/opencode；官网：https://opencode.ai；Star：223429（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/anomalyco/opencode/blob/dev/README.md)，文件SHA `60adea0e397cd675f01b1cf5f6dac9550ef5b377`。摘录仅表明文档陈述：

> brew install anomalyco/tap/opencode-v2 # macOS and Linux (recommended, always up to date)

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 改报告脚本 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 阅读代码并解释 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

开发者工作流；Windows路径及工具依赖按版本验证。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/anomalyco/opencode/blob/dev/LICENSE)（SHA `6439474beed8e0271df9862eff97ffd70ec2464c`）；不是仅依据GitHub许可证标签。 不是手机任务管理；模型服务可收费；命令执行需限权。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [Broken Claude Max](https://github.com/anomalyco/opencode/issues/7410)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Copilot auth now sets far too many requests as "user" consuming premium requests rapidly](https://github.com/anomalyco/opencode/issues/8030)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Windows Support](https://github.com/anomalyco/opencode/issues/631)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。不是手机任务管理；模型服务可收费；命令执行需限权。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 20/25 | 改报告脚本直接对应需求 |
| 易用性 | 9/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 9/12 | 开发者工作流；Windows路径及工具依赖按版本验证 |
| 维护稳定 | 7/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 8/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 6/10 | API/存储/电费另计 |
| 隐私安全 | 5/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 7/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 71；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## n8n

把多个服务连接起来的可视化自动化。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/n8n-io/n8n；官网：https://n8n.io；Star：209181（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/n8n-io/n8n/blob/master/README.md)，文件SHA `567d03f771487fd0be47cb5ac764d359cb281d2a`。摘录仅表明文档陈述：

> Fair-code platform to build and deploy AI agents and workflows. Combine a visual canvas with custom code, run it self-hosted or in the [cloud](https://app.n8n.cloud/login), and connect to 1500+ integrations. AI automation you can trust with real work, from prototype to production.

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 个人到期提醒 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 获批表格到摘要流程 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

浏览器编辑；自托管需Node或容器运维；CPU即可。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/n8n-io/n8n/blob/master/LICENSE.md)（SHA `f85f59baa906530c26cee26e0c9ddd6bd5f86dbd`）；不是仅依据GitHub许可证标签。 Sustainable Use许可限制；邮件写入和发送需单独授权；云集成不离线。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [Out of Memory when using "Extract from File" node with "Extract From PDF"](https://github.com/n8n-io/n8n/issues/19359)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [n8n is not open source and your project is gaslighting its users](https://github.com/n8n-io/n8n/issues/40)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Cannot read properties of null (reading 'length')](https://github.com/n8n-io/n8n/issues/17522)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。Sustainable Use许可限制；邮件写入和发送需单独授权；云集成不离线。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 22/25 | 个人到期提醒直接对应需求 |
| 易用性 | 9/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 8/12 | 浏览器编辑；自托管需Node或容器运维；CPU即可 |
| 维护稳定 | 7/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 8/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 6/10 | API/存储/电费另计 |
| 隐私安全 | 5/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 7/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 72；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## dify

构建模型应用、知识库和工作流的平台。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/langgenius/dify；官网：https://dify.ai；Star：160065（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/langgenius/dify/blob/main/README.md)，文件SHA `e8572f93797ee113302a7c2e29be02ea31153119`。摘录仅表明文档陈述：

> Dify is an open-source LLM app development platform. Its intuitive interface combines AI workflow, RAG pipeline, agent capabilities, model management, observability features (including [Opik](https://www.comet.com/docs/opik/integrations/dify), [Langfuse](https://docs.langfuse.com), and [Arize Phoenix](https://docs.arize.com/phoenix)) and more, lett

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 企业获批知识问答 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 受控题目生成 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

浏览器；多服务部署维护较重；Win11可评估Docker/WSL。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/langgenius/dify/blob/main/LICENSE)（SHA `329ee302875f292fdd11e12e830562d0be9ade1c`）；不是仅依据GitHub许可证标签。 多租户和前端品牌有附加条件；不是儿童教学成品。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [Knowledge created in versions prior to 1.9.1 is not usable after upgrading to 1.9.2](https://github.com/langgenius/dify/issues/27291)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [After local deployment of Dify and Langfuse, following the documentation configuration, Langfuse only records Dify's inputs and outputs but does not log internal nodes. My Dify version is 1.13.0. How can I resolve this?](https://github.com/langgenius/dify/issues/36099)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Can Microsoft's Graph RAG be added to the new version?](https://github.com/langgenius/dify/issues/6019)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。多租户和前端品牌有附加条件；不是儿童教学成品。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 22/25 | 企业获批知识问答直接对应需求 |
| 易用性 | 9/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 7/12 | 浏览器；多服务部署维护较重；Win11可评估Docker/WSL |
| 维护稳定 | 6/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 8/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 6/10 | API/存储/电费另计 |
| 隐私安全 | 5/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 6/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 69；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## langflow

可视化组装模型与工具链的开发工具。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/langflow-ai/langflow；官网：http://www.langflow.org；Star：156184（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/langflow-ai/langflow/blob/main/README.md)，文件SHA `1e9c7ce08a9e61c6f4e796366c695be81c47d7eb`。摘录仅表明文档陈述：

> - **Visual builder interface** to quickly get started and iterate.

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. RAG原型 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 验证模型调用流程 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

浏览器界面，Python依赖；适合原型，不宜直接公开编辑入口。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/langflow-ai/langflow/blob/main/LICENSE)（SHA `ee3d6be71bdd1b5e4cc5b85da4a4aabc7bfe3347`）；不是仅依据GitHub许可证标签。 理解模型链仍需技术；生产认证与升级需另审。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [Add SSO to Langflow](https://github.com/langflow-ai/langflow/issues/8374)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Hi All any one can tell me how  i can build sql db agent with langflow thanks](https://github.com/langflow-ai/langflow/issues/5494)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Upload file API](https://github.com/langflow-ai/langflow/issues/5445)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。理解模型链仍需技术；生产认证与升级需另审。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 18/25 | RAG原型直接对应需求 |
| 易用性 | 8/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 8/12 | 浏览器界面，Python依赖；适合原型，不宜直接公开编辑入口 |
| 维护稳定 | 7/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 8/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 7/10 | API/存储/电费另计 |
| 隐私安全 | 5/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 7/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 68；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## llama.cpp

可精细控制量化模型推理的底层工具。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/ggml-org/llama.cpp；官网：https://llama.app；Star：132934（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/ggml-org/llama.cpp/blob/master/README.md)，文件SHA `ff7221db733db148cc739bbc5697a58d4c98820d`。摘录仅表明文档陈述：

> - Run with Docker - see our [Docker documentation](docs/docker.md)

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 离线模型基准设计 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 小型专用推理服务 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

Windows CPU/CUDA可选；需命令参数和模型格式知识。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/ggml-org/llama.cpp/blob/master/LICENSE)（SHA `e7dca554bcb802f98408383a864404e3aa4eacca`）；不是仅依据GitHub许可证标签。 比Ollama维护难；不是完整知识库或Agent。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [llama : add Falcon LLM support](https://github.com/ggml-org/llama.cpp/issues/1602)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Feature Request: support qwen3-vl series](https://github.com/ggml-org/llama.cpp/issues/16207)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Llama3 GGUF conversion with merged LORA Adapter seems to lose training data randomly](https://github.com/ggml-org/llama.cpp/issues/7062)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。比Ollama维护难；不是完整知识库或Agent。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 19/25 | 离线模型基准设计直接对应需求 |
| 易用性 | 7/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 10/12 | Windows CPU/CUDA可选；需命令参数和模型格式知识 |
| 维护稳定 | 8/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 9/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 9/10 | API/存储/电费另计 |
| 隐私安全 | 7/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 7/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 76；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## open-webui

本地或远程模型的浏览器聊天前端。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/open-webui/open-webui；官网：https://openwebui.com；Star：157341（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/open-webui/open-webui/blob/main/README.md)，文件SHA `17b816309d96440f773a77877776dc73b7161de0`。摘录仅表明文档陈述：

> Open WebUI is **a home for AI**, a self-hosted AI platform that's **[extensible](https://docs.openwebui.com/features/extensibility/plugin/)**, **[feature-rich](https://docs.openwebui.com/features/)**, user-friendly, and built to run **[entirely offline](https://openwebui.com/sovereign-ai)**. With support for **Ollama** and **OpenAI-compatible APIs*

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 家庭多模型对话 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 获批文件问答 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

浏览器和移动浏览器入口；后端主机需在线；容器是选项。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/open-webui/open-webui/blob/main/LICENSE)（SHA `99f39e7feff29c93342877adad2d5c15e707444c`）；不是仅依据GitHub许可证标签。 品牌条款；工具、网页检索、外部模型可外传数据。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [500: Internal Error](https://github.com/open-webui/open-webui/issues/10887)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [infra: Network Problem 0.5+](https://github.com/open-webui/open-webui/issues/8074)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [enh: analytics](https://github.com/open-webui/open-webui/issues/21675)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。品牌条款；工具、网页检索、外部模型可外传数据。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 23/25 | 家庭多模型对话直接对应需求 |
| 易用性 | 11/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 9/12 | 浏览器和移动浏览器入口；后端主机需在线；容器是选项 |
| 维护稳定 | 7/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 8/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 7/10 | API/存储/电费另计 |
| 隐私安全 | 6/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 6/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 77；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## librechat

多供应商模型的聊天与工具界面。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/danny-avila/librechat；官网：UNKNOWN；Star：UNKNOWN（2026-10-31）。归档：UNKNOWN。

### 功能与证据

README取得受阻；官方功能原文UNKNOWN，不给予确定性推荐。

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 多模型比较 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 团队聊天入口 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

本轮仓库重定向未成功跟随，当前部署要求UNKNOWN。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

原始许可证未成功取得：UNKNOWN，阻断商业再分发判断。 关键原文未取得；禁止给出确定评分与推荐。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

未取得可用Issue样本；不能声称没有问题。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。关键原文未取得；禁止给出确定评分与推荐。

总分UNKNOWN；证据阻断，不纳入排名。

## ragflow

偏重复杂文档解析的RAG系统。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/infiniflow/ragflow；官网：https://ragflow.io；Star：93243（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/infiniflow/ragflow/blob/main/README.md)，文件SHA `9aae9d0a3d07413c998ac9c84928dba87eab8467`。摘录仅表明文档陈述：

> Try our cloud service at [https://cloud.ragflow.io](https://cloud.ragflow.io).

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 扫描PDF检索 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 脱敏文档证据定位 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

服务依赖较多；Win11研究机优先；老机不优先。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/infiniflow/ragflow/blob/main/LICENSE)（SHA `261eeb9e9f8b2b4b0d119366dda99c6fd7d35c64`）；不是仅依据GitHub许可证标签。 高资源与运维门槛；Excel问答不等于确定性BOM比较。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [[Question]: the process](https://github.com/infiniflow/ragflow/issues/6985)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [ROADMAP 2025](https://github.com/infiniflow/ragflow/issues/4214)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [[Question]: Model Ollama cannot connect ](https://github.com/infiniflow/ragflow/issues/333)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。高资源与运维门槛；Excel问答不等于确定性BOM比较。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 22/25 | 扫描PDF检索直接对应需求 |
| 易用性 | 7/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 6/12 | 服务依赖较多；Win11研究机优先；老机不优先 |
| 维护稳定 | 5/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 8/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 6/10 | API/存储/电费另计 |
| 隐私安全 | 5/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 7/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 66；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## kolibri

可离线分发教学内容、练习与学习记录的平台。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/learningequality/kolibri；官网：https://learningequality.org/kolibri/；Star：1163（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/learningequality/kolibri/blob/develop/README.md)，文件SHA `5371f5182b5c47450509e7a58e2ca1f1e5772787`。摘录仅表明文档陈述：

> This repository is for software developers wishing to contribute to Kolibri. If you are looking for help installing, configuring and using Kolibri, please refer to the [User Guide](https://kolibri.readthedocs.io/).

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 家庭离线练习 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 家长查看进度 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

浏览器客户端；主机与内容包需预先准备；无强制GPU。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/learningequality/kolibri/blob/develop/LICENSE)（SHA `6506702f35f36c815395fb668e78dabb6c15ef54`）；不是仅依据GitHub许可证标签。 中文三年级课程适配未核实；不是中文AI虚拟教师。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [Improve router handlers architecture in Coach](https://github.com/learningequality/kolibri/issues/11219)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Device > Channels > Import > The "Task finished" snackbar is never shown](https://github.com/learningequality/kolibri/issues/12965)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [standardize validator functions to all `Object` props ](https://github.com/learningequality/kolibri/issues/8903)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。中文三年级课程适配未核实；不是中文AI虚拟教师。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 20/25 | 家庭离线练习直接对应需求 |
| 易用性 | 10/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 9/12 | 浏览器客户端；主机与内容包需预先准备；无强制GPU |
| 维护稳定 | 8/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 7/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 9/10 | API/存储/电费另计 |
| 隐私安全 | 7/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 5/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 75；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## scratch-gui

Scratch可视化互动编程界面的旧仓库。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/scratchfoundation/scratch-gui；官网：https://scratchfoundation.github.io/scratch-gui/develop/；Star：4808（2026-10-31）。归档：True。

### 功能与证据

官方文档：[README](https://github.com/scratchfoundation/scratch-gui/blob/develop/README.md)，文件SHA `6508851ada7e6ff0fc04c181824033ccbf517e2e`。摘录仅表明文档陈述：

> The Scratch Team has migrated the `scratch-gui` module into a new mono-repo,

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 分数动画 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 英语词卡小游戏 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

浏览器交互思路适合儿童；旧仓库已归档迁移，采用新编辑器前另核。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/scratchfoundation/scratch-gui/blob/develop/LICENSE)（SHA `0ad25db4bd1d86c452db3f9602ccdbe172438f52`）；不是仅依据GitHub许可证标签。 不是完整教学/错题系统；旧源码不应新建生产分叉。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [When I npm install scratch-gui, request to https://downloads.scratch.mit.edu/microbit/scratch-microbit.hex.zip failed](https://github.com/scratchfoundation/scratch-gui/issues/9012)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [npm install error unexpected end of JSON input while parsing  near '..omment:http://open'](https://github.com/scratchfoundation/scratch-gui/issues/4328)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Global custom procedures](https://github.com/scratchfoundation/scratch-gui/issues/4858)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。不是完整教学/错题系统；旧源码不应新建生产分叉。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 20/25 | 分数动画直接对应需求 |
| 易用性 | 10/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 8/12 | 浏览器交互思路适合儿童；旧仓库已归档迁移，采用新编辑器前另核 |
| 维护稳定 | 5/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 5/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 9/10 | API/存储/电费另计 |
| 隐私安全 | 6/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 6/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 69；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## manim

用代码生成数学动画的渲染组件。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/manimcommunity/manim；官网：https://www.manim.community；Star：42045（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/ManimCommunity/manim/blob/main/README.md)，文件SHA `2d272267cd18839334c9768eee28c940512169e5`。摘录仅表明文档陈述：

> Manim is an animation engine for explanatory math videos. It's used to create precise animations programmatically, as demonstrated in the videos of [3Blue1Brown](https://www.3blue1brown.com/).

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 分数变化动画 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 周长面积演示 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

Python和渲染依赖；Windows可研究；不要求4060才能用。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/ManimCommunity/manim/blob/main/LICENSE)（SHA `774f5965700a59c2c7df2d4c234209d1da333c3e`）；不是仅依据GitHub许可证标签。 视频生成不等于交互；非程序员长期改代码负担较高。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [New repository for documentation examples](https://github.com/ManimCommunity/manim/issues/308)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [CONFIG dictionaries stuff ](https://github.com/ManimCommunity/manim/issues/7)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [ManimPango should be a plugin](https://github.com/ManimCommunity/manim/issues/1102)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。视频生成不等于交互；非程序员长期改代码负担较高。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 19/25 | 分数变化动画直接对应需求 |
| 易用性 | 6/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 8/12 | Python和渲染依赖；Windows可研究；不要求4060才能用 |
| 维护稳定 | 7/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 8/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 9/10 | API/存储/电费另计 |
| 隐私安全 | 7/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 6/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 70；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## sherpa-onnx

离线语音识别、合成等工具组件。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/k2-fsa/sherpa-onnx；官网：https://k2-fsa.github.io/sherpa/onnx/index.html；Star：15644（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/k2-fsa/sherpa-onnx/blob/master/README.md)，文件SHA `1164e4573f9026974b275451d73c3b818b7d7c01`。摘录仅表明文档陈述：

> - Pre-built Flutter demo apps: [flutter releases][flutter-releases]

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 中文口头答题输入 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 受控题目朗读 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

多平台CPU推理选项；具体模型和中文质量需实测。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/k2-fsa/sherpa-onnx/blob/master/LICENSE)（SHA `d645695673349e3947e8e5ae42332d0ac3164cd7`）；不是仅依据GitHub许可证标签。 组件不是教学系统；儿童语音准确率UNKNOWN；模型许可独立。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [（rk3568）嵌入式linux-aarch64，交叉编译使用阿里的sensevoice-small](https://github.com/k2-fsa/sherpa-onnx/issues/1430)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Questions related to MeloTTS ](https://github.com/k2-fsa/sherpa-onnx/issues/1193)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [ImportError: ../../../_deps/onnxruntime-src/lib/libonnxruntime_providers_cuda.so: cannot open shared object file: No such file or directory](https://github.com/k2-fsa/sherpa-onnx/issues/1030)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。组件不是教学系统；儿童语音准确率UNKNOWN；模型许可独立。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 20/25 | 中文口头答题输入直接对应需求 |
| 易用性 | 6/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 8/12 | 多平台CPU推理选项；具体模型和中文质量需实测 |
| 维护稳定 | 7/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 8/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 9/10 | API/存储/电费另计 |
| 隐私安全 | 7/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 7/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 72；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## vikunja

浏览器任务与项目管理服务。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/go-vikunja/vikunja；官网：https://vikunja.io；Star：5918（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/go-vikunja/vikunja/blob/main/README.md)，文件SHA `f34912266f33cd9d0328ac16bfcbaf6fb104ee99`。摘录仅表明文档陈述：

> If Vikunja is useful to you, please consider [supporting the project](https://vikunja.io/support/). You can [buy a coffee](https://www.buymeacoffee.com/kolaente), [sponsor on GitHub](https://github.com/sponsors/kolaente) or buy [a sticker pack](https://vikunja.io/stickers).

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 家庭待办共享 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 待回复列表 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

浏览器/手机入口；服务端常在线且需备份；CPU即可。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/go-vikunja/vikunja/blob/main/LICENSE)（SHA `be3f7b28e564e7dd05eaf59d64adba1a4065ac0e`）；不是仅依据GitHub许可证标签。 不自动读取邮件；比单机清单多运维和认证成本。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [Deleted and unassigned user still received "task overdue" emails](https://github.com/go-vikunja/vikunja/issues/1581)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Unable to setup OpenID login](https://github.com/go-vikunja/vikunja/issues/240)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [nginx proxy manager configuration](https://github.com/go-vikunja/vikunja/issues/206)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。不自动读取邮件；比单机清单多运维和认证成本。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 21/25 | 家庭待办共享直接对应需求 |
| 易用性 | 11/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 8/12 | 浏览器/手机入口；服务端常在线且需备份；CPU即可 |
| 维护稳定 | 8/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 7/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 9/10 | API/存储/电费另计 |
| 隐私安全 | 6/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 5/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 75；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## remotion

用React代码和模板渲染视频的框架。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/remotion-dev/remotion；官网：https://remotion.dev；Star：69249（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/remotion-dev/remotion/blob/main/README.md)，文件SHA `fd2e741074e6ea53f62eaf511c0c1a030c264b78`。摘录仅表明文档陈述：

> - **Make videos agentically**: Turn your idea into a video using your agent.

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 商品模板视频 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 知识卡片批量视频 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

需要前端开发与渲染环境；Win11更合适。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)（SHA `d655e2df830bbe19285e55607aefff636ed93d7b`）；不是仅依据GitHub许可证标签。 不是免费无限商用承诺；不是生成式视频模型。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [Allow a `toneFrequency` prop to be passed to `<Audio>` (Change pitch of Audio)](https://github.com/remotion-dev/remotion/issues/2932)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [HLS Support for `<Video>`](https://github.com/remotion-dev/remotion/issues/2930)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Bun Support](https://github.com/remotion-dev/remotion/issues/50)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。不是免费无限商用承诺；不是生成式视频模型。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 21/25 | 商品模板视频直接对应需求 |
| 易用性 | 6/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 8/12 | 需要前端开发与渲染环境；Win11更合适 |
| 维护稳定 | 7/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 8/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 5/10 | API/存储/电费另计 |
| 隐私安全 | 7/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 7/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 69；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## pyvideotrans

视频转录、字幕、翻译及配音工作流。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/jianchang512/pyvideotrans；官网：https://pyvideotrans.com；Star：19600（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/jianchang512/pyvideotrans/blob/main/README.md)，文件SHA `7099ce5a528bd9e687473345617e97d080e4bd9c`。摘录仅表明文档陈述：

> **A Powerful Open Source Video Translation / Audio Transcription / AI Dubbing / Subtitle Translation Tool**

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 已有产品片加字幕 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 教学视频字幕整理 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

Windows入口；CPU或GPU视转录后端；模型下载依赖网络。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/jianchang512/pyvideotrans/blob/main/LICENSE)（SHA `f288702d2fa16d3cdf0035b15a9fcbc552cd88e7`）；不是仅依据GitHub许可证标签。 翻译/TTS后端可能付费联网；配音授权和错译人工审核。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [Software getting closed in New Version too. ](https://github.com/jianchang512/pyvideotrans/issues/215)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [0.999版本字幕翻译后生成翻译的视频的时候报错](https://github.com/jianchang512/pyvideotrans/issues/178)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [Installation tutorial ](https://github.com/jianchang512/pyvideotrans/issues/193)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。翻译/TTS后端可能付费联网；配音授权和错译人工审核。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 22/25 | 已有产品片加字幕直接对应需求 |
| 易用性 | 10/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 10/12 | Windows入口；CPU或GPU视转录后端；模型下载依赖网络 |
| 维护稳定 | 7/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 7/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 6/10 | API/存储/电费另计 |
| 隐私安全 | 5/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 6/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 73；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## Stirling-PDF

通过界面执行PDF拆合、转换等操作。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/stirling-tools/stirling-pdf；官网：https://stirling.com；Star：95442（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/Stirling-Tools/Stirling-PDF/blob/main/README.md)，文件SHA `d266d6e9ce5b63599afa099b0fd3003f94442fd2`。摘录仅表明文档陈述：

> Stirling PDF is a powerful, open-source PDF editing platform. Run it as a personal desktop app, in the browser, or deploy it on your own servers with a private API. Edit, sign, redact, convert, and automate PDFs without sending documents to external services.

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 脱敏PDF批量整理 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 资料页提取 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

浏览器/桌面选项以当前版本为准；无需默认GPU。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/Stirling-Tools/Stirling-PDF/blob/main/LICENSE)（SHA `3510a74aa8ac273d4a894c50f7d8b3bd59047ad4`）；不是仅依据GitHub许可证标签。 根MIT不涵盖全部目录；OCR准确性与高级功能费用另查。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [[Bug]: Installation freezes  Windows 10](https://github.com/Stirling-Tools/Stirling-PDF/issues/2487)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [[Bug]: Session Expires after awhile on Windows App](https://github.com/Stirling-Tools/Stirling-PDF/issues/5603)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [[Bug]: 'Self-hosted login failed' on Windows App but working in browser](https://github.com/Stirling-Tools/Stirling-PDF/issues/5083)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。根MIT不涵盖全部目录；OCR准确性与高级功能费用另查。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 22/25 | 脱敏PDF批量整理直接对应需求 |
| 易用性 | 11/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 9/12 | 浏览器/桌面选项以当前版本为准；无需默认GPU |
| 维护稳定 | 8/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 8/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 7/10 | API/存储/电费另计 |
| 隐私安全 | 6/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 6/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 77；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## paperless-ngx

带OCR和检索的自托管文档档案库。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/paperless-ngx/paperless-ngx；官网：http://docs.paperless-ngx.com/；Star：47425（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/paperless-ngx/paperless-ngx/blob/dev/README.md)，文件SHA `f1e5141043dcb5e36b496c7ce71192d9e5e24aea`。摘录仅表明文档陈述：

> Paperless-ngx is a document management system that transforms your physical documents into a searchable online archive so you can keep, well, _less paper_.

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. 家庭票据归档 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. 获批合同检索 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

浏览器访问；OCR可耗CPU；服务备份与升级中高负担。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/paperless-ngx/paperless-ngx/blob/dev/LICENSE)（SHA `733c072369ca77331f392c40da7404c85c36542c`）；不是仅依据GitHub许可证标签。 不等于复杂Excel解析；不要在未授权家用机存公司合同。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [[BUG] Login fails due to CSRF issue - (Origin checking failed - null does not match any trusted origins.)](https://github.com/paperless-ngx/paperless-ngx/issues/817)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [[BUG] Classifier training much slower in 1.8.0 on aarch64](https://github.com/paperless-ngx/paperless-ngx/issues/1364)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [[BUG] paperless_mail.tasks.process_mail_accounts always results in REVOKED state](https://github.com/paperless-ngx/paperless-ngx/issues/3739)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。不等于复杂Excel解析；不要在未授权家用机存公司合同。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 21/25 | 家庭票据归档直接对应需求 |
| 易用性 | 8/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 7/12 | 浏览器访问；OCR可耗CPU；服务备份与升级中高负担 |
| 维护稳定 | 7/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 8/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 8/10 | API/存储/电费另计 |
| 隐私安全 | 6/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 6/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 71；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。

## pandas

用Python可靠处理结构化表格的数据组件。可替代同类产品的部分功能；关注度数字只证明仓库吸引力，不解释真实留存。

官方仓库：https://github.com/pandas-dev/pandas；官网：https://pandas.pydata.org；Star：50269（2026-10-31）。归档：False。

### 功能与证据

官方文档：[README](https://github.com/pandas-dev/pandas/blob/main/README.md)，文件SHA `494d3d574cf4df195da6fd096dde813408a4d02e`。摘录仅表明文档陈述：

> **pandas** is a Python package that provides fast, flexible, and expressive data

社区插件不作为默认功能；实验特性未完成逐项核验；外部模型、翻译、TTS、网页工具可能需要第三方服务，不能视为离线能力。

### 两个拟议案例

1. BOM层级差异 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

2. Excel批量报表 → 输入：本人有权处理的少量脱敏样本 → 操作：按官方支持格式导入/配置，执行一次有限任务 → 输出：可人工复核的文件或记录 → 预期节省重复整理 → 局限：准确率、耗时和节省量均未实测。

### 安装与设备分析

CPU即可；Win11/Win10按文件规模；需AI协助写可审计脚本。编程需求：组件与命令行工具较高，桌面成品较低。Docker是否必要不能一概而论，按版本安装指南复核。iPhone/iPad仅在有受控Web入口时考虑移动浏览器；非Web项目不得默认手机可用。中国大陆依赖/模型下载、更新和第三方登录未在当地实测；应预留离线包与失败重试方案。

### 成本、许可与门禁

取得[原始许可](https://github.com/pandas-dev/pandas/blob/main/LICENSE)（SHA `bd1cc2a30c626d0bbe43ab6ec1c4744c2e2df831`）；不是仅依据GitHub许可证标签。 不是可直接使用的图形产品；型号/替代料/单位规则需人工定义。软件免费不包括模型API、存储、云主机、电费、维护时间。SaaS/品牌/子目录及模型素材权利另核；无实际成本测量。

### 社区反馈样本

- [ENH: eval function](https://github.com/pandas-dev/pandas/issues/3393)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [ENH: sql support](https://github.com/pandas-dev/pandas/issues/4163)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。
- [FEEDBACK: PyArrow as a required dependency and PyArrow backed strings](https://github.com/pandas-dev/pandas/issues/54466)：原报告/请求样本，状态/版本/日期见社区报告与raw详情；代表性未知；采集2026-10-31。

### 二次开发与评分

先验证原版。确有缺口时优先配置、外接脚本或插件；深改会增加上游合并与安全更新负担。非程序员不宜长期维护核心分叉。不是可直接使用的图形产品；型号/替代料/单位规则需人工定义。

| 维度 | 分/权重 | 证据与判断 |
|---|---|---|
| 实际问题 | 24/25 | BOM层级差异直接对应需求 |
| 易用性 | 5/15 | 交互/配置门槛见设备段，未经用户试用 |
| 设备适配 | 10/12 | CPU即可；Win11/Win10按文件规模；需AI协助写可审计脚本 |
| 维护稳定 | 8/12 | 依赖与升级复杂度，非稳定性实测 |
| 社区 | 9/10 | 最近提交及Issue样本，非长期健康结论 |
| 总成本 | 9/10 | API/存储/电费另计 |
| 隐私安全 | 7/8 | 取决于本地路径、工具权限与后端 |
| 扩展商业 | 7/8 | 组件可复用；商业许可证门禁独立 |

暂定总分 79；证据可信度：元数据高，功能/易用性中低，实际性能UNKNOWN。
