import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import BorderGlow from "./components/BorderGlow.jsx";
import BrandLockup, { DEFAULT_DOCUMENT_TITLE } from "./brand-lockup.jsx";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/cormorant-garamond/latin-600-italic.css";
import ReadingFlow from "./reading-flow.jsx";
import OracleToolFlow from "./oracle-tool-flow.jsx";
import { getDailyCardCopy, getDailyHexagram, formatDailyDate, toLocalIsoDate } from "./daily-hexagram.js";
import useAtmosphereVisibility from "./use-atmosphere-visibility.js";
import "./upgrade.css";

const LightRays = lazy(() => import("./components/LightRays/LightRays.jsx"));
const LiquidEther = lazy(() => import("./components/LiquidEther.jsx"));
const HexagramAtlasPage = lazy(() => import("./hexagram-atlas.jsx"));
const DailyHexagramPage = lazy(() => import("./daily-hexagram-page.jsx"));
const ThreeCoinPage = lazy(() => import("./three-coin-page.jsx"));
const PersonalityPreferencePage = lazy(() => import("./personality-preference-page.jsx"));
const PERSONALITY_PREVIEW_SRC = `${import.meta.env.BASE_URL}media/legacy/personality-preference-v2.webp`;

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

function getAppRoute() {
  if (window.location.hash === "#/daily") return { kind: "daily" };
  if (window.location.hash === "#/tools/three-coins") return { kind: "three-coins" };
  if (window.location.hash === "#/personality") return { kind: "personality" };
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

function openPersonalityPreference(event) {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  window.location.hash = "/personality";
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
    document.title = DEFAULT_DOCUMENT_TITLE;
  }, []);

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

  function openReadingFlow(category = "") {
    window.dispatchEvent(new CustomEvent("dfgx:reading-open", { detail: { category } }));
  }

  return (
    <>
      <header className="dfgx-floating-nav">
        <a
          className={`dfgx-nav-brand ${activeSection === "dfgx-top" ? "is-active" : ""}`}
          href="#dfgx-top"
          aria-label="MMEETT Fate 首页"
          onClick={(event) => handleNavigation(event, "#dfgx-top")}
        >
          <BrandLockup decorative />
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
        <h1 className="dfgx-hero-wordmark" aria-label="MMEETT Fate">
          <span className="dfgx-hero-wordmark__mmeett">MMEETT</span>
          <span className="dfgx-hero-wordmark__fate">Fate</span>
        </h1>

        <hr className="dfgx-wordmark-rule" aria-hidden="true" />

        <p className="dfgx-english">READ THE SIGNS · MEET YOURSELF</p>

        <div className="dfgx-philosophy">
          <p>观象知变，向内而行</p>
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
            animated={!prefersReducedMotion && !renderProfile.isMobile}
            sweepDelay={920}
            sweepDuration={900}
            colors={borderGlowTheme.colors}
            fillOpacity={theme === "day" ? 0.035 : 0.06}
          >
            <button className="dfgx-primary" type="button" onClick={() => openReadingFlow()}>
              开始问卦
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

function updateDailyDate() {
  const time = document.querySelector("#root #daily time");
  if (!time) return false;

  const now = new Date();
  const daily = getDailyHexagram(now);
  time.textContent = formatDailyDate(now);
  time.dateTime = toLocalIsoDate(now);
  const card = document.querySelector("#root #daily");
  if (daily && card) {
    const copy = getDailyCardCopy(daily);
    card.querySelector("h2")?.replaceChildren(daily.fullName);
    card.querySelector(".daily-reading")?.replaceChildren(copy.reading);
    const advice = card.querySelector(".daily-advice");
    if (advice) advice.replaceChildren(...copy.advice.flatMap((line, index) => index ? [document.createElement("br"), document.createTextNode(line)] : [document.createTextNode(line)]));
    card.querySelector(".daily-symbol span")?.replaceChildren(daily.symbol);
  }
  return true;
}

function scheduleDailyDateRefresh() {
  updateDailyDate();
  const now = new Date();
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  window.setTimeout(scheduleDailyDateRefresh, nextMidnight.getTime() - now.getTime() + 1000);
}

function openDailyHexagram(event) {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  window.location.hash = "/daily";
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
    button.addEventListener("click", openDailyHexagram, true);
  }

  if (root.dataset.dfgxDailyDateReady !== "true") {
    root.dataset.dfgxDailyDateReady = "true";
    scheduleDailyDateRefresh();
  } else {
    updateDailyDate();
  }
  return true;
}

function initializeReadingEntryPoints() {
  const root = document.getElementById("root");
  const askSection = document.getElementById("ask");
  if (!root || !askSection) return false;
  if (root.dataset.dfgxReadingEntryReady === "true") return true;

  const supportedCategories = new Set(["感情发展", "事业发展", "学业考试", "财富运势"]);
  const supportedTools = new Set(["云签解惑", "事业灵签", "流年运势", "时辰运势", "AI解读报告"]);
  askSection.addEventListener(
    "click",
    (event) => {
      const button = event.target.closest("button");
      const category = button?.querySelector("strong")?.textContent?.trim();
      if (!button) return;
      if (supportedTools.has(category)) {
        event.preventDefault();
        event.stopPropagation();
        window.dispatchEvent(new CustomEvent("dfgx:oracle-tool-open", { detail: { tool: category } }));
        return;
      }
      if (!supportedCategories.has(category)) return;

      event.preventDefault();
      event.stopPropagation();
      window.dispatchEvent(new CustomEvent("dfgx:reading-open", { detail: { category } }));
    },
    true,
  );
  root.dataset.dfgxReadingEntryReady = "true";
  return true;
}

function initializeToolEntryPoints() {
  const root = document.getElementById("root");
  const toolsSection = document.getElementById("tools");
  if (!root || !toolsSection) return false;
  if (root.dataset.dfgxToolEntryReady === "true") return true;

  toolsSection.addEventListener(
    "click",
    (event) => {
      const button = event.target.closest("button");
      if (!button || !button.textContent?.includes("三枚铜钱")) return;
      event.preventDefault();
      event.stopPropagation();
      window.location.hash = "/tools/three-coins";
    },
    true,
  );

  root.dataset.dfgxToolEntryReady = "true";
  return true;
}

function initializePersonalityEntry() {
  const root = document.getElementById("root");
  const personalitySection = document.getElementById("personality");
  if (!root || !personalitySection) return false;
  if (root.dataset.dfgxPersonalityEntryReady === "true") return true;

  root.addEventListener(
    "click",
    (event) => {
      const entry = event.target.closest(
        "#personality .personality-test-card, #personality .personality-guide",
      );
      if (!entry) return;
      openPersonalityPreference(event);
    },
    true,
  );
  const previewCard = personalitySection.querySelector(".personality-test-card");
  const previewImage = previewCard?.querySelector("img");
  if (previewImage) {
    previewImage.src = PERSONALITY_PREVIEW_SRC;
    previewImage.alt = "";
    previewImage.loading = "lazy";
    previewImage.decoding = "async";
  }
  previewCard?.setAttribute("aria-label", "开始人格偏好探索，12题，约3分钟");
  root.dataset.dfgxPersonalityEntryReady = "true";
  return true;
}

function prepareOriginalContent() {
  if (!disableOriginalHero()) return false;
  if (!initializeDailySection()) return false;
  if (!initializeReadingEntryPoints()) return false;
  if (!initializePersonalityEntry()) return false;
  if (!initializeToolEntryPoints()) return false;
  if (!initializeAtlasSection()) return false;
  initializeLegacyReveal();
  initializeSectionNavigation();
  return true;
}

function UpgradeApp() {
  const [route, setRoute] = useState(getAppRoute);

  useEffect(() => {
    const updateRoute = () => setRoute(getAppRoute());
    window.addEventListener("hashchange", updateRoute);
    return () => {
      window.removeEventListener("hashchange", updateRoute);
    };
  }, []);

  useEffect(() => {
    if (route?.kind === "hexagrams" || route?.kind === "daily" || route?.kind === "three-coins" || route?.kind === "personality") {
      document.documentElement.dataset.dfgxRoute = route.kind;
      window.scrollTo({ top: 0, behavior: "auto" });
    } else {
      delete document.documentElement.dataset.dfgxRoute;
      const homeSection =
        window.location.hash === "#daily"
          ? "daily"
          : window.location.hash === "#atlas"
            ? "atlas"
            : window.location.hash === "#tools"
              ? "tools"
              : window.location.hash === "#personality"
                ? "personality"
                : null;
      if (homeSection) {
        window.requestAnimationFrame(() => {
          document.getElementById(homeSection)?.scrollIntoView({
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
  if (route?.kind === "daily") {
    return <Suspense fallback={<div className="dfgx-route-loading">正在展开今日卦象…</div>}><DailyHexagramPage /></Suspense>;
  }
  if (route?.kind === "three-coins") {
    return <Suspense fallback={<div className="dfgx-route-loading">正在展开三枚铜钱…</div>}><ThreeCoinPage /></Suspense>;
  }

  if (route?.kind === "personality") {
    return (
      <Suspense fallback={<div className="dfgx-route-loading">正在展开人格偏好探索…</div>}>
        <PersonalityPreferencePage />
      </Suspense>
    );
  }

  return (
    <>
      <UpgradeHero />
      <ReadingFlow />
      <OracleToolFlow />
    </>
  );
}

const upgradeRootContainer = document.getElementById("dfgx-upgrade-root");
const upgradeRoot = upgradeRootContainer.__dfgxUpgradeRoot
  || createRoot(upgradeRootContainer);

upgradeRootContainer.__dfgxUpgradeRoot = upgradeRoot;
upgradeRoot.render(
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
