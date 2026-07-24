# 018 MMEETT Fate 仓库与 Pages 路径统一

- 状态：已采纳
- 日期：2026-07-24

## 决定

GitHub 仓库统一使用 `mmeett-fate`，生产地址统一为：

https://3352873770-rgb.github.io/mmeett-fate/

Vite 的 GitHub Pages 基础路径同步使用 `/mmeett-fate/`。仓库名、构建路径、文档链接和品牌名保持一致。

## 原因

只修改品牌文案而不修改仓库与构建子路径，会让新公网地址缺少部署产物或引用旧路径下的静态资源。统一命名可避免 Pages 白屏、失效链接和后续发布配置分叉。

## 回滚

如需恢复旧仓库名，应同时恢复 GitHub 仓库名称、Vite Pages 基础路径、公开链接和相关测试，再重新触发 Pages 部署。
