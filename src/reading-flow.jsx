import React, { useEffect, useMemo, useRef, useState } from "react";
import { createIChingReading } from "./iching.js";
import { saveReadingRecord } from "./reading-storage.js";
import ProfileArchiveForm, {
  EMPTY_PROFILE,
  formatProfileSummary,
  loadProfiles,
  saveProfileArchive,
} from "./profile-archive-form.jsx";
import "./reading-flow.css";

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

function ReadingTopbar({ result, onBack, onClose }) {
  return (
    <header className="reading-topbar">
      <button type="button" onClick={result ? onBack : onClose}>
        {result ? "返回" : "关闭"}
      </button>
      <strong>观星问卦</strong>
      <button type="button" onClick={onClose}>
        退出
      </button>
    </header>
  );
}

function ReadingEvidence({ reading }) {
  return (
    <section className="reading-classics" aria-label="古籍原文">
      <p className="reading-classics-label">古籍原文</p>
      <article className="reading-hexagram">
        <span>{String.fromCodePoint(0x4dc0 + reading.primary.number - 1)}</span>
        <p>
          第{reading.primary.number}卦 · 上{reading.primary.upper}下
          {reading.primary.lower}
        </p>
        <h3>{reading.primary.fullName}</h3>
        <h4>卦辞</h4>
        <p>{reading.primary.judgement}</p>
        <h4>大象</h4>
        <p>{reading.primary.daxiang}</p>
      </article>
      <section className="reading-line-record">
        <h3>六爻记录</h3>
        <p>自上而下显示，上爻至初爻。</p>
        {[...reading.lines]
          .map((line, index) => ({ line, index }))
          .reverse()
          .map(({ line, index }) => (
            <p key={index}>
              第{index + 1}爻 · {line} ·{" "}
              {line === 6
                ? "老阴"
                : line === 7
                  ? "少阳"
                  : line === 8
                    ? "少阴"
                    : "老阳"}{" "}
              · {line === 6 || line === 9 ? "动" : "静"}
            </p>
          ))}
      </section>
      {reading.changingLines.length ? (
        <section className="reading-changing-lines">
          <h3>动爻与之卦</h3>
          {reading.changingLines.map((index) => (
            <p key={index}>
              第{index + 1}爻：{reading.primary.yao[index]}
            </p>
          ))}
          {reading.changingLines.length === 6 && reading.primary.extra ? (
            <p>专用爻辞：{reading.primary.extra}</p>
          ) : null}
          <p>
            之卦：{String.fromCodePoint(0x4dc0 + reading.changed.number - 1)} 第
            {reading.changed.number}卦《{reading.changed.fullName}》· 上
            {reading.changed.upper}下{reading.changed.lower}
          </p>
          <p>卦辞：{reading.changed.judgement}</p>
          <p>大象：{reading.changed.daxiang}</p>
        </section>
      ) : (
        <p className="reading-static-note">六爻皆静，以本卦卦辞与大象为主。</p>
      )}
    </section>
  );
}

export default function ReadingFlow() {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [question, setQuestion] = useState("");
  const [profiles, setProfiles] = useState(loadProfiles);
  const [selectedProfileId, setSelectedProfileId] = useState("new");
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [manualLongitude, setManualLongitude] = useState(false);
  const [notice, setNotice] = useState("");
  const [reading, setReading] = useState(null);
  const dialogRef = useRef(null);
  const returnFocusRef = useRef(null);
  const selectedCategory = useMemo(
    () => CATEGORIES.find((category) => category.id === categoryId),
    [categoryId],
  );
  const closeFlow = () => setIsOpen(false);

  useEffect(() => {
    const openFlow = (event) => {
      const incomingCategory = event.detail?.category || "";
      const matchedCategory = CATEGORIES.find(
        (category) =>
          category.id === incomingCategory ||
          category.name === incomingCategory,
      );
      const savedProfiles = loadProfiles();
      returnFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      setProfiles(savedProfiles);
      setSelectedProfileId(savedProfiles[0]?.id || "new");
      setProfile(savedProfiles[0] || EMPTY_PROFILE);
      setManualLongitude(false);
      setCategoryId(matchedCategory?.id || "");
      setQuestion("");
      setReading(null);
      setNotice("");
      setIsOpen(true);
    };
    window.addEventListener("dfgx:reading-open", openFlow);
    return () => window.removeEventListener("dfgx:reading-open", openFlow);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const targets = [
      document.getElementById("root"),
      ...document.querySelectorAll(".dfgx-floating-nav, .dfgx-upgrade"),
    ].filter(Boolean);
    const previousTargets = targets.map((target) => ({
      target,
      hadInert: target.hasAttribute("inert"),
      ariaHidden: target.getAttribute("aria-hidden"),
    }));
    targets.forEach((target) => {
      target.inert = true;
      target.setAttribute("aria-hidden", "true");
    });
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() =>
      dialogRef.current
        ?.querySelector(
          "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])",
        )
        ?.focus(),
    );
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeFlow();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousTargets.forEach(({ target, hadInert, ariaHidden }) => {
        if (hadInert) target.setAttribute("inert", "");
        else target.removeAttribute("inert");
        if (ariaHidden === null) target.removeAttribute("aria-hidden");
        else target.setAttribute("aria-hidden", ariaHidden);
      });
      returnFocusRef.current?.focus?.({ preventScroll: true });
      returnFocusRef.current = null;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    dialogRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [isOpen, reading]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  if (!isOpen) return null;

  const generateReading = () => {
    if (!categoryId) {
      setNotice("请先选择一类所问之事");
      return;
    }
    if (question.trim().length < 6) {
      setNotice("请把问题写得更具体一些");
      return;
    }
    if (!profile.name.trim()) {
      setNotice("请填写姓名");
      return;
    }
    const archive = saveProfileArchive({
      profile,
      selectedProfileId,
      profiles,
    });
    if (!archive) {
      setNotice("本地保存失败，请稍后重试");
      return;
    }
    const { savedProfile, profiles: nextProfiles } = archive;
    setProfiles(nextProfiles);
    setSelectedProfileId(savedProfile.id);
    setProfile(savedProfile);
    try {
      const nextReading = createIChingReading();
      saveReadingRecord({
        type: "reading",
        tool: "观星问卦",
        category: selectedCategory?.name || "",
        question: question.trim(),
        reading: nextReading,
        profileSummary: formatProfileSummary(savedProfile),
      });
      setReading(nextReading);
      setNotice("");
    } catch {
      setNotice("无法取得安全随机数，暂不能起卦");
    }
  };

  return (
    <section
      ref={dialogRef}
      className="reading-flow"
      data-step={reading ? "1" : "0"}
      role="dialog"
      aria-modal="true"
      aria-label="观星问卦流程"
    >
      <div className="reading-paper">
        <ReadingTopbar
          result={Boolean(reading)}
          onBack={() => setReading(null)}
          onClose={closeFlow}
        />
        <main className="reading-content">
          {!reading ? (
            <>
              <section className="reading-screen reading-category-screen">
                <p className="reading-kicker">·观星问卦 ·</p>
                <h2>此刻，你想问什么</h2>
                <p className="reading-intro">
                  一卦只问一事。先选择方向，再把真正困扰你的问题写下来。
                </p>
                <div className="reading-category-grid">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      className={
                        categoryId === category.id ? "is-selected" : ""
                      }
                      aria-pressed={categoryId === category.id}
                      onClick={() => {
                        setCategoryId(category.id);
                        setNotice("");
                      }}
                    >
                      <strong>{category.name}</strong>
                      <span>{category.description}</span>
                      <small>
                        {categoryId === category.id ? "已选择" : "选择此项"}
                      </small>
                    </button>
                  ))}
                </div>
              </section>
              <section className="reading-screen reading-question-screen">
                <h3 className="reading-form-section-title">所问之事</h3>
                <p className="reading-intro">
                  问题越具体，后续的卦象解读越容易落到你的真实处境。
                </p>
                <label className="reading-question-field">
                  <span>所问之事</span>
                  <textarea
                    aria-label="所问之事"
                    value={question}
                    rows="7"
                    maxLength="180"
                    placeholder={
                      selectedCategory?.prompt || "请写下此刻最想看清的一件事。"
                    }
                    onChange={(event) => setQuestion(event.target.value)}
                  />
                  <small>{question.length} / 180</small>
                </label>
                <aside className="reading-guidance">
                  <strong>问卦宜清晰</strong>
                  <p>
                    少问“会不会”，多说明当下处境、你的选择，以及最想看清的变化。
                  </p>
                </aside>
              </section>
              <section className="reading-screen reading-profile-screen">
                <ProfileArchiveForm
                  profiles={profiles}
                  selectedProfileId={selectedProfileId}
                  profile={profile}
                  manualLongitude={manualLongitude}
                  onSelectedProfileIdChange={setSelectedProfileId}
                  onProfileChange={setProfile}
                  onManualLongitudeChange={setManualLongitude}
                  onNewArchive={() => setNotice("已切换为新建档案")}
                />
                <p className="reading-local-note">
                  档案仅保存在本设备，可随时删除
                </p>
                <button
                  className="reading-primary-action"
                  type="button"
                  onClick={generateReading}
                >
                  保存档案并起卦
                </button>
              </section>
            </>
          ) : (
            <section className="reading-screen reading-result-screen">
              <p className="reading-kicker">·观星问卦 ·</p>
              <h2>卦象已成</h2>
              <article className="reading-summary-card">
                <p>
                  <span>所问</span>
                  <strong>{question}</strong>
                </p>
                <p>
                  <span>说明</span>
                  <strong>人物档案用于记录本次所问，不参与卦象生成。</strong>
                </p>
              </article>
              <ReadingEvidence reading={reading} />
              <section className="reading-reading-logic">
                <h3>阅读逻辑</h3>
                <p>本卦＝当前结构；动爻＝变化位置；之卦＝变化后结构。</p>
              </section>
              <details>
                <summary>起卦依据</summary>
                <p>
                  依据《系辞》“大衍之数五十，其用四十有九”；本实现以传统四值概率完成数字化模拟。
                </p>
              </details>
              <p className="reading-local-note">
                问卦用于整理处境，不替代医疗、法律、投资或现实决策。
              </p>
              <button
                className="reading-primary-action"
                type="button"
                onClick={() => {
                  setCategoryId("");
                  setQuestion("");
                  setReading(null);
                }}
              >
                再问一事
              </button>
              <button
                className="reading-secondary-action"
                type="button"
                onClick={() => setReading(null)}
              >
                返回修改信息
              </button>
            </section>
          )}
        </main>
        {notice ? (
          <div className="reading-notice" role="status">
            {notice}
          </div>
        ) : null}
      </div>
    </section>
  );
}
