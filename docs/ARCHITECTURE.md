# Architecture

## 运行结构

```text
index.html
├── #dfgx-upgrade-root
│   └── src/upgrade-entry.jsx
│       ├── LightRays（昼）
│       ├── LiquidEther（夜）
│       ├── BorderGlow
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

## 技术债边界

- `public/legacy/*` 是兼容交付物，不是常规编辑入口。
- `src/App.jsx` 与 `src/main.jsx` 当前不参与线上入口。
- 新功能优先进入明确的 React 组件，不继续扩大 Legacy Bundle。
- Legacy 迁移必须逐区进行，每次保持视觉、移动端和交互回归通过。
