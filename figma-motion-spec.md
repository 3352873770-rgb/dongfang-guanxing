# Figma 动效标注

所有动效均可使用 Figma 组件变体和 Smart Animate 实现。只改变透明度、位置和缩放，不依赖网页滚动监听或代码特效。

## 1. 首屏入场

建立 `Hero / Intro` 组件集，使用 `Start` 和 `Rest` 两个变体。

| 图层 | Start | Rest | 延迟 | 时长 | 缓动 |
| --- | --- | --- | --- | --- | --- |
| 圆形观象画面 | Opacity 0, Scale 96.5% | Opacity 100%, Scale 100% | 0 ms | 720 ms | Custom: 0.16, 1, 0.3, 1 |
| 主标题 | Opacity 0, Y 16 | Opacity 100%, Y 0 | 100 ms | 560 ms | Custom: 0.16, 1, 0.3, 1 |
| 说明文字 | Opacity 0, Y 16 | Opacity 100%, Y 0 | 170 ms | 560 ms | Custom: 0.16, 1, 0.3, 1 |
| 主题选择 | Opacity 0, Y 16 | Opacity 100%, Y 0 | 230 ms | 560 ms | Custom: 0.16, 1, 0.3, 1 |
| 主按钮 | Opacity 0, Y 16 | Opacity 100%, Y 0 | 290 ms | 560 ms | Custom: 0.16, 1, 0.3, 1 |

Prototype 设置：`Start` 使用 `After Delay` 切换到 `Rest`，动画选择 `Smart Animate`。

## 2. 人格测试呼吸提示

建立 `Personality Card` 组件集：`Idle`、`Pulse`、`Hover`、`Pressed`。

- `Idle`：雷达区域上方的金色径向椭圆 Opacity 34%，Scale 96%。
- `Pulse`：同一椭圆 Opacity 76%，Scale 103.5%。
- `Idle -> Pulse`：After Delay 2600 ms，Smart Animate 1200 ms，Ease In And Out。
- `Pulse -> Idle`：After Delay 0 ms，Smart Animate 1200 ms，Ease In And Out，形成循环。
- `Hover`：卡片 Y -3，Scale 100%，图片 Scale 100.8%，边框提高到 90% 透明度，260 ms Ease Out。
- `Pressed`：卡片 Scale 98.5%，100 ms Ease Out。

径向椭圆必须是独立图层，位置覆盖雷达图，不需要外发光。

## 3. 列表与按钮反馈

- 玩法三步骤：`While Hovering` 切换到 X 4 的变体，260 ms Ease Out。
- “查看玩法说明”箭头：`While Hovering` 切换到 X 4 的变体，260 ms Ease Out。
- 问卦列表：`While Pressing` Scale 99%，100 ms Ease Out。
- 人格测试卡、主按钮、工具卡：`While Pressing` Scale 98-98.5%，100 ms Ease Out。

## 4. 无障碍降级

准备一个 `Reduced Motion` 画面状态：直接显示所有 Rest 图层，隐藏人格测试呼吸椭圆，保留点击后的静态状态变化。

## 5. “开始问卦”点击加载

建立 `Ask Loading` 组件集：`Hidden`、`Loading`、`Exit`、`Complete`。

- `Hidden -> Loading`：点击“开始问卦”触发，Smart Animate 260 ms，Custom 0.16, 1, 0.3, 1。
- `Loading`：六个圆点放入同一个 `Loader / Orbit` 组，圆点图层名称保持不变。
- `Loading -> Exit`：After Delay 720 ms，圆点组 Rotation 120°，整个加载内容 Scale 97%、Opacity 0%，Smart Animate 240 ms。
- `Exit -> Complete`：After Delay 240 ms，Navigate To 问卦选择画面。
- 网页实现对应为加载层淡出后滚动到 `#ask`。

Reduced Motion 状态不旋转圆点，只保留 180 ms 静态加载反馈，然后直接进入问卦选择画面。
