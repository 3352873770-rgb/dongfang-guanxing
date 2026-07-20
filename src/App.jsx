import { lazy, Suspense, useEffect, useRef, useState } from "react";

const LiquidEther = lazy(() => import("./components/LiquidEther.jsx"));

const SLOGANS = [
  "观天象，问内心",
  "以星为镜，照见本心",
  "一问天地，一见自己",
  "顺时而观，向内而行",
];

const RESULT_COPY = "风起于青萍之末。先看清正在发生的变化，再决定下一步。";

export function App() {
  const [sloganIndex, setSloganIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [readingState, setReadingState] = useState("idle");
  const [notice, setNotice] = useState("");
  const sceneRef = useRef(null);
  const dialogRef = useRef(null);
  const readingTimerRef = useRef(null);
  const noticeTimerRef = useRef(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSloganIndex((current) => (current + 1) % SLOGANS.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (dialogOpen && !dialog.open) dialog.showModal();
    if (!dialogOpen && dialog.open) dialog.close();
  }, [dialogOpen]);

  useEffect(() => () => {
    window.clearTimeout(readingTimerRef.current);
    window.clearTimeout(noticeTimerRef.current);
  }, []);

  function handlePointerMove(event) {
    if (!sceneRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const x = (event.clientX / window.innerWidth - 0.5) * 12;
    const y = (event.clientY / window.innerHeight - 0.5) * 8;
    sceneRef.current.style.setProperty("--scene-x", `${x}px`);
    sceneRef.current.style.setProperty("--scene-y", `${y}px`);
  }

  function openReading() {
    setDialogOpen(true);
    setReadingState("idle");
    window.requestAnimationFrame(() => dialogRef.current?.querySelector("textarea")?.focus());
  }

  function closeReading() {
    setDialogOpen(false);
    setReadingState("idle");
  }

  function submitReading(event) {
    event.preventDefault();
    if (!question.trim()) return;
    setReadingState("reading");
    window.clearTimeout(readingTimerRef.current);
    readingTimerRef.current = window.setTimeout(() => setReadingState("result"), 1500);
  }

  function showNotice(message) {
    setNotice(message);
    window.clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = window.setTimeout(() => setNotice(""), 2400);
  }

  return (
    <main className="site-shell" id="hero" onPointerMove={handlePointerMove}>
      <div className="ether-layer" aria-hidden="true">
        <Suspense fallback={null}>
          <LiquidEther
            colors={["#071416", "#31535a", "#c6c0b2", "#8f6e4f"]}
            mouseForce={10}
            cursorSize={94}
            resolution={0.42}
            iterationsPoisson={24}
            autoSpeed={0.38}
            autoIntensity={1.78}
            autoResumeDelay={1600}
          />
        </Suspense>
      </div>

      <div className="ink-veil" aria-hidden="true" />
      <div ref={sceneRef} className="observatory-scene" aria-hidden="true" />

      <header className="site-header">
        <a className="brand-lockup" href="#hero" aria-label="东方观星首页">
          <img src="/brand-mark.png" alt="" />
          <span>东方观星</span>
        </a>

        <nav className="primary-nav" aria-label="主导航">
          <a className="is-active" href="#hero">观星</a>
          <button type="button" onClick={openReading}>问卦</button>
          <button type="button" onClick={() => showNotice("星图典藏正在编纂中")}>典藏</button>
          <button type="button" onClick={() => showNotice("循古法而观，向内心而问")}>关于</button>
        </nav>

        <button className="mobile-reading" type="button" onClick={openReading}>问卦</button>
      </header>

      <section className="hero-content" aria-labelledby="hero-title">
        <h1 id="hero-title">东方观星</h1>
        <div className="slogan-window" id="slogan" aria-live="polite">
          <p key={sloganIndex}>{SLOGANS[sloganIndex]}</p>
        </div>
        <button className="primary-cta" type="button" onClick={openReading}>
          <span>开始观星问卦</span>
        </button>
      </section>

      <dialog ref={dialogRef} className="reading-dialog" onClose={closeReading}>
        <button className="dialog-close" type="button" onClick={closeReading}>关闭</button>
        {readingState !== "result" ? (
          <form onSubmit={submitReading}>
            <p className="dialog-number">壹 · 问</p>
            <h2>此刻，你想问什么？</h2>
            <p className="dialog-hint">静下心，写下一件正困扰你的事。</p>
            <label htmlFor="question">心中所问</label>
            <textarea
              id="question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="例如：我应该继续等待，还是向前一步？"
              rows="4"
              required
            />
            <button className="dialog-submit" type="submit" disabled={readingState === "reading"}>
              {readingState === "reading" ? "星盘推演中…" : "起卦观星"}
            </button>
          </form>
        ) : (
          <section className="reading-result" aria-live="polite">
            <p className="dialog-number">卦意 · 初现</p>
            <div className="result-symbol" aria-hidden="true">䷴</div>
            <h2>渐卦</h2>
            <p>{RESULT_COPY}</p>
            <button type="button" onClick={() => setReadingState("idle")}>再问一卦</button>
          </section>
        )}
      </dialog>

      <div className={`notice ${notice ? "is-visible" : ""}`} role="status">{notice}</div>
    </main>
  );
}
