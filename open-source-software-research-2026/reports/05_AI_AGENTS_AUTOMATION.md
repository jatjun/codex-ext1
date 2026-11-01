# AI Agent与自动化

Hermes适合个人持续任务，OpenHands面向隔离软件开发，OpenCode面向终端编程；不能当作完全替代品。n8n处理确定性连接与定时流程，Dify处理模型应用，Langflow处理模型链原型。先有一个重复流程再引入工作流平台。Hermes当前README确认原生Windows入口，不能沿用“只支持WSL”的旧结论；支持声明不等于本机稳定测试。

| 方案 | Star（2026-10-31） | 依据/下一步 |
|---|---|---|
| [hermes-agent](https://github.com/NousResearch/hermes-agent) | 259007 | README现已宣称原生Windows支持，也可WSL；本地执行不强制Docker；模型端另选 |
| [OpenHands](https://github.com/OpenHands/OpenHands) | 92321 | 浏览器交互；运行时隔离和后端维护较重；Win11更合适 |
| [opencode](https://github.com/anomalyco/opencode) | 223429 | 开发者工作流；Windows路径及工具依赖按版本验证 |
| [n8n](https://github.com/n8n-io/n8n) | 209181 | 浏览器编辑；自托管需Node或容器运维；CPU即可 |
| [dify](https://github.com/langgenius/dify) | 160065 | 浏览器；多服务部署维护较重；Win11可评估Docker/WSL |
| [langflow](https://github.com/langflow-ai/langflow) | 156184 | 浏览器界面，Python依赖；适合原型，不宜直接公开编辑入口 |

成本、原文证据与风险详见[重点分析](04_TOP_30_DEEP_RESEARCH.md)。
