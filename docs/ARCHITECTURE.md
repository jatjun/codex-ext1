# 架构

React + TypeScript + Vite，无外部图片、字体或在线API依赖。

- math-engine/model：面数字、方向、相对面运算、步骤门槛、答题记录纯逻辑。
- lessons/data：课程步骤与6道原创题目。
- animation/Stage：CSS立体物体与触屏观察；只消费数学模型。
- teacher/adapter：受控错误解释与中文SpeechSynthesis。真实AI仅为接口，未接大模型，不发送儿童数据。未来模型必须走服务端，校验固定题目与数学条件，不接收可改变答案的响应。
- progress/storage：浏览器localStorage；最近500条题目会话，覆盖同一会话的进展；损坏数据回退；存储失败提示；JSON导出。
- main：编排课程、状态、问题和页面。

记录包含首答、正确性、次数、提示、重播、讲解、最终分类。自动提示的错误重试也不会被误报为独立正确。无儿童账号、无共享数据库、无API密钥。
