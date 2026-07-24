import { useEffect, useMemo, useRef, useState } from "react";
import { createIChingReadingFromLines } from "./iching.js";
import { BRAND_NAME, DEFAULT_DOCUMENT_TITLE } from "./brand-lockup.jsx";
import { saveReadingRecord } from "./reading-storage.js";
import SecondaryPageHeader, { useDfgxTheme } from "./secondary-page-chrome.jsx";
import "./three-coin-page.css";

const CATEGORIES = [
  { id: "career", label: "事业" },
  { id: "wealth", label: "财运" },
  { id: "relationship", label: "感情" },
  { id: "study", label: "学业" },
  { id: "health", label: "健康" },
  { id: "other", label: "其他" },
];

const LINE_NAMES = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];
const LINE_DESCRIPTIONS = {
  6: "老阴 · 动",
  7: "少阳 · 静",
  8: "少阴 · 静",
  9: "老阳 · 动",
};

const CATEGORY_GUIDANCE = {
  career: {
    action: "把当前选择拆成一个可验证的小动作，先观察资源、协作与节奏是否匹配。",
    risk: "避免因短期情绪做不可逆决定；涉及职位、合同或收入时仍需核对现实条件。",
  },
  wealth: {
    action: "先检查现金流、期限与最坏情境，再决定是否继续投入或调整配置。",
    risk: "卦象不构成投资建议；不要用它替代风险评估、合同核对和专业意见。",
  },
  relationship: {
    action: "先确认事实与双方真实表达，再用一次具体沟通验证你的判断。",
    risk: "不要把象意当成对他人动机的确定结论，也不要替代清晰的边界与沟通。",
  },
  study: {
    action: "选择一个最影响结果的学习环节，在短周期内练习、反馈并复盘。",
    risk: "结果不能替代备考计划与真实成绩反馈；避免因一次阅读否定长期积累。",
  },
  health: {
    action: "记录症状、作息与变化时间，优先寻求可靠的医疗信息和专业诊断。",
    risk: "卦象不能用于诊断或治疗；出现持续或急性症状时应及时就医。",
  },
  other: {
    action: "把问题拆成事实、担心和可行动部分，先处理你能影响的一小步。",
    risk: "重大法律、医疗、财务或安全事项，应以现实证据和专业建议为准。",
  },
};

function secureCoinFace() {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error("Secure random generation is unavailable");
  }
  const value = new Uint32Array(1);
  globalThis.crypto.getRandomValues(value);
  return value[0] % 2 === 0 ? 2 : 3;
}

function getLineValue(coins) {
  if (!Array.isArray(coins) || coins.length !== 3) return null;
  return coins.reduce((sum, value) => sum + value, 0);
}

function getLineGlyph(value) {
  return value === 7 || value === 9 ? "⚊" : "⚋";
}

function HexagramReading({ reading, categoryId, question }) {
  const guidance = CATEGORY_GUIDANCE[categoryId] ?? CATEGORY_GUIDANCE.other;
  const changingText = reading.changingLines.length
    ? `动爻为${reading.changingLines.map((index) => LINE_NAMES[index]).join("、")}`
    : "六爻皆静";

  return (
    <section className="three-coin-result" id="three-coin-result" aria-labelledby="three-coin-result-title">
      <div className="three-coin-chapter-heading">
        <span>03</span>
        <div>
          <h2 id="three-coin-result-title">见卦</h2>
          <p>根据卦象与爻辞，整理所问之事。</p>
        </div>
      </div>

      <div className="three-coin-hexagrams" aria-label="本卦与变卦">
        <article>
          <span>本卦</span>
          <strong aria-hidden="true">{String.fromCodePoint(0x4dc0 + reading.primary.number - 1)}</strong>
          <h3>{reading.primary.name}</h3>
          <small>{reading.primary.fullName}</small>
        </article>
        <i aria-hidden="true">→</i>
        <article>
          <span>变卦</span>
          <strong aria-hidden="true">{String.fromCodePoint(0x4dc0 + reading.changed.number - 1)}</strong>
          <h3>{reading.changed.name}</h3>
          <small>{reading.changed.fullName}</small>
        </article>
      </div>

      <p className="three-coin-result-summary">
        本卦呈现当前结构，变卦提供变化后的观察方向；本次{changingText}。
        请结合“{question}”的现实处境阅读，不把象意当成确定预测。
      </p>

      <div className="three-coin-result-sections">
        <section>
          <h3>卦辞依据</h3>
          <p><strong>{reading.primary.fullName}：</strong>{reading.primary.judgement}</p>
          <p><strong>《象》曰：</strong>{reading.primary.daxiang}</p>
          {reading.changingLines.length ? (
            <p>
              <strong>动爻：</strong>
              {reading.changingLines
                .map((index) => `${LINE_NAMES[index]}「${reading.primary.yao[index]}」`)
                .join("；")}
            </p>
          ) : null}
        </section>
        <section>
          <h3>行动建议</h3>
          <p>{guidance.action}</p>
        </section>
        <section>
          <h3>风险提醒</h3>
          <p>{guidance.risk}</p>
        </section>
        <section>
          <h3>理性边界</h3>
          <p>本页是传统文化的数字化体验，用于自我观察与复盘，不构成确定性结论，也不替代现实决策。</p>
        </section>
      </div>
    </section>
  );
}

export default function ThreeCoinPage() {
  const [theme, setTheme] = useDfgxTheme();
  const [categoryId, setCategoryId] = useState("career");
  const [question, setQuestion] = useState("");
  const [casts, setCasts] = useState(() => Array(6).fill(null));
  const [reading, setReading] = useState(null);
  const [notice, setNotice] = useState("");
  const questionRef = useRef(null);

  const completedCount = casts.filter(Boolean).length;
  const nextCastIndex = casts.findIndex((coins) => !coins);
  const isComplete = completedCount === 6;
  const category = useMemo(
    () => CATEGORIES.find((item) => item.id === categoryId) ?? CATEGORIES[0],
    [categoryId],
  );

  useEffect(() => {
    document.title = `三枚铜钱｜${BRAND_NAME}`;
    return () => {
      document.title = DEFAULT_DOCUMENT_TITLE;
    };
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 2800);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!reading) return;
    window.requestAnimationFrame(() => {
      document.getElementById("three-coin-result")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    });
  }, [reading]);

  const clearResult = () => {
    if (reading) setReading(null);
  };

  const updateCategory = (id) => {
    setCategoryId(id);
    clearResult();
    setNotice("");
  };

  const updateQuestion = (value) => {
    setQuestion(value);
    clearResult();
    setNotice("");
  };

  const castNextLine = () => {
    if (question.trim().length < 6) {
      setNotice("请先写下至少 6 个字的具体问题");
      questionRef.current?.focus();
      return;
    }
    if (nextCastIndex < 0) return;

    try {
      const coins = [secureCoinFace(), secureCoinFace(), secureCoinFace()];
      setCasts((current) => current.map((value, index) => (index === nextCastIndex ? coins : value)));
      setNotice(`${LINE_NAMES[nextCastIndex]}已记录`);
    } catch {
      setNotice("无法取得安全随机数，暂不能掷币");
    }
  };

  const toggleCoin = (lineIndex, coinIndex) => {
    setCasts((current) =>
      current.map((coins, index) => {
        if (index !== lineIndex || !coins) return coins;
        return coins.map((value, currentCoinIndex) =>
          currentCoinIndex === coinIndex ? (value === 3 ? 2 : 3) : value,
        );
      }),
    );
    clearResult();
    setNotice(`${LINE_NAMES[lineIndex]}已按手动记录调整`);
  };

  const generateResult = () => {
    const trimmedQuestion = question.trim();
    if (trimmedQuestion.length < 6) {
      setNotice("请先写下至少 6 个字的具体问题");
      questionRef.current?.focus();
      return;
    }
    if (!isComplete) {
      setNotice("请先完成六次掷币");
      return;
    }
    try {
      const lines = casts.map(getLineValue);
      const nextReading = createIChingReadingFromLines(lines);
      saveReadingRecord({
        type: "three-coins",
        tool: "三枚铜钱",
        category: category.label,
        question: trimmedQuestion,
        reading: nextReading,
        profileSummary: "",
      });
      setReading(nextReading);
      setNotice("卦象已生成");
    } catch {
      setNotice("卦象生成失败，请重新起卦");
    }
  };

  const resetCasting = () => {
    setCasts(Array(6).fill(null));
    setReading(null);
    setNotice("");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <div className="three-coin-page">
      <SecondaryPageHeader
        theme={theme}
        onThemeChange={setTheme}
        backHash="tools"
        backLabel="返回工具"
      />

      <main className="three-coin-main">
        <section className="three-coin-chapter" aria-labelledby="three-coin-question-title">
          <div className="three-coin-chapter-heading">
            <span>01</span>
            <div>
              <h1 id="three-coin-question-title">定问</h1>
              <p>默念所问之事，选定事项类别，清晰表述问题。</p>
            </div>
          </div>

          <div className="three-coin-categories" aria-label="事项类别">
            {CATEGORIES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={categoryId === item.id ? "is-selected" : ""}
                aria-pressed={categoryId === item.id}
                onClick={() => updateCategory(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <label className="three-coin-question">
            <span>所问之事</span>
            <textarea
              ref={questionRef}
              rows="4"
              maxLength="120"
              value={question}
              placeholder="例如：近期是否适合推进新的项目计划？"
              onChange={(event) => updateQuestion(event.target.value)}
            />
            <small>{question.length} / 120</small>
          </label>
        </section>

        <section className="three-coin-chapter three-coin-casting" aria-labelledby="three-coin-casting-title">
          <div className="three-coin-chapter-heading">
            <span>02</span>
            <div>
              <h2 id="three-coin-casting-title">六掷</h2>
              <p>静心六掷，每次记录三枚铜钱；爻线自下而上。</p>
            </div>
          </div>

          <p className="three-coin-method">
            本页采用“正面记 3、反面记 2”的三钱法：合计 6、7、8、9，分别对应老阴、少阳、少阴、老阳。
          </p>

          <ol className="three-coin-cast-list">
            {[...LINE_NAMES].reverse().map((lineName, visualIndex) => {
              const lineIndex = LINE_NAMES.length - 1 - visualIndex;
              const coins = casts[lineIndex];
              const lineValue = getLineValue(coins);
              return (
                <li key={lineName} className={coins ? "is-complete" : ""}>
                  <div className="three-coin-line-name">
                    <strong>{lineName}</strong>
                    <small>第 {lineIndex + 1} 掷</small>
                  </div>
                  <div className="three-coin-faces" aria-label={`${lineName}三枚铜钱`}>
                    {coins ? (
                      coins.map((value, coinIndex) => (
                        <button
                          key={coinIndex}
                          type="button"
                          aria-label={`${lineName}第${coinIndex + 1}枚，当前${value === 3 ? "正面" : "反面"}，点击切换`}
                          onClick={() => toggleCoin(lineIndex, coinIndex)}
                        >
                          {value === 3 ? "正" : "反"}
                        </button>
                      ))
                    ) : (
                      <span>待掷</span>
                    )}
                  </div>
                  <div className="three-coin-line-result">
                    {lineValue ? (
                      <>
                        <strong aria-hidden="true">{getLineGlyph(lineValue)}</strong>
                        <small>{LINE_DESCRIPTIONS[lineValue]}</small>
                      </>
                    ) : (
                      <small>尚未记录</small>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          {!isComplete ? (
            <button className="three-coin-primary" type="button" onClick={castNextLine}>
              掷出{LINE_NAMES[nextCastIndex]}
              <span aria-hidden="true">→</span>
            </button>
          ) : (
            <button className="three-coin-primary" type="button" onClick={generateResult}>
              生成结果
              <span aria-hidden="true">→</span>
            </button>
          )}
        </section>

        {reading ? (
          <>
            <HexagramReading reading={reading} categoryId={categoryId} question={question.trim()} />
            <button className="three-coin-reset" type="button" onClick={resetCasting}>
              重新起卦
            </button>
          </>
        ) : (
          <section className="three-coin-result-placeholder" aria-label="结果说明">
            <span>03</span>
            <div>
              <h2>见卦</h2>
              <p>完成六次掷币后，结果将在本页下方展开，不跳转到其他页面。</p>
            </div>
          </section>
        )}
      </main>

      {notice ? <div className="three-coin-notice" role="status">{notice}</div> : null}
    </div>
  );
}
