# 019 手机端根页面横向约束

- 状态：已采纳
- 日期：2026-07-24

## 决定

在现役 `src/upgrade.css` 中统一约束 `html`、`body`、`#dfgx-upgrade-root` 与 `#root`：

- 宽度不超过移动端视口；
- 使用 `overflow-x: hidden` 作为兼容回退；
- 浏览器支持时升级为 `overflow-x: clip`；
- 根滚动容器使用 `overscroll-behavior-x: none` 阻止横向回弹串联。

顶部导航的 `.dfgx-nav-links` 继续保留自己的 `overflow-x: auto` 和局部 overscroll containment，不因根页面约束失去小屏幕下的可访问性。

## 原因

Hero 光效和按钮高光包含刻意超出容器的绘制区域。只在 `body` 上隐藏横向溢出，无法稳定约束部分移动浏览器所使用的 `html` 根滚动容器，用户仍可能左右拖动整页。

## 回滚

回滚本决定时应同时恢复根节点 CSS 与对应测试，并重新验证 320px、375px 和 390px 视口下的整页横向滚动宽度。
