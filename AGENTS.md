# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

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
