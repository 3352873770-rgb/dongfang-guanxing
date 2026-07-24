import React, { useEffect, useMemo, useRef, useState } from "react";
import "./reading-flow.css";

const PROFILE_STORAGE_KEY = "dfgx-profiles-v1";

const CATEGORIES = [
  {
    id: "relationship",
    name: "感情发展",
    description: "关系走向、缘分时机、相处选择",
    prompt: "例如：这段关系是否值得我继续投入？",
  },
  {
    id: "career",
    name: "事业发展",
    description: "职业规划、转型、晋升与合作",
    prompt: "例如：现在是否适合接受新的工作机会？",
  },
  {
    id: "study",
    name: "学业考试",
    description: "升学、备考、选择与阶段变化",
    prompt: "例如：接下来的备考重点应该放在哪里？",
  },
  {
    id: "wealth",
    name: "财富运势",
    description: "财务状况、买卖、经营与节奏",
    prompt: "例如：这项长期投入是否适合现在开始？",
  },
  {
    id: "other",
    name: "其他所问",
    description: "家庭、人际或当下难以归类之事",
    prompt: "请只写一件你此刻最想看清的事情。",
  },
];

const GUANGZHOU_DISTRICTS = [
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

const EMPTY_PROFILE = {
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

function loadProfiles() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(PROFILE_STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return [];

    return saved
      .map((item) => {
        if (!item || typeof item !== "object") return null;

        const id = typeof item.id === "string" ? item.id.trim() : "";
        const name = typeof item.name === "string" ? item.name.trim() : "";
        if (!id || !name) return null;

        const normalized = { ...EMPTY_PROFILE, id, name };
        Object.keys(EMPTY_PROFILE).forEach((field) => {
          if (field === "id" || field === "name") return;
          const value = item[field];
          if (typeof value === "string" && value.trim()) normalized[field] = value;
        });
        return normalized;
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

function getEarthlyBranch(time) {
  if (!time) return "待选择";
  const hour = Number(time.split(":")[0]);
  const branches = [
    ["子时", "23:00–00:59"],
    ["丑时", "01:00–02:59"],
    ["寅时", "03:00–04:59"],
    ["卯时", "05:00–06:59"],
    ["辰时", "07:00–08:59"],
    ["巳时", "09:00–10:59"],
    ["午时", "11:00–12:59"],
    ["未时", "13:00–14:59"],
    ["申时", "15:00–16:59"],
    ["酉时", "17:00–18:59"],
    ["戌时", "19:00–20:59"],
    ["亥时", "21:00–22:59"],
  ];
  const index = hour === 23 ? 0 : Math.floor((hour + 1) / 2);
  return `${branches[index][0]} · ${branches[index][1]}`;
}

function formatProfileSummary(profile) {
  if (!profile?.name) return "填写出生信息后保存为档案";
  return `${profile.calendar}${profile.year}年${profile.month}月${profile.day}日 · ${getEarthlyBranch(profile.birthTime).split(" · ")[0]} · ${profile.city}${profile.district}`;
}

function getDaysInMonth(year, month) {
  return new Date(Number(year), Number(month), 0).getDate();
}

function ReadingTopbar({ step, onBack, onClose }) {
  return (
    <header className="reading-topbar">
      <button type="button" onClick={step === 0 ? onClose : onBack}>
        {step === 0 ? "关闭" : "返回"}
      </button>
      <strong>观星问卦</strong>
      <button type="button" onClick={onClose}>退出</button>
    </header>
  );
}

export default function ReadingFlow() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [question, setQuestion] = useState("");
  const [profiles, setProfiles] = useState(loadProfiles);
  const [selectedProfileId, setSelectedProfileId] = useState("new");
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [manualLongitude, setManualLongitude] = useState(false);
  const [castingMethod, setCastingMethod] = useState("coins");
  const [notice, setNotice] = useState("");
  const [isLaunching, setIsLaunching] = useState(false);
  const castingTimerRef = useRef(null);
  const dialogRef = useRef(null);
  const returnFocusRef = useRef(null);

  const selectedCategory = useMemo(
    () => CATEGORIES.find((category) => category.id === categoryId),
    [categoryId],
  );

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, index) => String(currentYear - index));
  }, []);

  const clearCastingTimer = () => {
    if (castingTimerRef.current !== null) {
      window.clearTimeout(castingTimerRef.current);
      castingTimerRef.current = null;
    }
  };

  const closeFlow = () => {
    clearCastingTimer();
    setIsLaunching(false);
    setIsOpen(false);
  };

  useEffect(() => {
    const openFlow = (event) => {
      const incomingCategory = event.detail?.category || "";
      const matchedCategory = CATEGORIES.find(
        (category) => category.id === incomingCategory || category.name === incomingCategory,
      );
      const savedProfiles = loadProfiles();

      returnFocusRef.current = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
      setProfiles(savedProfiles);
      if (savedProfiles.length) {
        setSelectedProfileId(savedProfiles[0].id);
        setProfile(savedProfiles[0]);
      } else {
        setSelectedProfileId("new");
        setProfile(EMPTY_PROFILE);
      }
      setCategoryId(matchedCategory?.id || "");
      setQuestion("");
      setStep(matchedCategory ? 1 : 0);
      setCastingMethod("coins");
      setNotice("");
      clearCastingTimer();
      setIsLaunching(false);
      setIsOpen(true);
    };

    window.addEventListener("dfgx:reading-open", openFlow);
    return () => window.removeEventListener("dfgx:reading-open", openFlow);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const backgroundTargets = [
      document.getElementById("root"),
      ...document.querySelectorAll(".dfgx-floating-nav, .dfgx-upgrade"),
    ].filter(Boolean);
    const backgroundState = backgroundTargets.map((target) => ({
      target,
      inert: target.inert,
      ariaHidden: target.getAttribute("aria-hidden"),
    }));
    let focusFrame = 0;

    backgroundTargets.forEach((target) => {
      target.inert = true;
      target.setAttribute("aria-hidden", "true");
    });
    document.body.style.overflow = "hidden";
    focusFrame = window.requestAnimationFrame(() => {
      dialogRef.current?.querySelector("button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])")?.focus();
    });
    const handleEscape = (event) => {
      if (event.key === "Escape") closeFlow();
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
      backgroundState.forEach(({ target, inert, ariaHidden }) => {
        target.inert = inert;
        if (ariaHidden === null) target.removeAttribute("aria-hidden");
        else target.setAttribute("aria-hidden", ariaHidden);
      });
      returnFocusRef.current?.focus({ preventScroll: true });
      returnFocusRef.current = null;
    };
  }, [isOpen]);

  useEffect(() => () => clearCastingTimer(), []);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!isOpen) return;
    document.querySelector(".reading-flow")?.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [isOpen, step]);

  if (!isOpen) return null;

  const updateProfile = (field, value) => {
    setProfile((current) => {
      const next = { ...current, [field]: value };
      if (field === "year" || field === "month") {
        const daysInMonth = getDaysInMonth(next.year, next.month);
        if (Number(next.day) > daysInMonth) next.day = String(daysInMonth);
      }
      return next;
    });
  };

  const selectCategory = (id) => {
    setCategoryId(id);
    setNotice("");
  };

  const continueFromCategory = () => {
    if (!categoryId) {
      setNotice("请先选择一类所问之事");
      return;
    }
    setStep(1);
  };

  const continueFromQuestion = () => {
    if (question.trim().length < 6) {
      setNotice("请把问题写得更具体一些");
      return;
    }
    setStep(2);
  };

  const selectProfile = (id) => {
    setSelectedProfileId(id);
    if (id === "new") {
      setProfile(EMPTY_PROFILE);
      setManualLongitude(false);
      return;
    }
    const savedProfile = profiles.find((item) => item.id === id);
    if (savedProfile) {
      setProfile(savedProfile);
      setManualLongitude(false);
    }
  };

  const createNewProfile = () => {
    setSelectedProfileId("new");
    setProfile(EMPTY_PROFILE);
    setManualLongitude(false);
    setNotice("已切换为新建档案");
  };

  const saveProfile = ({ continueFlow = false } = {}) => {
    if (!profile.name.trim()) {
      setNotice("请填写姓名");
      return;
    }

    const savedProfile = {
      ...profile,
      id: selectedProfileId === "new"
        ? `profile-${Date.now()}`
        : selectedProfileId,
      name: profile.name.trim(),
    };
    const nextProfiles = [
      savedProfile,
      ...profiles.filter((item) => item.id !== savedProfile.id),
    ];

    try {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfiles));
    } catch {
      setNotice("本地保存失败，请稍后重试");
      return;
    }

    setProfiles(nextProfiles);
    setSelectedProfileId(savedProfile.id);
    setProfile(savedProfile);
    if (continueFlow) {
      setStep(3);
      setNotice("");
    } else {
      setNotice("档案已保存在本设备");
    }
  };

  const changeDistrict = (district) => {
    const longitude = GUANGZHOU_DISTRICTS.find(([name]) => name === district)?.[1] || profile.longitude;
    setProfile((current) => ({
      ...current,
      district,
      longitude: manualLongitude ? current.longitude : longitude,
    }));
  };

  const launchCasting = () => {
    clearCastingTimer();
    setIsLaunching(true);
    castingTimerRef.current = window.setTimeout(() => {
      castingTimerRef.current = null;
      setIsLaunching(false);
      setNotice("所问与档案已带入起卦环节");
    }, 1200);
  };

  return (
    <section ref={dialogRef} className="reading-flow" data-step={step} role="dialog" aria-modal="true" aria-label="观星问卦流程">
      <div className="reading-paper">
        <ReadingTopbar
          step={step}
          onBack={() => setStep((current) => Math.max(0, current - 1))}
          onClose={closeFlow}
        />

        <main className="reading-content">
          {step === 0 ? (
            <section className="reading-screen reading-category-screen">
              <p className="reading-kicker">观星问卦 · 第一步</p>
              <h2>此刻，你想问什么</h2>
              <p className="reading-intro">一卦只问一事。先选择方向，再把真正困扰你的问题写下来。</p>

              <div className="reading-category-grid">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className={categoryId === category.id ? "is-selected" : ""}
                    aria-pressed={categoryId === category.id}
                    onClick={() => selectCategory(category.id)}
                  >
                    <strong>{category.name}</strong>
                    <span>{category.description}</span>
                    <small>{categoryId === category.id ? "已选择" : "选择此项"}</small>
                  </button>
                ))}
              </div>

              <button className="reading-primary-action" type="button" onClick={continueFromCategory}>
                下一步，写下问题
              </button>
            </section>
          ) : null}

          {step === 1 ? (
            <section className="reading-screen reading-question-screen">
              <p className="reading-kicker">观星问卦 · 第二步</p>
              <h2>写下你真正想问的事</h2>
              <p className="reading-intro">问题越具体，后续的卦象解读越容易落到你的真实处境。</p>

              <div className="reading-selected-category">
                <span>当前方向</span>
                <strong>{selectedCategory?.name || "其他所问"}</strong>
                <button type="button" onClick={() => setStep(0)}>重新选择</button>
              </div>

              <label className="reading-question-field">
                <span>所问之事</span>
                <textarea
                  value={question}
                  rows="7"
                  maxLength="180"
                  placeholder={selectedCategory?.prompt || "请写下此刻最想看清的一件事。"}
                  onChange={(event) => setQuestion(event.target.value)}
                  autoFocus
                />
                <small>{question.length} / 180</small>
              </label>

              <aside className="reading-guidance">
                <strong>问卦宜清晰</strong>
                <p>少问“会不会”，多说明当下处境、你的选择，以及最想看清的变化。</p>
              </aside>

              <button className="reading-primary-action" type="button" onClick={continueFromQuestion}>
                下一步，确认档案
              </button>
            </section>
          ) : null}

          {step === 2 ? (
            <section className="reading-screen reading-profile-screen">
              <p className="reading-kicker">档案信息 · 问卦前准备</p>
              <h2>确认出生信息</h2>
              <p className="reading-intro">档案只保存在当前设备，可随时修改或删除。</p>

              <fieldset className="reading-fieldset reading-profile-picker">
                <legend>选择档案</legend>
                <label className="reading-select-card">
                  <span className="sr-only">选择档案</span>
                  <select value={selectedProfileId} onChange={(event) => selectProfile(event.target.value)}>
                    {profiles.length ? null : <option value="new">尚无档案 · 新建档案</option>}
                    {profiles.map((item) => (
                      <option key={item.id} value={item.id}>{item.name} · 本人</option>
                    ))}
                    {profiles.length ? <option value="new">新建档案</option> : null}
                  </select>
                  <small>{formatProfileSummary(profile)}</small>
                </label>
                <div className="reading-picker-meta">
                  <span>切换档案后自动回填下方信息</span>
                  <button type="button" onClick={createNewProfile}>新建档案</button>
                </div>
              </fieldset>

              <fieldset className="reading-fieldset">
                <legend>基本信息</legend>
                <label className="reading-row">
                  <span>姓名</span>
                  <input
                    value={profile.name}
                    placeholder="请输入姓名"
                    onChange={(event) => updateProfile("name", event.target.value)}
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
                        onClick={() => updateProfile("gender", gender)}
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
                  <div className="reading-segmented" role="group" aria-label="历法">
                    {["公历", "农历"].map((calendar) => (
                      <button
                        key={calendar}
                        type="button"
                        className={profile.calendar === calendar ? "is-selected" : ""}
                        aria-pressed={profile.calendar === calendar}
                        onClick={() => updateProfile("calendar", calendar)}
                      >
                        {calendar}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="reading-row">
                  <span>出生日期</span>
                  <div className="reading-date-fields">
                    <select aria-label="出生年份" value={profile.year} onChange={(event) => updateProfile("year", event.target.value)}>
                      {years.map((year) => <option key={year} value={year}>{year}年</option>)}
                    </select>
                    <select aria-label="出生月份" value={profile.month} onChange={(event) => updateProfile("month", event.target.value)}>
                      {Array.from({ length: 12 }, (_, index) => String(index + 1)).map((month) => <option key={month} value={month}>{month}月</option>)}
                    </select>
                    <select aria-label="出生日期" value={profile.day} onChange={(event) => updateProfile("day", event.target.value)}>
                      {Array.from({ length: getDaysInMonth(profile.year, profile.month) }, (_, index) => String(index + 1)).map((day) => <option key={day} value={day}>{day}日</option>)}
                    </select>
                  </div>
                </div>
                <label className="reading-row">
                  <span>出生时间</span>
                  <input type="time" value={profile.birthTime} onChange={(event) => updateProfile("birthTime", event.target.value)} />
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
                    <select aria-label="省份" value={profile.province} onChange={(event) => updateProfile("province", event.target.value)}>
                      <option>广东省</option>
                    </select>
                    <select aria-label="城市" value={profile.city} onChange={(event) => updateProfile("city", event.target.value)}>
                      <option>广州市</option>
                    </select>
                    <select aria-label="区县" value={profile.district} onChange={(event) => changeDistrict(event.target.value)}>
                      {GUANGZHOU_DISTRICTS.map(([district]) => <option key={district}>{district}</option>)}
                    </select>
                  </div>
                </div>
                <p className="reading-location-note">广州现辖 11 区</p>
                <label className="reading-row">
                  <span>经度（自动）</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    readOnly={!manualLongitude}
                    value={profile.longitude}
                    onChange={(event) => updateProfile("longitude", event.target.value)}
                  />
                  <button
                    className="reading-inline-action"
                    type="button"
                    onClick={() => setManualLongitude((current) => !current)}
                  >
                    {manualLongitude ? "恢复自动" : "手动修改"}
                  </button>
                </label>
                <p className="reading-location-note">根据所选地区自动匹配，可按出生地实际经度调整。</p>
              </fieldset>

              <p className="reading-local-note">档案仅保存在本设备，可随时删除</p>
              <button className="reading-primary-action" type="button" onClick={() => saveProfile({ continueFlow: true })}>
                使用此档案开始问卦
              </button>
              <button className="reading-secondary-action" type="button" onClick={() => saveProfile()}>
                仅保存档案
              </button>
            </section>
          ) : null}

          {step === 3 ? (
            <section className="reading-screen reading-casting-screen">
              <p className="reading-kicker">观星问卦 · 起卦准备</p>
              <h2>静心，所问已定</h2>
              <p className="reading-intro">确认所问与人物档案，选择一种方式进入起卦。</p>

              <article className="reading-summary-card">
                <p><span>所问方向</span><strong>{selectedCategory?.name}</strong></p>
                <p><span>所问之事</span><strong>{question}</strong></p>
                <p><span>人物档案</span><strong>{profile.name} · {getEarthlyBranch(profile.birthTime).split(" · ")[0]}</strong></p>
                <button type="button" onClick={() => setStep(1)}>修改所问</button>
              </article>

              <fieldset className="reading-fieldset reading-methods">
                <legend>选择起卦方式</legend>
                <button
                  type="button"
                  className={castingMethod === "coins" ? "is-selected" : ""}
                  onClick={() => setCastingMethod("coins")}
                >
                  <strong>三枚铜钱</strong>
                  <span>专注所问，依次完成六次投掷</span>
                </button>
                <button
                  type="button"
                  className={castingMethod === "time" ? "is-selected" : ""}
                  onClick={() => setCastingMethod("time")}
                >
                  <strong>按时起卦</strong>
                  <span>以当前年月日时推演卦象</span>
                </button>
              </fieldset>

              <aside className="reading-guidance">
                <strong>一事一问</strong>
                <p>问卦是整理当下处境的方法，不替代医疗、法律、投资或现实决策。</p>
              </aside>

              <button className="reading-primary-action" type="button" disabled={isLaunching} onClick={launchCasting}>
                {isLaunching ? "正在进入起卦…" : castingMethod === "coins" ? "开始投掷铜钱" : "按当前时辰起卦"}
              </button>
              <button className="reading-secondary-action" type="button" onClick={() => setStep(2)}>
                返回修改档案
              </button>
            </section>
          ) : null}
        </main>

        {notice ? <div className="reading-notice" role="status">{notice}</div> : null}
      </div>
    </section>
  );
}
