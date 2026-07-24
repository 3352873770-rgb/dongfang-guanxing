# MMEETT Fate

以《周易》文化知识与自我探索为核心的问卦产品原型，包含昼夜双主题、首页经典书名漂移动效、长期问卦、六十四卦图谱、推荐工具与记录入口。

- 公网地址：https://3352873770-rgb.github.io/mmeett-fate/
- 当前状态：[PROJECT_STATE.md](./PROJECT_STATE.md)
- 产品与维护文档：[docs/](./docs/)
- 版本记录：[CHANGELOG.md](./CHANGELOG.md)

## 本地运行

```bash
npm ci
npm run dev
```

默认开发地址为 `http://localhost:5173/`。生产构建使用：

```bash
npm run build
npm run preview
```

提交前统一执行：

```bash
npm run check
```

## 主要实现

- React 19 + Vite 6
- 昼模式 LightRays 与夜模式 LiquidEther
- 按钮级 SpecularButton 描边响应与图标、文案、箭头微动效
- 桌面端与移动端自适应布局
- `prefers-reduced-motion` 无障碍降级

本项目为交互设计原型，卦象内容仅作产品体验展示，不构成现实决策建议。
