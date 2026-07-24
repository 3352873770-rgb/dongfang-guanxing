# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## MMEETT Fate 品牌系统

品牌名称统一为 “MMEETT Fate”。英文主字标使用同家族的高对比衬线：`MMEETT` 为直立全大写，`Fate` 为优雅斜体；通过共享 `src/brand-lockup.jsx` 在首页导航、Hero 与二级页页眉中复用，禁止重新手写字标。优先自托管 `Cormorant Garamond` 所需字重，中文继续使用系统宋体与无衬线字体，不引入大型中文网络字体。

Hero 字标必须保持单行并在移动端不换行。英文说明固定为 “EASTERN SYMBOLS · INNER CLARITY”，英文标语固定为 “READ THE SIGNS · MEET YOURSELF”，中文标语固定为“观象知变，向内而行”，支撑文案固定为“以《周易》为根，循象观变”，主 CTA 显示“开始问卦”。保留既有导航标签、昼夜主题、页面布局与业务流程；全站现役页面 title 与 SEO 使用 MMEETT Fate 品牌。

The homepage supports two intentionally related atmosphere modes. Preserve the same centered editorial layout, navigation, slogans, and interactions in both. Night uses LiquidEther with deep ink and antique gold; day uses LightRays on a warm rice-paper field with sunlit old gold. Keep the mode difference concentrated in background motion and contrast tokens, and retain the visible day/night switch.

昼夜主题必须共用同一套页面、路由、组件树、内容数据和交互逻辑；禁止为了主题复制页面或维护两套组件。首页选择的主题是全站唯一主题状态，进入问卦、灵签、日签、卦图或其他二级流程时必须继续呈现同一主题。主题差异通过根级 `data-dfgx-theme` 和共享 CSS 变量完成，优先切换背景氛围及保证可读性所需的前景对比，不在各页面建立独立主题状态。

For the day-mode LightRays, prefer long volumetric beams entering from above, with slow movement, a broad natural spread, gentle noise, and heavily damped cursor influence. It should feel like sunlight passing through rice paper, not a concert spotlight or a sci-fi effect.

Keep the antique-gold rays clearly visible but subordinate to the centered brand typography. The day effect should add depth and motion without reducing text contrast.

The floating classic-book titles around the homepage hero should remain calm but visibly alive. Keep their staggered vertical and horizontal drift, with varied cycles around 9.4–12.8 seconds; preserve the reduced-motion fallback.

Keep LightRays and LiquidEther strictly scoped to the visible banner container on both the homepage and the six-four-hexagram knowledge page. Unmount the WebGL atmosphere when its banner leaves the viewport or the document becomes hidden; content below the banner uses only static theme backgrounds.

Keep the `#ask` and `#tools` sections restrained and strictly per-button. Night and day share the same individual SpecularButton edge response plus icon, copy, and arrow micro-interactions; day recolors the response to lower-intensity tea brown and sunlit old gold. Never apply one shared glow to a whole section, or add large spotlight gradients behind these controls.

Keep the `#daily` primary action as a clearly clickable rounded-rectangle gold CTA labeled “今日卦象”. Maintain a minimum 44px touch height, dark ink text, a short arrow, and localized hover, focus-visible, and active feedback without adding glow to the whole daily card.

Keep the `#daily` date synchronized with the visitor's local calendar date, including a semantic `datetime` value and automatic refresh after local midnight; never hard-code a historical date into the visible daily card.

The “今日卦象” journey uses exactly two page states: homepage daily entry -> one complete daily result page. Organize the result as continuous vertical sections on that single page; do not add steps, “下一步”, separate interpretation pages, or a profile/form gate.

The homepage card and result page must derive from the same local-date daily-hexagram function, so date, hexagram name, theme, and symbol always agree and refresh after local midnight. Disclose that the product uses a stable local-calendar rotation for cultural reading rather than presenting it as a traditional casting method. Separate verified classic text from modern reflection prompts, keep all interpretation non-deterministic, and provide one path into the matching six-four-hexagram knowledge page.

## 灵签信二级工具

“云签解惑”“事业灵签”“流年运势”“时辰运势”“AI 解读报告”统一复用“长期问卦”的完整表单排版、页眉、宣纸容器、章节节奏和唯一主操作，不为每个工具另造一套视觉版式。

五个工具只按实际任务自适应增减必要输入；用户完成填写后，结果页再根据工具性质调整元素层级与内容结构。继续遵守“单页填写 → 直接结果”的简化流程，不增加无业务必要的步骤页。

五个工具的输入页都必须把共享人物档案组件放在工具专属字段之前：先选择已有档案或新建并填写，再填写该工具自己的问题、年份、时刻或记录。档案选择、新建、编辑、地区和经度继续复用同一个 `ProfileArchiveForm` 与本地存储，不复制表单。

所有工具生成结果时保存并关联当前人物档案，但不能因此伪造术数逻辑：只有原本明确依赖出生背景的工具才可把出生信息纳入计算；云签、事业灵签、时辰运势和 AI 解读报告只把人物档案用于区分用户与保存记录，不得暗示出生日期参与了原有起卦或报告算法。传统术数内容必须标明所用起卦或解释口径，古籍原文与现代解释分层呈现，不虚构经典原文，也不把结果包装成确定性预测或现实决策替代。

## 推荐小工具二级页

“三枚铜钱”“八字排盘”“六爻排卦”“紫微命盘”“周时起卦”“塔罗抽牌”等推荐工具统一采用单页完整任务流：玩法说明、必要选择、需要填写的信息、实际操作区和唯一主操作都在同一个连续页面内呈现，不拆成步骤页，不使用“下一步”制造无业务必要的跳转。

用户完成该工具所需的全部信息和操作后，直接在当前页面切换到结果状态；结果应保留用户刚刚填写的上下文，并在同一页面继续呈现结果摘要、详细解析、依据说明和理性使用边界。不同工具只调整必要字段、玩法组件与结果结构，必须复用现有二级页页眉、昼夜主题、字体、圆角、描边、间距和按钮语言，保持为同一个产品。

推荐工具二级页以当前“今日卦象”和“六十四卦”二级页为直接视觉参考，不新增独立插画体系。避免石盘、祭坛、山水大图、撕边宣纸和其他占据主要版面的装饰性插画；优先依靠排版、留白、细分隔线、克制的描边容器和现有图标建立层级，必要的玩法图形也应小型化并服务于操作。

## 人格偏好探索二级页

人格测试复用现有二级页的页眉、昼夜切换和单页连续阅读结构。页面大标题位于 Banner 中心；日间沿用暖米纸、顶部柔和日光与淡墨山水，夜间使用对应的深墨与旧金对比。动态氛围只存在于 Banner，表单和结果内容区使用静态主题背景。

12 道题在同一页面内以语义化表单纵向排列并一次性提交。每道题固定使用两行结构：第一行只放题号与完整问题；第二行最左和最右分别放两端倾向文本，中间等距放置五个单选点。中间点代表中立，选择点越靠近某端文本，表示该端意愿越强。不得把倾向文本插入五个点之间；移动端也必须保留两端含义、中心中立语义、完整键盘焦点和至少 44px 的触控目标。

提交后在同一路由、同一页面切换到结果状态。结果首先呈现一张独立人格卡片，包含当前类型倾向、四组偏好轴、边界维度提示和非确定性说明；卡片下方再用连续编辑式章节介绍该人格的思考方式、自然优势、可能盲区、关系倾向与成长建议。不得把类型包装成心理诊断、能力等级、职业定论或固定命运。

`docs/design/personality-preference-flow-v1.png` 是当前人格偏好探索二级页的视觉源；实现时保持 Banner、表单、人格卡片和连续介绍的层级、密度和节奏。

首页人格入口使用 `public/media/legacy/personality-preference-v2.webp`。该预览固定呈现四组偏好轴、深靛墨纸与旧金线条，并使用“人格偏好探索”“12题 · 约3分钟”“开始探索”以及“偏好不是能力，类型不是固定标签”的语义；不得退回八卦八维雷达或诊断式表达。

## 二级页固定导航与退出

人格偏好、今日卦象、六十四卦知识、三枚铜钱及后续长内容二级页必须复用 `SecondaryPageHeader`。共享页眉在纵向滚动时固定在视口上方，并始终提供可见的“返回首页”或“返回工具”退出操作；用户不应为了退出当前流程而滚回页面顶部。

固定页眉继续保留品牌入口和昼夜切换，日夜只调整现有主题 token。桌面端与移动端均需避让安全区，返回操作与主题开关保持至少 44px 触控高度，页眉不得被 Banner 的 `overflow` 或 `contain` 截断，也不得造成横向溢出或遮挡主要内容。

## 档案与问卦前置流程

各流程页眉统一使用“·观星问卦 ·”，不显示步骤或阶段说明。

Before a user enters the casting flow, require them to select an existing人物档案 or create a new one. Saved profiles must be reusable so repeat users do not re-enter birth data for every reading.

Implement the人物档案 selector and editable birth-information form as one shared component. “观星问卦”、流年运势 and future features that require birth information must reuse the same component and storage behavior instead of copying profile markup or maintaining separate field logic.

Treat the profile gate as shared routing logic for every feature that requires birth information:

- no saved profile -> open the shared profile form with empty fields and an inline “新建档案” state -> save successfully -> return to and continue the originally requested feature;
- one or more saved profiles -> open the same profile form with a “选择档案” dropdown above “基本信息” -> selecting a profile auto-fills the form -> confirm and continue the originally requested feature.

Do not create a standalone profile-selection page in this flow. Preserve the originating feature and its selected context while the user creates or selects a profile. Do not send the user back to the homepage after profile completion. Even when only one profile exists, show it in the dropdown for confirmation before continuing, and keep an inline “新建档案” entry available.

The primary “开始观星问卦” journey is a four-step full-screen flow: choose one question category -> write one concrete question -> select/create and confirm a人物档案 -> review the context and choose a casting method. The homepage hero starts at the category step; the four “长期问卦” category buttons may enter at the question step with their category preselected. Back navigation must preserve the category, question, and profile context.

The profile form includes姓名、性别、出生日期、历法（公历/农历）、出生时间、对应十二时辰、省/市/区所在地和经度。Treat公历/农历 as one calendar-mode switch for the same birth date, not two independent date fields; store the converted counterpart for later calculation.

Location selection must use a maintainable province/city/district cascade. The first design scope uses广州 as the example and includes its current 11 districts. Auto-fill a longitude from the selected region, clearly label it as an automatic match, and always provide a manual longitude-edit path.

Use `docs/design/profile-archive-form-v2.png` as the current visual source of truth for both the no-profile and existing-profile states. The integrated “选择档案” dropdown sits above “基本信息”; choosing an item auto-fills the editable birth-information form below. `docs/design/profile-archive-form-v1.png` and `docs/design/profile-selector-v1.png` are retained only as historical drafts and must not drive implementation. Preserve the warm rice paper, ink typography, antique-gold controls, restrained section dividers, and one clear continuation action.

Keep the homepage `#atlas` preview as a static responsive grid with no horizontal scrolling, carousel arrows, or pagination dots. Every visible hexagram entry must be keyboard, mouse, and touch accessible and open the hash-routed six-four-hexagram knowledge page focused on that entry. The knowledge page must preserve the shared day/night structure and theme toggle, remain educational rather than predictive, and avoid horizontal overflow down to 320px.

## Long-term project workflow

Treat `/Users/leon/Documents/算卦` as the only source of truth. Do not create or maintain a second nested project copy. Start each task by reading `PROJECT_STATE.md` and only the relevant files under `docs/`, then inspect `git status` before editing.

Do not scan or hand-edit `public/legacy/legacy-app.js` or `public/legacy/legacy-styles.css` during ordinary work; they are generated compatibility artifacts. Work in `src/` unless a task explicitly targets the legacy packaging pipeline. Ignore `node_modules`, `dist`, `.npm-cache`, screenshots, and other generated output.

After a material change, run `npm run check`. Update `PROJECT_STATE.md` when current status, risks, or next steps change; update `CHANGELOG.md` for user-visible or operational changes; add a short record under `docs/decisions/` for durable product, design, architecture, or deployment decisions.

Use one GitHub Issue per independently deliverable task and one `agent/<description>` branch per change. Keep `main` deployable. Pull requests must state scope, impact, checks, and rollback notes. GitHub Pages is the production delivery path.

Use `agent/prototype-current` as the single integration branch for the current unpublished product. New feature branches start from this integration branch and merge back into it after their own verification; do not keep stacking one feature branch on top of another as the long-term workflow. `main` remains the public production branch and only receives the integrated prototype after explicit publication approval.

The default completion boundary for each task is local verification plus a draft pull request. Do not merge into `main`, trigger a GitHub Pages production update, push a release tag, or create a GitHub Release until the user explicitly confirms publication for that specific task. A publication confirmation applies only to the current task and never carries forward to later tasks.
