export const BRAND_NAME = "MMEETT Fate";
export const BRAND_DESCRIPTOR = "EASTERN SYMBOLS · INNER CLARITY";
export const DEFAULT_DOCUMENT_TITLE = "MMEETT Fate｜观象知变，向内而行";

function BrandMark() {
  return (
    <svg className="mmeett-brand-lockup__mark" viewBox="78 44 77 38" aria-hidden="true" focusable="false">
      <g transform="matrix(1 0 0 -1 0 499.594)" fill="currentColor" fillRule="evenodd">
        <g transform="translate(115.4306 452.5124)">
          <path d="M0 0h19.186L37.016-32.652H18.857L2.572-2.714C1.638-.995.691-.138 0 0Z" />
        </g>
        <g transform="translate(93.1923 452.5124)">
          <path d="M0 0h17.163c1.135-.227 1.673-1.19 2.493-2.692L36.02-32.652h-.004l-18.134 0-6.316 11.597-6.315-11.597h-18.138L2.91-3.253C2.254-2.047 1.338-.268 0 0Z" />
        </g>
      </g>
    </svg>
  );
}

function BrandWordmark() {
  return (
    <svg className="mmeett-brand-lockup__wordmark" viewBox="66 300 101 20" aria-hidden="true" focusable="false">
      <g transform="matrix(1 0 0 -1 0 499.594)" fill="currentColor" fillRule="evenodd">
        <g transform="translate(68.374 195.7468)">
          <path d="M0 0h3.205L8.121-10.989l4.906 10.967H16.23v-14.547h-3.203v7.388l-3.305-7.388H6.52L3.193-7.111v-7.436H0Z" />
        </g>
        <g transform="translate(86.0722 195.7468)">
          <path d="M0 0h3.205l4.916-10.989 4.906 10.967h3.203v-14.547h-3.203v7.388L9.722-14.547H6.52L3.193-7.111v-7.436H0Z" />
        </g>
        <g transform="translate(103.7704 195.7497)">
          <path d="M0 0h13.554v-3.197H3.193v-2.126h10.361v-3.193H3.193v-2.841h10.361v-3.193H0Z" />
        </g>
        <g transform="translate(118.7924 195.7497)">
          <path d="M0 0h13.553v-3.197H3.193v-2.126h10.36v-3.193H3.193v-2.841h10.36v-3.193H0Z" />
        </g>
        <g transform="translate(148.3617 195.7487)">
          <path d="M0 0v-3.193h-5.677v-11.356h-3.194V-3.193h-5.677V0Z" />
        </g>
        <g transform="translate(164.3779 195.7487)">
          <path d="M0 0v-3.193h-5.677v-11.356h-3.194V-3.193h-5.676V0Z" />
        </g>
      </g>
    </svg>
  );
}

export default function BrandLockup({ className = "", decorative = false }) {
  return (
    <span className={`mmeett-brand-lockup ${className}`.trim()} aria-hidden={decorative || undefined}>
      <BrandMark />
      <BrandWordmark />
    </span>
  );
}
