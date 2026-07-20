# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

The homepage supports two intentionally related atmosphere modes. Preserve the same centered editorial layout, navigation, slogans, and interactions in both. Night uses LiquidEther with deep ink and antique gold; day uses LightRays on a warm rice-paper field with sunlit old gold. Keep the mode difference concentrated in background motion and contrast tokens, and retain the visible day/night switch.

For the day-mode LightRays, prefer long volumetric beams entering from above, with slow movement, a broad natural spread, gentle noise, and heavily damped cursor influence. It should feel like sunlight passing through rice paper, not a concert spotlight or a sci-fi effect.

Keep the antique-gold rays clearly visible but subordinate to the centered brand typography. The day effect should add depth and motion without reducing text contrast.

The floating classic-book titles around the homepage hero should remain calm but visibly alive. Keep their staggered vertical and horizontal drift, with varied cycles around 9.4–12.8 seconds; preserve the reduced-motion fallback.

Keep the `#ask` and `#tools` sections restrained and strictly per-button. Night and day share the same individual SpecularButton edge response plus icon, copy, and arrow micro-interactions; day recolors the response to lower-intensity tea brown and sunlit old gold. Never apply one shared glow to a whole section, or add large spotlight gradients behind these controls.
