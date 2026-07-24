# MMEETT Fate

以《周易》文化知识与自我探索为核心的问卦产品原型，包含昼夜双主题、首页经典书名漂移动效、长期问卦、六十四卦图谱、推荐工具与记录入口。

- 公网地址：https://3352873770-rgb.github.io/mmeett-fate/
- 当前状态：[PROJECT_STATE.md](./PROJECT_STATE.md)
- 产品与维护文档：[docs/](./docs/)
- 版本记录：[CHANGELOG.md](./CHANGELOG.md)

## 本地运行

```bash
npm ci
npm run workspace:status
```

根目录 `/Users/leon/Documents/算卦` 的 `main` 是唯一的公网基线。先确认基线，再使用固定端口启动预览：

```bash
npm run workspace:baseline
npm run dev:baseline
```

基线预览固定为 `http://localhost:4173/`。功能分支或独立 worktree 使用另一固定端口，避免 Vite 在端口被占用时自动跳到难以识别的地址：

```bash
npm run dev:task
```

任务预览固定为 `http://localhost:4181/`。两组命令都启用 `--strictPort`；端口已被占用时会失败而不是静默改用其他端口。开发页面右下角会显示 `LOCAL · 分支 · 短提交 · 端口`，生产构建与 GitHub Pages 不会渲染此标识。

生产构建和本地预览使用：

```bash
npm run build
npm run preview
```

对应的固定生产预览命令为 `npm run preview:baseline`（4173）与 `npm run preview:task`（4181）。创建或更新 PR 前，在任务分支执行：

```bash
npm run workspace:release
```

它会刷新并确认 `origin/main`、工作区干净、远程仓库正确，以及当前 HEAD 已包含最新 `origin/main`。`workspace:baseline` 额外要求规范根目录、`main` 分支与 `HEAD === origin/main`。规范根目录可通过 `MMEETT_CANONICAL_ROOT` 环境变量覆盖，便于 CI 和其他机器使用。

提交前统一执行：

```bash
npm run check
```

## 主要实现

- React 19 + Vite 6
- 昼模式 LightRays 与夜模式 LiquidEther
- 按钮级 SpecularButton 描边响应与图标、文案、箭头微动效
- 桌面端与移动端自适应布局
- `prefers-reduced-motion` 无障碍降级

本项目为交互设计原型，卦象内容仅作产品体验展示，不构成现实决策建议。
