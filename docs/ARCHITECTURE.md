# Architecture

## 运行结构

```text
index.html
├── #dfgx-upgrade-root
│   └── src/upgrade-entry.jsx
│       ├── LightRays（昼）
│       ├── LiquidEther（夜）
│       ├── BorderGlow
│       ├── #/hexagrams/:number → src/hexagram-atlas.jsx
│       ├── #/daily → src/daily-hexagram-page.jsx
│       ├── #/tools/three-coins → src/three-coin-page.jsx
│       ├── #/personality → src/personality-preference-page.jsx
│       └── 对 Legacy DOM 的渐进增强
└── #root
    └── public/legacy/legacy-app.js
        └── 一级首页下半页兼容内容
```

## 构建与发布

- Vite 负责生产构建，输出到 `dist/`。
- 本地基础路径为 `/`。
- GitHub Pages 构建使用 `GITHUB_PAGES=true`，基础路径为 `/dongfang-guanxing/`。
- `.github/workflows/pages.yml` 在 `main` 更新后自动部署。

## 状态与存储

- 主题偏好属于设备本地状态。
- 当前原型不包含服务端数据库、登录或业务 API。
- 六十四卦知识页使用 Hash 路由，避免 GitHub Pages 刷新二级路径时产生 404。
- 卦象知识数据位于 `src/hexagram-data.js`，二级页按需加载，不增加首页首次渲染负担。
- 三枚铜钱页直接复用 `src/iching.js` 的三钱记爻与卦象数据，六次投掷与结果只保存于当前页面状态。
- 人格题目、四轴计分与 16 种结果文案位于 `src/personality-preference-data.js`；页面组件按 Hash 路由懒加载，答卷只保存在当前页面状态。
- `src/use-atmosphere-visibility.js` 统一观察 Banner 可见性和文档前后台状态，仅在需要时挂载 WebGL 场景。

## 技术债边界

- `public/legacy/*` 是兼容交付物，不是常规编辑入口。
- `src/App.jsx` 与 `src/main.jsx` 当前不参与线上入口。
- 新功能优先进入明确的 React 组件，不继续扩大 Legacy Bundle。
- Legacy 迁移必须逐区进行，每次保持视觉、移动端和交互回归通过。
