import { useEffect, useState } from "react";
import BrandLockup from "./brand-lockup.jsx";
import "./secondary-page-chrome.css";

export function getStoredTheme() {
  try {
    const storedTheme = window.localStorage.getItem("dfgx-theme");
    return storedTheme === "night" || storedTheme === "day" ? storedTheme : "day";
  } catch {
    return "day";
  }
}

export function useDfgxTheme() {
  const [theme, setTheme] = useState(getStoredTheme);

  useEffect(() => {
    document.documentElement.dataset.dfgxTheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      theme === "day" ? "#e8dfd1" : "#0b1112",
    );
    try {
      window.localStorage.setItem("dfgx-theme", theme);
    } catch {
      // The theme remains usable when local storage is unavailable.
    }
  }, [theme]);

  return [theme, setTheme];
}

export function ThemeToggle({ theme, onChange }) {
  return (
    <button
      className="dfgx-theme-toggle"
      type="button"
      data-theme={theme}
      aria-pressed={theme === "day"}
      aria-label={`切换为${theme === "night" ? "昼" : "夜"}间主题`}
      title={`当前：${theme === "day" ? "昼" : "夜"}间主题`}
      onClick={onChange}
    >
      <span className={theme === "day" ? "is-active" : ""}>昼</span>
      <i aria-hidden="true" />
      <span className={theme === "night" ? "is-active" : ""}>夜</span>
    </button>
  );
}

export default function SecondaryPageHeader({ theme, onThemeChange, backHash, backLabel = "返回首页" }) {
  const returnToHomepage = () => {
    window.location.hash = backHash;
  };

  return (
    <header className="dfgx-secondary-header">
      <button className="dfgx-secondary-brand" type="button" onClick={returnToHomepage} aria-label="返回 MMEETT Fate 首页">
        <BrandLockup decorative />
      </button>
      <button className="dfgx-secondary-back" type="button" onClick={returnToHomepage}>{backLabel}</button>
      <ThemeToggle
        theme={theme}
        onChange={() => onThemeChange((current) => (current === "night" ? "day" : "night"))}
      />
    </header>
  );
}
