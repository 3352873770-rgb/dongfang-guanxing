# 东方观星昼夜模式 Design QA

- source visual truth path: `/Users/leon/.codex/visualizations/2026/07/20/019f7eca-3282-7933-bace-7e5639ff7214/night-desktop-settled.png`
- implementation screenshot path: `/Users/leon/.codex/visualizations/2026/07/20/019f7eca-3282-7933-bace-7e5639ff7214/day-light-rays-desktop.png`
- responsive screenshot path: `/Users/leon/.codex/visualizations/2026/07/20/019f7eca-3282-7933-bace-7e5639ff7214/day-light-rays-mobile.png`
- viewport: 1440 × 1024 desktop; 390 × 844 mobile
- state: day mode initial state, night/day toggle, and primary CTA scroll

## Full-view comparison evidence

- Layout: the centered brand title, bilingual lines, rotating slogan, primary/secondary actions, floating navigation, and first-viewport spacing remain aligned with the night source.
- Typography: the same Kai/Song display stack and UI typography are preserved; only contrast tokens change for the light field.
- Palette: night remains deep ink with antique gold; day uses a softly shaded rice-paper field, ink typography, and sunlit old gold.
- Asset treatment: the day hero now uses the requested React Bits LightRays JS/CSS WebGL component; the night hero keeps LiquidEther.
- Motion: the two modes keep the same reveal rhythm and reduced-motion handling. Day mode now uses long volumetric rays from the upper-left with slow drift, gentle distortion, and strongly damped cursor influence.
- Responsive behavior: the 390 × 844 capture has no horizontal overflow; navigation ends at 139 px and the title begins at 272 px, so the primary visual is not obscured.

## Focused comparison evidence

- The day/night control remains in the same right-side navigation slot and exposes an updated accessible label after each switch.
- Day mode renders one `.dfgx-light-rays canvas`, no Ferrofluid canvas, and no LiquidEther canvas; night mode renders one LiquidEther canvas and no LightRays canvas.
- Day mode uses the warm rice-paper gradient and preserves the dark ink title contrast.
- Desktop body width is 1440/1440 and mobile body width is 390/390, confirming no horizontal overflow.
- `开始观星问卦` moves `#ask` into view; observed `#ask` top was 144 px on mobile.

## Findings

- No actionable P0/P1/P2 visual or interaction findings remain.
- P3: LiquidEther may emit a Three.js `Clock` deprecation warning in night mode. It is pre-existing, does not affect rendering, and is unrelated to the LightRays day mode.

## Comparison history

- Pass 1: the first day capture was taken during the entrance transition, so rotating slogan opacity had not settled.
- Fix: waited for the stage and atmosphere transitions before the final capture.
- Pass 2: final desktop and mobile captures show complete typography, the active Ferrofluid background, stable layout, and working mode/CTA interactions.
- Pass 3: day-mode parameters were opened up after user feedback. The first tuning pass produced small drifting spots, so scale was increased and sharpness reduced; the final render shows broad smoke bands with restrained gold highlights and no content collision.
- Pass 4: the direction changed from broad smoke to fine long-lived lines. Rim width and speed were reduced, sharpness and glow raised, and two desktop frames several seconds apart were checked to confirm slow rather than rapid recomposition.
- Pass 5: antique-gold segments were added to the moving contours. The light-background shader output was corrected so hue is not lost through repeated alpha attenuation; final desktop and mobile captures show intermittent gold among the ink-gray lines.
- Pass 6: the day Ferrofluid layer was replaced by React Bits LightRays. The first centered, wide spread was too uniform on pale paper; the final direction moves the source to the upper-left, narrows the spread, preserves the gold hue through the shader, and adds more tonal separation to the paper background.

## Interaction and browser checks

- Page identity: `东方观星｜观天象，问内心` at `http://127.0.0.1:4173/`.
- Framework overlay: none.
- Relevant console errors: none.
- Day → night → day switch: passed.
- Theme persistence after reload: passed.
- Primary CTA scroll to `#ask`: passed.

final result: passed

---

# Design QA：观星问卦与人物档案流程

## 对比目标

- 视觉源稿：`docs/design/profile-archive-form-v2.png`
- 浏览器实现：`src/reading-flow.jsx`、`src/reading-flow.css`
- 实现截图：
  - `screenshots/reading-flow-profile-mobile-existing.png`
  - `screenshots/reading-flow-category-desktop.png`
  - `screenshots/reading-flow-wide-full-bleed.png`
- 合并对比证据：`screenshots/profile-source-vs-implementation-v2.png`

## 视口与归一化

- 源稿像素：852 × 1846，纵横比 0.4615。
- 移动端实现截图：390 × 844，CSS 视口 390 × 844，deviceScaleFactor 1，纵横比 0.4621。
- 桌面端实现检查：1440 × 1024。
- 宽屏铺底检查：2048 × 1158。
- 最小宽度检查：320 × 700。
- 对比板将源稿和 390px 实现按相同显示宽度并列，均从页面顶部开始；源稿是完整长页，浏览器证据同时保留真实视口截图。

## 状态

- 有档案状态：`陈知远 · 本人` 已选中，出生信息自动回填。
- 问卦流程：所问分类 -> 具体问题 -> 档案确认 -> 起卦方式。
- 主题：问卦流程统一使用米纸、墨色与旧金界面。

## 全视图对比

- 构图与层级：通过。档案选择位于基本信息之上，标题、分节、表单和主操作顺序与源稿一致。
- 字体与排版：通过。标题使用楷体/宋体回退，表单正文使用系统中文字体；字重、字距和层级接近源稿。
- 间距与布局节奏：通过。移动端保持标签与控件并排，桌面端内容限制在可读宽度；320px、390px、1440px 和 2048px 均无水平溢出。
- 色彩与视觉 token：通过。米白宣纸、墨黑正文、旧金选中态和低对比分隔线与源稿一致。
- 图像质量：通过。使用 315KB 的独立宣纸八卦 JPG 素材，没有以 CSS 图形或页面截图冒充背景；2048px 宽屏纹理覆盖全宽。
- 文案与内容：通过。保留“选择档案”“基本信息”“出生时间”“出生地点”“使用此档案开始问卦”等关键文案；按用户标注移除顶部数字进度提示。

## 聚焦区域对比

- 档案下拉：选中档案、出生摘要、自动回填说明和“新建档案”入口均可见、可操作。
- 基本信息：姓名与三段性别选择结构一致。
- 出生时间：公历/农历、年月日、时间和十二时辰均可操作；年月会限制有效日期。
- 出生地点：广东省 / 广州市 / 11 区联动，经度自动匹配且支持手动修改。
- 主操作：使用档案继续、仅保存档案和返回修改均可操作。

## 浏览器交互验证

- Hero“开始观星问卦”从第一步打开。
- “长期问卦”四类按钮预选方向后直接进入问题输入。
- 问题不足 6 个字符时阻止继续。
- 没有档案时进入新建状态；已有档案时下拉默认选择并完整回填。
- 档案保存到本设备后，关闭并重新进入仍可选择。
- 1996 年 1 月 31 日切换到 2 月后自动收敛为 29 日。
- 经度从自动只读切换为手动可编辑。
- 两种起卦方式可切换，主按钮文案同步变化。
- 弹层打开时底层首页设为 inert；关闭后恢复并将焦点返回原入口。
- 新开问卦会清理上一轮问题与启动状态。
- 最终干净页面控制台无错误；仅保留项目已知的 Three.js Clock 弃用警告。

## 比较历史

1. 初次检查发现步骤切换后保留旧滚动位置，档案页从中部出现。已在每次步骤变化时滚回流程顶部，复查通过。
2. 初次移动端对比发现档案字段纵向堆叠、密度明显高于源稿。已恢复移动端标签与控件并排，并缩紧档案页间距，复查通过。
3. 宽屏检查发现宣纸纹理只覆盖中间约 1000px，左右露出纯底色。已将背景改为随容器宽度铺满并纵向延伸；2048 × 1158 复查无留白、无横向溢出。
4. Sol 代码检查发现 HMR 重复 Root、旧问题串入新流程、无效日期、延时残留和弹层焦点隔离问题；由 Terra 完成代码修复，Sol 浏览器回归通过。
5. 用户标注顶部四步数字进度提示不需要。已完整移除其组件、文案与专属样式；320 × 700 复查元素数量为 0，页面无横向溢出。

## 遗留 P3

- 实现保留比静态源稿更大的触控尺寸，便于手机操作；不影响视觉方向。
- 真实铜钱投掷、时间排卦、卦象生成与解读尚未接入，属于下一阶段产品范围。

## 结论

final result: passed
