import React, { useMemo } from "react";

export const PROFILE_STORAGE_KEY = "dfgx-profiles-v1";

export const GUANGZHOU_DISTRICTS = [
  ["越秀区", "113.27"],
  ["海珠区", "113.32"],
  ["荔湾区", "113.24"],
  ["天河区", "113.36"],
  ["白云区", "113.27"],
  ["黄埔区", "113.45"],
  ["花都区", "113.22"],
  ["番禺区", "113.38"],
  ["南沙区", "113.54"],
  ["从化区", "113.59"],
  ["增城区", "113.81"],
];

export function getGuangzhouLongitude(district, fallback = "") {
  return GUANGZHOU_DISTRICTS.find(([name]) => name === district)?.[1] || fallback;
}

export const EMPTY_PROFILE = {
  id: "",
  name: "",
  gender: "男",
  calendar: "公历",
  year: "1996",
  month: "8",
  day: "18",
  birthTime: "08:35",
  province: "广东省",
  city: "广州市",
  district: "越秀区",
  longitude: "113.27",
};

export function loadProfiles(
  storage = typeof window === "undefined" ? null : window.localStorage,
) {
  try {
    const values = JSON.parse(storage?.getItem(PROFILE_STORAGE_KEY) || "[]");
    if (!Array.isArray(values)) return [];
    return values
      .map((value) => {
        if (
          !value ||
          typeof value !== "object" ||
          !String(value.id || "").trim() ||
          !String(value.name || "").trim()
        )
          return null;
        return {
          ...EMPTY_PROFILE,
          ...value,
          id: String(value.id).trim(),
          name: String(value.name).trim(),
        };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

export function saveProfileArchive({
  profile,
  selectedProfileId,
  profiles,
  storage = typeof window === "undefined" ? null : window.localStorage,
}) {
  if (!storage || !profile?.name?.trim()) return null;
  const savedProfile = {
    ...profile,
    id:
      selectedProfileId === "new" ? `profile-${Date.now()}` : selectedProfileId,
    name: profile.name.trim(),
  };
  const nextProfiles = [
    savedProfile,
    ...profiles.filter((item) => item.id !== savedProfile.id),
  ];
  try {
    storage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfiles));
    return { savedProfile, profiles: nextProfiles };
  } catch {
    return null;
  }
}

export function getDaysInMonth(year, month) {
  return new Date(Number(year), Number(month), 0).getDate();
}

export function getEarthlyBranch(time) {
  const hour = Number(String(time || "").split(":")[0]);
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) return "待选择";
  const branches = [
    "子",
    "丑",
    "寅",
    "卯",
    "辰",
    "巳",
    "午",
    "未",
    "申",
    "酉",
    "戌",
    "亥",
  ];
  const ranges = [
    "23:00–00:59",
    "01:00–02:59",
    "03:00–04:59",
    "05:00–06:59",
    "07:00–08:59",
    "09:00–10:59",
    "11:00–12:59",
    "13:00–14:59",
    "15:00–16:59",
    "17:00–18:59",
    "19:00–20:59",
    "21:00–22:59",
  ];
  const index = hour === 23 ? 0 : Math.floor((hour + 1) / 2);
  return `${branches[index]}时 · ${ranges[index]}`;
}

export function formatProfileSummary(profile) {
  if (!profile?.name) return "填写出生信息后保存为档案";
  return `${profile.calendar}${profile.year}年${profile.month}月${profile.day}日 · ${getEarthlyBranch(profile.birthTime).split(" · ")[0]} · ${profile.city}${profile.district}`;
}

export default function ProfileArchiveForm({
  profiles,
  selectedProfileId,
  profile,
  manualLongitude,
  onSelectedProfileIdChange,
  onProfileChange,
  onManualLongitudeChange,
  onNewArchive,
  heading = "人物档案",
  intro = "档案只保存在当前设备，可随时修改或删除。",
}) {
  const years = useMemo(
    () =>
      Array.from({ length: 100 }, (_, index) =>
        String(new Date().getFullYear() - index),
      ),
    [],
  );
  const update = (field, value) =>
    onProfileChange((current) => {
      const next = { ...current, [field]: value };
      if (
        (field === "year" || field === "month") &&
        Number(next.day) > getDaysInMonth(next.year, next.month)
      )
        next.day = String(getDaysInMonth(next.year, next.month));
      return next;
    });
  const selectArchive = (id) => {
    onSelectedProfileIdChange(id);
    const savedProfile = profiles.find((item) => item.id === id);
    onProfileChange(savedProfile || EMPTY_PROFILE);
    onManualLongitudeChange(false);
  };
  const createNewArchive = () => {
    selectArchive("new");
    onNewArchive?.();
  };
  const changeDistrict = (district) =>
    onProfileChange((current) => ({
      ...current,
      district,
      longitude: manualLongitude
        ? current.longitude
        : getGuangzhouLongitude(district, current.longitude),
    }));

  return (
    <section className="profile-archive-form" aria-label={heading}>
      <h3 className="reading-form-section-title">{heading}</h3>
      <p className="reading-intro">{intro}</p>
      <fieldset className="reading-fieldset reading-profile-picker">
        <legend>选择档案</legend>
        <label className="reading-select-card">
          <span className="sr-only">选择档案</span>
          <select
            aria-label="选择档案"
            value={selectedProfileId}
            onChange={(event) => selectArchive(event.target.value)}
          >
            {profiles.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} · 本人
              </option>
            ))}
            <option value="new">
              {profiles.length ? "新建档案" : "尚无档案 · 新建档案"}
            </option>
          </select>
          <small>{formatProfileSummary(profile)}</small>
        </label>
        <div className="reading-picker-meta">
          <span>切换档案后自动回填下方信息</span>
          <button type="button" onClick={createNewArchive}>
            新建档案
          </button>
        </div>
      </fieldset>

      <fieldset className="reading-fieldset">
        <legend>基本信息</legend>
        <label className="reading-row">
          <span>姓名</span>
          <input
            aria-label="姓名"
            value={profile.name}
            placeholder="请输入姓名"
            onChange={(event) => update("name", event.target.value)}
          />
        </label>
        <div className="reading-row">
          <span>性别</span>
          <div className="reading-segmented" role="group" aria-label="性别">
            {["男", "女", "不透露"].map((gender) => (
              <button
                key={gender}
                type="button"
                className={profile.gender === gender ? "is-selected" : ""}
                aria-pressed={profile.gender === gender}
                onClick={() => update("gender", gender)}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>
      </fieldset>

      <fieldset className="reading-fieldset">
        <legend>出生时间</legend>
        <div className="reading-row">
          <span>历法</span>
          <div
            className="reading-segmented profile-calendar-switch"
            role="group"
            aria-label="历法"
          >
            {["公历", "农历"].map((calendar) => (
              <button
                key={calendar}
                type="button"
                className={profile.calendar === calendar ? "is-selected" : ""}
                aria-pressed={profile.calendar === calendar}
                onClick={() => update("calendar", calendar)}
              >
                {calendar}
              </button>
            ))}
          </div>
        </div>
        <div className="reading-row">
          <span>出生日期</span>
          <div className="reading-date-fields">
            <select
              aria-label="出生年份"
              value={profile.year}
              onChange={(event) => update("year", event.target.value)}
            >
              {years.map((value) => (
                <option key={value} value={value}>
                  {value}年
                </option>
              ))}
            </select>
            <select
              aria-label="出生月份"
              value={profile.month}
              onChange={(event) => update("month", event.target.value)}
            >
              {Array.from({ length: 12 }, (_, index) => String(index + 1)).map(
                (value) => (
                  <option key={value} value={value}>
                    {value}月
                  </option>
                ),
              )}
            </select>
            <select
              aria-label="出生日期"
              value={profile.day}
              onChange={(event) => update("day", event.target.value)}
            >
              {Array.from(
                { length: getDaysInMonth(profile.year, profile.month) },
                (_, index) => String(index + 1),
              ).map((value) => (
                <option key={value} value={value}>
                  {value}日
                </option>
              ))}
            </select>
          </div>
        </div>
        <label className="reading-row">
          <span>出生时间</span>
          <input
            aria-label="出生时间"
            type="time"
            value={profile.birthTime}
            onChange={(event) => update("birthTime", event.target.value)}
          />
        </label>
        <div className="reading-row">
          <span>对应时辰</span>
          <output>{getEarthlyBranch(profile.birthTime)}</output>
        </div>
      </fieldset>

      <fieldset className="reading-fieldset">
        <legend>出生地点</legend>
        <div className="reading-row">
          <span>出生地</span>
          <div className="reading-location-fields">
            <select
              aria-label="省份"
              value={profile.province}
              onChange={(event) => update("province", event.target.value)}
            >
              <option>广东省</option>
            </select>
            <select
              aria-label="城市"
              value={profile.city}
              onChange={(event) => update("city", event.target.value)}
            >
              <option>广州市</option>
            </select>
            <select
              aria-label="区县"
              value={profile.district}
              onChange={(event) => changeDistrict(event.target.value)}
            >
              {GUANGZHOU_DISTRICTS.map(([district]) => (
                <option key={district}>{district}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="reading-location-note">广州现辖 11 区</p>
        <label className="reading-row profile-longitude">
          <span>经度（自动）</span>
          <input
            aria-label="经度"
            type="number"
            inputMode="decimal"
            step="0.01"
            readOnly={!manualLongitude}
            value={profile.longitude}
            onChange={(event) => update("longitude", event.target.value)}
          />
          <button
            className="reading-inline-action"
            type="button"
            onClick={() => {
              if (manualLongitude) {
                onProfileChange((current) => ({
                  ...current,
                  longitude: getGuangzhouLongitude(current.district, current.longitude),
                }));
                onManualLongitudeChange(false);
                return;
              }
              onManualLongitudeChange(true);
            }}
          >
            {manualLongitude ? "恢复自动" : "手动修改"}
          </button>
        </label>
        <p className="reading-location-note">
          根据所选地区自动匹配，可按出生地实际经度调整。
        </p>
      </fieldset>
    </section>
  );
}
