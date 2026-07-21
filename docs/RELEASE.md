# Release and Rollback

## 发布流程

1. 从最新 `main` 创建 `agent/<description>` 分支。
2. 完成修改并运行 `npm run check`。
3. 创建 PR，记录范围、影响、验证和回滚说明。
4. 合并到 `main` 后等待 GitHub Pages 工作流成功。
5. 验证公网地址和关键静态资源返回 HTTP 200。
6. 稳定版本创建 `vMAJOR.MINOR.PATCH` 标签与 GitHub Release。

## 回滚流程

1. 在 GitHub 找到最后一个正常版本标签或提交。
2. 使用 `git revert` 回退引入问题的提交，不重写 `main` 历史。
3. 通过 PR 合并回滚，触发 Pages 自动重新部署。
4. 验证公网地址恢复，并在 `CHANGELOG.md` 记录原因。

## 版本规则

- PATCH：文案、样式、兼容性和 Bug 修复。
- MINOR：新增可独立使用的页面或流程。
- MAJOR：产品结构、数据模型或交互主流程不兼容变化。
