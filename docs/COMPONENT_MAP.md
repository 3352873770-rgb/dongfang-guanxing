# Component Map

| 用户界面 | 主要文件 | 说明 |
|---|---|---|
| 页面入口 | `index.html` | 挂载新版 Hero 与 Legacy 内容 |
| 新版首页 Hero | `src/upgrade-entry.jsx` | 导航、主题切换、标语、书名、CTA |
| Hero 与昼夜样式 | `src/upgrade.css` | 视觉 token、响应式和交互覆盖 |
| 观星问卦单页流程 | `src/reading-flow.jsx` | 单页完成所问分类、问题与档案，提交后直接展示卦象结果 |
| 问卦流程样式 | `src/reading-flow.css` | 米纸界面、表单、响应式与流程状态 |
| 人物档案共享组件 | `src/profile-archive-form.jsx` | 档案选择、新建编辑、出生时间、广州 11 区与经度逻辑，供问卦和五个灵签工具复用 |
| 灵签信五工具流程 | `src/oracle-tool-flow.jsx` | 五个工具统一以人物档案为首个表单模块，再组合各自输入与差异化结果 |
| 灵签信补充样式 | `src/oracle-tool-flow.css` | 基于问卦流程 token 的自适应字段、结果区和移动端触控尺寸 |
| 本地问卦记录 | `src/reading-storage.js` | 保存普通问卦与灵签工具结果，供 AI 结构化报告读取 |
| 易经数据与起卦 | `src/iching.js` | 六十四卦原文、四值数字化起卦与可重算的时间起卦 |
| 问卦米纸素材 | `public/media/reading/rice-paper-bagua-v1.jpg` | 低对比宣纸、八卦与淡墨纹理 |
| 六十四卦知识页 | `src/hexagram-atlas.jsx` | Hash 路由、阅读方法、选中卦象、搜索与完整图谱 |
| 六十四卦知识数据 | `src/hexagram-data.js` | 通行次序、卦名、Unicode 卦象与学习主题 |
| 六十四卦知识页样式 | `src/hexagram-atlas.css` | 昼夜主题、网格、响应式与选中状态 |
| 今日卦象日期数据 | `src/daily-hexagram.js` | 本地日期轮换、首页与结果页共享卦象及文案 |
| 今日卦象结果页 | `src/daily-hexagram-page.jsx` | 卦象结构、经典依据、现代观察、理性边界与知识页入口 |
| 今日卦象结果页样式 | `src/daily-hexagram-page.css` | 昼夜主题、连续阅读、响应式和可访问状态 |
| 二级页共享页眉 | `src/secondary-page-chrome.jsx`、`src/secondary-page-chrome.css` | 今日卦象与六十四卦知识页共用返回、品牌和昼夜切换 |
| Banner 动效生命周期 | `src/use-atmosphere-visibility.js` | 离开视口或页面后台时卸载 WebGL |
| 日间体积光 | `src/components/LightRays/` | WebGL LightRays |
| 夜间流体背景 | `src/components/LiquidEther.*` | Three.js LiquidEther |
| 主按钮描边 | `src/components/BorderGlow.*` | Hero 主要按钮高光 |
| 下半页内容 | `public/legacy/legacy-app.js` | 生成后的兼容 Bundle，禁止常规手改 |
| 下半页样式 | `public/legacy/legacy-styles.css` | 生成后的兼容样式，禁止常规手改 |
| 下半页媒体 | `public/media/legacy/` | 已外置并压缩的 Legacy 图片 |
| 旧 React 参考 | `src/App.jsx`、`src/main.jsx`、`src/styles.css` | 当前未被入口加载，供迁移参考 |
| GitHub Pages | `.github/workflows/pages.yml` | `main` 自动部署 |

定位任务时先查本表，再读取最小范围的源文件。
