export const READING_STORAGE_KEY = "dfgx-readings-v1";

const MAX_RECORDS = 30;

function getStorage(storage) {
  if (storage) return storage;
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function isRecord(value) {
  return Boolean(
    value && typeof value === "object" && typeof value.id === "string",
  );
}

export function loadReadingRecords(storage) {
  try {
    const records = JSON.parse(
      getStorage(storage)?.getItem(READING_STORAGE_KEY) || "[]",
    );
    return Array.isArray(records) ? records.filter(isRecord) : [];
  } catch {
    return [];
  }
}

export function saveReadingRecord(record, storage) {
  try {
    const target = getStorage(storage);
    if (!target || !record || typeof record !== "object") return null;
    const records = loadReadingRecords(target);
    const next = [
      {
        id:
          record.id ||
          `reading-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: record.createdAt || new Date().toISOString(),
        ...record,
      },
      ...records,
    ].slice(0, MAX_RECORDS);
    target.setItem(READING_STORAGE_KEY, JSON.stringify(next));
    return next[0];
  } catch {
    return null;
  }
}

export function getReadingRecordById(id, storage) {
  return loadReadingRecords(storage).find((record) => record.id === id) || null;
}
