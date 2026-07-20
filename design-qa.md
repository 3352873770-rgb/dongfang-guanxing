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
