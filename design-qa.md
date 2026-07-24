# 三枚铜钱单页二级界面 Design QA

## Comparison target

- Source visual truth: `/Users/leon/.codex/generated_images/019f9239-98f8-73b1-bc4f-117407ff161c/call_sPOG8pW2yJcOF0PU4gCjUxO2.png`
- Source evidence copy: `/Users/leon/.codex/visualizations/2026/07/24/019f9239-98f8-73b1-bc4f-117407ff161c/source-visual-826x1905.png`
- Implementation route: `http://127.0.0.1:4173/#/tools/three-coins`
- Pass 1 implementation: `/Users/leon/.codex/visualizations/2026/07/24/019f9239-98f8-73b1-bc4f-117407ff161c/implementation-pass-1-390-day-complete.png`
- Pass 1 combined comparison: `/Users/leon/.codex/visualizations/2026/07/24/019f9239-98f8-73b1-bc4f-117407ff161c/comparison-pass-1.png`
- Pass 2 implementation: `/Users/leon/.codex/visualizations/2026/07/24/019f9239-98f8-73b1-bc4f-117407ff161c/implementation-pass-2-390-day-complete.png`
- Pass 2 combined comparison: `/Users/leon/.codex/visualizations/2026/07/24/019f9239-98f8-73b1-bc4f-117407ff161c/comparison-pass-2.png`

## Viewport, density, and state

- CSS viewport: `390 × 844`.
- Theme: day.
- State: 事业 selected; question is `近期是否适合推进新的项目计划？`; all six casts are complete; the result is expanded on the same page.
- Deterministic comparison reading: `雷山小过 → 水火既济`; moving lines are 初爻、四爻、五爻.
- Source pixels: `826 × 1905`.
- Source normalization: shown at `390px` width, producing `390 × 899.45` displayed pixels. Effective source density is `826 / 390 = 2.118`.
- Implementation density: browser capture is one output pixel per CSS pixel.
- Pass 1 implementation pixels: `390 × 2953`.
- Pass 2 implementation pixels: `390 × 2432`.
- Browser: Chrome was used because the Codex in-app browser surface was unavailable.

## Full-view comparison evidence

`comparison-pass-1.png` and `comparison-pass-2.png` place the source and browser-rendered implementation together in one image at the same displayed width. Pass 2 shows the corrected spacing, result hierarchy, and CTA copy.

The implementation remains taller than the normalized concept image. The remaining difference is intentional and non-actionable:

- The source concept depicts two small face controls per line, while the actual three-coin method must expose three independent coin records.
- The source's normalized controls are below the product's 44px touch-target requirement.
- The implementation includes the verified classic judgement, `《象》`, all changing-line text, action advice, risk warning, and rational boundary; the source uses abbreviated placeholder copy.

Removing those differences would break the agreed casting model, accessibility requirement, or result-content integrity.

## Focused-region evidence

Separate crop files were not required. The original-resolution source, both 390px implementation captures, and the combined comparison files preserve readable typography and control detail when opened at original size. There are no photographic, illustrative, or masked raster assets requiring an additional image-quality crop; the important focused regions are the header/form, six cast rows, CTA, hexagram pair, and text sections, all visible in the combined evidence.

## Findings

### Resolved P1 — avoidable vertical-density drift

- Location: mobile layout in `src/three-coin-page.css`.
- Evidence: pass 1 was `390 × 2953`, with an oversized textarea, 100px cast rows, and broad chapter/result spacing. The source uses a much tighter editorial rhythm.
- Impact: the main task felt substantially longer and the cast/result relationship was harder to scan.
- Fix: reduced mobile page and chapter padding, category/form gaps, textarea height, cast-list gap, cast-row height, result glyph scale, result-section padding, and reset spacing while retaining all 44px controls.
- Post-fix evidence: pass 2 is `390 × 2432`, a reduction of 521px or 17.6%, with no horizontal overflow.
- Status: resolved. Remaining height is required by real three-coin controls, 44px targets, and complete verified content.

### Resolved P2 — result name hierarchy differed from the source

- Location: `HexagramReading` in `src/three-coin-page.jsx`.
- Evidence: pass 1 used `雷山小过` and `水火既济` as primary headings with ordinal numbers below. The source uses `小过` and `既济` as the display names, with the full names as secondary context.
- Impact: the result pair was visually heavier and less faithful to the selected target.
- Fix: use `name` for the display heading and `fullName` for the supporting line.
- Post-fix evidence: pass 2 shows `小过 / 雷山小过` and `既济 / 水火既济`.
- Status: resolved.

### Resolved P2 — completed-state CTA copy drift

- Location: primary result action in `src/three-coin-page.jsx`.
- Evidence: pass 1 displayed `更新结果`; the source keeps `生成结果`.
- Impact: copy changed the perceived action model even when no input had changed.
- Fix: keep the primary action label `生成结果`.
- Post-fix evidence: pass 2 combined comparison.
- Status: resolved.

## Required fidelity surfaces

- Fonts and typography: the implementation preserves the source's Kai/Song editorial hierarchy, antique-gold headings, restrained body weight, and readable Chinese line height. Exact source font metadata is unavailable; the project-approved `Kaiti SC`, `STKaiti`, `KaiTi`, `Songti SC`, and `STSong` fallbacks are visually consistent. Result title hierarchy was corrected in pass 2.
- Spacing and layout rhythm: major avoidable mobile spacing drift was corrected. Three-column category wrapping, three coin controls per row, wider mobile content, and the shared two-row header are intentional responsive/accessibility adaptations.
- Colors and tokens: warm rice-paper background, tea-brown body copy, antique-gold selected states, fine brown dividers, and low-elevation surfaces match the source direction. Contrast remains stronger than the source where needed for readability.
- Image quality and asset fidelity: the source contains no body illustration or photographic asset. The implementation adds none. Brand text and standard Unicode hexagram symbols remain sharp and avoid placeholder imagery.
- Copy and content: category, question, section names, primary action, result names, and rational boundary are coherent. Additional classic text is verified product content rather than prompt leakage or filler.
- Icons: the only icon-like marks are the short arrow and standard hexagram symbols; both align with the source's restrained treatment.
- States and interactions: question entry, six sequential casts, per-coin manual adjustment, result generation, same-page expansion, and day theme were exercised in the browser.
- Responsiveness and accessibility: the 390px capture has no horizontal overflow. Coin buttons remain `44 × 44`, the primary action is 56px high, semantic labels are present, focus styles exist, and reduced-motion handling remains intact.
- Console: no implementation `error` or `warning` entries were observed during the final browser pass.

## Accepted differences

- `返回工具` remains instead of source copy `返回首页` because the implementation returns users to the originating tools section.
- The category controls wrap to two rows at 390px instead of compressing six sub-44px controls into one row.
- Every cast displays three independently adjustable coins instead of the concept image's two small face controls.
- The shared secondary-page header remains taller than the source concept so brand, back action, and theme toggle each preserve usable touch targets.
- Result evidence is longer than the source because it uses verified classic content and explicitly separates action advice, risk, and rational boundaries.

## Comparison history

1. Pass 1 found one P1 and two P2 issues: avoidable mobile density, incorrect result-name hierarchy, and completed CTA copy drift.
2. The implementation was tightened without changing task structure, casting math, content integrity, or accessibility.
3. Pass 2 re-captured the same viewport, day theme, question, six cast values, and `小过 → 既济` result. All prior P1/P2 issues are resolved; no actionable P0/P1/P2 finding remains.

## Follow-up polish

- P3: add automated screenshot regression when the project's planned browser E2E baseline becomes available.

final result: passed
