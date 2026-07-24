import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import {
  HEXAGRAMS,
  createIChingReading,
  createTimeIChingReading,
  lineValueFromRoll,
  getHexagramByNumber,
} from "../src/iching.js";
import { getDailyHexagram, getDailyHexagramNumber, getUtcDayNumber } from "../src/daily-hexagram.js";
import {
  READING_STORAGE_KEY,
  getReadingRecordById,
  loadReadingRecords,
  saveReadingRecord,
} from "../src/reading-storage.js";

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
  const visibilityHook = await read("src/use-atmosphere-visibility.js");

  assert.match(entry, /LightRays/);
  assert.match(entry, /LiquidEther/);
  assert.match(entry, /dfgx-theme-toggle/);
  assert.match(entry, /prefers-reduced-motion/);
  assert.match(entry, /useAtmosphereVisibility\(heroRef\)/);
  assert.match(entry, /atmosphereActive && theme/);
  assert.match(visibilityHook, /IntersectionObserver/);
  assert.match(visibilityHook, /visibilitychange/);
  assert.match(visibilityHook, /document\.visibilityState !== "hidden"/);
});

test("classic title motion remains within the approved range", async () => {
  const css = await read("src/upgrade.css");
  const start = css.indexOf(".dfgx-classics span {");
  const end = css.indexOf('html[data-dfgx-theme="day"] .dfgx-classics');
  const classicCss = css.slice(start, end);
  const durations = [
    ...classicCss.matchAll(
      /animation(?:-duration)?:\s*[^;]*?([0-9]+(?:\.[0-9]+)?)s/g,
    ),
  ].map((match) => Number(match[1]));

  assert.ok(
    durations.length >= 12,
    "expected staggered classic title durations",
  );
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
  const daily = await read("src/daily-hexagram.js");

  assert.match(daily, /new Intl\.DateTimeFormat\("zh-CN"/);
  assert.match(entry, /time\.dateTime = toLocalIsoDate\(now\)/);
  assert.match(entry, /nextMidnight/);
});

test("daily hexagram uses one DST-safe local-calendar rotation across the entry and detail page", async () => {
  const entry = await read("src/upgrade-entry.jsx");
  const page = await read("src/daily-hexagram-page.jsx");
  const dailyCss = await read("src/daily-hexagram-page.css");
  const chrome = await read("src/secondary-page-chrome.jsx");
  const atlas = await read("src/hexagram-atlas.jsx");
  const fixed = new Date(2026, 6, 24, 12);
  assert.equal(getDailyHexagramNumber(fixed), 62);
  assert.equal(getDailyHexagram(fixed)?.fullName, "雷山小过");
  assert.equal(getDailyHexagramNumber(new Date(2026, 6, 25, 12)), 63);
  assert.equal(getUtcDayNumber(new Date("invalid")), null);
  assert.equal(getDailyHexagram(new Date("invalid")), null);
  assert.equal(getHexagramByNumber(62)?.name, "小过");
  assert.equal(getHexagramByNumber(65), null);
  assert.match(entry, /#\/daily/);
  assert.match(entry, /getDailyHexagram\(now\)/);
  assert.match(entry, /event\.stopImmediatePropagation\(\)/);
  assert.match(entry, /addEventListener\("click", openDailyHexagram, true\)/);
  assert.match(entry, /\.daily-reading.*replaceChildren/s);
  assert.match(entry, /\.daily-advice.*replaceChildren/s);
  assert.match(entry, /\.daily-symbol span.*replaceChildren/s);
  assert.match(page, /SecondaryPageHeader/);
  assert.match(atlas, /SecondaryPageHeader/);
  assert.match(chrome, /getStoredTheme/);
  assert.match(page, /经典依据/);
  assert.match(page, /现代辅助解释/);
  assert.match(page, /理性边界/);
  assert.doesNotMatch(page, /下一步|<form|LightRays|LiquidEther/);
  assert.match(dailyCss, /min-height:4[46]px/);
  assert.match(dailyCss, /@media\(max-width:340px\)/);
});

test("atlas footer return action retains a defined homepage handler", async () => {
  const atlas = await read("src/hexagram-atlas.jsx");
  assert.match(atlas, /function returnToAtlasHomepage\(\)/);
  assert.match(atlas, /onClick=\{returnToAtlasHomepage\}/);
  assert.doesNotMatch(atlas, /onClick=\{returnToHomepage\}/);
});

test("reading flow connects question, profile, and generated result", async () => {
  const entry = await read("src/upgrade-entry.jsx");
  const flow = await read("src/reading-flow.jsx");
  const archive = await read("src/profile-archive-form.jsx");
  const css = await read("src/reading-flow.css");
  const paper = await stat(
    new URL("../public/media/reading/rice-paper-bagua-v1.jpg", import.meta.url),
  );

  assert.match(entry, /dfgx:reading-open/);
  assert.match(entry, /<ReadingFlow \/>/);
  assert.match(flow, /此刻，你想问什么/);
  assert.match(flow, /所问之事/);
  assert.match(flow, /ProfileArchiveForm/);
  assert.ok(archive.indexOf("选择档案") < archive.indexOf("基本信息"));
  assert.match(archive, /PROFILE_STORAGE_KEY/);
  assert.match(flow, /保存档案并起卦/);
  assert.match(flow, /卦象已成/);
  assert.match(flow, /target\.hasAttribute\("inert"\)/);
  assert.match(flow, /target\.removeAttribute\("inert"\)/);
  assert.equal((flow.match(/·观星问卦 ·/g) || []).length, 2);
  assert.doesNotMatch(
    flow,
    /观星问卦 · 第一步|观星问卦 · 第二步|档案信息 · 问卦前准备|观星问卦 · 卦象结果/,
  );
  assert.doesNotMatch(flow, /选择起卦方式/);
  assert.doesNotMatch(
    flow,
    /下一步，写下问题|下一步，确认档案|仅保存档案|data-step="2"|reading-selected-category/,
  );
  assert.ok(
    flow.indexOf("reading-category-grid") <
      flow.indexOf("reading-question-field"),
  );
  assert.match(archive, /reading-profile-picker/);
  assert.match(
    css,
    /\.reading-profile-screen \.reading-picker-meta button\s*\{\s*min-height:\s*44px/,
  );
  assert.match(await read("src/iching.js"), /crypto/);
  assert.match(archive, /越秀区/);
  assert.match(archive, /增城区/);
  assert.match(css, /\.reading-primary-action/);
  assert.match(css, /min-height:\s*62px/);
  assert.ok(
    paper.size < 500_000,
    "reading paper texture should remain lightweight",
  );
});

test("long-term reading entries preselect a category in the same complete form", async () => {
  const entry = await read("src/upgrade-entry.jsx");
  const flow = await read("src/reading-flow.jsx");
  const categories = [
    ["relationship", "感情发展"],
    ["career", "事业发展"],
    ["study", "学业考试"],
    ["wealth", "财富运势"],
  ];

  assert.match(
    entry,
    /new Set\(\[\s*"感情发展",\s*"事业发展",\s*"学业考试",\s*"财富运势",?\s*\]\)/,
  );
  assert.match(
    entry,
    /new CustomEvent\(\s*"dfgx:reading-open",\s*\{ detail: \{ category \} \},?\s*\)/,
  );
  assert.match(
    flow,
    /category\.id === incomingCategory\s*\|\|\s*category\.name === incomingCategory/,
  );
  assert.match(flow, /setCategoryId\(matchedCategory\?\.id \|\| ""\)/);
  assert.match(flow, /setReading\(null\)/);

  for (const [id, name] of categories) {
    assert.match(flow, new RegExp(`id: "${id}",[\\s\\S]*?name: "${name}"`));
  }
});

test("five oracle entries share one accessible paper flow with adaptive fields and result sections", async () => {
  const entry = await read("src/upgrade-entry.jsx");
  const flow = await read("src/oracle-tool-flow.jsx");
  const css = await read("src/oracle-tool-flow.css");
  assert.match(entry, /dfgx:oracle-tool-open/);
  assert.match(entry, /云签解惑.*事业灵签.*流年运势.*时辰运势.*AI解读报告/s);
  assert.match(entry, /<OracleToolFlow \/>/);
  assert.match(flow, /role="dialog"/);
  assert.match(flow, /aria-modal="true"/);
  assert.match(flow, /dialogRef/);
  assert.match(flow, /target\.inert = true/);
  assert.match(flow, /target\.hasAttribute\("inert"\)/);
  assert.match(flow, /target\.removeAttribute\("inert"\)/);
  assert.match(flow, /aria-hidden/);
  assert.match(flow, /Escape/);
  assert.match(flow, /reading-paper/);
  assert.match(flow, /ToolTopbar/);
  assert.match(flow, /QuestionField/);
  assert.match(flow, /所问方向/);
  assert.match(flow, /事业情境/);
  assert.match(flow, /年度所观/);
  assert.match(flow, /人物档案/);
  assert.match(flow, /所问时刻/);
  assert.match(flow, /已保存问卦/);
  assert.match(flow, /广州现辖 11 区/);
  assert.match(flow, /手动修改/);
  assert.match(flow, /暂无已保存问卦记录/);
  assert.match(flow, /结构化解读原型/);
  assert.match(flow, /createTimeIChingReading/);
  assert.match(
    flow,
    /nextTool\.id === "cloud"[\s\S]*?"迷茫困惑"[\s\S]*?nextTool\.id === "annual"[\s\S]*?"事业发展"[\s\S]*?: ""/,
  );
  assert.match(flow, /record\.type !== "oracle-report"/);
  assert.match(flow, /<option key=\{value\} value=\{value\}>/);
  assert.match(flow, /getShanghaiDateTimeInputValue\(date\) !== value/);
  assert.match(flow, /六爻皆静，以本卦卦辞与大象为主/);
  assert.match(flow, /签象摘要/);
  assert.match(flow, /现代决策检查/);
  assert.match(flow, /年度背景/);
  assert.match(flow, /时间与地区口径/);
  assert.match(flow, /本卦、动爻、之卦/);
  assert.match(flow, /不重新起卦/);
  assert.match(css, /min-height:\s*54px/);
  assert.match(
    css,
    /\.oracle-tool-flow \.profile-archive-form \.reading-picker-meta button,[\s\S]*?\.profile-longitude \.reading-inline-action\s*\{\s*min-height:\s*44px/,
  );
  assert.match(css, /@media \(max-width: 640px\)/);
});

test("every oracle tool places one shared profile archive before adaptive fields and saves its context", async () => {
  const flow = await read("src/oracle-tool-flow.jsx");
  const inputScreenStart = flow.indexOf("const inputScreen = () => {");
  const profileUsage = flow.indexOf("{profileArchive}", inputScreenStart);
  const firstAdaptiveField = flow.indexOf('{tool.id === "cloud"', inputScreenStart);

  assert.equal((flow.match(/<ProfileArchiveForm\b/g) || []).length, 1);
  assert.ok(profileUsage > inputScreenStart);
  assert.ok(profileUsage < firstAdaptiveField);
  assert.match(
    flow,
    /tool\.id === "report" && !records\.length[\s\S]*?<p className="reading-intro">\{tool\.intro\}<\/p>[\s\S]*?\{profileArchive\}/,
  );
  assert.match(flow, /const saveCurrentProfile = \(\) => \s*\{[\s\S]*?saveProfileArchive\(/);
  assert.match(
    flow,
    /const generate = \(\) => \s*\{[\s\S]*?if \(!profile\.name\.trim\(\)\)[\s\S]*?tool\.id === "cloud"/,
  );
  assert.match(flow, /savedProfile = saveCurrentProfile\(\);[\s\S]*?profileSummary: savedProfile \? formatProfileSummary\(savedProfile\) : ""/);
  assert.match(flow, /profileSummary: inputs\.profileSummary/);
  assert.match(flow, /function ProfileContext\(/);
  assert.match(flow, /onClick=\{openReadingFromEmpty\}/);
  assert.match(flow, /const openReadingFromEmpty = \(\) => \{[\s\S]*?saveCurrentProfile\(\);[\s\S]*?dfgx:reading-open/);
});

test("reading storage keeps usable local records and supports lookup", () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
  };
  assert.deepEqual(loadReadingRecords(storage), []);
  const first = saveReadingRecord(
    {
      id: "first",
      tool: "观星问卦",
      reading: {
        primary: { fullName: "乾为天" },
        changed: { fullName: "坤为地" },
        changingLines: [],
      },
    },
    storage,
  );
  const second = saveReadingRecord(
    {
      id: "second",
      tool: "云签解惑",
      reading: {
        primary: { fullName: "地水师" },
        changed: { fullName: "山水蒙" },
        changingLines: [5],
      },
    },
    storage,
  );
  assert.equal(first.id, "first");
  assert.equal(second.id, "second");
  assert.equal(loadReadingRecords(storage).length, 2);
  assert.equal(getReadingRecordById("first", storage)?.tool, "观星问卦");
  assert.ok(values.get(READING_STORAGE_KEY));
});

test("main reading and all oracle tools reuse one profile archive component", async () => {
  const archive = await read("src/profile-archive-form.jsx");
  const reading = await read("src/reading-flow.jsx");
  const oracle = await read("src/oracle-tool-flow.jsx");

  assert.match(reading, /from "\.\/profile-archive-form\.jsx"/);
  assert.match(oracle, /from "\.\/profile-archive-form\.jsx"/);
  assert.match(reading, /<ProfileArchiveForm/);
  assert.match(oracle, /<ProfileArchiveForm/);
  assert.match(archive, /saveProfileArchive/);
  assert.match(archive, /广州现辖 11 区/);
  assert.match(archive, /经度（自动）/);
  assert.match(archive, /getGuangzhouLongitude\(current\.district/);
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
  assert.deepEqual(
    [1, 2, 6, 7, 13, 14, 16].map(lineValueFromRoll),
    [6, 7, 7, 8, 8, 9, 9],
  );
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
  const timed = createTimeIChingReading(new Date("2026-07-24T02:00:00Z"));
  assert.equal(timed.primary.number, 7);
  assert.equal(timed.changed.number, 4);
  assert.deepEqual(timed.changingLines, [5]);
  assert.equal(timed.context.yearName, "丙午");
  assert.equal(timed.context.branchName, "巳时");
  assert.equal(timed.context.yearBranchIndex, 7);
  assert.equal(timed.context.timezone, "Asia/Shanghai");
  assert.equal(createTimeIChingReading(new Date("invalid")), null);
  assert.equal(createTimeIChingReading("2026-07-24"), null);
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
  assert.match(page, /useAtmosphereVisibility\(heroStageRef\)/);
  assert.match(page, /dfgx-atlas-hero-stage/);
  assert.match(page, /atmosphereActive \? <AtlasAtmosphere/);
  assert.match(css, /\.dfgx-atlas-atmosphere \{\s*position:\s*absolute/);
  assert.doesNotMatch(css, /\.dfgx-atlas-atmosphere \{\s*position:\s*fixed/);
  assert.match(css, /data-dfgx-theme="day"/);
  assert.match(css, /@media \(max-width:\s*340px\)/);

  const namesAndThemes = data.match(/^\s{2}"[^"]+",$/gm) ?? [];
  assert.equal(namesAndThemes.length, 128, "expected 64 names and 64 learning themes");
});

test("legacy compatibility bundles stay externalized and reviewable", async () => {
  const app = await stat(
    new URL("../public/legacy/legacy-app.js", import.meta.url),
  );
  const styles = await stat(
    new URL("../public/legacy/legacy-styles.css", import.meta.url),
  );

  assert.ok(app.size < 2_000_000, "legacy app bundle should remain below 2 MB");
  assert.ok(
    styles.size < 500_000,
    "legacy stylesheet should remain below 500 KB",
  );
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
    assert.doesNotMatch(
      await read(path),
      /\/Users\/|file:\/\//,
      `${path} contains a local path`,
    );
  }
});
