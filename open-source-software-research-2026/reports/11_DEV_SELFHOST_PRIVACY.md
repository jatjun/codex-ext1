# 开发、自托管与隐私

暂不新建低代码全家桶。Appsmith/ToolJet/Budibase仍需要数据库、认证、备份与升级；免费社区版不保证企业功能全免费。家庭先做密码库和可恢复备份；Syncthing是同步，restic/Kopia是备份。Immich/Nextcloud/Home Assistant只有明确照片、文件或家居需求才值得长期服务。Win11不开机时不能承担持续任务；Win10老设备先核安全更新、磁盘与内存余量，不公开暴露服务。远程访问也必须认证、授权和可撤回。

| 方案 | Star（2026-10-31） | 依据/下一步 |
|---|---|---|
| [appsmith](https://github.com/AppsmithOrg/appsmith) | 41145 | 仅元数据核验；安装/中文/离线UNKNOWN |
| [ToolJet](https://github.com/ToolJet/ToolJet) | 41150 | 仅元数据核验；安装/中文/离线UNKNOWN |
| [budibase](https://github.com/Budibase/budibase) | 28373 | 仅元数据核验；安装/中文/离线UNKNOWN |
| [syncthing](https://github.com/syncthing/syncthing) | 89925 | CPU运行；两端需在线才能直接同步；Windows版本要求再核对 |
| [restic](https://github.com/restic/restic) | 36898 | CPU/命令行；老机可调度但需在线；存储容量另算 |
| [kopia](https://github.com/kopia/kopia) | 14540 | 仅元数据核验；安装/中文/离线UNKNOWN |
| [keepassxc](https://github.com/keepassxreboot/keepassxc) | 29634 | Windows桌面，无GPU；离线可用；iOS需独立兼容客户端 |

成本、原文证据与风险详见[重点分析](04_TOP_30_DEEP_RESEARCH.md)。
