# Component Map

| 用户界面 | 主要文件 | 说明 |
|---|---|---|
| 页面入口 | `index.html` | 挂载新版 Hero 与 Legacy 内容 |
| 新版首页 Hero | `src/upgrade-entry.jsx` | 导航、主题切换、标语、书名、CTA |
| Hero 与昼夜样式 | `src/upgrade.css` | 视觉 token、响应式和交互覆盖 |
| 日间体积光 | `src/components/LightRays/` | WebGL LightRays |
| 夜间流体背景 | `src/components/LiquidEther.*` | Three.js LiquidEther |
| 主按钮描边 | `src/components/BorderGlow.*` | Hero 主要按钮高光 |
| 下半页内容 | `public/legacy/legacy-app.js` | 生成后的兼容 Bundle，禁止常规手改 |
| 下半页样式 | `public/legacy/legacy-styles.css` | 生成后的兼容样式，禁止常规手改 |
| 下半页媒体 | `public/media/legacy/` | 已外置并压缩的 Legacy 图片 |
| 旧 React 参考 | `src/App.jsx`、`src/main.jsx`、`src/styles.css` | 当前未被入口加载，供迁移参考 |
| GitHub Pages | `.github/workflows/pages.yml` | `main` 自动部署 |

定位任务时先查本表，再读取最小范围的源文件。
