# 首页 Hero 中央字标 Design QA

## 比较目标

- Source visual truth：`docs/design/hero-mmeett-fate-wordmark-reference-v2.png`
- Source pixels：2094 × 334
- Implementation：
  - `docs/qa/hero-mmeett-fate-desktop-night-v2.png`
  - `docs/qa/hero-mmeett-fate-desktop-day-v2.png`
  - `docs/qa/hero-mmeett-fate-mobile-night-v2.png`
- CSS viewports / screenshots：1440 × 1024、390 × 844，device scale factor 1
- 补充窄屏检查：320 × 700，`documentElement.scrollWidth === clientWidth === 320`
- 状态：首页首屏，昼间与夜间主题；首屏入场动画稳定后截图
- 密度归一：所有实现截图均按 CSS viewport 1:1 输出。源图是字标局部参考，不按整页比例硬套；比较时以字形、正斜体关系、横向占幅、颜色和单行结构为准。

## Full-view comparison evidence

桌面夜间实现保留现有导航、经典书名、标语、哲思和两项操作，只替换中央字标。最终 `MMEETT Fate` 的实际边界为 928 × 137px，约占 1440px 视口宽度的 64.4%，与参考图的大幅横向占比一致。日间沿用同一结构，仅把旧金字标切换为深墨色；移动端保持单行，并保留原有信息顺序。

## Focused-region comparison evidence

已在同一次视觉比较输入中并列打开源字标图与 1440 × 1024 夜间实现截图。重点核对结果：

- `MMEETT` 使用设计稿原始的直立高对比 Cormorant Garamond 600 衬线；
- `Fate` 使用同家族斜体，并与 `MMEETT` 保持相同字号；
- 两者保持单行，字间关系和参考图一致；
- 中央不包含中文“东方观星”或重复说明行；
- 夜间为旧金色，日间为深墨色；
- 导航继续使用原官方 MMEETT 图形标/字标。

源图不包含完整页面，因此没有把它误当作整页构图参考；完整页面的其他区域以现有产品设计系统为约束。

## Required fidelity surfaces

- Fonts and typography：通过。自托管 Cormorant Garamond 600 正体与 600 斜体覆盖标题，浏览器检查 `document.fonts` 状态为 `loaded`；不依赖合成粗体，不产生外部字体请求。
- Spacing and layout rhythm：通过。桌面标题居中、横向占幅 64.4%，标题至分隔线、英文标语、哲思与 CTA 的既有节奏保留；390px 与 320px 均为单行且无横向溢出。
- Colors and visual tokens：通过。夜间沿用旧金 `#d8b568`，日间沿用深墨 `#000000`；背景动效与标题对比关系保留。
- Image quality and asset fidelity：通过。中央目标本质为可访问的文字字标，使用真实字体而非栅格截图；导航官方 SVG 品牌资产未替换。字体 WOFF2 资源已本地化并附 OFL。
- Copy and content：通过。中央精确显示 `MMEETT Fate`，无中文标题；原英文标语、中文哲思、CTA 和导航文案未改。

## Comparison history

1. 首次实现截图 `v1`：桌面标题宽约 799px，仅占视口 55.5%，相较参考图的大幅字标略显保守，判定为 P2 尺度偏小。
2. 修复：桌面标题字号从 `clamp(84px, 10.5vw, 164px)` 调整为 `clamp(92px, 12.2vw, 184px)`；当前实现保留该尺度，并统一使用设计稿原始的 Cormorant Garamond 600 正体与斜体。
3. 修复后截图 `v2`：桌面标题宽约 928px，占视口 64.4%；单行、正斜体比例和视觉中心与参考一致。390px、320px 规则不受桌面放大影响，320px 标题右边界 303.37px、页面总宽 320px。

## Interaction and runtime checks

- 昼夜切换：通过，标题结构不变，颜色正确切换。
- “开始问卦”：通过，打开“观星问卦流程”对话框；关闭操作可返回首页。
- Console：无 warning / error。
- 字体加载：正体、斜体均通过 `document.fonts.check()`。

## Findings

没有剩余 P0、P1 或 P2 问题。

## Follow-up polish

- P3：LiquidEther 的亮部偶尔会经过字标局部，这是现有动态氛围的瞬时状态；没有破坏可读性，且不需要为本次字标任务改动背景算法。

## Final result

final result: passed
