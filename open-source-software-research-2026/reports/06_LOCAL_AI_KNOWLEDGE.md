# 本地AI与知识库

个人先试AnythingLLM桌面，确需手机/多人入口才评估Open WebUI；LibreChat本轮重定向受阻，不能确定排名。Ollama省配置，llama.cpp可控但技术门槛高，LocalAI偏服务接口兼容。只选一个主入口。检索引用不是正确性保证，BOM精确差异应交给结构化规则。

| 方案 | Star（2026-10-31） | 依据/下一步 |
|---|---|---|
| [ollama](https://github.com/ollama/ollama) | 185426 | Win11 原生；模型下载后可本地推理；16GB 显存优先小模型量化；Win10 老 CPU 不宜重推理 |
| [llama.cpp](https://github.com/ggml-org/llama.cpp) | 132934 | Windows CPU/CUDA可选；需命令参数和模型格式知识 |
| [LocalAI](https://github.com/mudler/LocalAI) | 50085 | 仅元数据核验；安装/中文/离线UNKNOWN |
| [open-webui](https://github.com/open-webui/open-webui) | 157341 | 浏览器和移动浏览器入口；后端主机需在线；容器是选项 |
| [anything-llm](https://github.com/Mintplex-Labs/anything-llm) | 67783 | Windows 桌面入口降低门槛；服务端浏览器需另维护；手机访问需常在线主机 |
| [LibreChat](https://github.com/danny-avila/LibreChat) | UNKNOWN | 本轮仓库重定向未成功跟随，当前部署要求UNKNOWN |
| [ragflow](https://github.com/infiniflow/ragflow) | 93243 | 服务依赖较多；Win11研究机优先；老机不优先 |

成本、原文证据与风险详见[重点分析](04_TOP_30_DEEP_RESEARCH.md)。
