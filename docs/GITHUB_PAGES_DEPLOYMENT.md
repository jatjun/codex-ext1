# GitHub Pages 双仓库部署

## 架构与当前边界

- 私有源码：https://github.com/jatjun/codex-ext1 ，保持 **Private**。
- 发布分支：`feat/interactive-math-v1`。
- 目标公开仓库：https://github.com/jatjun/codex-ext1-pages 。
- 正式地址（配置成功后）：https://jatjun.github.io/codex-ext1-pages/ 。
- Vite base 固定为 `/codex-ext1-pages/`，无路径路由；页面切换使用React状态，刷新返回课程首页，不需要SPA重写。

当前环境的GitHub连接器没有创建仓库、配置Pages或Secrets工具；CLI的GitHub API请求返回Forbidden。目标仓库查询返回404，可能不存在或未授权，不能单凭404认定不存在。请先在GitHub网页检查目标仓库，如含不属于此项目的文件或历史，停止并人工确认，不要直接运行发布。

## 首次配置（需要仓库所有者操作）

### 1. 目标公开仓库

在 https://github.com/new 创建 `jatjun/codex-ext1-pages`，选择 **Public**；不要初始化README、License、gitignore或任何其他文件。已有空仓库可复用。不要修改源码仓库可见性。不设置自定义域名。

发布器会检查目标确为指定Public仓库、已有分支仅main、当前文件严格符合公开清单，历史具有本项目发布标记；发现不相干文件或历史会停止。不能用force push清理旧仓库来绕过此检查。

### 2. 优先选GitHub App（只安装在目标仓库）

1. GitHub → Settings → Developer settings → GitHub Apps → New GitHub App。
2. 名称自定且全局唯一；Homepage可填目标仓库URL；不启用Webhook，不需要用户授权回调。
3. Repository permissions：**Contents: Read and write**，Metadata自动Read-only，其余No access。不订阅事件。Only on this account。
4. 创建后记下App ID，生成Private key；Install App → 账户jatjun → **Only select repositories** → 只选择 `codex-ext1-pages`。
5. 在**私有源码仓库** Settings → Secrets and variables → Actions → Variables，新增 `PAGES_APP_ID`（App ID）。
6. 在同一位置的Secrets新增 `PAGES_APP_PRIVATE_KEY`，值为私钥文件完整内容。仅在GitHub网页粘贴，**不要发到聊天、提交Git或打印日志**。
7. 工作流使用固定版本的官方create-github-app-token动作，仅申请目标仓库Contents写权限；令牌短期有效，结束时撤销。

### 3. App不可行时，使用细粒度PAT（二选一）

1. 访问 https://github.com/settings/personal-access-tokens/new 。必须是 **Fine-grained token**，不使用Tokens (classic)。
2. 名称如 `codex-ext1-pages-deploy`，选择合理有效期（如90天），Resource owner选jatjun。
3. Repository access → **Only select repositories** → 只选 `codex-ext1-pages`。
4. Repository permissions → **Contents: Read and write**；Metadata自动Read-only；其余不授权，尤其不需要源仓库权限、Administration或Workflows。
5. Generate token后，直接进入 https://github.com/jatjun/codex-ext1/settings/secrets/actions ，新增Repository secret `PAGES_DEPLOY_TOKEN`，粘贴令牌。
6. 使用PAT模式时不要设置 `PAGES_APP_ID`，否则工作流优先选择App模式。
7. 令牌仅写目标仓库；源码读取由本次Actions自带、只读的GITHUB_TOKEN完成。PAT过期会阻止更新，上一版网站保留。

当前环境的临时GitHub连接授权不能当作长期Actions部署凭据，也不会被读取或复制为Secret。

### 4. 首次构建与Pages设置

将本次修改推送到发布分支后，打开 https://github.com/jatjun/codex-ext1/actions ，查看 **Deploy reviewed static site**。若首次运行因缺Secret失败，配置完成后在该次运行右上角选择 **Re-run all jobs**；旧提交运行若发现新HEAD会拒绝发布，应重跑最新提交的运行。

首次发布成功会创建目标仓库main分支。然后到 https://github.com/jatjun/codex-ext1-pages/settings/pages ：

- Build and deployment → Source：**Deploy from a branch**。
- Branch：**main**；目录：**/(root)**；Save。
- 不设置Custom domain。

`.nojekyll`随产物发布，禁止Jekyll处理。App/PAT提交可触发目标仓库的分支Pages构建，避免默认GITHUB_TOKEN跨仓库不可写、且自身推送不触发Pages的问题。

等待目标仓库的Pages部署完成后打开正式地址。不要把“代码已推送”或“源仓库工作流成功”当作网站已验证。必须检查目标Pages构建以及在线资源。

## 每次自动更新

工作流文件：`.github/workflows/deploy-pages.yml`。

发布分支push → 精确checkout提交 → Node 24 LTS → npm ci → 逻辑/产物门槛测试 → TypeScript和生产构建 → 公开文件检查与SHA256清单 → Chromium生产子路径测试 → 生成限定目标仓库令牌 → 再检查产物与仓库状态 → 非强制推送公开main → Pages自动更新。

任一步失败均不会推送公开main。Concurrency取消旧运行；发布前再读取源分支最新SHA，阻止旧提交部署；目标分支非快进更新也会失败，不允许旧版本覆盖新版本。Secrets只提供给最后的授权与发布步骤，不提供给npm install、测试、构建或浏览器。

公开仓库只有`index.html`、编译的`assets/*.js`/`*.css`、`.nojekyll`、`deployment.json`，后者包含源Commit、构建时间和文件哈希。没有源码仓库Git历史。每个公开提交信息为`Publish <source SHA>`。源码Commit SHA仅用于追踪，并不会使私有源码可公开访问。

编译后的JS仍然包含可读的教学内容与程序逻辑，任何人可以查看；不视编译为保密措施。当前没有教材整页图片、真实儿童记录或密钥。检查采用严格白名单与已知敏感模式，会阻止新增图片/网络API等内容，未来新增资源必须先人工审核并扩展规则；它不能保证识别所有人为写入的任意个人信息。

## 状态、手动重跑与在线验证

- 私有Actions：查看步骤日志与最终Summary中的公开Commit；失败日志不打印Token或匹配的敏感文本。
- 目标仓库Actions/Settings→Pages：查看Pages build and deployment。
- 网站`/codex-ext1-pages/deployment.json`：查看在线版本对应的源SHA。
- 手动重跑：重跑最新发布分支提交的Actions运行；或推送一个正常的新提交（必要时允许`git commit --allow-empty -m "chore: redeploy pages"`）。
- 文件包含`workflow_dispatch`，但GitHub要求它同时存在于默认分支才提供手动dispatch入口；本任务不改变默认分支或合并代码，因此不要假设发布分支上的文件自动提供该入口。将来经过正常评审合并到默认分支后，Run workflow时仍需选指定发布分支。

本地复现（PowerShell）：

```powershell
npm ci
npm test
npm run build
$env:SOURCE_SHA = (git rev-parse HEAD)
npm run check:public
npx playwright install chromium
npm run test:browser
# Pages真正上线后再执行同一套在线测试：
$env:BASE_URL = 'https://jatjun.github.io/codex-ext1-pages/'
npm run test:browser
Remove-Item Env:BASE_URL
```

浏览器测试为Chromium、390px及1280px，覆盖资源无404/JS错误、刷新、两场景、答题分支、练习、迁移、播放暂停继续、方向拖动、调速、重播、学习记录和JSON下载。WebKit及真实iPhone Safari未执行时必须标NOT_TESTED。

## 回滚

优先在**私有发布分支**用`git revert <有问题的源码提交>`生成正常新提交并推送，让同一测试构建检查链重建旧行为。不要reset/force push，不直接复制私有源码到公开仓库。回滚后的发布同样记录新的源SHA。

## 常见问题

- 首页404：确认Public仓库存在，main有index.html，Pages源main根目录，目标Pages部署成功；等待GitHub构建完成。
- JS/CSS 404或空白：确认访问地址含`/codex-ext1-pages/`，vite.config.ts base匹配；查看开发者工具Network及Console。
- 发布403：检查App仅安装目标仓库、Contents读写、App ID/私钥配对；或细粒度PAT未过期且选中了目标仓库。不要扩大到所有仓库或使用经典全权限PAT。
- 工作流文件推送被拒绝：当前连接可能缺少修改Workflows权限，需要所有者通过GitHub网页提交工作流或调整相应连接权限，不绕过GitHub限制。
- 发布提示unrelated target content/history：停止，检查是否误用了别的项目仓库；不要删除原文件或改检查规则绕过。
- 产物被拒绝：检查是否混入教材图、map、文档、记录、密钥、外传代码；先移除不应公开的文件，再构建。
- 私有Actions额度或Actions被禁用：仓库所有者检查Settings→Actions与账户Billing；不宣称工作流已成功。

## 更换分支与停止网站

更换发布分支时同步修改工作流push.branches、job的github.ref限制、发布器读取最新源HEAD的路径（`scripts/publish-pages.mjs`）；验证后通过正常提交推送。不要扩大触发范围到任意分支。

停止网站：公开仓库Settings→Pages→Unpublish site；同时禁用私有仓库的Deploy reviewed static site工作流，撤销目标App安装或删除PAT/部署Secret，防止以后恢复发布。不需要改变私有仓库可见性。

## 儿童学习记录

学习记录只存储在访问设备的当前浏览器localStorage；不跨设备同步，不上传GitHub或第三方。清除浏览器站点数据会删除记录，使用JSON导出自行保存。GitHub Pages只提供公开静态网页，不提供私有学习数据库。网站公开访问不代表孩子的学习记录公开。GitHub托管方仍会接收普通网站访问请求；应用没有添加第三方统计脚本。
