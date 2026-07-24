# 首页 Hero MMEETT Fate 字标

- 日期：2026-07-24
- 状态：已采纳

## 范围与原因

`docs/design/hero-mmeett-fate-wordmark-reference-v2.png` 确认为首页 Hero 中央字标的视觉源。该位置改为仅呈现单行 `MMEETT Fate`，使用设计稿原始的 Cormorant Garamond 600 高对比衬线建立首屏主视觉：`MMEETT` 为直立大写，`Fate` 为同字号的同家族 600 斜体。移除中央重复的 “Fate” 说明行与中文“东方观星”，避免品牌层级分散。

导航和二级页仍使用 `src/brand-lockup.jsx` 的官方 MMEETT 图形标/字标，不改变导航识别或共享页眉。

## 响应式与主题策略

Hero 通过 `@fontsource/cormorant-garamond` 的自托管 600 正体与 600 斜体渲染，不产生运行时外部字体请求。桌面字标按约 60–70% 可用视口宽度的比例扩展；移动端使用受容器限制的流式字号，保持单行且不产生横向溢出。既有 staged entrance 与 reduced-motion 回退继续用于标题。

昼夜共用同一标题结构和字体：夜间使用旧金色，日间使用深墨色；仅通过共享主题 token 调整对比，LightRays、LiquidEther、文案、CTA 和业务交互不变。

## 回滚

恢复 `src/upgrade-entry.jsx` 的 Hero `BrandLockup` 渲染及其对应样式，并移除 Cormorant Garamond 600 字体引入即可。导航和二级页的共享官方字标不受影响。
