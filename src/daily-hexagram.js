import { HEXAGRAMS } from "./hexagram-data.js";
import { getHexagramByNumber } from "./iching.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const ANCHOR_DAY = Math.floor(Date.UTC(2026, 6, 24) / DAY_MS);
const ANCHOR_HEXAGRAM = 62;

function getLocalDateParts(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
  return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}

export function toLocalIsoDate(date) {
  const parts = getLocalDateParts(date);
  if (!parts) return "";
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

export function formatDailyDate(date) {
  if (!getLocalDateParts(date)) return "";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function getDailyHexagramNumber(date) {
  const parts = getLocalDateParts(date);
  if (!parts) return null;
  const localDay = Math.floor(Date.UTC(parts.year, parts.month - 1, parts.day) / DAY_MS);
  return ((localDay - ANCHOR_DAY + ANCHOR_HEXAGRAM - 1) % 64 + 64) % 64 + 1;
}

/** DST-safe UTC day number composed from the visitor's local calendar fields. */
export function getUtcDayNumber(date) {
  const parts = getLocalDateParts(date);
  return parts ? Math.floor(Date.UTC(parts.year, parts.month - 1, parts.day) / DAY_MS) : null;
}

export function getDailyHexagram(date = new Date()) {
  const number = getDailyHexagramNumber(date);
  if (!number) return null;
  const atlas = HEXAGRAMS[number - 1];
  const classic = getHexagramByNumber(number);
  if (!atlas || !classic) return null;

  return {
    ...classic,
    symbol: atlas.symbol,
    theme: atlas.theme,
    dateLabel: formatDailyDate(date),
    isoDate: toLocalIsoDate(date),
    formattedDate: formatDailyDate(date),
    date: toLocalIsoDate(date),
  };
}

export function getTodayDailyHexagram() {
  return getDailyHexagram(new Date());
}

export function getDailyCardCopy(daily) {
  if (!daily) return { reading: "", advice: [] };
  if (daily.number === 62) {
    return { reading: "小事可为", advice: ["宜小事谨慎，不宜大事", "过犹未及，慎言慎行"] };
  }
  return {
    reading: daily.theme,
    advice: ["从一件可掌握的小事开始观察", "留出余地，再回看变化"],
  };
}
