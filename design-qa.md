# 灵签信二级工具 Design QA

- source visual truth: `.artifacts/design-qa/long-term-reading-mobile-viewport.jpg`
- implementation screenshot: `.artifacts/design-qa/oracle-annual-mobile-viewport.jpg`
- combined comparison: `.artifacts/design-qa/comparison-long-term-vs-annual-mobile-viewport.jpg`
- viewport: `390 × 844` CSS px
- source pixels: `390 × 844`
- implementation pixels: `390 × 844`
- device scale factor: `1`
- density normalization: none required
- state: 输入页首屏；长期问卦“感情发展”已预选，对比流年运势默认年度与关注方向

## Full-view comparison

长期问卦与流年运势使用相同的 64px sticky topbar、居中 390px 移动端画布、米纸八卦背景、楷体主标题、宋体章节标题、茶棕正文、旧金状态和 24px 左右安全边距。流年页没有建立第二套导航、卡片或色彩系统；新增信息通过既有章节标题、表单控件和纵向节奏组织。

流年页的年份、观察范围和关注方向使用表单型控件而非长期问卦的分类卡片。这是字段性质导致的有意差异，不改变页面骨架。具体问题和人物档案继续沿用同一套标题、输入和共享档案组件。

## Focused-region comparison

未单独增加局部裁切。组合图原始分辨率足以直接检查页眉、标题、章节标记、选择控件、问题输入、背景纹理和人物档案起始位置。

## Required fidelity surfaces

- Fonts and typography: 两页共享楷体展示标题、宋体章节标题和无衬线表单正文；字号、字距和行高保持同一层级。
- Spacing and layout rhythm: 主内容宽度、章节间距、分隔线、输入圆角与纵向留白一致。390px 和 1440px 均无横向溢出。
- Colors and visual tokens: 暖米纸、墨色标题、茶棕正文与古金状态完全复用 `reading-flow.css`。
- Image quality and asset fidelity: 两页使用同一张 `rice-paper-bagua-v1.jpg`，无临时占位图、CSS 图案或伪造素材。
- Copy and content: 流年页只增加年份、范围、关注方向和共享人物档案；未引入步骤提示或第二套流程术语。

## Interaction and accessibility evidence

- 五个首页入口均能打开对应中文命名的 `role="dialog"`。
- 打开后背景设置 `inert` 和 `aria-hidden`，关闭后属性与入口焦点正确恢复。
- 输入页只保留一个主操作，结果返回时已填内容保留。
- 390px 视口无横向溢出；所有可见 button、input、select 和 textarea 高度不低于 44px。
- 云签、事业、流年、时辰和 AI 报告的主要路径均已在浏览器中操作。
- AI 报告读取真实本地问卦记录，并排除已经生成的 AI 报告，避免报告套报告。
- 浏览器控制台无 error；仅保留项目已知的 Three.js Clock 弃用 warning。

## Findings

无 P0、P1 或 P2 视觉与交互问题。

P3：流年输入页较长期问卦增加年份、范围和人物档案，完整页面更长；当前以自然滚动承载，符合项目“用信息连续替代步骤堆叠”的既定原则。

## Comparison history

1. 首轮浏览器检查发现弹层关闭后 `inert` 未移除，后续首页入口对键盘和辅助技术不可操作。
2. 修复两个流程的属性恢复逻辑后，关闭状态的 `inert` 与 `aria-hidden` 均正确恢复，后续五个入口可以连续使用。
3. 移动端检查发现共享档案内“新建档案”和“手动修改”高度为 40px。
4. 调整为至少 44px 后复查，所有可见交互控件均达到触控尺寸要求。

final result: passed
