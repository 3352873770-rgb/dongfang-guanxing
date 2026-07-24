import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/cormorant-garamond/latin-600-italic.css";

export const BRAND_NAME = "MMEETT Fate";
export const BRAND_DESCRIPTOR = "EASTERN SYMBOLS · INNER CLARITY";
export const DEFAULT_DOCUMENT_TITLE = "MMEETT Fate｜观象知变，向内而行";

export default function BrandLockup({ className = "", decorative = false }) {
  return (
    <span className={`mmeett-brand-lockup ${className}`.trim()} aria-hidden={decorative || undefined}>
      <span className="mmeett-brand-lockup__mmeett">MMEETT</span>
      <span className="mmeett-brand-lockup__fate">Fate</span>
    </span>
  );
}
