# MMEETT Fate 项目状态

更新日期：2026-07-24

## 当前基线

- 正式源码：仓库根目录 `/Users/leon/Documents/算卦`
- 线上地址：https://3352873770-rgb.github.io/dongfang-guanxing/
- 正式分支：`main`
- 当前原型集成分支：`agent/prototype-current`
- 当前版本：`1.0.0`
- 技术栈：React 19、Vite 6、OGL、Three.js
- 发布方式：任务默认停在本地验证与草稿 PR；用户逐次确认发布后才合并 `main`，再由 GitHub Actions 发布 GitHub Pages

## 当前品牌

- 当前产品品牌：MMEETT Fate；英文说明为 “EASTERN SYMBOLS · INNER CLARITY”。
- 首页 Hero 使用单行 MMEETT Fate 字标、`READ THE SIGNS · MEET YOURSELF` 与“观象知变，向内而行”，但保持原有昼夜氛围、导航与问卦业务流程。
- 品牌字标由 `src/brand-lockup.jsx` 统一提供，使用仅含所需字重的自托管 Cormorant Garamond；首页、二级页和页面标题不再使用旧品牌名。

## 已完成

- 一级首页与移动端自适应布局
- 昼模式 LightRays 与夜模式 LiquidEther
- 昼夜主题切换与本地偏好保存
- 首页、观星问卦、五个灵签工具、今日卦象与六十四卦知识页继承同一个全站主题状态；问卦表单骨架通过共享 CSS 变量切换米纸与深墨背景
- 首页经典书名错峰漂移动效
- 长期问卦与推荐工具的逐按钮 SpecularButton 交互
- 六十四卦图谱、人格入口、日签与记录入口
- 今日一卦使用真实本地日期与醒目的金色“今日卦象”操作按钮
- 今日卦象二级结果页已在本地接入首页：日期、卦名、主题和卦象共用同一轮换数据，并提供经典依据、现代观察、理性边界和对应知识页入口
- “三枚铜钱”与人格偏好探索二级页已合入 `agent/prototype-current`：前者同页完成定问、六次三钱记录与结果展开；后者提供单页 12 题五点量表、一次提交、偏好印谱、边界核对题和连续人格介绍
- “开始观星问卦”单页表单与卦象结果已在本地实现：所问分类、问题输入与人物档案在同页确认后直接起卦
- 人物档案支持本设备保存、下拉切换回填、广州 11 区和手动经度
- 人物档案已抽为共享组件，观星问卦与流年运势共用同一份档案选择、编辑和本地存储逻辑
- “灵签信”五个二级入口已在 `agent/oracle-tool-flows` 分支实现：输入页复用长期问卦排版，云签、事业、流年、时辰与 AI 报告按任务自适应字段并使用差异化结果层级
- “灵签信”五个输入页统一把人物档案组件放在工具字段之前，生成结果时保存并关联当前档案；非出生类工具不改变原有起卦或报告算法
- 时辰运势使用可重算的农历年月日时起卦口径；AI 解读报告首期读取真实本地问卦记录，并明确标注为未连接外部模型的结构化解读原型
- 首页六十四卦图谱使用无横向滚动的静态网格，并可进入昼夜双模式知识二级页
- 首页与六十四卦知识页的 WebGL 氛围仅在 Banner 可见时挂载，滚出首屏或页面进入后台后自动卸载
- GitHub Pages 公网发布
- 根目录唯一源码、长期项目文档与自动质量检查基线
- 逐任务明确确认的公网发布门禁，避免完成任务后自动更新线上版本
- 已验证的问卦、灵签信、六十四卦、今日卦象、人物档案、三枚铜钱和人格偏好探索已收拢到 `agent/prototype-current`
- 用户已于 2026-07-24 确认将当前统一版本通过 PR #30 发布到 `main`

## 当前架构边界

- `src/upgrade-entry.jsx` 负责新版首页 Hero、主题切换和原页面增强。
- `src/brand-lockup.jsx` 负责 MMEETT Fate 的共享英文品牌字标、说明与默认页面标题。
- `public/legacy/legacy-app.js` 与 `legacy-styles.css` 提供下半页兼容内容。
- `src/App.jsx` 与 `src/main.jsx` 当前不由 `index.html` 加载，保留为后续 Legacy 源码迁移参考，不应被误认为线上入口。

## 已知问题

- Legacy 兼容内容仍以生成后的 Bundle 交付，缺少从 React 源码自动生成该 Bundle 的正式脚本。
- 当前自动检查覆盖结构、关键交互契约和生产构建，尚未覆盖真实浏览器端到端截图回归。
- 人物档案与问卦前置流程已在 `agent/interactive-reading-flow` 分支本地实现，使用浏览器本地存储；尚未接入账号同步、全国行政区划、真实排卦算法和结果解读。
- 灵签信五工具与问卦记录当前只保存在浏览器本地；AI 解读报告尚未接入真实大模型服务。
- 人格偏好结果基于本地简化偏好问卷，用于自我探索，不是官方 MBTI 测评、心理诊断或招聘评估。

## 下一步

1. [#5](https://github.com/3352873770-rgb/dongfang-guanxing/issues/5)：建立 Legacy Bundle 的可重复构建或逐段迁移到正常 React 组件。
2. [#6](https://github.com/3352873770-rgb/dongfang-guanxing/issues/6)：增加桌面端、390px 移动端、昼夜切换和核心按钮的浏览器端到端测试。
3. [#7](https://github.com/3352873770-rgb/dongfang-guanxing/issues/7)：记录 LightRays / LiquidEther 性能基线并持续监测移动端表现。
4. [#8](https://github.com/3352873770-rgb/dongfang-guanxing/issues/8)：基于当前主线重建离线单文件分享版。
5. 将三枚铜钱的同页任务骨架逐项复用到其他推荐工具。
6. 评估 AI 模型接入与全国地区数据范围。
7. 为人格偏好探索补充浏览器端到端测试和可访问性回归。
8. 按 `docs/ROADMAP.md` 通过 GitHub Issues 推进其他二级页面。

## 接手规则

新任务先读取 `AGENTS.md`、本文件和任务相关的 `docs/` 文档。不要扫描依赖、构建产物或 Legacy Bundle；通过 `docs/COMPONENT_MAP.md` 定位代码。

新功能从 `agent/prototype-current` 创建独立任务分支；验证完成后合回该集成分支。只有用户针对当前任务明确确认发布时，才把集成版本合入 `main`。
