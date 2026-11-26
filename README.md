# 權息通（web-stock-dividend-yield）

<https://stock.imallenlai.com/> 的前端：查詢台股上市櫃個股與 ETF 的歷年除權息、填權息成功率、填息天數與殖利率。後端在 [api-stock-dividend-yield](https://github.com/luckstar77/api-stock-dividend-yield)。

## 功能
參考 Goodinfo、財報狗、CMoney、Yahoo 股市的股利頁面整理出來的：

- 首頁大搜尋框：代號、名稱都能搜，依「代號完全相同 → 代號開頭 → 名稱開頭 → 名稱包含」排序；Enter 直接查詢。熱門股票與最近查詢（存在瀏覽器）一鍵進入。
- 個股頁 `/stock/2330`：網址可以分享、加書籤；用名稱查（`/stock/台積電`）會自動換成代號網址。
  - 最近一次除權息與是否已填權息
  - 填權息成功率、平均現金殖利率、平均還原殖利率、近一年現金殖利率（以最新收盤價計）
  - 歷年股利／殖利率圖表（可切換）
  - 歷年除權息明細表：預設最近 10 年，可展開每一次除權息的除權息前收盤價、填權息日與填息天數
  - 統計方式說明
- 深色模式（預設跟隨系統），手機、平板、電腦都適用。

## 技術架構
- Vite + React 19 + TypeScript
- MUI 9（主題、深色模式用 CSS variables）
- React Router 8：個股頁 lazy load，圖表程式庫只在個股頁才載入
- TanStack Query：API 快取（股票清單 1 小時、個股 10 分鐘）
- Recharts：圖表
- Vitest + Testing Library：單元與元件測試

```
src/
  api/                  後端 v1 API 的型別與呼叫（解開 { status, code, data }）
  app/                  路由、Provider（主題、React Query）
  components/layout/    頁首、頁尾、深色模式切換
  features/stocks/
    components/         搜尋框、摘要卡片、圖表、明細表…
    hooks/              useStockList、useStockDividends、useRecentStocks
    search.ts           搜尋排序與關鍵字解析
  pages/                HomePage、StockPage、NotFoundPage
  theme/                MUI 主題
  utils/                數字／日期格式、document title
  test/                 測試用的 fixture 與 render helper
```

## 開發
需要 Node.js 22（見 `.nvmrc`）。

```
nvm use
npm ci
npm run dev          # http://localhost:3100，API 位址見 .env（預設 http://localhost:3000）
```

| 指令 | 說明 |
| --- | --- |
| `npm run dev` | 開發伺服器 |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript 型別檢查 |
| `npm test` | 執行測試 |
| `npm run test:coverage` | 測試與覆蓋率（低於 80% 會失敗） |
| `npm run build` | 產生 `dist/` |

環境變數：`VITE_API_URL`（開發用 `.env`，正式用 `.env.production`）。

## 後端 API
前端只用 v1 API，回應格式是 `{ status, code, data }`，`code` 20000 成功、20400 查無資料。

- `GET /v1/stocks`：搜尋框用的股票清單
- `GET /v1/stocks/dividends?keyword=2330`：一檔股票的統計與歷年除權息

詳細欄位見 `src/api/types.ts` 與後端的 README。

## CI/CD
`.github/workflows/ci.yml`：

- 每個 PR 與 push：lint、型別檢查、測試（含覆蓋率門檻）、build。
- push 到 `master`：上面都通過後，部署到 S3 + CloudFront。
  1. `dist/assets/*`（檔名有 hash）先上傳，`Cache-Control: immutable` 快取一年。
  2. 再上傳 `index.html` 等其他檔案，`max-age=0` 讓瀏覽器每次都重新確認。
  3. CloudFront invalidation `/*`，等它完成。
  4. 確認 <https://stock.imallenlai.com/> 已經是這次 build 的版本。

沒有設定部署用的 secrets 時，deploy job 會顯示提示並略過（不會失敗）。

### 第一次設定
1. 到 AWS CloudShell 執行 `scripts/setup-aws-deploy-role.sh`（可直接貼上內容）。它會從 `stock.imallenlai.com` 找出 CloudFront distribution 與 S3 bucket，建立只能由這個 repo 的 `production` environment 透過 GitHub OIDC 使用的 IAM role（不需要在 GitHub 存長期的 AWS key），權限只有上傳到這個 bucket 與 invalidate 這個 distribution。
2. 照腳本最後印出的指令設定 GitHub secrets／variables：

| 名稱 | 類型 | 說明 |
| --- | --- | --- |
| `AWS_ROLE_ARN` | secret | 部署用的 IAM role |
| `AWS_S3_BUCKET` | secret | 網站的 S3 bucket |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | secret | CloudFront distribution ID |
| `AWS_REGION` | variable | bucket 所在 region，預設 `ap-northeast-1` |

不想用 OIDC 的話，也可以改設 `AWS_ACCESS_KEY_ID` 與 `AWS_SECRET_ACCESS_KEY`（IAM user 的權限同上）。

部署順序：後端的 v1 API 要先上線，前端才能部署。

## 參考技術文章
- [在 S3 上架設網站](https://blog.cloudthat.com/step-by-step-guide-to-deploy-reactjs-app-on-aws-s3/)
- [CloudFront 連結 S3 權限問題](https://aws.amazon.com/tw/premiumsupport/knowledge-center/s3-website-cloudfront-error-403/)
- [GitHub Actions 透過 OIDC 存取 AWS](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [Vite 環境變數](https://vite.dev/guide/env-and-mode)
