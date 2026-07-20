import React, { lazy, Suspense, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import BorderGlow from "./components/BorderGlow.jsx";
import LiquidEther from "./components/LiquidEther.jsx";
import "./upgrade.css";

const LightRays = lazy(() => import("./components/LightRays/LightRays.jsx"));

const SLOGANS = [
  "以星为镜，照见本心",
  "一问天地，一见自己",
  "顺时而观，向内而行",
];

const CLASSIC_TITLES = [
  "《周易》",
  "《易传》",
  "《系辞》",
  "《说卦》",
  "《序卦》",
  "《杂卦》",
  "《梅花易数》",
  "《皇极经世》",
  "《彖传》",
  "《象传》",
  "《文言》",
  "《焦氏易林》",
];

const NAV_ITEMS = [
  { id: "ask", label: "问卦" },
  { id: "daily", label: "日签" },
  { id: "personality", label: "人格" },
  { id: "atlas", label: "卦图" },
  { id: "tools", label: "工具" },
  { id: "record", label: "记录" },
];

const NIGHT_ETHER_COLORS = ["#070d0e", "#756a49", "#d2b357", "#ffffff"];
const BORDER_GLOW_THEMES = {
  day: {
    glowColor: "39 68 54",
    colors: ["#7a552b", "#d6ad62", "#fff1cd"],
    backgroundColor: "rgba(177, 137, 66, 0.9)",
  },
  night: {
    glowColor: "45 88 72",
    colors: ["#75652c", "#dfbd59", "#fff6d5"],
    backgroundColor: "rgba(202, 159, 64, 0.9)",
  },
};
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function UpgradeHero() {
  const [sloganIndex, setSloganIndex] = useState(0);
  const [activeSection, setActiveSection] = useState("dfgx-top");
  const [theme, setTheme] = useState(() => {
    try {
      const storedTheme = window.localStorage.getItem("dfgx-theme");
      return storedTheme === "night" || storedTheme === "day" ? storedTheme : "day";
    } catch {
      return "day";
    }
  });
  const borderGlowTheme = BORDER_GLOW_THEMES[theme];

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    const timer = window.setInterval(() => {
      setSloganIndex((current) => (current + 1) % SLOGANS.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleSectionChange = (event) => setActiveSection(event.detail);
    window.addEventListener("dfgx:section-change", handleSectionChange);
    return () => window.removeEventListener("dfgx:section-change", handleSectionChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.dfgxTheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      theme === "day" ? "#e8dfd1" : "#0b1112",
    );
    try {
      window.localStorage.setItem("dfgx-theme", theme);
    } catch {
      // The theme still works when storage is unavailable.
    }
  }, [theme]);

  function scrollToSection(selector, block = "center") {
    document.querySelector(selector)?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block,
    });
  }

  function handleNavigation(event, selector) {
    event.preventDefault();
    scrollToSection(selector, "start");
  }

  return (
    <>
      <header className="dfgx-floating-nav">
        <a
          className={`dfgx-nav-brand ${activeSection === "dfgx-top" ? "is-active" : ""}`}
          href="#dfgx-top"
          onClick={(event) => handleNavigation(event, "#dfgx-top")}
        >
          <span>东方观星</span>
          <small>ORIENTAL ASTROLOGY</small>
        </a>

        <nav className="dfgx-nav-links" aria-label="页面导航">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={activeSection === item.id ? "location" : undefined}
              onClick={(event) => handleNavigation(event, `#${item.id}`)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          className="dfgx-theme-toggle"
          type="button"
          data-theme={theme}
          aria-pressed={theme === "day"}
          aria-label={`切换为${theme === "night" ? "昼" : "夜"}间主题`}
          title={`当前：${theme === "day" ? "昼" : "夜"}间主题`}
          onClick={() => setTheme((current) => (current === "night" ? "day" : "night"))}
        >
          <span className={theme === "day" ? "is-active" : ""}>昼</span>
          <i aria-hidden="true" />
          <span className={theme === "night" ? "is-active" : ""}>夜</span>
        </button>
      </header>

      <section className="dfgx-upgrade" id="dfgx-top">
      {theme === "night" && !prefersReducedMotion ? (
        <div className="dfgx-ether" aria-hidden="true">
          <LiquidEther
            colors={NIGHT_ETHER_COLORS}
            mouseForce={15}
            cursorSize={132}
            isViscous
            viscous={48}
            iterationsViscous={40}
            iterationsPoisson={30}
            dt={0.011}
            resolution={0.48}
            autoSpeed={0.2}
            autoIntensity={1.9}
            takeoverDuration={0.8}
            autoResumeDelay={2600}
            autoRampDuration={1.8}
          />
        </div>
      ) : null}

      {theme === "day" ? (
        <div className="dfgx-light-rays" aria-hidden="true">
          <Suspense fallback={null}>
            <LightRays
              className="dfgx-light-rays-canvas"
              raysOrigin="top-left"
              raysColor="#d0a04a"
              raysSpeed={prefersReducedMotion ? 0 : 0.42}
              lightSpread={0.28}
              rayLength={1.72}
              pulsating={false}
              fadeDistance={1.22}
              saturation={1.18}
              followMouse={!prefersReducedMotion}
              mouseInfluence={prefersReducedMotion ? 0 : 0.08}
              noiseAmount={0.08}
              distortion={prefersReducedMotion ? 0 : 0.14}
            />
          </Suspense>
        </div>
      ) : null}

      <div className="dfgx-classics" aria-hidden="true">
        {CLASSIC_TITLES.map((title) => (
          <span key={title}>{title}</span>
        ))}
      </div>

      <div className="dfgx-editorial">
        <p className="dfgx-brandline">东方观星 · ORIENTAL ASTROLOGY</p>

        <h1 aria-label="东方观星">
          <span>东方</span>
          <span>观星</span>
        </h1>

        <p className="dfgx-english">READ THE HEAVENS · KNOW THYSELF</p>

        <div className="dfgx-philosophy" aria-live="polite">
          <p key={sloganIndex}>{SLOGANS[sloganIndex]}</p>
          <p>以《周易》为根，循象观变</p>
        </div>

        <div className="dfgx-actions">
          <BorderGlow
            className="dfgx-primary-glow"
            edgeSensitivity={18}
            glowColor={borderGlowTheme.glowColor}
            backgroundColor={borderGlowTheme.backgroundColor}
            borderRadius={999}
            glowRadius={10}
            glowIntensity={theme === "day" ? 0.3 : 0.42}
            coneSpread={18}
            animated={!prefersReducedMotion}
            colors={borderGlowTheme.colors}
            fillOpacity={theme === "day" ? 0.035 : 0.06}
          >
            <button className="dfgx-primary" type="button" onClick={() => scrollToSection("#ask")}>
              开始观星问卦
            </button>
          </BorderGlow>
          <button className="dfgx-secondary" type="button" onClick={() => scrollToSection("#atlas")}>
            浏览六十四卦
          </button>
        </div>

        <button className="dfgx-explore" type="button" onClick={() => scrollToSection("#ask")}>
          <span>探索诸术</span>
        </button>
      </div>
      </section>
    </>
  );
}

function disableOriginalHero() {
  const originalHero = document.querySelector("#root .hero");
  const originalHeader = document.querySelector("#root .site-header");
  if (!originalHero || !originalHeader) return false;

  originalHero.setAttribute("aria-hidden", "true");
  originalHeader.setAttribute("aria-hidden", "true");
  const video = originalHero.querySelector("video");
  if (video) {
    video.pause();
    video.removeAttribute("src");
    video.load();
  }
  return true;
}

function initializeLegacyReveal() {
  const root = document.getElementById("root");
  if (!root || root.dataset.dfgxRevealReady === "true") return;

  const sections = root.querySelectorAll(".section-shell");
  if (!sections.length) return;

  root.dataset.dfgxRevealReady = "true";
  const nestedGroups = ".tool-grid, .reason-grid, .personality-steps, .reflection-steps, .hexagram-rail";
  const revealItems = [];

  sections.forEach((section) => {
    let order = 0;

    Array.from(section.children).forEach((element) => {
      const items = element.matches(nestedGroups)
        ? Array.from(element.children)
        : [element];

      items.forEach((item) => {
        item.classList.add("dfgx-reveal");
        item.style.setProperty("--dfgx-reveal-order", String(Math.min(order, 7)));
        revealItems.push(item);
        order += 1;
      });
    });
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initializeSectionNavigation() {
  const root = document.getElementById("root");
  if (!root || root.dataset.dfgxNavReady === "true") return;

  const sections = [
    document.getElementById("dfgx-top"),
    ...NAV_ITEMS.map((item) => document.getElementById(item.id)),
  ].filter(Boolean);

  if (sections.length !== NAV_ITEMS.length + 1) return;
  root.dataset.dfgxNavReady = "true";

  let currentSection = "";
  let ticking = false;

  const update = () => {
    const marker = window.scrollY + Math.min(window.innerHeight * 0.34, 280);
    let nextSection = sections[0].id;

    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      if (sectionTop <= marker) nextSection = section.id;
    });

    if (nextSection !== currentSection) {
      currentSection = nextSection;
      window.dispatchEvent(new CustomEvent("dfgx:section-change", { detail: nextSection }));
    }
    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();
}

function prepareOriginalContent() {
  if (!disableOriginalHero()) return false;
  initializeLegacyReveal();
  initializeSectionNavigation();
  return true;
}

createRoot(document.getElementById("dfgx-upgrade-root")).render(
  <React.StrictMode>
    <UpgradeHero />
  </React.StrictMode>,
);

if (!prepareOriginalContent()) {
  const observer = new MutationObserver(() => {
    if (prepareOriginalContent()) observer.disconnect();
  });
  observer.observe(document.getElementById("root"), { childList: true, subtree: true });
}
