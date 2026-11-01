# 独立证据审计

审计日期：2026-10-31。审计方式：另一独立代理检查原始返回、许可证原文、交付数据和文件边界；未安装、部署或运行候选软件。

## 证据边界

- GitHub 连接器 `github_fetch` 返回公开仓库 JSON；Star/Fork 可回溯原始值。不能以 `isError=false` 作为成功标准：LibreChat、ente 的内容实际为重定向消息，缺少 Star 字段。
- 原始 metadata 90 条中 83 条具有仓库统计数据；此为初次采集计数，最终计数须合并纠错并去重，不能简单相加。
- 初次采集发现 Scratch GUI、Scratch VM 和 Filebrowser 已归档；不能列为维护活跃项目。
- `pushed_at` 是仓库推送时间，不能直接写成最近代码提交时间。开放问题统计包含 PR；不是缺陷数。
- GitHub 自动识别的 SPDX 不能替代许可证原文。初次采集18项为 NOASSERTION 或无识别结果。
- Issues 搜索返回多条日期、状态、作者字段为 null；仅可作为报告存在的线索，不能推断问题尚未解决、发生频率或当前版本故障率。
- README、许可证及代码提交是文档证据；不构成软件功能、性能、安全或中国大陆网络实测。

## 独立原文抽查

原始返回与文件 SHA 保存在 [independent_source_checks.json](independent_source_checks.json)。

|项目|原始来源|独立审查判断|
|---|---|---|
|n8n|[LICENSE.md](https://github.com/n8n-io/n8n/blob/master/LICENSE.md)|Sustainable Use License 限内部业务/非商业/个人用途；企业文件另授权，不能称无条件开源商用|
|Dify|[LICENSE](https://github.com/langgenius/dify/blob/main/LICENSE)|修改版 Apache，存在多租户及前端标识限制；不能只写 Apache-2.0|
|Open WebUI|[LICENSE](https://github.com/open-webui/open-webui/blob/main/LICENSE)|附品牌条款，含滚动30天内不超过50名最终用户等例外；不能笼统写无条件去品牌或绝对不可去品牌|
|KeePassXC|[仓库元数据](https://github.com/keepassxreboot/keepassxc)|独立返回 Star 29,634；许可证识别 NOASSERTION，不代表没有许可证|

## 仍需最终验收

最终报告生成后检查统计与图表一致性、评分证据、所有请求文件、离线 HTML 和 PDF，以及原仓库未受影响。上述初次采集计数不替代最终统计。

## 最终追加核验

最终去重候选92项，全部Star/Fork与原始JSON一致；82项≥1万Star、12项≥10万Star，原始许可证取得29项。29项目有Issue搜索样本；其中12个不同项目补取完整故障Issue详情，见data/raw/complaints_verified.json，具备创建日期和状态，版本按正文可得信息核对。不能从12份报告推断普遍性或最新版本仍有问题。全部八维分数已低于维度满分。最终整体为REWORK，详见INDEPENDENT_REVIEW.md。
