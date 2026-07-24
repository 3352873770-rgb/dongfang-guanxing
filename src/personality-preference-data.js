export const DIMENSION_ORDER = ["EI", "SN", "TF", "JP"];

export const PREFERENCE_DIMENSIONS = {
  EI: {
    id: "EI",
    label: "能量来源",
    leftLetter: "E",
    leftName: "外向",
    rightLetter: "I",
    rightName: "内向",
    tieLetter: "I",
  },
  SN: {
    id: "SN",
    label: "信息方式",
    leftLetter: "S",
    leftName: "实感",
    rightLetter: "N",
    rightName: "直觉",
    tieLetter: "N",
  },
  TF: {
    id: "TF",
    label: "判断依据",
    leftLetter: "T",
    leftName: "思考",
    rightLetter: "F",
    rightName: "情感",
    tieLetter: "F",
  },
  JP: {
    id: "JP",
    label: "生活节奏",
    leftLetter: "J",
    leftName: "判断",
    rightLetter: "P",
    rightName: "感知",
    tieLetter: "J",
  },
};

export const PERSONALITY_QUESTIONS = [
  {
    id: "q01",
    dimension: "EI",
    prompt: "忙碌一周之后，我更容易从哪种方式恢复精力？",
    leftLabel: "与熟悉的人交流",
    rightLabel: "独处整理思绪",
  },
  {
    id: "q02",
    dimension: "SN",
    prompt: "接触新信息时，我通常先注意什么？",
    leftLabel: "具体事实与细节",
    rightLabel: "整体联系与可能性",
  },
  {
    id: "q03",
    dimension: "TF",
    prompt: "面对分歧时，我更自然地依据什么作决定？",
    leftLabel: "一致的原则与逻辑",
    rightLabel: "人的处境与感受",
  },
  {
    id: "q04",
    dimension: "JP",
    prompt: "安排一段旅程时，我更倾向于？",
    leftLabel: "提前确定计划",
    rightLabel: "保留临场选择",
  },
  {
    id: "q05",
    dimension: "EI",
    prompt: "在讨论中，我通常怎样形成自己的想法？",
    leftLabel: "边说边理清思路",
    rightLabel: "想清楚再表达",
  },
  {
    id: "q06",
    dimension: "SN",
    prompt: "学习陌生内容时，我更习惯从哪里开始？",
    leftLabel: "按步骤掌握实例",
    rightLabel: "先理解原理联系",
  },
  {
    id: "q07",
    dimension: "TF",
    prompt: "收到一条重要反馈时，我会先关注什么？",
    leftLabel: "标准与改进方向",
    rightLabel: "动机与关系影响",
  },
  {
    id: "q08",
    dimension: "JP",
    prompt: "原定计划被打乱时，我的第一反应更接近？",
    leftLabel: "重排并恢复秩序",
    rightLabel: "观察变化再决定",
  },
  {
    id: "q09",
    dimension: "EI",
    prompt: "遇到复杂问题时，我更容易在哪里获得启发？",
    leftLabel: "与人讨论碰撞",
    rightLabel: "独自沉淀思考",
  },
  {
    id: "q10",
    dimension: "SN",
    prompt: "面对一种新的做法时，我通常更看重？",
    leftLabel: "已有经验与证据",
    rightLabel: "潜在价值与可能",
  },
  {
    id: "q11",
    dimension: "TF",
    prompt: "团队意见发生冲突时，我更倾向于？",
    leftLabel: "使用一致的标准",
    rightLabel: "兼顾每个人处境",
  },
  {
    id: "q12",
    dimension: "JP",
    prompt: "推进一个长期目标时，我更需要什么？",
    leftLabel: "明确路径与节点",
    rightLabel: "保留调整空间",
  },
];

export const VERIFICATION_QUESTIONS = [
  {
    id: "v01",
    dimension: "EI",
    prompt: "参加一场持续较久的聚会之后，我通常更想？",
    leftLabel: "继续与人互动",
    rightLabel: "留出独处时间",
  },
  {
    id: "v02",
    dimension: "SN",
    prompt: "向别人描述一次经历时，我更自然地？",
    leftLabel: "讲清具体经过",
    rightLabel: "提炼意义与联想",
  },
  {
    id: "v03",
    dimension: "TF",
    prompt: "朋友带着困扰来找我时，我通常先？",
    leftLabel: "分析解决办法",
    rightLabel: "理解他的感受",
  },
  {
    id: "v04",
    dimension: "JP",
    prompt: "临近周末时，我更喜欢怎样安排时间？",
    leftLabel: "预先排好安排",
    rightLabel: "根据状态决定",
  },
];

export const TYPE_PROFILES = {
  ISTJ: { name: "稳序守望者", summary: "重视事实、责任与可靠秩序，习惯用清晰步骤把事情安稳落地。" },
  ISFJ: { name: "温序照料者", summary: "留意具体需要与关系温度，常以细致、稳定的方式支持身边的人。" },
  INFJ: { name: "静思洞察者", summary: "偏好在安静中整合意义，以理解人与长期方向组织行动。" },
  INTJ: { name: "远见建构者", summary: "善于从复杂信息中提炼结构，并围绕长期目标建立可执行系统。" },
  ISTP: { name: "冷静实践者", summary: "倾向观察事实、理解机制，并在需要时快速采取有效行动。" },
  ISFP: { name: "温和体验者", summary: "重视真实体验与个人价值，常以安静、灵活的方式回应当下。" },
  INFP: { name: "理想守心者", summary: "关注内在价值与可能世界，希望选择与真实信念保持一致。" },
  INTP: { name: "概念探索者", summary: "喜欢追问原理、辨析概念，并为复杂问题寻找更准确的解释。" },
  ESTP: { name: "行动应变者", summary: "从现场获得能量，善于把握现实机会并迅速调整行动。" },
  ESFP: { name: "热忱体验者", summary: "重视人与当下的真实感受，善于为共同经历带来活力。" },
  ENFP: { name: "灵感联结者", summary: "从关系与可能性中获得灵感，乐于推动有意义的新尝试。" },
  ENTP: { name: "可能性辩证者", summary: "喜欢挑战惯例、连接新观点，并通过讨论打开更多路径。" },
  ESTJ: { name: "秩序推进者", summary: "关注目标、标准与效率，擅长组织资源并推动结果实现。" },
  ESFJ: { name: "关系协调者", summary: "敏锐察觉群体需要，乐于用可靠行动维系合作与归属。" },
  ENFJ: { name: "共情引导者", summary: "善于理解他人潜力，并通过沟通与组织推动共同成长。" },
  ENTJ: { name: "目标统筹者", summary: "倾向看清方向、配置资源，并以清晰决断推动长期进展。" },
};

const LETTER_COPY = {
  E: {
    world: "你常在互动、表达和现实反馈中逐渐看清自己的想法。",
    strength: "你愿意主动连接资源，让讨论更快形成共识与行动。",
    blindspot: "持续向外投入时，可能忽略自己尚未整理清楚的感受。",
    relationship: "你通常通过及时回应和共同经历建立关系。",
    action: "为重要决定留一段不被打扰的独处时间。",
  },
  I: {
    world: "你常先在内心整理经验，再选择合适的方式回应外界。",
    strength: "你能长时间专注，并从细微线索中形成稳定判断。",
    blindspot: "思考尚未表达时，别人可能不知道你已经投入很多。",
    relationship: "你重视少量但深入的连接，也需要独处恢复精力。",
    action: "在想法仍不完整时，也尝试先分享一个简短版本。",
  },
  S: {
    world: "你倾向从可观察的事实、细节和既有经验理解情境。",
    strength: "你能发现现实限制，让想法更具体、更容易执行。",
    blindspot: "专注当下证据时，可能较晚注意尚未发生的可能性。",
    relationship: "你常用具体照顾、兑现承诺和解决实际问题表达在意。",
    action: "在确认事实之后，再写下三种尚未被验证的解释。",
  },
  N: {
    world: "你倾向寻找信息之间的联系、意义和未来可能。",
    strength: "你能跨越表面细节，看见趋势并提出新的理解框架。",
    blindspot: "快速跳向整体意义时，可能漏掉决定成败的具体条件。",
    relationship: "你喜欢交流想法、愿景与彼此尚未展开的潜力。",
    action: "把一个抽象判断转换成可观察的事实和下一步行动。",
  },
  T: {
    world: "你在判断时较自然地检查逻辑、原则和前后一致性。",
    strength: "你能拉开距离分析问题，并指出结构性的矛盾。",
    blindspot: "直接追求正确与效率时，可能低估表达方式带来的影响。",
    relationship: "你常以坦诚分析和可靠解决方案表达支持。",
    action: "提出建议前，先复述对方此刻最在意的感受或需要。",
  },
  F: {
    world: "你在判断时会自然考虑价值、关系与具体人的处境。",
    strength: "你能感知未被说出的需要，让决定更具人情与合作空间。",
    blindspot: "为了照顾关系，可能延后表达自己的界限或不同意见。",
    relationship: "你重视理解与真诚，通常先确认彼此感受再推动事情。",
    action: "在照顾关系的同时，写下不可妥协的事实与边界。",
  },
  J: {
    world: "你偏好先形成方向与结构，再有节奏地推进事情。",
    strength: "你能明确优先级、管理进度，并给团队稳定预期。",
    blindspot: "过早锁定计划时，可能把新信息当成干扰而非机会。",
    relationship: "清晰承诺与可预期的安排，会让你更有安全感。",
    action: "为计划预留一段明确的试验区，允许新信息改变路径。",
  },
  P: {
    world: "你偏好保留选择，在变化中持续收集信息并调整方向。",
    strength: "你对意外更有弹性，也容易发现临场出现的新机会。",
    blindspot: "选择保持开放过久，可能让重要决定失去推进窗口。",
    relationship: "你喜欢给彼此空间，并在真实情境中自然形成节奏。",
    action: "为最重要的一件事设置一个足够小、但不可再延后的节点。",
  },
};

function getStrengthLabel(normalizedScore) {
  const distance = Math.abs(normalizedScore);
  if (distance <= 0.18) return "接近边界";
  if (distance <= 0.42) return "轻微倾向";
  if (distance <= 0.72) return "较清晰";
  return "明显倾向";
}

export function calculatePreferenceResult(
  answers,
  questions = PERSONALITY_QUESTIONS,
) {
  const axes = DIMENSION_ORDER.map((dimensionId) => {
    const dimension = PREFERENCE_DIMENSIONS[dimensionId];
    const dimensionQuestions = questions.filter(
      (question) => question.dimension === dimensionId
        && Number.isFinite(Number(answers[question.id])),
    );
    const score = dimensionQuestions.reduce(
      (total, question) => total + Number(answers[question.id]),
      0,
    );
    const maximum = Math.max(2, dimensionQuestions.length * 2);
    const normalizedScore = score / maximum;
    const letter = score < 0
      ? dimension.leftLetter
      : score > 0
        ? dimension.rightLetter
        : dimension.tieLetter;

    return {
      ...dimension,
      score,
      maximum,
      normalizedScore,
      position: Math.min(94, Math.max(6, 50 + normalizedScore * 44)),
      letter,
      strength: getStrengthLabel(normalizedScore),
      isBoundary: Math.abs(normalizedScore) <= 0.18,
    };
  });

  const type = axes.map((axis) => axis.letter).join("");

  return {
    type,
    profile: TYPE_PROFILES[type],
    axes,
    boundaries: axes.filter((axis) => axis.isBoundary),
  };
}

export function buildPersonalitySections(result) {
  const [energy, information, decision, pace] = result.type;

  return [
    {
      id: "world",
      title: "你如何看世界",
      copy: `${LETTER_COPY[energy].world}${LETTER_COPY[information].world}`,
    },
    {
      id: "strengths",
      title: "你的自然优势",
      copy: `${LETTER_COPY[information].strength}${LETTER_COPY[decision].strength}`,
    },
    {
      id: "blindspots",
      title: "可能忽略的地方",
      copy: `${LETTER_COPY[energy].blindspot}${LETTER_COPY[pace].blindspot}`,
    },
    {
      id: "relationships",
      title: "与人相处的倾向",
      copy: `${LETTER_COPY[energy].relationship}${LETTER_COPY[decision].relationship}`,
    },
    {
      id: "actions",
      title: "可以尝试的成长行动",
      copy: `${LETTER_COPY[information].action}${LETTER_COPY[pace].action}`,
    },
  ];
}
