# MMEETT Fate 品牌字体设计 QA

## 对照对象

- source visual truth path: `docs/design/mmeett-fate-brand-home-v1.png`
- implementation URL: `http://127.0.0.1:4176/`
- implementation screenshot path: `docs/qa/mmeett-fate-brand-desktop-night-v1.jpg`
- full-view comparison evidence: `docs/qa/mmeett-fate-brand-reference-comparison-v1.jpg`
- responsive evidence:
  - `docs/qa/mmeett-fate-brand-mobile-night-v1.jpg`
  - `docs/qa/mmeett-fate-brand-mobile-day-v1.jpg`
- source pixels: 1487 × 1058 PNG
- implementation pixels: 1487 × 1058 JPEG
- CSS viewport: 1487 × 1058
- device density normalization: source and implementation use the same pixel dimensions and a 1× CSS viewport; no resampling was required before the full-view comparison
- primary state: homepage, night theme, initial viewport

## Required Fidelity Surfaces

- Fonts and typography: `Cormorant Garamond` 600 normal renders `MMEETT`; the matching 600 italic renders `Fate`. The single-line relationship, high-contrast strokes, optical hierarchy, letter spacing and mobile wrapping match the selected direction. Chinese display copy remains in the existing restrained Songti stack and utility text remains in the existing sans stack.
- Spacing and layout rhythm: the centered editorial composition, floating navigation, wordmark scale, separator, copy stack and CTA rhythm remain aligned with the source while preserving the product's existing responsive structure. At 390 × 844 and 320 × 700, the wordmark does not wrap and the document has no horizontal overflow.
- Colors and visual tokens: night uses antique gold on deep ink; day remaps the same components to tea brown on warm rice paper. Both themes use one component tree and shared token overrides.
- Image quality and asset fidelity: the selected mock is preserved as the design source. No logo image was rasterized into the product; the wordmark is live, selectable type. Existing LightRays and LiquidEther backgrounds were deliberately retained, so the animated night capture can contain a moving light form that is absent from the static mock.
- Copy and content: `EASTERN SYMBOLS · INNER CLARITY`, `READ THE SIGNS · MEET YOURSELF`, “观象知变，向内而行”, “以《周易》为根，循象观变” and “开始问卦” match the approved design.

## Full-view and Focused Comparison

The native-size side-by-side image verifies the complete frame: navigation, small brand signature, descriptor, main wordmark, rule, English line, Chinese copy and both actions. A separate crop was not needed because all brand-critical typography is legible at the native 1487 × 1058 comparison size. DOM measurement additionally confirmed the final desktop wordmark is 708.4 px wide and the primary CTA remains 220 × 62 px.

## Comparison History

### Iteration 1

- [P2] The first implementation rendered the main wordmark in ivory instead of antique gold.
- [P2] The small `MMEETT Fate` signature above the descriptor and the rule below the main wordmark were missing.
- [P2] Legacy nested-span rules reduced the navigation wordmark's intended type size.
- Fixes: changed the night wordmark token to `#d8b568`, added the shared small lockup and semantic rule, and removed the obsolete nested-span overrides.
- Post-fix evidence: `docs/qa/mmeett-fate-brand-reference-comparison-v1.jpg`.

### Iteration 2

- [P2] The corrected desktop wordmark remained wider and slightly higher than the selected mock.
- Fixes: reduced the desktop maximum from 132 px to 116 px, brought the measured width to 708.4 px, and shifted the desktop editorial group 24 px lower without changing the mobile layout.
- Post-fix evidence: `docs/qa/mmeett-fate-brand-desktop-night-v1.jpg`.

## Findings

No actionable P0, P1 or P2 differences remain.

- [P3] The source mock includes a tiny diamond at the center of the horizontal rule. The implementation keeps a clean hairline instead of introducing a fabricated ornamental asset.
- [P3] LiquidEther produces a moving highlight in the night screenshot. This is an intentional retained product behavior rather than a second brand layout.

## Interaction, Responsive and Runtime Checks

- Day/night toggle updates the same homepage component tree and preserves brand hierarchy.
- “开始问卦” opens the existing full reading form and retains the selected theme.
- The daily secondary route renders the shared `MMEETT Fate` header, has the title `小过｜今日卦象｜MMEETT Fate`, and has no horizontal overflow at 390 px or 320 px.
- Homepage checks passed at 1487 × 1058, 390 × 844 and 320 × 700.
- Browser logs contain no runtime error or warning. Development-only Vite connection and hot-update debug entries were observed during editing.
- `npm run check` passes all 28 tests plus normal and GitHub Pages production builds.

## Final Result

final result: passed
