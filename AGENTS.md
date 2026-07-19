# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Keep the long homepage calm and breathable: use a consistent, generous vertical gap between major sections, with a slightly tighter but still spacious mobile rhythm. Do not enlarge card internals just to create page-level breathing room.

The recommended-tools controls should read as balanced visual tiles, not long narrow list rows: use four columns on wide screens and two columns on tablet/mobile, with centered icon-and-copy composition.

Keep the mobile primary CTA compact rather than nearly full-width: target roughly two-thirds of the viewport with reduced height and type scale, while preserving it as the dominant action.

## Accepted design direction

- Latest source of truth: the 2026-07-19 user-supplied long-page “东方观星” screenshot (`codex-clipboard-63ccb551-56d2-466d-98d8-f9f637da2dbf.png`). It supersedes the earlier v2 board when the two differ.
- Match its long-page composition: centered circular video window, deep teal-black paper texture, antique-gold accents, warm parchment daily card, restrained Song-style typography, compact card internals with generous major-section spacing, and one dominant CTA.
- Preserve its first-level section order with the approved new feature inserted at the requested point: hero, two-column question panel, daily hexagram, personality map, four-part rationale, hexagram atlas, recommended tools, record/reflection panel, minimal disclaimer footer.
- The personality-map feature uses an open two-column composition: editorial introduction and three-step explanation on the left, one large clickable personality-test visual on the right; stack it vertically on mobile.
- Keep prototype motion reproducible in Figma: use component variants, Smart Animate, opacity, translation, scale, hover/press states, and After Delay loops. Avoid web-only scroll listeners, cursor physics, particles, or effects that cannot be handed off as normal Figma layers.
- Clicking the primary “开始问卦” CTA must trigger the six-dot loading transition before the interface moves to the question-selection panel; preserve its reduced-motion fallback.
- Build only the responsive first-level homepage. Do not add secondary routes or product flows.
- Desktop is judged at 1440px wide; mobile is judged at 390px wide and must not horizontally overflow.
- Use the supplied video as the hero media, with muted playback, a visible play/pause control, and a reduced-motion poster fallback.
