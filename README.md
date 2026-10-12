# Expectation Simulator v3.0｜產品架構與完整開發計畫
Expectation Simulator 將是一個同時支援「日常快速調整」與「深度情境模擬」的 Web App，並在後期加入 PWA 安裝能力及 AI 反思功能。
規劃為 8 個階段、48 個開發單元。其中第 24 個單元就應該有可實際使用的第一版，第 48 個單元則是完整產品的交付驗收。

## 正式產品定位
Expectation Simulator 的核心不是追蹤你每天做了多少，而是當現實和原本的期待不一樣時，幫助你探索還有哪些可能的安排。

## 兩種模式
- **Quick Check**：1–3 分鐘，日常快速調整
- **Scenario Lab**：10–20 分鐘，多週深度情境模擬

## 指令
| 指令 | 用途 |
|---|---|
| `npm run dev` | 啟動開發伺服器（不做型別檢查） |
| `npm run typecheck` | 只做型別檢查 |
| `npm run build` | 型別檢查並打包到 `dist/` |
| `npm run preview` | 預覽打包結果 |

## 分層規則
- `src/domain`、`src/simulation`：純 TypeScript，不依賴瀏覽器與 AI
- `src/application`：狀態管理
- `src/features`、`src/ui`：畫面與共用元件

## 設計原則
- 冷靜、留白充足，讓人感到「有選擇」而不是「落後」
- 不用紅色代表「沒達成」
- 手機優先，鍵盤可操作，尊重 `prefers-reduced-motion`
- 數字由程式計算，AI 只負責解釋；不顯示失敗或連續天數

## 目前進度
- [ ] Day 01：初始化 Vite + strict TypeScript
- [ ] Day 12：Quick Check 可用
- [ ] Day 24：MVP
- [ ] Day 36：PWA 完整工具
- [ ] Day 48：正式發佈