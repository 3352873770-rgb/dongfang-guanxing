# 017 MMEETT Fate 品牌系统

- 日期：2026-07-24
- 状态：已采纳

## 背景

产品在不改变既有昼夜氛围、信息架构与问卦流程的前提下，采用已确认的 MMEETT Fate 品牌视觉。

## 决策

1. 品牌字标固定为单行 `MMEETT Fate`：`MMEETT` 使用直立高对比衬线全大写，`Fate` 使用同家族斜体。
2. 在 `src/brand-lockup.jsx` 集中提供字标、英文说明与默认标题；首页导航、Hero 与二级页页眉均复用该组件。
3. 使用 `@fontsource/cormorant-garamond` 的 600 normal 与 600 italic 自托管字体文件；中文继续依赖系统宋体与无衬线回退，避免增加中文网络字体体积。
4. 英文说明、英文标语、中文标语与支撑文案分别固定为 `EASTERN SYMBOLS · INNER CLARITY`、`READ THE SIGNS · MEET YOURSELF`、“观象知变，向内而行”和“以《周易》为根，循象观变”。主 CTA 改为“开始问卦”。
5. 现役页面标题、首页静态 title 与 description 统一使用 MMEETT Fate；导航标签与业务术语保持不变。

## 影响与回退

该变更只替换品牌呈现与文案，不改路由、昼夜主题或起卦逻辑。若需回退，可移除共享字标组件和字体依赖，并恢复此前的首页与页面标题文本。
