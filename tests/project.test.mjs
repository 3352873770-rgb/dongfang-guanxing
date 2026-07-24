import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("long-term project documents exist", async () => {
  const paths = [
    "AGENTS.md",
    "PROJECT_STATE.md",
    "CHANGELOG.md",
    "docs/PRD.md",
    "docs/ROADMAP.md",
    "docs/DESIGN_SYSTEM.md",
    "docs/ARCHITECTURE.md",
    "docs/COMPONENT_MAP.md",
    "docs/QUALITY.md",
    "docs/RELEASE.md",
  ];

  for (const path of paths) {
    const info = await stat(new URL(`../${path}`, import.meta.url));
    assert.ok(info.isFile(), `${path} must be a file`);
  }
});

test("HTML mounts the upgraded hero and base-aware legacy assets", async () => {
  const html = await read("index.html");

  assert.match(html, /id="dfgx-upgrade-root"/);
  assert.match(html, /id="root"/);
  assert.match(html, /src="\/src\/upgrade-entry\.jsx"/);
  assert.match(html, /%BASE_URL%legacy\/legacy-app\.js/);
  assert.match(html, /%BASE_URL%legacy\/legacy-styles\.css/);
});

test("GitHub Pages build keeps the repository subpath", async () => {
  const config = await read("vite.config.mjs");

  assert.match(config, /GITHUB_PAGES/);
  assert.match(config, /\/dongfang-guanxing\//);
});

test("day and night atmosphere components remain wired", async () => {
  const entry = await read("src/upgrade-entry.jsx");

  assert.match(entry, /LightRays/);
  assert.match(entry, /LiquidEther/);
  assert.match(entry, /dfgx-theme-toggle/);
  assert.match(entry, /prefers-reduced-motion/);
});

test("classic title motion remains within the approved range", async () => {
  const css = await read("src/upgrade.css");
  const start = css.indexOf(".dfgx-classics span {");
  const end = css.indexOf('html[data-dfgx-theme="day"] .dfgx-classics');
  const classicCss = css.slice(start, end);
  const durations = [...classicCss.matchAll(/animation(?:-duration)?:\s*[^;]*?([0-9]+(?:\.[0-9]+)?)s/g)]
    .map((match) => Number(match[1]));

  assert.ok(durations.length >= 12, "expected staggered classic title durations");
  assert.ok(durations.every((duration) => duration >= 9.4 && duration <= 12.8));
});

test("question and tool effects stay scoped to individual buttons", async () => {
  const css = await read("src/upgrade.css");

  assert.match(css, /\.question-row:is\(:hover, :focus-visible\)/);
  assert.match(css, /\.tool-card:is\(:hover, :focus-visible\)/);
  assert.match(css, /\.question-row \.specular-button__fx/);
  assert.match(css, /\.tool-card \.specular-button__fx/);
});

test("daily hexagram CTA keeps its accessible label and 44px touch target", async () => {
  const entry = await read("src/upgrade-entry.jsx");
  const css = await read("src/upgrade.css");

  assert.match(entry, /button\.textContent = "今日卦象"/);
  assert.match(entry, /查看今日卦象详细解析/);
  assert.match(css, /#root #daily \.daily-button \{/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /border-radius:\s*12px/);
});

test("daily hexagram date follows the visitor's local calendar date", async () => {
  const entry = await read("src/upgrade-entry.jsx");

  assert.match(entry, /function formatDailyDate\(date\)/);
  assert.match(entry, /new Intl\.DateTimeFormat\("zh-CN"/);
  assert.match(entry, /time\.dateTime = toLocalIsoDate\(now\)/);
  assert.match(entry, /nextMidnight/);
});

test("hexagram atlas preview is a static grid with accessible page entry", async () => {
  const entry = await read("src/upgrade-entry.jsx");
  const css = await read("src/upgrade.css");

  assert.match(entry, /function initializeAtlasSection\(\)/);
  assert.match(entry, /openHexagramAtlas\(number\)/);
  assert.match(entry, /了解第 \$\{number\} 卦/);
  assert.match(css, /#root #atlas \.hexagram-rail \{/);
  assert.match(css, /grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /overflow:\s*visible !important/);
  assert.match(css, /#root #atlas \.atlas-next/);
});

test("hexagram knowledge route includes all 64 hexagrams and both themes", async () => {
  const entry = await read("src/upgrade-entry.jsx");
  const page = await read("src/hexagram-atlas.jsx");
  const data = await read("src/hexagram-data.js");
  const css = await read("src/hexagram-atlas.css");

  assert.match(entry, /#\\\/hexagrams/);
  assert.match(entry, /initialHexagramNumber=\{route\.number\}/);
  assert.match(page, /六十四卦总览/);
  assert.match(page, /查找卦名、序号或主题/);
  assert.match(page, /LightRays/);
  assert.match(page, /LiquidEther/);
  assert.match(css, /data-dfgx-theme="day"/);
  assert.match(css, /@media \(max-width:\s*340px\)/);

  const namesAndThemes = data.match(/^\s{2}"[^"]+",$/gm) ?? [];
  assert.equal(namesAndThemes.length, 128, "expected 64 names and 64 learning themes");
});

test("legacy compatibility bundles stay externalized and reviewable", async () => {
  const app = await stat(new URL("../public/legacy/legacy-app.js", import.meta.url));
  const styles = await stat(new URL("../public/legacy/legacy-styles.css", import.meta.url));

  assert.ok(app.size < 2_000_000, "legacy app bundle should remain below 2 MB");
  assert.ok(styles.size < 500_000, "legacy stylesheet should remain below 500 KB");
});

test("runtime entry files do not contain local absolute paths", async () => {
  const paths = [
    "index.html",
    "vite.config.mjs",
    "src/upgrade-entry.jsx",
    "src/upgrade.css",
    "src/hexagram-atlas.jsx",
    "src/hexagram-atlas.css",
    "src/hexagram-data.js",
    "public/forward-journey.html",
  ];

  for (const path of paths) {
    assert.doesNotMatch(await read(path), /\/Users\/|file:\/\//, `${path} contains a local path`);
  }
});
