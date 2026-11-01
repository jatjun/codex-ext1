# Excel、BOM与企业文件

推荐先用OpenRefine清洗，Grist承载关系台账，pandas执行可重复比较；三者不互相等价。Excel单元格差异不能替代BOM业务差异：必须定义料号/版本/数量/单位/替代料/父子路径、重复行、多层展开与缺失值。用人工标注的脱敏样本比较漏报误报；原文件只读，输出差异表与规则版本。公司电脑禁止安装时，浏览器需要企业批准的内网主机，不意味着可把数据发到个人服务器。LibreOffice主开发源非GitHub镜像，不能以镜像提交判断整体维护。

| 方案 | Star（2026-10-31） | 依据/下一步 |
|---|---|---|
| [OpenRefine](https://github.com/openrefine/openrefine) | 12085 | 本地Java服务加浏览器；CPU即可；8GB需控制文件规模 |
| [grist-core](https://github.com/gristlabs/grist-core) | 12029 | 浏览器访问批准服务器；自托管维护中等；无需GPU |
| [pandas](https://github.com/pandas-dev/pandas) | 50269 | CPU即可；Win11/Win10按文件规模；需AI协助写可审计脚本 |
| [sheetjs](https://github.com/SheetJS/sheetjs) | 36348 | 仅元数据核验；安装/中文/离线UNKNOWN |
| [Stirling-PDF](https://github.com/Stirling-Tools/Stirling-PDF) | 95442 | 浏览器/桌面选项以当前版本为准；无需默认GPU |
| [paperless-ngx](https://github.com/paperless-ngx/paperless-ngx) | 47425 | 浏览器访问；OCR可耗CPU；服务备份与升级中高负担 |

成本、原文证据与风险详见[重点分析](04_TOP_30_DEEP_RESEARCH.md)。
