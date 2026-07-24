# 东方观星项目状态

更新日期：2026-07-24

## 当前基线

- 正式源码：仓库根目录 `/Users/leon/Documents/算卦`
- 线上地址：https://3352873770-rgb.github.io/dongfang-guanxing/
- 正式分支：`main`
- 当前版本：`1.0.0`
- 技术栈：React 19、Vite 6、OGL、Three.js
- 发布方式：任务默认停在本地验证与草稿 PR；用户逐次确认发布后才合并 `main`，再由 GitHub Actions 发布 GitHub Pages

## 已完成

- 一级首页与移动端自适应布局
- 昼模式 LightRays 与夜模式 LiquidEther
- 昼夜主题切换与本地偏好保存
- 首页经典书名错峰漂移动效
- 长期问卦与推荐工具的逐按钮 SpecularButton 交互
- 六十四卦图谱、人格入口、日签与记录入口
- 今日一卦使用真实本地日期与醒目的金色“今日卦象”操作按钮
- 首页六十四卦图谱使用无横向滚动的静态网格，并可进入昼夜双模式知识二级页
- 首页与六十四卦知识页的 WebGL 氛围仅在 Banner 可见时挂载，滚出首屏或页面进入后台后自动卸载
- GitHub Pages 公网发布
- 根目录唯一源码、长期项目文档与自动质量检查基线
- 逐任务明确确认的公网发布门禁，避免完成任务后自动更新线上版本

## 当前架构边界

- `src/upgrade-entry.jsx` 负责新版首页 Hero、主题切换和原页面增强。
- `public/legacy/legacy-app.js` 与 `legacy-styles.css` 提供下半页兼容内容。
- `src/App.jsx` 与 `src/main.jsx` 当前不由 `index.html` 加载，保留为后续 Legacy 源码迁移参考，不应被误认为线上入口。

## 已知问题

- Legacy 兼容内容仍以生成后的 Bundle 交付，缺少从 React 源码自动生成该 Bundle 的正式脚本。
- LiquidEther 依赖的 Three.js Clock 存在弃用警告，但不影响当前渲染。
- 当前自动检查覆盖结构、关键交互契约和生产构建，尚未覆盖真实浏览器端到端截图回归。
- 六十四卦知识页及 Banner 动效性能收敛已在 `agent/hexagram-atlas-knowledge` 分支本地实现，尚未获得本任务的公网发布确认。

## 下一步

1. [#5](https://github.com/3352873770-rgb/dongfang-guanxing/issues/5)：建立 Legacy Bundle 的可重复构建或逐段迁移到正常 React 组件。
2. [#6](https://github.com/3352873770-rgb/dongfang-guanxing/issues/6)：增加桌面端、390px 移动端、昼夜切换和核心按钮的浏览器端到端测试。
3. [#7](https://github.com/3352873770-rgb/dongfang-guanxing/issues/7)：处理 Three.js Clock 弃用警告并记录性能基线。
4. [#8](https://github.com/3352873770-rgb/dongfang-guanxing/issues/8)：基于当前主线重建离线单文件分享版。
5. 按 `docs/ROADMAP.md` 通过 GitHub Issues 推进二级页面，而不扩大当前一级首页范围。

## 接手规则

新任务先读取 `AGENTS.md`、本文件和任务相关的 `docs/` 文档。不要扫描依赖、构建产物或 Legacy Bundle；通过 `docs/COMPONENT_MAP.md` 定位代码。
