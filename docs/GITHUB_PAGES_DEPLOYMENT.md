# 单仓库 GitHub Pages 部署

## 当前状态与公开前置条件

唯一仓库：https://github.com/jatjun/codex-ext1 。发布分支：`feat/interactive-math-v1`。网站目标：https://jatjun.github.io/codex-ext1/ 。

**当前保持Private，网站尚未验证上线。** 公开前审查发现旧提交作者元数据含个人邮箱，用户已选择暂不公开、先讨论清理。详见 [审查记录](PRE_PUBLICATION_REVIEW.md)。不能仅凭构建测试通过就公开仓库或将网站描述为已上线。

不再使用跨仓库发布，不需要PAT、GitHub App或目标部署仓库。旧发布脚本已删除，工作流不读取旧的PAGES_DEPLOY_TOKEN、PAGES_APP_ID、PAGES_APP_PRIVATE_KEY。若过去配置过这些设置，可由所有者在Settings→Secrets and variables→Actions删除对应项并撤销不用的令牌/私钥；本任务不读取、输出或自行删除其值，也不修改其他仓库。

## 工作流

`.github/workflows/deploy-pages.yml`：

1. 指定分支push后，checkout精确SHA，Node 24 LTS，npm ci。
2. 执行逻辑与公开产物规则测试。
3. TypeScript严格检查和Vite生产构建。
4. 检查dist，生成deployment.json及文件SHA256。
5. Chromium在生产子路径测试桌面1280px与手机390px。
6. 再校验SHA、文件清单与哈希，确保上传的是已测产物。
7. 官方actions/upload-pages-artifact上传dist，保留7天。
8. 独立deploy job要求仓库为Public，且本次SHA仍是最新发布分支提交；否则停止，不改变可见性。
9. 官方actions/configure-pages核查现有Pages配置，actions/deploy-pages使用同一运行的artifact发布。

build job仅contents:read。deploy job才有contents:read、pages:write、id-token:write，使用github-pages environment和GitHub自动签发的GITHUB_TOKEN/OIDC，不使用长期Secret。Action固定到审核过的Commit SHA。

Concurrency group为github-pages-production，cancel-in-progress:false，避免中途取消活跃的Pages部署；GitHub只保留一个待运行任务，更新的待运行任务可能替换旧任务。部署前的源HEAD检查阻止陈旧提交发布。失败不触碰上一版网站；不提交dist、不推送生成分支、不强制推送。

## 安全审查完成后，所有者的网页操作

以下步骤**暂不执行**。须先完成历史清理讨论、必要的另行授权、重扫与明确公开决定。当前工具没有修改仓库可见性和Pages设置的接口；CLI GitHub REST此前返回Forbidden，不能绕过权限。

1. https://github.com/jatjun/codex-ext1/settings → General → Danger Zone → Change repository visibility → Make public；确认这是唯一目标仓库，并按GitHub提示输入仓库名。此操作会公开可访问分支及Git历史，不只是构建产物。
2. https://github.com/jatjun/codex-ext1/settings/pages → Build and deployment → Source选择 **GitHub Actions**。不要选Deploy from a branch，不创建自定义域名。
3. Settings → Environments → github-pages → Deployment branches and tags：如果使用Selected branches and tags，添加Branch规则 `feat/interactive-math-v1`。不能保留只允许默认main的规则。已有必要的人工审批保护应保留，通过正常界面审批，不绕过。
4. https://github.com/jatjun/codex-ext1/actions → Deploy reviewed static site → 重跑最新发布分支提交的 **Re-run all jobs**。也可推送正常新提交触发，不用跳过测试。
5. 等待build与deploy均成功，再访问正式地址并执行在线浏览器验证。

workflow_dispatch已声明，但GitHub通常要求工作流存在于默认分支才显示Run workflow入口。当前默认main只有初始README，本任务不自动合并或更换默认分支。优先使用最新一次push运行的Re-run all jobs。

## 本地与线上验证

```powershell
npm ci
npm test
npm run build
$env:SOURCE_SHA = (git rev-parse HEAD)
npm run check:public
npx playwright install chromium
npm run test:browser
```

生产预览：`npm run preview`，打开`http://127.0.0.1:4173/codex-ext1/`。Vite base为`/codex-ext1/`；关闭source map。应用使用React状态切换页面，无路径路由，刷新无需404回退。

真正上线后再运行：

```powershell
$env:BASE_URL = 'https://jatjun.github.io/codex-ext1/'
npm run test:browser
Remove-Item Env:BASE_URL
```

检查首页、JS/CSS无404、两种动画、拖动、暂停继续、重播、速度、步骤、关键题、错误分支、练习、刷新持久化与JSON导出。Chromium手机尺寸测试不等于真实iPhone Safari。WebKit及真机未执行时标NOT_TESTED。

deployment.json的application为codex-ext1，包含sourceCommit、构建时间和文件清单；可据此核对线上版本。该文件不包含儿童记录。

## 状态、排错、回滚与停站

Actions每次运行显示build/deploy状态；成功deploy的Environment链接指向正式网站。若build成功而deploy因Private停止，这是预期保护，不能称为部署成功。

- 404：确认Public与Pages Source=GitHub Actions，deploy成功；访问地址带`/codex-ext1/`，检查浏览器Network和deployment.json版本。
- configure-pages找不到站点：在Settings→Pages启用GitHub Actions。工作流不自动更改Pages或仓库可见性。
- environment拒绝分支：允许指定发布分支；如需要人工批准，在GitHub界面批准，不绕过保护。
- OIDC/403：检查deploy job的pages:write和id-token:write及Pages/environment配置，不增加PAT。
- 产物检查失败：先清除不应公开的素材、map、凭据、真实记录或外传代码，再构建，不绕过检查。
- 最新SHA检查失败：重跑最新提交对应的运行，旧提交不会覆盖新版。
- 更换发布分支：同步调整push.branches、build job的ref限制、deploy源HEAD路径及environment允许分支。
- 回滚：在发布分支git revert有问题的源码提交并正常推送，重新走全套验证，不reset/force push。旧SHA不能绕过“最新源HEAD”检查直接重跑。
- 停站：Settings→Pages→Unpublish site，并禁用此Actions工作流，防止下次push恢复发布。

## 公开源码、版权与儿童隐私

单仓库Public会公开src、tests、docs及可达历史；“dist中没有源码目录”不代表源码保密。教材原始截图从未提交到检查过的历史，网页为原创图形与练习；未来不得把整页教材图片加入仓库或public。依赖的许可证注释应保留。

公开产物仍只允许index.html、编译JS/CSS、.nojekyll和deployment.json。模式扫描会阻止常见密钥、图像、记录样本、map及网络上传接口；新增素材或数据仍需人工审查。

学习记录只在当前设备、当前浏览器localStorage中，不跨设备同步，不上传GitHub或第三方。清除站点数据会删除记录，请自行JSON导出。GitHub Pages没有私有学习数据库；网站与源码公开都不代表孩子记录公开。GitHub会接收正常静态网页访问请求，应用没有第三方分析脚本。
