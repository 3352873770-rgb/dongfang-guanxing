# Release and Rollback

## 发布确认门禁

- 每项任务默认交付到“本地验证通过 + 草稿 PR 已创建”，此时视为待发布状态，不更新公网。
- 只有用户针对当前任务明确确认“发布”后，才能将 PR 转为可合并状态、合并 `main` 并触发 GitHub Pages。
- 用户对某一次发布的确认仅对该次任务有效，不自动延续到后续任务。
- 未获得当次确认时，不推送版本标签、不创建 GitHub Release，也不以任何其他方式绕过发布门禁。
- 本规则自当前 PR #16 完成发布后生效；PR #16 已获得用户对本次发布的明确授权。

## 发布流程

1. 在规范根目录的 `main` 执行 `npm run workspace:baseline`。此检查要求路径、分支、工作区和 `origin/main` 完全匹配；CI 或其他机器可用 `MMEETT_CANONICAL_ROOT` 配置规范路径。
2. 从最新 `main` 创建 `agent/<description>` 分支，并使用 `npm run dev:task`（4181）进行本地预览；Vite 端口冲突必须直接失败，不得静默切换端口。
3. 完成修改后执行 `npm run workspace:release` 和 `npm run check`。前者会刷新 `origin/main`，并确认任务工作区干净、远程仓库正确、当前 HEAD 已包含最新主线；它可在 PR 合并前的任务分支上通过。
4. 创建草稿 PR，记录范围、影响、验证和回滚说明；任务默认在此处停止。
5. 等待用户针对当前任务明确确认发布。
6. 获得确认后，将 PR 转为可合并状态并合并到 `main`。
7. 等待 GitHub Pages 工作流成功，验证公网地址和关键静态资源返回 HTTP 200；再在规范根目录执行 `npm run workspace:baseline`，确认新的公网基线。
8. 仅在用户确认需要正式版本时，创建 `vMAJOR.MINOR.PATCH` 标签与 GitHub Release。

## 回滚流程

1. 在 GitHub 找到最后一个正常版本标签或提交。
2. 使用 `git revert` 回退引入问题的提交，不重写 `main` 历史。
3. 通过 PR 合并回滚，触发 Pages 自动重新部署。
4. 验证公网地址恢复，并在 `CHANGELOG.md` 记录原因。

## 版本规则

- PATCH：文案、样式、兼容性和 Bug 修复。
- MINOR：新增可独立使用的页面或流程。
- MAJOR：产品结构、数据模型或交互主流程不兼容变化。
