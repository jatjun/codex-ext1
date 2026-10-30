# SOURCE_VERIFIED

仓库 jatjun/codex-ext1；main 最新提交 4b7f9603a03e1207d3f701667b0e7926cf7bd708；来源 feat/interactive-math-v1 最新提交 5cbce17c1a7d4f36fd74d5deaf1c4f7371147ca6。通过 GitHub connector 读取固定提交源码并保存 source-audit。初始 work 分支指向 main 相同提交，未提交文件为空；未发现 educational-videos 目录；远端 edu 分支搜索为空，打开的 PR 搜索为空。不是对所有私有/外部任务的全面排查。

|视频|源码|题目与正确答案|迁移|
|---|---|---|---|
|views-top-view|src/lessons/data.ts|views/view-key：从正上方看这个长方体，能直接看到哪个面？上面|view-transfer：球各方向轮廓都是圆形|
|cube-opposite-face|src/lessons/data.ts|cube/cube-key：前面1，相对和7，后面几？6|cube-transfer：新盒相对和9，上面2，下面7|
|yogurt-word-problem|src/lessons/mixed.ts|yogurt-key：4＋6×3先算6×3；yogurt-total：18＋4＝22盒。步骤明确3组每组6盒，另外4盒|yogurt-transfer：25＋8×4＝57元|

提示、选项及原解释完整保留于 source-audit 源文件，视频将文字分段改写为适龄提示，未改变数字条件。还读取 practice.ts、TEACHING_DESIGN.md、ANIMATION_SPEC.md、Stage.tsx、MixedStage.tsx、model.test.ts、mixed.test.ts。未运行原课程测试，原课程未修改。

补充读取并存档 src/math-engine/model.ts 与 src/math-engine/mixed.ts，确认原程序六面绑定和分组坐标规则。随后Git网络fetch与ls-remote再次确认来源及main SHA；创建远端工作分支后搜索仅发现本任务分支和既有课程分支，无同名其他视频任务分支。
