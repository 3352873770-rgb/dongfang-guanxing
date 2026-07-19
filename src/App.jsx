import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowsClockwise,
  Briefcase,
  CalendarBlank,
  CardsThree,
  CaretRight,
  ChartLineUp,
  ChatsCircle,
  Clock,
  Coins,
  Compass,
  EnvelopeSimple,
  FlowerLotus,
  GraduationCap,
  GridFour,
  Heart,
  List,
  MagnifyingGlass,
  Microphone,
  Pause,
  Play,
  SealCheck,
  Sparkle,
  StarFour,
  TrendUp,
  X,
} from "@phosphor-icons/react";

const topics = ["感情", "事业", "学业", "财富", "健康", "决策", "其他"];

const longTermQuestions = [
  { icon: Heart, title: "感情发展", copy: "何时遇见正缘 / 关系走向" },
  { icon: Briefcase, title: "事业发展", copy: "职业规划 / 转型 / 晋升时机" },
  { icon: GraduationCap, title: "学业考试", copy: "升学 / 考研 / 考试发展变化" },
  { icon: Coins, title: "财富运势", copy: "投资 / 理财 / 财务状况 / 买卖" },
];

const oracleQuestions = [
  { icon: EnvelopeSimple, title: "云签解惑", copy: "迷茫困惑，求指引方向" },
  { icon: Briefcase, title: "事业灵签", copy: "日常决策、趋吉避凶" },
  { icon: ChartLineUp, title: "流年运势", copy: "年度运势，流年走向" },
  { icon: Clock, title: "时辰运势", copy: "每日运势，时辰吉凶" },
  { icon: Sparkle, title: "AI解读报告", copy: "智能分析，深度解读" },
];

const reasons = [
  { key: "变", copy: ["解析卦象本质", "看清事物本体", "理解背后原因"] },
  { key: "理", copy: ["阐明问题逻辑", "梳理来龙去脉", "提供应对方向"] },
  { key: "行", copy: ["提供具体建议", "分步骤给出指引", "落地可执行"] },
  { key: "果", copy: ["预测未来变化", "把握趋势与风险", "提前规划应变"] },
];

const hexagrams = [
  { symbol: "䷀", name: "乾为天" },
  { symbol: "䷁", name: "坤为地" },
  { symbol: "䷂", name: "水雷屯" },
  { symbol: "䷃", name: "山水蒙" },
  { symbol: "䷄", name: "水天需" },
  { symbol: "䷅", name: "天水讼" },
  { symbol: "䷆", name: "地水师" },
  { symbol: "䷇", name: "水地比" },
];

const tools = [
  { icon: Coins, title: "三枚铜钱", copy: "传统起卦，简便正道" },
  { icon: StarFour, title: "八字排盘", copy: "四柱排盘解析" },
  { icon: CardsThree, title: "六爻排卦", copy: "智能排盘分析" },
  { icon: FlowerLotus, title: "紫微命盘", copy: "十二宫位详批" },
  { icon: CalendarBlank, title: "周时起卦", copy: "按时间起卦" },
  { icon: GridFour, title: "塔罗抽牌", copy: "78张塔罗解析" },
  { icon: Microphone, title: "语音解卦", copy: "365卦辞解读" },
  { icon: MagnifyingGlass, title: "吉凶查询", copy: "传统查吉凶" },
];

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="东方观星首页">
      <span className="brand-mark"><SealCheck weight="thin" aria-hidden="true" /></span>
      <span>东方观星</span>
    </a>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="主导航">
          <button className="mobile-nav-close" onClick={() => setMenuOpen(false)} aria-label="关闭菜单"><X weight="thin" /></button>
          <a className="is-active" href="#top" onClick={() => setMenuOpen(false)}>首页</a>
          <a href="#ask" onClick={() => setMenuOpen(false)}>问卦</a>
          <a href="#daily" onClick={() => setMenuOpen(false)}>卜卦</a>
          <a href="#record" onClick={() => setMenuOpen(false)}>记录</a>
          <a href="#footer" onClick={() => setMenuOpen(false)}>我的</a>
        </nav>
        <a className="report-link" href="#tools">AI解读报告</a>
        <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="打开菜单"><List weight="thin" /></button>
      </div>
    </header>
  );
}

function Hero({ onStart, onToast, isStarting }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("感情");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      try {
        await video.play();
      } catch {
        setIsPlaying(false);
      }
    } else {
      video.pause();
    }
  };

  return (
    <section className="hero" id="top">
      <div className="hero-orbit" aria-label="九万里观象视频">
        <div className="hero-media">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster="/media/observatory-poster.png"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src="/media/observatory.mp4" type="video/mp4" />
          </video>
          <p className="orbit-title">九万里觉 · 一象一问</p>
          <button className="playback-control" onClick={togglePlayback} aria-label={isPlaying ? "暂停观象视频" : "播放观象视频"}>
            {isPlaying ? <Pause weight="light" /> : <Play weight="light" />}
          </button>
          <SealCheck className="orbit-seal" weight="thin" aria-hidden="true" />
        </div>
      </div>
      <h1>今天，想问什么？</h1>
      <p className="hero-copy">不管是什么问题，寻找你的定问，求心中的答案。</p>
      <div className="topic-list" aria-label="问题主题">
        {topics.map((topic) => (
          <button key={topic} className={selectedTopic === topic ? "is-selected" : ""} onClick={() => setSelectedTopic(topic)} aria-pressed={selectedTopic === topic}>
            {topic}
          </button>
        ))}
      </div>
      <button className="primary-cta" onClick={() => onStart(selectedTopic)} disabled={isStarting} aria-busy={isStarting}>开始问卦</button>
      <button className="guide-link" onClick={() => onToast("使用指南：先选主题，再选择问卦方式")}>使用指南</button>
    </section>
  );
}

function QuestionRow({ item, onSelect }) {
  const Icon = item.icon;
  return (
    <button className="question-row" onClick={() => onSelect(item.title)}>
      <span className="row-icon"><Icon weight="thin" aria-hidden="true" /></span>
      <span className="row-copy"><strong>{item.title}</strong><small>{item.copy}</small></span>
      <CaretRight weight="thin" aria-hidden="true" />
    </button>
  );
}

function QuestionPanel({ onToast }) {
  return (
    <section className="question-panel section-shell" id="ask">
      <div className="question-column">
        <h2>长期问卦</h2>
        {longTermQuestions.map((item) => <QuestionRow key={item.title} item={item} onSelect={(title) => onToast(`已选择「${title}」`)} />)}
      </div>
      <div className="question-divider" aria-hidden="true" />
      <div className="question-column oracle-column">
        <h2>灵签信</h2>
        {oracleQuestions.map((item) => <QuestionRow key={item.title} item={item} onSelect={(title) => onToast(`已选择「${title}」`)} />)}
      </div>
    </section>
  );
}

function DailyHexagram({ onToast }) {
  return (
    <section className="daily-card section-shell" id="daily">
      <div className="daily-content">
        <p className="daily-kicker">今日一卦</p>
        <time dateTime="2025-05-20">2025年5月20日</time>
        <h2>雷山小过</h2>
        <p className="daily-reading">小事可为</p>
        <p className="daily-advice">宜小事谨慎，不宜大事<br />过犹未及，慎言慎行</p>
        <button className="daily-button" onClick={() => onToast("今日卦象详解已展开")}>查看卦象详细解析 <ArrowRight weight="thin" /></button>
        <p className="daily-note">今日卦象，点击查看更多</p>
      </div>
      <div className="daily-symbol" aria-label="雷山小过卦象"><span>䷽</span></div>
    </section>
  );
}

function PersonalityMap({ onToast }) {
  const steps = [
    ["01", "直觉作答", "凭第一直觉，完成选择"],
    ["02", "生成图谱", "系统生成你的八维图谱"],
    ["03", "理解自己", "发现优势，识别盲区"],
  ];

  return (
    <section className="personality-map section-shell" id="personality" aria-labelledby="personality-title">
      <div className="personality-intro">
        <p className="personality-eyebrow">认识自己的变化方式</p>
        <h2 id="personality-title">人格图谱</h2>
        <p className="personality-copy">从选择与判断中，看见你面对变化时的倾向、优势与盲区。</p>
        <ol className="personality-steps">
          {steps.map(([index, title, copy]) => (
            <li key={index}>
              <span className="personality-step-index">{index}</span>
              <strong>{title}</strong>
              <small>{copy}</small>
            </li>
          ))}
        </ol>
        <button className="personality-guide" onClick={() => onToast("人格图谱玩法：直觉作答，生成图谱，理解自己")}>查看玩法说明 <CaretRight weight="thin" aria-hidden="true" /></button>
      </div>
      <button className="personality-test-card" onClick={() => onToast("人格测试即将开始") } aria-label="开始人格测试，12题，约3分钟">
        <img src="/media/personality-test-panel.png" alt="" />
        <span className="personality-test-pulse" aria-hidden="true" />
      </button>
    </section>
  );
}

function Reasons() {
  return (
    <section className="reasons section-shell" aria-labelledby="reasons-title">
      <h2 id="reasons-title">不只是答案，也说明为什么</h2>
      <div className="reason-grid">
        {reasons.map((item) => (
          <article key={item.key}>
            <b>{item.key}</b>
            <p>{item.copy.map((line) => <span key={line}>{line}</span>)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function HexagramAtlas({ onToast }) {
  const railRef = useRef(null);
  const [selected, setSelected] = useState("乾为天");

  const moveRail = () => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollLeft = Math.min(rail.scrollLeft + 230, rail.scrollWidth - rail.clientWidth);
  };

  return (
    <section className="atlas section-shell" id="atlas">
      <div className="atlas-heading">
        <div><h2>六十四卦图谱</h2><p>六十四卦全收录，卦象、卦辞全面解析。</p></div>
        <span>含64卦象</span>
      </div>
      <div className="atlas-wrap">
        <div className="hexagram-rail" ref={railRef}>
          {hexagrams.map((hexagram) => (
            <button key={hexagram.name} className={selected === hexagram.name ? "is-selected" : ""} onClick={() => { setSelected(hexagram.name); onToast(`已选择「${hexagram.name}」`); }}>
              <span aria-hidden="true">{hexagram.symbol}</span><strong>{hexagram.name}</strong>
            </button>
          ))}
        </div>
        <button className="atlas-next" onClick={moveRail} aria-label="查看更多卦象"><ArrowRight weight="thin" /></button>
      </div>
      <div className="atlas-dots" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i className={index === 0 ? "is-active" : ""} key={index} />)}</div>
    </section>
  );
}

function ToolGrid({ onToast }) {
  return (
    <section className="tools section-shell" id="tools">
      <div className="tools-heading"><h2>推荐小工具</h2><p>实用小工具，助力你更好地理解和运用易学智慧</p></div>
      <div className="tool-grid">
        {tools.map((item) => {
          const Icon = item.icon;
          return (
            <button className="tool-card" key={item.title} onClick={() => onToast(`即将进入「${item.title}」`)}>
              <span className="tool-icon"><Icon weight="thin" aria-hidden="true" /></span>
              <span><strong>{item.title}</strong><small>{item.copy}</small></span>
              <ArrowRight weight="thin" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Reflection({ onToast }) {
  return (
    <section className="reflection section-shell" id="record">
      <h2>问过玄冥，也记录时间流转带来的变化</h2>
      <div className="reflection-panel">
        <div className="reflection-copy">
          <h3>一卦一事，过去、现在、未来，环环入扣</h3>
          <p>建立专属卦象库，跟踪记录问卦情况变化轨迹</p>
          <div className="reflection-steps">
            <div><span><ChatsCircle weight="thin" /></span><strong>记录</strong><small>每一次提问<br />完整记录</small></div>
            <div><span><ArrowsClockwise weight="thin" /></span><strong>追踪</strong><small>事后发展<br />阶段变化留痕</small></div>
            <div><span><TrendUp weight="thin" /></span><strong>对比变化</strong><small>前后卦象<br />对比分析验证</small></div>
          </div>
        </div>
        <figure className="reflection-visual">
          <img src="/media/scroll-hall.png" alt="悬挂经卷组成的问卦记录空间" />
          <button onClick={() => onToast("问卦记录已打开")}>查看卦象记录</button>
        </figure>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="footer">
      <div><strong>却不迷信答案，重在自省</strong><strong>理性决策，不迷信卦辞</strong></div>
      <p>不代替实际决策，仅供参考；照见内心只是危险的一种投影，指信自己，未来在你手中。</p>
    </footer>
  );
}

function QuestionLoader({ phase }) {
  if (!phase) return null;

  return (
    <div className={`question-loader ${phase === "exiting" ? "is-exiting" : ""}`} role="status" aria-live="polite" aria-label="正在生成问卦路径">
      <div className="question-loader-content">
        <span className="question-loader-orbit" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => <i key={index} />)}
        </span>
        <p>正在生成问卦路径...</p>
      </div>
    </div>
  );
}

export function App() {
  const [toast, setToast] = useState("");
  const [loadingPhase, setLoadingPhase] = useState("");
  const toastTimer = useRef(null);
  const loaderExitTimer = useRef(null);
  const loaderCompleteTimer = useRef(null);
  const loaderActive = useRef(false);

  useEffect(() => () => {
    window.clearTimeout(toastTimer.current);
    window.clearTimeout(loaderExitTimer.current);
    window.clearTimeout(loaderCompleteTimer.current);
  }, []);

  const showToast = (message) => {
    window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(""), 2200);
  };

  const startQuestion = (topic) => {
    if (loaderActive.current) return;
    loaderActive.current = true;
    setLoadingPhase("active");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const exitAt = reduceMotion ? 180 : 720;
    const completeAt = reduceMotion ? 240 : 960;

    loaderExitTimer.current = window.setTimeout(() => setLoadingPhase("exiting"), exitAt);
    loaderCompleteTimer.current = window.setTimeout(() => {
      setLoadingPhase("");
      loaderActive.current = false;
      document.querySelector("#ask")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      showToast(`已选择「${topic}」，请继续选择问卦方式`);
    }, completeAt);
  };

  return (
    <div className="app-shell">
      <Header />
      <main>
        <Hero onStart={startQuestion} onToast={showToast} isStarting={Boolean(loadingPhase)} />
        <QuestionPanel onToast={showToast} />
        <DailyHexagram onToast={showToast} />
        <PersonalityMap onToast={showToast} />
        <Reasons />
        <HexagramAtlas onToast={showToast} />
        <ToolGrid onToast={showToast} />
        <Reflection onToast={showToast} />
      </main>
      <Footer />
      <QuestionLoader phase={loadingPhase} />
      <div className={`toast ${toast ? "is-visible" : ""}`} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}
