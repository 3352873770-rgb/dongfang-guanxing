import React, {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import SecondaryPageHeader, { useDfgxTheme } from "./secondary-page-chrome.jsx";
import { BRAND_NAME, DEFAULT_DOCUMENT_TITLE } from "./brand-lockup.jsx";
import useAtmosphereVisibility from "./use-atmosphere-visibility.js";
import {
  PREFERENCE_DIMENSIONS,
  PERSONALITY_QUESTIONS,
  VERIFICATION_QUESTIONS,
  buildPersonalitySections,
  calculatePreferenceResult,
} from "./personality-preference-data.js";
import "./personality-preference-page.css";

const LightRays = lazy(() => import("./components/LightRays/LightRays.jsx"));
const LiquidEther = lazy(() => import("./components/LiquidEther.jsx"));

const POINTS = [-2, -1, 0, 1, 2];
const NIGHT_ETHER_COLORS = ["#071012", "#76684a", "#d0ad58", "#f8eed6"];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function getPointLabel(question, value) {
  if (value === 0) return "中立";
  const direction = value < 0 ? question.leftLabel : question.rightLabel;
  return `${Math.abs(value) === 2 ? "强烈" : "较"}偏向${direction}`;
}

function PersonalityAtmosphere({ theme }) {
  const isMobile = window.matchMedia("(max-width: 720px)").matches;

  if (prefersReducedMotion) return null;

  return (
    <div className="personality-atmosphere" aria-hidden="true">
      {theme === "night" ? (
        <Suspense fallback={null}>
          <LiquidEther
            colors={NIGHT_ETHER_COLORS}
            mouseForce={isMobile ? 6 : 9}
            cursorSize={isMobile ? 88 : 112}
            isViscous
            viscous={54}
            iterationsViscous={isMobile ? 14 : 24}
            iterationsPoisson={isMobile ? 11 : 18}
            dt={0.011}
            resolution={isMobile ? 0.26 : 0.36}
            maxDpr={isMobile ? 1 : 1.5}
            targetFps={isMobile ? 24 : 40}
            autoSpeed={0.13}
            autoIntensity={1.05}
            takeoverDuration={0.9}
            autoResumeDelay={3200}
            autoRampDuration={2}
          />
        </Suspense>
      ) : (
        <Suspense fallback={null}>
          <LightRays
            className="personality-rays"
            raysOrigin="top-left"
            raysColor="#c89642"
            raysSpeed={0.28}
            lightSpread={0.34}
            rayLength={1.62}
            pulsating={false}
            fadeDistance={1.3}
            saturation={1.05}
            followMouse
            mouseInfluence={0.045}
            noiseAmount={0.06}
            distortion={0.09}
            maxDpr={isMobile ? 1 : 1.5}
            targetFps={isMobile ? 24 : 40}
          />
        </Suspense>
      )}
    </div>
  );
}

function PreferenceQuestion({
  question,
  index,
  answer,
  onAnswer,
  invalid = false,
  compact = false,
}) {
  return (
    <fieldset
      className={`personality-question${invalid ? " has-error" : ""}${compact ? " is-compact" : ""}`}
      id={`question-${question.id}`}
    >
      <legend>
        <span>{String(index + 1).padStart(2, "0")}</span>
        {question.prompt}
      </legend>

      <div className="personality-scale-row">
        <span className="personality-endpoint personality-endpoint-left">
          {question.leftLabel}
        </span>

        <div className="personality-scale" aria-describedby="personality-scale-help">
          {POINTS.map((point) => (
            <label
              className={`personality-point${point === 0 ? " is-neutral" : ""}`}
              key={point}
            >
              <input
                type="radio"
                name={question.id}
                value={point}
                checked={answer === point}
                required
                aria-label={getPointLabel(question, point)}
                onChange={() => onAnswer(question.id, point)}
              />
              <span aria-hidden="true" />
              {point === 0 ? <small>中立</small> : null}
            </label>
          ))}
        </div>

        <span className="personality-endpoint personality-endpoint-right">
          {question.rightLabel}
        </span>
      </div>
    </fieldset>
  );
}

function PreferenceRail({ axis }) {
  return (
    <div className="personality-result-axis">
      <div className="personality-result-axis-labels">
        <span>{axis.leftName} {axis.leftLetter}</span>
        <small>{axis.strength}</small>
        <span>{axis.rightName} {axis.rightLetter}</span>
      </div>
      <div
        className="personality-result-axis-track"
        style={{ "--axis-position": `${axis.position}%` }}
        role="img"
        aria-label={`${axis.label}：${axis.strength}，更接近${axis.letter}`}
      >
        <i aria-hidden="true" />
      </div>
    </div>
  );
}

function PersonalityResultCard({
  result,
  onVerify,
  onRestart,
}) {
  const boundaryCopy = result.boundaries.length
    ? `${result.boundaries.map((axis) => axis.id.split("").join(" / ")).join("、")} 接近边界，可追加 4 道核对题`
    : "四组偏好均已形成倾向，仍可用核对题再次确认";

  return (
    <article className="personality-result-card" aria-labelledby="personality-card-title">
      <div className="personality-result-identity">
        <p>当前偏好组合</p>
        <strong>{result.type}</strong>
        <h3 id="personality-card-title">{result.profile.name}</h3>
        <span>更接近 {result.type} 倾向</span>
        <p>{result.profile.summary}</p>
      </div>

      <div className="personality-result-axes">
        {result.axes.map((axis) => <PreferenceRail key={axis.id} axis={axis} />)}
        <p className="personality-result-boundary">{boundaryCopy}</p>
        <div className="personality-result-actions">
          <button type="button" onClick={onVerify}>追加核对题</button>
          <button type="button" onClick={onRestart}>重新作答</button>
        </div>
      </div>

      <p className="personality-result-disclaimer">偏好不是能力，类型不是固定标签</p>
    </article>
  );
}

export default function PersonalityPreferencePage() {
  const [theme, setTheme] = useDfgxTheme();
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const bannerRef = useRef(null);
  const resultRef = useRef(null);
  const verificationRef = useRef(null);
  const atmosphereActive = useAtmosphereVisibility(bannerRef);
  const answeredCount = PERSONALITY_QUESTIONS.reduce(
    (count, question) => count + (Number.isFinite(answers[question.id]) ? 1 : 0),
    0,
  );
  const sections = useMemo(
    () => (result ? buildPersonalitySections(result) : []),
    [result],
  );
  const basePath = import.meta.env.BASE_URL;
  const pageStyle = {
    "--personality-banner-image": `url("${basePath}media/legacy/scroll-paper.webp")`,
    "--personality-paper-image": `url("${basePath}media/reading/rice-paper-bagua-v1.jpg")`,
    "--personality-night-image": `url("${basePath}media/legacy/ink-paper-bg.webp")`,
  };

  useEffect(() => {
    document.title = `人格偏好探索｜${BRAND_NAME}`;
    return () => {
      document.title = DEFAULT_DOCUMENT_TITLE;
    };
  }, []);

  useEffect(() => {
    if (!result) return undefined;

    const frame = window.requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
      resultRef.current?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [result]);

  useEffect(() => {
    if (!showVerification) return undefined;

    const frame = window.requestAnimationFrame(() => {
      verificationRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [showVerification]);

  function updateAnswer(id, value) {
    setAnswers((current) => ({ ...current, [id]: value }));
    setValidationMessage("");
    if (result && id.startsWith("q")) {
      setResult(null);
      setShowVerification(false);
    }
  }

  function focusQuestion(question) {
    window.requestAnimationFrame(() => {
      const input = document.querySelector(
        `#question-${question.id} input[type="radio"]`,
      );
      input?.focus({ preventScroll: true });
      document.getElementById(`question-${question.id}`)?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "center",
      });
    });
  }

  function revealResult(nextResult) {
    setResult(nextResult);
    setShowVerification(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const missingQuestion = PERSONALITY_QUESTIONS.find(
      (question) => !Number.isFinite(answers[question.id]),
    );

    if (missingQuestion) {
      const number = PERSONALITY_QUESTIONS.indexOf(missingQuestion) + 1;
      setValidationMessage(`请先回答第 ${String(number).padStart(2, "0")} 题。`);
      focusQuestion(missingQuestion);
      return;
    }

    setValidationMessage("");
    revealResult(calculatePreferenceResult(answers));
  }

  function openVerification() {
    setShowVerification(true);
  }

  function submitVerification(event) {
    event.preventDefault();
    const missingQuestion = VERIFICATION_QUESTIONS.find(
      (question) => !Number.isFinite(answers[question.id]),
    );

    if (missingQuestion) {
      setValidationMessage("请完成 4 道核对题后再更新偏好印谱。");
      focusQuestion(missingQuestion);
      return;
    }

    const allQuestions = [...PERSONALITY_QUESTIONS, ...VERIFICATION_QUESTIONS];
    setValidationMessage("");
    revealResult(calculatePreferenceResult(answers, allQuestions));
  }

  function restart() {
    setAnswers({});
    setResult(null);
    setShowVerification(false);
    setValidationMessage("");
    window.requestAnimationFrame(() => {
      document.getElementById("personality-questionnaire")?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  return (
    <div className="personality-page" style={pageStyle}>
      <SecondaryPageHeader
        theme={theme}
        onThemeChange={setTheme}
        backHash="personality"
      />

      <div className="personality-banner-stage" ref={bannerRef}>
        {atmosphereActive ? <PersonalityAtmosphere theme={theme} /> : null}
        <div className="personality-banner-art" aria-hidden="true" />

        <section className="personality-banner" aria-labelledby="personality-title">
          <p>MMEETT Fate · 自我探索</p>
          <h1 id="personality-title">人格偏好探索</h1>
          <p>
            从日常选择中，看见你获取能量、理解信息、
            作出判断与安排生活的倾向。
          </p>
          <div className="personality-seal" aria-hidden="true">人</div>
        </section>
      </div>

      <main className="personality-main">
        <form
          className="personality-form"
          id="personality-questionnaire"
          noValidate
          onSubmit={handleSubmit}
        >
          <header className="personality-form-heading">
            <p>快速初测</p>
            <h2>请按第一直觉作答</h2>
            <span>12 题 · 约 3 分钟 · 没有正确答案</span>
          </header>

          <p className="personality-scale-help" id="personality-scale-help">
            中间点代表中立；越靠近两端文字，代表相应意愿越强。
          </p>

          <div className="personality-question-list">
            {PERSONALITY_QUESTIONS.map((question, index) => (
              <PreferenceQuestion
                key={question.id}
                question={question}
                index={index}
                answer={answers[question.id]}
                invalid={Boolean(validationMessage) && !Number.isFinite(answers[question.id])}
                onAnswer={updateAnswer}
              />
            ))}
          </div>

          <div className="personality-submit">
            <span>已完成 {answeredCount} / {PERSONALITY_QUESTIONS.length}</span>
            <button type="submit">提交并生成偏好印谱 <i aria-hidden="true">→</i></button>
            <p
              className="personality-validation"
              role="status"
              aria-live="polite"
            >
              {validationMessage}
            </p>
          </div>
        </form>

        {result ? (
          <section
            className="personality-result"
            ref={resultRef}
            tabIndex="-1"
            aria-labelledby="personality-result-title"
          >
            <header className="personality-result-heading">
              <p>你的偏好印谱</p>
              <h2 id="personality-result-title">看见当前回答呈现的倾向</h2>
            </header>

            <PersonalityResultCard
              result={result}
              onVerify={openVerification}
              onRestart={restart}
            />

            {showVerification ? (
              <form
                className="personality-verification"
                ref={verificationRef}
                onSubmit={submitVerification}
              >
                <header>
                  <p>边界核对</p>
                  <h3>再用四个情境确认偏好</h3>
                  <span>核对题会与原有回答一起重新计算，不覆盖原始答卷。</span>
                </header>
                {VERIFICATION_QUESTIONS.map((question, index) => (
                  <PreferenceQuestion
                    key={question.id}
                    question={question}
                    index={index}
                    answer={answers[question.id]}
                    compact
                    invalid={Boolean(validationMessage) && !Number.isFinite(answers[question.id])}
                    onAnswer={updateAnswer}
                  />
                ))}
                <button type="submit">更新我的偏好印谱 <i aria-hidden="true">→</i></button>
              </form>
            ) : null}

            <section className="personality-introduction" aria-labelledby="personality-introduction-title">
              <header>
                <p>人格介绍</p>
                <h2 id="personality-introduction-title">认识你的{result.profile.name}倾向</h2>
                <span>{result.profile.summary}</span>
              </header>

              <ol>
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{section.title}</h3>
                      <p>{section.copy}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <blockquote>把结果当作一面镜子，而不是一张判决书。</blockquote>
              <p className="personality-boundary">
                本结果只用于自我探索，不是官方 MBTI 测评或心理诊断，
                也不用于招聘筛选、能力评定或现实决策替代。
              </p>
            </section>
          </section>
        ) : null}
      </main>
    </div>
  );
}
