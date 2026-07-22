# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

The homepage supports two intentionally related atmosphere modes. Preserve the same centered editorial layout, navigation, slogans, and interactions in both. Night uses LiquidEther with deep ink and antique gold; day uses LightRays on a warm rice-paper field with sunlit old gold. Keep the mode difference concentrated in background motion and contrast tokens, and retain the visible day/night switch.

For the day-mode LightRays, prefer long volumetric beams entering from above, with slow movement, a broad natural spread, gentle noise, and heavily damped cursor influence. It should feel like sunlight passing through rice paper, not a concert spotlight or a sci-fi effect.

Keep the antique-gold rays clearly visible but subordinate to the centered brand typography. The day effect should add depth and motion without reducing text contrast.

The floating classic-book titles around the homepage hero should remain calm but visibly alive. Keep their staggered vertical and horizontal drift, with varied cycles around 9.4–12.8 seconds; preserve the reduced-motion fallback.

Keep the `#ask` and `#tools` sections restrained and strictly per-button. Night and day share the same individual SpecularButton edge response plus icon, copy, and arrow micro-interactions; day recolors the response to lower-intensity tea brown and sunlit old gold. Never apply one shared glow to a whole section, or add large spotlight gradients behind these controls.

Keep the `#daily` primary action as a clearly clickable rounded-rectangle gold CTA labeled “今日卦象”. Maintain a minimum 44px touch height, dark ink text, a short arrow, and localized hover, focus-visible, and active feedback without adding glow to the whole daily card.

Keep the `#daily` date synchronized with the visitor's local calendar date, including a semantic `datetime` value and automatic refresh after local midnight; never hard-code a historical date into the visible daily card.

## Long-term project workflow

Treat `/Users/leon/Documents/算卦` as the only source of truth. Do not create or maintain a second nested project copy. Start each task by reading `PROJECT_STATE.md` and only the relevant files under `docs/`, then inspect `git status` before editing.

Do not scan or hand-edit `public/legacy/legacy-app.js` or `public/legacy/legacy-styles.css` during ordinary work; they are generated compatibility artifacts. Work in `src/` unless a task explicitly targets the legacy packaging pipeline. Ignore `node_modules`, `dist`, `.npm-cache`, screenshots, and other generated output.

After a material change, run `npm run check`. Update `PROJECT_STATE.md` when current status, risks, or next steps change; update `CHANGELOG.md` for user-visible or operational changes; add a short record under `docs/decisions/` for durable product, design, architecture, or deployment decisions.

Use one GitHub Issue per independently deliverable task and one `agent/<description>` branch per change. Keep `main` deployable. Pull requests must state scope, impact, checks, and rollback notes. GitHub Pages is the production delivery path.

The default completion boundary for each task is local verification plus a draft pull request. Do not merge into `main`, trigger a GitHub Pages production update, push a release tag, or create a GitHub Release until the user explicitly confirms publication for that specific task. A publication confirmation applies only to the current task and never carries forward to later tasks.
