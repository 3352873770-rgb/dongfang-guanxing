# 024：工作区身份与发布前校验

- 状态：Accepted
- 日期：2026-07-24
- 关联 Issue：#52

## 背景

同一仓库可同时存在规范根目录、多个 Git worktree 与多个 Vite 预览端口。Vite 默认会在端口占用时自动选择下一个端口，容易让本地页面、分支和公网基线被误认成同一个版本。

## 决策

- 规范根目录的 `main` 使用 `dev:baseline` / `preview:baseline`，固定 4173 并启用 `--strictPort`。
- 任务分支与 worktree 使用 `dev:task` / `preview:task`，固定 4181 并启用 `--strictPort`。
- `workspace:baseline` 校验规范根目录、`main`、干净工作区、正确远程和 `HEAD === origin/main`；规范路径可通过 `MMEETT_CANONICAL_ROOT` 配置。
- `workspace:release` 在 PR 前刷新 `origin/main`，校验干净工作区、正确远程和任务 HEAD 已包含最新主线；预期远程可通过 `MMEETT_EXPECTED_ORIGIN` 配置。
- Vite 启动时读取分支与短提交，仅在 `import.meta.env.DEV` 时显示不可交互的本地身份标识。生产构建和 GitHub Pages 不渲染该标识。

## 影响

- 本地开发页面可直接辨认所属分支、提交和端口，减少误把草稿当成公网版本的风险。
- 端口冲突需要显式处理，而不是产生一个未记录的新本地地址。
- 发布检查依赖可访问 `origin` 来刷新远程主线；网络不可用时应停止发布验证，而不是基于过期引用继续。
