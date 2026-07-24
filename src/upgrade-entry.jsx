import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import BorderGlow from "./components/BorderGlow.jsx";
import useAtmosphereVisibility from "./use-atmosphere-visibility.js";
import "./upgrade.css";

const LightRays = lazy(() => import("./components/LightRays/LightRays.jsx"));
const LiquidEther = lazy(() => import("./components/LiquidEther.jsx"));
const HexagramAtlasPage = lazy(() => import("./hexagram-atlas.jsx"));

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

function getHexagramRoute() {
  const match = window.location.hash.match(/^#\/hexagrams(?:\/(\d{1,2}))?$/);
  if (!match) return null;

  const requestedNumber = Number(match[1] ?? 1);
  return {
    kind: "hexagrams",
    number: Math.min(64, Math.max(1, Number.isFinite(requestedNumber) ? requestedNumber : 1)),
  };
}

function openHexagramAtlas(number = 1) {
  window.location.hash = `/hexagrams/${number}`;
}

function getRenderProfile() {
  const isMobile = window.matchMedia("(max-width: 720px)").matches;
  const saveData = navigator.connection?.saveData === true;
  const lowMemory = typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 4;
  const lowCoreCount = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;

  return {
    isMobile,
    isConstrained: isMobile && (saveData || lowMemory || lowCoreCount),
  };
}

function UpgradeHero() {
  const heroRef = useRef(null);
  const [sloganIndex, setSloganIndex] = useState(0);
  const [activeSection, setActiveSection] = useState("dfgx-top");
  const [renderProfile, setRenderProfile] = useState(getRenderProfile);
  const [theme, setTheme] = useState(() => {
    try {
      const storedTheme = window.localStorage.getItem("dfgx-theme");
      return storedTheme === "night" || storedTheme === "day" ? storedTheme : "day";
    } catch {
      return "day";
    }
  });
  const atmosphereActive = useAtmosphereVisibility(heroRef);
  const borderGlowTheme = BORDER_GLOW_THEMES[theme];

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 720px)");
    const updateRenderProfile = () => setRenderProfile(getRenderProfile());
    mobileQuery.addEventListener("change", updateRenderProfile);
    navigator.connection?.addEventListener?.("change", updateRenderProfile);

    return () => {
      mobileQuery.removeEventListener("change", updateRenderProfile);
      navigator.connection?.removeEventListener?.("change", updateRenderProfile);
    };
  }, []);

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

      <section className="dfgx-upgrade" id="dfgx-top" ref={heroRef}>
      {atmosphereActive && theme === "night" && !prefersReducedMotion ? (
        <div className="dfgx-ether" aria-hidden="true">
          <Suspense fallback={null}>
            <LiquidEther
              colors={NIGHT_ETHER_COLORS}
              mouseForce={renderProfile.isMobile ? 10 : 15}
              cursorSize={renderProfile.isMobile ? 112 : 132}
              isViscous
              viscous={48}
              iterationsViscous={renderProfile.isMobile ? 20 : 40}
              iterationsPoisson={renderProfile.isMobile ? 16 : 30}
              dt={0.011}
              resolution={renderProfile.isConstrained ? 0.28 : renderProfile.isMobile ? 0.34 : 0.48}
              maxDpr={renderProfile.isMobile ? 1 : 2}
              targetFps={renderProfile.isMobile ? 30 : 60}
              autoSpeed={0.2}
              autoIntensity={1.9}
              takeoverDuration={0.8}
              autoResumeDelay={2600}
              autoRampDuration={1.8}
            />
          </Suspense>
        </div>
      ) : null}

      {atmosphereActive && theme === "day" ? (
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
              maxDpr={renderProfile.isMobile ? 1 : 2}
              targetFps={renderProfile.isMobile ? 30 : 60}
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
          <a className="dfgx-secondary" href="#/hexagrams/1">
            浏览六十四卦
          </a>
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

function initializeAtlasSection() {
  const atlas = document.querySelector("#root #atlas");
  const rail = atlas?.querySelector(".hexagram-rail");
  if (!atlas || !rail || atlas.dataset.dfgxAtlasReady === "true") return Boolean(atlas && rail);

  atlas.dataset.dfgxAtlasReady = "true";
  rail.setAttribute("aria-label", "六十四卦知识入口");

  Array.from(rail.children).forEach((entry, index) => {
    const number = index + 1;
    const label = entry.textContent?.trim().replace(/\s+/g, " ") || `第 ${number} 卦`;
    entry.classList.add("dfgx-atlas-entry");
    entry.dataset.hexagramNumber = String(number);

    if (entry.tagName === "BUTTON") {
      entry.setAttribute("type", "button");
    } else {
      entry.setAttribute("role", "link");
      entry.setAttribute("tabindex", "0");
    }

    entry.setAttribute("aria-label", `了解第 ${number} 卦：${label}`);
    entry.setAttribute("title", `进入六十四卦知识页：${label}`);

    entry.addEventListener("click", (event) => {
      event.preventDefault();
      openHexagramAtlas(number);
    });

    entry.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openHexagramAtlas(number);
    });
  });

  return true;
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

function formatDailyDate(date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function toLocalIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function updateDailyDate() {
  const time = document.querySelector("#root #daily time");
  if (!time) return false;

  const now = new Date();
  time.textContent = formatDailyDate(now);
  time.dateTime = toLocalIsoDate(now);
  return true;
}

function scheduleDailyDateRefresh() {
  updateDailyDate();
  const now = new Date();
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  window.setTimeout(scheduleDailyDateRefresh, nextMidnight.getTime() - now.getTime() + 1000);
}

function initializeDailySection() {
  const root = document.getElementById("root");
  const button = document.querySelector("#root #daily .daily-button");
  const time = document.querySelector("#root #daily time");
  if (!root || !button || !time) return false;

  if (button.dataset.dfgxDailyCtaReady !== "true") {
    button.dataset.dfgxDailyCtaReady = "true";
    button.textContent = "今日卦象";
    button.setAttribute("aria-label", "查看今日卦象详细解析");
    button.setAttribute("title", "查看今日卦象详细解析");
  }

  if (root.dataset.dfgxDailyDateReady !== "true") {
    root.dataset.dfgxDailyDateReady = "true";
    scheduleDailyDateRefresh();
  } else {
    updateDailyDate();
  }
  return true;
}

function prepareOriginalContent() {
  if (!disableOriginalHero()) return false;
  if (!initializeDailySection()) return false;
  if (!initializeAtlasSection()) return false;
  initializeLegacyReveal();
  initializeSectionNavigation();
  return true;
}

function UpgradeApp() {
  const [route, setRoute] = useState(getHexagramRoute);

  useEffect(() => {
    const updateRoute = () => setRoute(getHexagramRoute());
    window.addEventListener("hashchange", updateRoute);
    window.addEventListener("popstate", updateRoute);
    window.addEventListener("resize", updateRoute);
    return () => {
      window.removeEventListener("hashchange", updateRoute);
      window.removeEventListener("popstate", updateRoute);
      window.removeEventListener("resize", updateRoute);
    };
  }, []);

  useEffect(() => {
    if (route?.kind === "hexagrams") {
      document.documentElement.dataset.dfgxRoute = "hexagrams";
      window.scrollTo({ top: 0, behavior: "auto" });
    } else {
      delete document.documentElement.dataset.dfgxRoute;
      if (window.location.hash === "#atlas") {
        window.requestAnimationFrame(() => {
          document.getElementById("atlas")?.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start",
          });
        });
      }
    }

    return () => {
      delete document.documentElement.dataset.dfgxRoute;
    };
  }, [route]);

  if (route?.kind === "hexagrams") {
    return (
      <Suspense fallback={<div className="dfgx-route-loading">正在展开六十四卦图谱…</div>}>
        <HexagramAtlasPage initialHexagramNumber={route.number} />
      </Suspense>
    );
  }

  return <UpgradeHero />;
}

createRoot(document.getElementById("dfgx-upgrade-root")).render(
  <React.StrictMode>
    <UpgradeApp />
  </React.StrictMode>,
);

if (!prepareOriginalContent()) {
  const observer = new MutationObserver(() => {
    if (prepareOriginalContent()) observer.disconnect();
  });
  observer.observe(document.getElementById("root"), { childList: true, subtree: true });
}
