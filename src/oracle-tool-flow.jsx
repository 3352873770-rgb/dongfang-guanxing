import React, { useEffect, useMemo, useRef, useState } from "react";
import { createIChingReading, createTimeIChingReading } from "./iching.js";
import { loadReadingRecords, saveReadingRecord } from "./reading-storage.js";
import ProfileArchiveForm, {
  EMPTY_PROFILE,
  formatProfileSummary,
  getGuangzhouLongitude,
  GUANGZHOU_DISTRICTS,
  loadProfiles,
  saveProfileArchive,
} from "./profile-archive-form.jsx";
import "./oracle-tool-flow.css";

export const ORACLE_TOOLS = {
  云签解惑: {
    id: "cloud",
    name: "云签解惑",
    title: "此刻想看清什么",
    intro: "选择一个方向，再写下一件具体的事。",
    action: "生成签象",
  },
  事业灵签: {
    id: "career",
    name: "事业灵签",
    title: "确认这次事业选择",
    intro: "把情境和一个具体选择写清楚。",
    action: "生成事业灵签",
  },
  流年运势: {
    id: "annual",
    name: "流年运势",
    title: "确认年度所观",
    intro: "年份、关注范围、具体问题和人物背景在同页确认。",
    action: "保存档案并观流年",
  },
  时辰运势: {
    id: "time",
    name: "时辰运势",
    title: "以所问时刻起卦",
    intro: "以所问时刻和所在地按可重算的时间口径起卦。",
    action: "生成时间卦",
  },
  AI解读报告: {
    id: "report",
    name: "AI解读报告",
    title: "选择一条已保存问卦",
    intro: "结构化解读原型，只整理已保存的卦象，不重新起卦。",
    action: "生成结构化解读",
  },
};

function getShanghaiDateTimeInputValue(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
    .formatToParts(date)
    .reduce((result, part) => ({ ...result, [part.type]: part.value }), {});
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

function parseShanghaiDateTime(value) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value || "")) return null;
  const date = new Date(`${value}:00+08:00`);
  if (Number.isNaN(date.getTime()) || getShanghaiDateTimeInputValue(date) !== value) return null;
  return date;
}

function isUsableReading(record) {
  return Boolean(
    record?.reading?.primary?.fullName &&
    record?.reading?.changed?.fullName &&
    Array.isArray(record?.reading?.changingLines),
  );
}

function readingSymbol(reading) {
  return String.fromCodePoint(0x4dc0 + reading.primary.number - 1);
}

function ToolTopbar({ showingResult, onBack, onClose }) {
  return (
    <header className="reading-topbar">
      <button type="button" onClick={showingResult ? onBack : onClose}>
        {showingResult ? "返回" : "关闭"}
      </button>
      <strong>观星问卦</strong>
      <button type="button" onClick={onClose}>
        退出
      </button>
    </header>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <label className={`reading-row ${className}`.trim()}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function TimeLocationFields({
  location,
  manualLongitude,
  onChange,
  onDistrict,
  onToggleLongitude,
}) {
  return (
    <fieldset className="reading-fieldset">
      <legend>所在地</legend>
      <div className="reading-row">
        <span>所问地区</span>
        <div className="reading-location-fields">
          <select
            aria-label="省份"
            value={location.province}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                province: event.target.value,
              }))
            }
          >
            <option>广东省</option>
          </select>
          <select
            aria-label="城市"
            value={location.city}
            onChange={(event) =>
              onChange((current) => ({ ...current, city: event.target.value }))
            }
          >
            <option>广州市</option>
          </select>
          <select
            aria-label="区县"
            value={location.district}
            onChange={(event) => onDistrict(event.target.value)}
          >
            {GUANGZHOU_DISTRICTS.map(([district]) => (
              <option key={district}>{district}</option>
            ))}
          </select>
        </div>
      </div>
      <p className="reading-location-note">
        广州现辖 11 区；时间按 Asia/Shanghai 计算。
      </p>
      <Field label="经度（自动）" className="oracle-longitude">
        <input
          aria-label="经度"
          type="number"
          inputMode="decimal"
          step="0.01"
          readOnly={!manualLongitude}
          value={location.longitude}
          onChange={(event) =>
            onChange((current) => ({
              ...current,
              longitude: event.target.value,
            }))
          }
        />
        <button
          className="reading-inline-action"
          type="button"
          onClick={onToggleLongitude}
        >
          {manualLongitude ? "恢复自动" : "手动修改"}
        </button>
      </Field>
    </fieldset>
  );
}

function ClassicEvidence({ reading, includeLine = true }) {
  return (
    <section className="reading-classics" aria-label="古籍原文">
      <p className="reading-classics-label">古籍原文</p>
      <article className="reading-hexagram">
        <span>{readingSymbol(reading)}</span>
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
      {includeLine && reading.changingLines.length ? (
        <section className="reading-changing-lines">
          <h3>动爻与之卦</h3>
          {reading.changingLines.map((index) => (
            <p key={index}>
              第{index + 1}爻：{reading.primary.yao[index]}
            </p>
          ))}
          <p>
            之卦：{reading.changed.fullName} · {reading.changed.judgement}
          </p>
        </section>
      ) : (
        <p className="reading-static-note">六爻皆静，以本卦卦辞与大象为主。</p>
      )}
    </section>
  );
}

function ResultPanel({ title, children }) {
  return (
    <section className="oracle-result-panel">
      <h3>{title}</h3>
      <div>{children}</div>
    </section>
  );
}

function ResultScreen({ tool, result, onEdit }) {
  const { reading, inputs, sourceRecord } = result;
  const lineText = reading.changingLines
    .map((index) => reading.primary.yao[index])
    .join("；");
  const modernNote = (
    <p className="reading-local-note">
      现代提示仅作整理处境的辅助阅读，不替代医疗、法律、投资或其他现实决策。
    </p>
  );

  if (tool.id === "cloud") {
    return (
      <section className="reading-screen reading-result-screen">
        <p className="reading-kicker">·云签解惑 ·</p>
        <h2>签象摘要</h2>
        <ResultPanel title="所问方向">
          <p>
            {inputs.focus} · {inputs.question}
          </p>
        </ResultPanel>
        <ClassicEvidence reading={reading} />
        <ResultPanel title="当下提醒">
          <p>
            将本卦视为当前处境的观察面，先核对问题中已经存在的条件，再决定下一步要补充的信息。
          </p>
        </ResultPanel>
        {modernNote}
        <button
          className="reading-primary-action"
          type="button"
          onClick={onEdit}
        >
          返回修改信息
        </button>
      </section>
    );
  }
  if (tool.id === "career") {
    return (
      <section className="reading-screen reading-result-screen">
        <p className="reading-kicker">·事业灵签 ·</p>
        <h2>当前结构</h2>
        <ResultPanel title="事业情境">
          <p>
            {inputs.situation} · {inputs.question}
          </p>
        </ResultPanel>
        <ResultPanel title="变化位置">
          <p>{lineText || "六爻皆静，以本卦卦辞与大象为主。"}</p>
        </ResultPanel>
        <ResultPanel title="后续结构">
          <p>
            之卦《{reading.changed.fullName}》：{reading.changed.judgement}
          </p>
        </ResultPanel>
        <ClassicEvidence reading={reading} />
        <ResultPanel title="现代决策检查">
          <ul>
            <li>这项选择的前提条件是否已经写清？</li>
            <li>可以先验证的最小行动是什么？</li>
            <li>谁会受到影响，是否需要补充沟通？</li>
          </ul>
        </ResultPanel>
        {modernNote}
        <button
          className="reading-primary-action"
          type="button"
          onClick={onEdit}
        >
          返回修改信息
        </button>
      </section>
    );
  }
  if (tool.id === "annual") {
    return (
      <section className="reading-screen reading-result-screen">
        <p className="reading-kicker">·流年运势 ·</p>
        <h2>年度背景</h2>
        <ResultPanel title="年度背景">
          <p>
            {inputs.year}年 · {inputs.range} · {inputs.focus}
          </p>
          <p>{inputs.profileSummary}</p>
        </ResultPanel>
        <ResultPanel title="年度主象">
          <p>
            本卦《{reading.primary.fullName}》：{reading.primary.judgement}
          </p>
        </ResultPanel>
        <ResultPanel title="关键变化">
          <p>{lineText || "六爻皆静，以本卦整体结构为主。"}</p>
        </ResultPanel>
        <ResultPanel title="之卦">
          <p>
            《{reading.changed.fullName}》：{reading.changed.judgement}
          </p>
        </ResultPanel>
        <ClassicEvidence reading={reading} />
        <ResultPanel title="现实提醒">
          <p>
            把年度观察拆成可以核对的阶段、资源与关系变化；卦象不构成对结果的确定性预测。
          </p>
        </ResultPanel>
        {modernNote}
        <button
          className="reading-primary-action"
          type="button"
          onClick={onEdit}
        >
          返回修改信息
        </button>
      </section>
    );
  }
  if (tool.id === "time") {
    const timeContext = reading.context;
    return (
      <section className="reading-screen reading-result-screen">
        <p className="reading-kicker">·时辰运势 ·</p>
        <h2>时间卦</h2>
        <ResultPanel title="时间与地区口径">
          <p>
            所问时刻：{inputs.time.replace("T", " ")}（{timeContext.timezone}）
          </p>
          <p>
            所在地：{inputs.location.province}
            {inputs.location.city}
            {inputs.location.district} · 东经 {inputs.location.longitude}°
          </p>
          <p>
            农历：{timeContext.yearName}年{timeContext.lunarMonth}月
            {timeContext.lunarDay}日 · {timeContext.branchName}
          </p>
        </ResultPanel>
        <ResultPanel title="时间卦">
          <p>
            本卦《{reading.primary.fullName}》：{reading.primary.judgement}
          </p>
        </ResultPanel>
        <ResultPanel title="动爻">
          <p>{lineText || "六爻皆静，以本卦卦辞与大象为主。"}</p>
        </ResultPanel>
        <ResultPanel title="之卦">
          <p>
            《{reading.changed.fullName}》：{reading.changed.judgement}
          </p>
        </ResultPanel>
        <ClassicEvidence reading={reading} />
        <details>
          <summary>时间起卦公式</summary>
          <p>
            {timeContext.formula}。本次为年支{timeContext.yearName.at(-1)}
            （第{timeContext.yearBranchIndex}位）
            、农历{timeContext.lunarMonth}月{timeContext.lunarDay}日、
            {timeContext.branchName}（第{timeContext.timeBranch}位）。
          </p>
        </details>
        {modernNote}
        <button
          className="reading-primary-action"
          type="button"
          onClick={onEdit}
        >
          返回修改信息
        </button>
      </section>
    );
  }
  return (
    <section className="reading-screen reading-result-screen">
      <p className="reading-kicker">·AI解读报告 ·</p>
      <h2>结构化解读报告</h2>
      <ResultPanel title="问卦摘要">
        <p>
          {sourceRecord?.tool || "观星问卦"} ·{" "}
          {sourceRecord?.category || "所问"}
        </p>
        <p>{sourceRecord?.question || "已保存记录"}</p>
        <p>解读重点：{inputs.focus}</p>
      </ResultPanel>
      <ResultPanel title="本卦、动爻、之卦">
        <p>
          本卦《{reading.primary.fullName}》；动爻：{lineText}；之卦《
          {reading.changed.fullName}》。
        </p>
      </ResultPanel>
      <ClassicEvidence reading={reading} />
      <ResultPanel title="原文依据">
        <p>
          上方“古籍原文”逐项对应已保存记录中的本卦卦辞、大象与动爻；本报告不重新起卦。
        </p>
      </ResultPanel>
      <ResultPanel title="结构化提示">
        <p>
          这是未连接外部模型的结构化解读原型：将问题、当前结构、变化位置和可核对的现实条件并列，供你自行复盘。
        </p>
      </ResultPanel>
      {modernNote}
      <button className="reading-primary-action" type="button" onClick={onEdit}>
        返回修改信息
      </button>
    </section>
  );
}

export default function OracleToolFlow() {
  const [isOpen, setIsOpen] = useState(false);
  const [tool, setTool] = useState(null);
  const [result, setResult] = useState(null);
  const [notice, setNotice] = useState("");
  const [question, setQuestion] = useState("");
  const [focus, setFocus] = useState("迷茫困惑");
  const [situation, setSituation] = useState("转职机会");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [annualRange, setAnnualRange] = useState("全年走势");
  const [profiles, setProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState("new");
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [profileManualLongitude, setProfileManualLongitude] = useState(false);
  const [time, setTime] = useState(getShanghaiDateTimeInputValue);
  const [location, setLocation] = useState({
    province: "广东省",
    city: "广州市",
    district: "越秀区",
    longitude: "113.27",
  });
  const [timeManualLongitude, setTimeManualLongitude] = useState(false);
  const [records, setRecords] = useState([]);
  const [selectedRecordId, setSelectedRecordId] = useState("");
  const dialogRef = useRef(null);
  const returnFocusRef = useRef(null);

  const selectedRecord = useMemo(
    () => records.find((record) => record.id === selectedRecordId) || null,
    [records, selectedRecordId],
  );

  const closeFlow = () => setIsOpen(false);

  useEffect(() => {
    const openTool = (event) => {
      const nextTool = ORACLE_TOOLS[event.detail?.tool];
      if (!nextTool) return;
      const nextProfiles = loadProfiles();
      const nextRecords = loadReadingRecords().filter(
        (record) => record.type !== "oracle-report" && isUsableReading(record),
      );
      returnFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      setTool(nextTool);
      setResult(null);
      setNotice("");
      setQuestion("");
      setFocus(
        nextTool.id === "cloud"
          ? "迷茫困惑"
          : nextTool.id === "annual"
            ? "事业发展"
            : "",
      );
      setSituation("转职机会");
      setYear(String(new Date().getFullYear()));
      setAnnualRange("全年走势");
      setProfiles(nextProfiles);
      setSelectedProfileId(nextProfiles[0]?.id || "new");
      setProfile(nextProfiles[0] || EMPTY_PROFILE);
      setProfileManualLongitude(false);
      setTime(getShanghaiDateTimeInputValue());
      setLocation({
        province: "广东省",
        city: "广州市",
        district: "越秀区",
        longitude: "113.27",
      });
      setTimeManualLongitude(false);
      setRecords(nextRecords);
      setSelectedRecordId(nextRecords[0]?.id || "");
      setIsOpen(true);
    };
    window.addEventListener("dfgx:oracle-tool-open", openTool);
    return () => window.removeEventListener("dfgx:oracle-tool-open", openTool);
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
  }, [isOpen, result]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  if (!isOpen || !tool) return null;

  const changeTimeDistrict = (district) =>
    setLocation((current) => ({
      ...current,
      district,
      longitude: timeManualLongitude
        ? current.longitude
        : getGuangzhouLongitude(district, current.longitude),
    }));
  const saveAnnualProfile = () => {
    const archive = saveProfileArchive({
      profile,
      selectedProfileId,
      profiles,
    });
    if (!archive) return null;
    setProfiles(archive.profiles);
    setSelectedProfileId(archive.savedProfile.id);
    setProfile(archive.savedProfile);
    return archive.savedProfile;
  };
  const openReadingFromEmpty = () => {
    closeFlow();
    window.setTimeout(
      () =>
        window.dispatchEvent(
          new CustomEvent("dfgx:reading-open", { detail: { category: "" } }),
        ),
      0,
    );
  };
  const generate = () => {
    let reading;
    let savedProfile = null;
    let sourceRecord = null;
    if (tool.id === "cloud" && (!focus || question.trim().length < 6)) {
      setNotice("请选择方向，并把所问写得更具体一些");
      return;
    }
    if (tool.id === "career" && (!situation || question.trim().length < 6)) {
      setNotice("请选择事业情境，并写下具体选择");
      return;
    }
    if (tool.id === "annual") {
      if (!year || !annualRange || !focus || question.trim().length < 6) {
        setNotice("请补全年份、范围、关注方向和具体问题");
        return;
      }
      if (!profile.name.trim()) {
        setNotice("流年运势需要先填写人物档案姓名");
        return;
      }
      savedProfile = saveAnnualProfile();
      if (!savedProfile) {
        setNotice("档案本地保存失败，请稍后重试");
        return;
      }
    }
    if (tool.id === "time") {
      if (!question.trim() || !time) {
        setNotice("请填写所问时刻和具体问题");
        return;
      }
      reading = createTimeIChingReading(parseShanghaiDateTime(time));
      if (!reading) {
        setNotice("所问时刻无效，请重新选择");
        return;
      }
    }
    if (tool.id === "report") {
      sourceRecord = selectedRecord;
      if (!isUsableReading(sourceRecord)) {
        setNotice("请选择一条真实的已保存问卦记录");
        return;
      }
      if (!focus.trim()) {
        setNotice("请填写希望解读的重点");
        return;
      }
      reading = sourceRecord.reading;
    }
    try {
      reading ||= createIChingReading();
    } catch {
      setNotice("无法取得安全随机数，暂不能起卦");
      return;
    }
    const inputs = {
      question: question.trim(),
      focus: focus.trim(),
      situation,
      year,
      range: annualRange,
      time,
      profileSummary: savedProfile ? formatProfileSummary(savedProfile) : "",
      location,
    };
    const nextResult = { reading, inputs, sourceRecord };
    const savedRecord = saveReadingRecord({
      type: tool.id === "report" ? "oracle-report" : "oracle",
      tool: tool.name,
      category:
        tool.id === "cloud"
          ? inputs.focus
          : tool.id === "annual"
            ? inputs.focus
            : "",
      question: tool.id === "report" ? sourceRecord.question : inputs.question,
      reading,
      profileSummary: inputs.profileSummary,
      sourceRecordId: sourceRecord?.id || "",
      context: tool.id === "time" ? { time, location } : undefined,
    });
    if (savedRecord) {
      setRecords(
        loadReadingRecords().filter(
          (record) => record.type !== "oracle-report" && isUsableReading(record),
        ),
      );
    }
    setResult(nextResult);
    setNotice("");
  };

  const inputScreen = () => {
    if (tool.id === "report" && !records.length) {
      return (
        <section className="reading-screen oracle-input-screen oracle-empty-state">
          <p className="reading-kicker">·AI解读报告 ·</p>
          <h2>结构化解读报告</h2>
          <p className="reading-static-note">
            暂无已保存问卦记录。请先完成一次问卦，再回来查看结构化解读。
          </p>
          <p className="reading-local-note">
            结构化解读原型，未连接外部大模型。
          </p>
          <button
            className="reading-primary-action"
            type="button"
            onClick={openReadingFromEmpty}
          >
            去开始问卦
          </button>
        </section>
      );
    }
    return (
      <section className="reading-screen oracle-input-screen">
        <p className="reading-kicker">·{tool.name} ·</p>
        <h2>{tool.title}</h2>
        <p className="reading-intro">{tool.intro}</p>
        {tool.id === "cloud" ? (
          <>
            <fieldset className="reading-fieldset">
              <legend>所问方向</legend>
              <select
                aria-label="所问方向"
                value={focus}
                onChange={(event) => setFocus(event.target.value)}
              >
                {["迷茫困惑", "关系选择", "日常取舍", "其他"].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </fieldset>
            <QuestionField
              value={question}
              onChange={setQuestion}
              label="具体问题"
              placeholder="写下此刻最想看清的一件事。"
            />
          </>
        ) : null}
        {tool.id === "career" ? (
          <>
            <fieldset className="reading-fieldset">
              <legend>事业情境</legend>
              <select
                aria-label="事业情境"
                value={situation}
                onChange={(event) => setSituation(event.target.value)}
              >
                {["转职机会", "晋升发展", "合作关系", "创业取舍"].map(
                  (value) => (
                    <option key={value}>{value}</option>
                  ),
                )}
              </select>
            </fieldset>
            <QuestionField
              value={question}
              onChange={setQuestion}
              label="具体选择"
              placeholder="写下你正在权衡的具体选择。"
            />
          </>
        ) : null}
        {tool.id === "annual" ? (
          <>
            <fieldset className="reading-fieldset">
              <legend>年度所观</legend>
              <div className="oracle-input-stack">
                <select
                  aria-label="所观年份"
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                >
                  {Array.from({ length: 9 }, (_, index) =>
                    String(new Date().getFullYear() - 2 + index),
                  ).map((value) => (
                    <option key={value} value={value}>{value}年</option>
                  ))}
                </select>
                <select
                  aria-label="观察范围"
                  value={annualRange}
                  onChange={(event) => setAnnualRange(event.target.value)}
                >
                  {["全年走势", "上半年", "下半年", "一个关键阶段"].map(
                    (value) => (
                      <option key={value}>{value}</option>
                    ),
                  )}
                </select>
                <select
                  aria-label="关注方向"
                  value={focus}
                  onChange={(event) => setFocus(event.target.value)}
                >
                  {["事业发展", "关系变化", "学习成长", "财务节奏"].map(
                    (value) => (
                      <option key={value}>{value}</option>
                    ),
                  )}
                </select>
              </div>
            </fieldset>
            <QuestionField
              value={question}
              onChange={setQuestion}
              label="具体问题"
              placeholder="写下这一年最希望看清的变化。"
            />
            <ProfileArchiveForm
              profiles={profiles}
              selectedProfileId={selectedProfileId}
              profile={profile}
              manualLongitude={profileManualLongitude}
              onSelectedProfileIdChange={setSelectedProfileId}
              onProfileChange={setProfile}
              onManualLongitudeChange={setProfileManualLongitude}
              onNewArchive={() => setNotice("已切换为新建档案")}
              heading="人物档案"
              intro="档案仅保存在当前设备；选择后可继续编辑并用于本次流年背景。"
            />
          </>
        ) : null}
        {tool.id === "time" ? (
          <>
            <fieldset className="reading-fieldset">
              <legend>所问时刻</legend>
              <Field label="日期与时间">
                <input
                  aria-label="所问日期与时间"
                  type="datetime-local"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                />
              </Field>
            </fieldset>
            <TimeLocationFields
              location={location}
              manualLongitude={timeManualLongitude}
              onChange={setLocation}
              onDistrict={changeTimeDistrict}
              onToggleLongitude={() => {
                if (timeManualLongitude) {
                  setLocation((current) => ({
                    ...current,
                    longitude: getGuangzhouLongitude(current.district, current.longitude),
                  }));
                  setTimeManualLongitude(false);
                  return;
                }
                setTimeManualLongitude(true);
              }}
            />
            <QuestionField
              value={question}
              onChange={setQuestion}
              label="具体问题"
              placeholder="写下此刻所问。"
            />
            <p className="reading-local-note">
              时间口径固定为 Asia/Shanghai；经度保留为地区记录与手动校正信息。
            </p>
          </>
        ) : null}
        {tool.id === "report" ? (
          <>
            <fieldset className="reading-fieldset">
              <legend>已保存问卦</legend>
              <select
                aria-label="已保存问卦"
                value={selectedRecordId}
                onChange={(event) => setSelectedRecordId(event.target.value)}
              >
                {records.map((record) => (
                  <option key={record.id} value={record.id}>
                    {record.tool} ·{" "}
                    {record.question ||
                      record.category ||
                      record.createdAt.slice(0, 10)}
                  </option>
                ))}
              </select>
              <p className="reading-location-note oracle-record-hint">
                {selectedRecord
                  ? `${selectedRecord.reading.primary.fullName} → ${selectedRecord.reading.changed.fullName}`
                  : "请选择记录"}
              </p>
            </fieldset>
            <QuestionField
              value={focus}
              onChange={setFocus}
              label="解读重点"
              placeholder="例如：我想核对动爻与当前选择的关系。"
            />
            <p className="reading-local-note">
              结构化解读原型，未连接外部大模型；只读取你选中的真实记录，不重新起卦。
            </p>
          </>
        ) : null}
        <button
          className="reading-primary-action"
          type="button"
          onClick={generate}
        >
          {tool.action}
        </button>
      </section>
    );
  };

  return (
    <section
      ref={dialogRef}
      className="reading-flow oracle-tool-flow"
      role="dialog"
      aria-modal="true"
      aria-label={`${tool.name}流程`}
    >
      <div className="reading-paper">
        <ToolTopbar
          showingResult={Boolean(result)}
          onBack={() => setResult(null)}
          onClose={closeFlow}
        />
        <main className="reading-content">
          {result ? (
            <ResultScreen
              tool={tool}
              result={result}
              onEdit={() => setResult(null)}
            />
          ) : (
            inputScreen()
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

function QuestionField({ label, value, onChange, placeholder }) {
  return (
    <fieldset className="reading-fieldset oracle-question-field">
      <legend>{label}</legend>
      <textarea
        aria-label={label}
        value={value}
        maxLength="180"
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      <small>{value.length} / 180</small>
    </fieldset>
  );
}
