import { useEffect, useState } from "react";
import { getDailyHexagram } from "./daily-hexagram.js";
import SecondaryPageHeader, { useDfgxTheme } from "./secondary-page-chrome.jsx";
import "./daily-hexagram-page.css";

const LINE_NAMES = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];

function scheduleTomorrow(callback) {
  const now = new Date();
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return window.setTimeout(callback, nextMidnight.getTime() - now.getTime() + 1000);
}

function DailyYao({ value, index }) {
  return (
    <li>
      <span>{LINE_NAMES[index]}</span>
      <i className={value === 7 ? "is-yang" : "is-yin"} aria-label={value === 7 ? "阳爻" : "阴爻"} />
      <small>{value === 7 ? "阳" : "阴"}</small>
    </li>
  );
}

function ReflectionList({ theme }) {
  return (
    <ol className="dfgx-daily-reflections">
      <li><strong>观察</strong><p>今天哪些选择最需要体现“{theme}”？先写下事实，再判断感受。</p></li>
      <li><strong>行动</strong><p>挑一件范围可控的小事试着调整，并为它保留余地。</p></li>
      <li><strong>复盘</strong><p>一天结束时回看：哪些判断有依据，哪些只是当下的担心？</p></li>
    </ol>
  );
}

export default function DailyHexagramPage() {
  const [theme, setTheme] = useDfgxTheme();
  const [date, setDate] = useState(() => new Date());
  const daily = getDailyHexagram(date);

  useEffect(() => {
    let timer;
    const refresh = () => {
      setDate(new Date());
      timer = scheduleTomorrow(refresh);
    };
    timer = scheduleTomorrow(refresh);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!daily) return undefined;
    document.title = `${daily.name}｜今日卦象｜东方观星`;
    return () => { document.title = "东方观星｜观天象，问内心"; };
  }, [daily?.name]);

  if (!daily) return null;

  return (
    <div className="dfgx-daily-page">
      <SecondaryPageHeader theme={theme} onThemeChange={setTheme} backHash="daily" />
      <main className="dfgx-daily-main">
        <section className="dfgx-daily-hero" aria-labelledby="daily-title">
          <p>今日一卦 · 文化阅读</p>
          <time dateTime={daily.isoDate}>{daily.dateLabel}</time>
          <div className="dfgx-daily-seal" aria-hidden="true">易</div>
          <div className="dfgx-daily-hero-grid">
            <div className="dfgx-daily-symbol" aria-hidden="true">{daily.symbol}</div>
            <div>
              <span>第 {String(daily.number).padStart(2, "0")} 卦</span>
              <h1 id="daily-title">{daily.name}</h1>
              <strong>{daily.theme}</strong>
            </div>
          </div>
          <p className="dfgx-daily-method">按访客本地公历日期稳定轮换；同日同卦，仅供文化阅读，不是传统起卦。</p>
        </section>

        <section className="dfgx-daily-section dfgx-daily-structure" aria-labelledby="daily-structure-title">
          <div className="dfgx-daily-section-heading"><span>卦象结构</span><h2 id="daily-structure-title">上下相应，六爻自下而上</h2></div>
          <dl className="dfgx-daily-trigrams"><div><dt>上卦</dt><dd>{daily.upper}</dd></div><div><dt>下卦</dt><dd>{daily.lower}</dd></div></dl>
          <ol className="dfgx-daily-lines">{[...daily.bits].map((value, index) => <DailyYao key={index} value={value} index={index} />).reverse()}</ol>
        </section>

        <section className="dfgx-daily-section dfgx-daily-classic" aria-labelledby="daily-classic-title">
          <div className="dfgx-daily-section-heading"><span>经典依据</span><h2 id="daily-classic-title">《周易》原文</h2></div>
          <blockquote><cite>卦辞</cite><p>{daily.judgement}</p></blockquote>
          <blockquote><cite>《象》曰</cite><p>{daily.daxiang}</p></blockquote>
          <small>以上仅呈现项目内已核对的经典文本；现代解释另列，不混同为原文。</small>
        </section>

        <section className="dfgx-daily-section dfgx-daily-observation" aria-labelledby="daily-observation-title">
          <div className="dfgx-daily-section-heading"><span>今日观察</span><h2 id="daily-observation-title">把“{daily.theme}”放回现实</h2></div>
          <p>以下为现代辅助解释，用于组织观察与复盘，不构成对结果的预测。</p>
          <ReflectionList theme={daily.theme} />
        </section>

        <section className="dfgx-daily-boundary" aria-labelledby="daily-boundary-title">
          <h2 id="daily-boundary-title">理性边界</h2>
          <p>卦象适合作为文化阅读与自我提问的材料，不替代医疗、法律、投资或其他现实决策。</p>
          <a href={`#/hexagrams/${daily.number}`}>进入「{daily.name}」知识页 <span aria-hidden="true">→</span></a>
        </section>
      </main>
    </div>
  );
}
