import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import { HEXAGRAMS, createIChingReading, lineValueFromRoll } from "../src/iching.js";

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

test("reading flow connects question, profile, and generated result", async () => {
  const entry = await read("src/upgrade-entry.jsx");
  const flow = await read("src/reading-flow.jsx");
  const css = await read("src/reading-flow.css");
  const paper = await stat(new URL("../public/media/reading/rice-paper-bagua-v1.jpg", import.meta.url));

  assert.match(entry, /dfgx:reading-open/);
  assert.match(entry, /<ReadingFlow \/>/);
  assert.match(flow, /此刻，你想问什么/);
  assert.match(flow, /写下你真正想问的事/);
  assert.ok(flow.indexOf("选择档案") < flow.indexOf("基本信息"));
  assert.match(flow, /PROFILE_STORAGE_KEY/);
  assert.match(flow, /保存档案并起卦/);
  assert.match(flow, /卦象已成/);
  assert.equal((flow.match(/·观星问卦 ·/g) || []).length, 4);
  assert.doesNotMatch(flow, /观星问卦 · 第一步|观星问卦 · 第二步|档案信息 · 问卦前准备|观星问卦 · 卦象结果/);
  assert.doesNotMatch(flow, /选择起卦方式/);
  assert.match(await read("src/iching.js"), /crypto/);
  assert.match(flow, /越秀区/);
  assert.match(flow, /增城区/);
  assert.match(css, /\.reading-primary-action/);
  assert.match(css, /min-height:\s*62px/);
  assert.ok(paper.size < 500_000, "reading paper texture should remain lightweight");
});

test("I Ching data and four-value casting algorithm remain complete", () => {
  const hexagrams = Object.values(HEXAGRAMS);
  assert.equal(hexagrams.length, 64);
  assert.equal(new Set(hexagrams.map((hexagram) => hexagram.number)).size, 64);
  assert.ok(hexagrams.every((hexagram) => hexagram.yao.length === 6));
  assert.equal(HEXAGRAMS["777777"].name, "乾");
  assert.equal(HEXAGRAMS["888888"].name, "坤");
  assert.equal(HEXAGRAMS["787878"].name, "既济");
  assert.equal(HEXAGRAMS["878787"].name, "未济");
  assert.deepEqual([1, 2, 6, 7, 13, 14, 16].map(lineValueFromRoll), [6, 7, 7, 8, 8, 9, 9]);
  const rolls = [1, 2, 7, 14, 6, 16];
  const reading = createIChingReading(() => rolls.shift());
  assert.deepEqual(reading.lines, [6, 7, 8, 9, 7, 9]);
  assert.deepEqual(reading.changingLines, [0, 3, 5]);
  assert.equal(reading.primary.number, 6);
  assert.equal(reading.changed.number, 60);
  const allOldYin = createIChingReading(() => 1);
  assert.equal(allOldYin.primary.name, "坤");
  assert.equal(allOldYin.changed.name, "乾");
  assert.match(allOldYin.primary.extra, /用六/);
  const allOldYang = createIChingReading(() => 16);
  assert.equal(allOldYang.primary.name, "乾");
  assert.equal(allOldYang.changed.name, "坤");
  assert.match(allOldYang.primary.extra, /用九/);
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
    "public/forward-journey.html",
  ];

  for (const path of paths) {
    assert.doesNotMatch(await read(path), /\/Users\/|file:\/\//, `${path} contains a local path`);
  }
});
