# 003 GitHub Pages 发布

- 状态：已采纳
- 日期：2026-07-21

## 决定

公开仓库的 `main` 是生产源。GitHub Actions 构建 Vite 并发布到：

https://3352873770-rgb.github.io/mmeett-fate/

## 原因

该流程提供稳定公网链接、可追溯提交和可逆发布历史。生产问题通过 revert PR 回滚，不直接修改 Pages 产物。
