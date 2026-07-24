import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { HEXAGRAMS } from "./hexagram-data.js";
import useAtmosphereVisibility from "./use-atmosphere-visibility.js";
import SecondaryPageHeader, { useDfgxTheme } from "./secondary-page-chrome.jsx";
import "./hexagram-atlas.css";

const LightRays = lazy(() => import("./components/LightRays/LightRays.jsx"));
const LiquidEther = lazy(() => import("./components/LiquidEther.jsx"));

const NIGHT_ETHER_COLORS = ["#070d0e", "#756a49", "#d2b357", "#ffffff"];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function returnToAtlasHomepage() {
  window.location.hash = "atlas";
}

function AtlasAtmosphere({ theme }) {
  const isMobile = window.matchMedia("(max-width: 720px)").matches;

  if (prefersReducedMotion) return null;

  return (
    <div className="dfgx-atlas-atmosphere" aria-hidden="true">
      {theme === "night" ? (
        <Suspense fallback={null}>
          <LiquidEther
            colors={NIGHT_ETHER_COLORS}
            mouseForce={isMobile ? 7 : 10}
            cursorSize={isMobile ? 92 : 118}
            isViscous
            viscous={52}
            iterationsViscous={isMobile ? 16 : 26}
            iterationsPoisson={isMobile ? 12 : 20}
            dt={0.011}
            resolution={isMobile ? 0.28 : 0.38}
            maxDpr={isMobile ? 1 : 1.5}
            targetFps={isMobile ? 24 : 40}
            autoSpeed={0.14}
            autoIntensity={1.2}
            takeoverDuration={0.9}
            autoResumeDelay={3000}
            autoRampDuration={2}
          />
        </Suspense>
      ) : (
        <Suspense fallback={null}>
          <LightRays
            className="dfgx-atlas-rays"
            raysOrigin="top-left"
            raysColor="#c6923d"
            raysSpeed={0.3}
            lightSpread={0.32}
            rayLength={1.55}
            pulsating={false}
            fadeDistance={1.28}
            saturation={1.08}
            followMouse
            mouseInfluence={0.05}
            noiseAmount={0.07}
            distortion={0.1}
            maxDpr={isMobile ? 1 : 1.5}
            targetFps={isMobile ? 24 : 40}
          />
        </Suspense>
      )}
    </div>
  );
}

export default function HexagramAtlasPage({ initialHexagramNumber = 1 }) {
  const heroStageRef = useRef(null);
  const [theme, setTheme] = useDfgxTheme();
  const [query, setQuery] = useState("");
  const atmosphereActive = useAtmosphereVisibility(heroStageRef);
  const selected = HEXAGRAMS[initialHexagramNumber - 1] ?? HEXAGRAMS[0];
  const normalizedQuery = query.trim().toLowerCase();
  const visibleHexagrams = normalizedQuery
    ? HEXAGRAMS.filter((hexagram) => (
      hexagram.name.toLowerCase().includes(normalizedQuery)
      || hexagram.theme.toLowerCase().includes(normalizedQuery)
      || String(hexagram.number) === normalizedQuery
    ))
    : HEXAGRAMS;

  useEffect(() => {
    document.title = `${selected.name}｜六十四卦图谱｜东方观星`;
    return () => {
      document.title = "东方观星｜观天象，问内心";
    };
  }, [selected.name]);

  function selectHexagram(number) {
    window.location.hash = `/hexagrams/${number}`;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById("hexagram-detail")?.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    });
  }

  return (
    <div className="dfgx-atlas-page">
      <div className="dfgx-atlas-hero-stage" ref={heroStageRef}>
        {atmosphereActive ? <AtlasAtmosphere theme={theme} /> : null}

        <SecondaryPageHeader theme={theme} onThemeChange={setTheme} backHash="atlas" />

        <section className="dfgx-atlas-intro" aria-labelledby="atlas-title">
          <p>东方观星 · 易学知识</p>
          <h1 id="atlas-title">六十四卦图谱</h1>
          <div className="dfgx-atlas-seal" aria-hidden="true">易</div>
          <p>
            从卦象、卦名与爻位出发，理解《周易》观察变化的基本语言。
            这里提供的是文化知识与阅读线索，不把卦象当作绝对结论。
          </p>
        </section>
      </div>

      <main className="dfgx-atlas-main">
        <section className="dfgx-atlas-guide" aria-labelledby="atlas-guide-title">
          <div className="dfgx-atlas-section-heading">
            <span>阅读方法</span>
            <h2 id="atlas-guide-title">先学会怎么看一卦</h2>
          </div>
          <ol>
            <li>
              <span>01</span>
              <div>
                <h3>看六爻</h3>
                <p>卦象由六条爻组成，自下而上阅读；阳爻与阴爻共同表达事物的结构与变化。</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>分上下卦</h3>
                <p>六爻分成上下两组三爻，由八卦两两组合，形成六十四种不同的关系情境。</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>读卦辞与爻辞</h3>
                <p>卦辞观察整体，爻辞理解位置与阶段；阅读时需要结合语境，而不是机械套用吉凶。</p>
              </div>
            </li>
          </ol>
        </section>

        <section
          className="dfgx-atlas-detail"
          id="hexagram-detail"
          aria-labelledby="hexagram-detail-title"
          tabIndex="-1"
        >
          <div className="dfgx-atlas-symbol" aria-hidden="true">{selected.symbol}</div>
          <div className="dfgx-atlas-detail-copy">
            <p>第 {String(selected.number).padStart(2, "0")} 卦</p>
            <h2 id="hexagram-detail-title">{selected.name}</h2>
            <strong>{selected.theme}</strong>
            <p>
              “{selected.theme}”是理解这一卦的第一条线索。继续阅读时，应把卦名、卦辞、
              六个爻位和所处语境放在一起观察，避免把单一词句理解成固定答案。
            </p>
          </div>
          <dl>
            <div>
              <dt>学习顺序</dt>
              <dd>卦象 → 卦名 → 卦辞 → 爻辞</dd>
            </div>
            <div>
              <dt>阅读边界</dt>
              <dd>用于理解变化，不替代现实判断</dd>
            </div>
          </dl>
        </section>

        <section className="dfgx-atlas-library" aria-labelledby="atlas-library-title">
          <div className="dfgx-atlas-library-head">
            <div className="dfgx-atlas-section-heading">
              <span>完整图谱</span>
              <h2 id="atlas-library-title">六十四卦总览</h2>
            </div>
            <label>
              <span>查找卦名、序号或主题</span>
              <input
                type="search"
                value={query}
                placeholder="例如：乾、62、小事谨慎"
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>

          <p className="dfgx-atlas-result-count" aria-live="polite">
            {normalizedQuery ? `找到 ${visibleHexagrams.length} 卦` : "按《周易》通行次序排列"}
          </p>

          <div className="dfgx-atlas-grid">
            {visibleHexagrams.map((hexagram) => (
              <button
                key={hexagram.number}
                className={hexagram.number === selected.number ? "is-selected" : ""}
                type="button"
                aria-pressed={hexagram.number === selected.number}
                onClick={() => selectHexagram(hexagram.number)}
              >
                <span className="dfgx-atlas-grid-symbol" aria-hidden="true">{hexagram.symbol}</span>
                <span className="dfgx-atlas-grid-number">
                  {String(hexagram.number).padStart(2, "0")}
                </span>
                <strong>{hexagram.name}</strong>
                <small>{hexagram.theme}</small>
              </button>
            ))}
          </div>

          {visibleHexagrams.length === 0 ? (
            <div className="dfgx-atlas-empty">
              <h3>没有找到对应卦象</h3>
              <p>可以尝试输入卦名中的一个字、1–64 的序号，或“守正”“变化”等主题。</p>
            </div>
          ) : null}
        </section>

        <footer className="dfgx-atlas-footer">
          <p>知象，是为了更清醒地看见变化。</p>
          <button type="button" onClick={returnToAtlasHomepage}>返回六十四卦入口</button>
        </footer>
      </main>
    </div>
  );
}
