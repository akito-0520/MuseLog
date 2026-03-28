# 開発・運用ガイド

本ドキュメントは Muse Log の開発環境構築、コーディング規約、テスト戦略、デプロイ手順、運用方法を定義します。

## 📑 目次

1. [開発環境構築](#1-開発環境構築)
2. [コーディング規約](#2-コーディング規約)
3. [Git運用ルール](#3-git運用ルール)
4. [テスト戦略](#4-テスト戦略)
5. [デプロイ手順](#5-デプロイ手順)

---

## 1. 開発環境構築

### 1.1 必要なツール

| ツール             | バージョン   | 用途               |
| :----------------- | :----------- | :----------------- |
| **Node.js**        | 20.x LTS     | フロントエンド開発 |
| **npm**            | 10.x         | パッケージ管理     |
| **Go**             | 1.21+        | バックエンド開発   |
| **Docker**         | 24.x         | コンテナ化         |
| **Docker Compose** | 2.x          | マルチコンテナ管理 |
| **Git**            | 2.x          | バージョン管理     |
| **PostgreSQL**     | 15+ (Docker) | ローカルDB         |
| **Redis**          | 7+ (Docker)  | ローカルキャッシュ |

---

### 1.2 フロントエンド環境構築

#### 1. リポジトリクローン

```bash
git clone https://github.com/your-org/muselog-frontend.git
cd muselog-frontend
```

#### 2. 依存関係インストール

```bash
npm install
```

#### 3. 環境変数設定

`.env.local` ファイルを作成:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8080

# Sentry (Optional)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

#### 4. 開発サーバー起動

```bash
npm run dev
```

→ `http://localhost:3000` でアクセス

---

### 1.3 バックエンド環境構築

#### 1. リポジトリクローン

```bash
git clone https://github.com/your-org/muselog-backend.git
cd muselog-backend
```

#### 2. 環境変数設定

`.env` ファイルを作成:

```bash
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_DB_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres

# DMM API
DMM_API_ID=xxx
DMM_AFFILIATE_ID=xxx

# Redis
REDIS_URL=redis://localhost:6379

# Server
PORT=8080
ENV=development
```

#### 3. Docker Compose で起動

```bash
docker-compose -f docker-compose.dev.yml up
```

内訳:

- **Go アプリ**: ホットリロード有効（Air を使用）
- **PostgreSQL**: ローカルDB（Supabaseの代わり）
- **Redis**: キャッシュサーバー

#### 4. マイグレーション実行

```bash
docker-compose exec app go run cmd/migrate/main.go
```

---

### 1.4 Supabase ローカル開発（Optional）

Supabase CLI を使用してローカル環境を構築することも可能。

```bash
# Supabase CLI インストール
npm install -g supabase

# プロジェクト初期化
supabase init

# ローカルSupabase起動
supabase start
```

---

### 1.5 推奨エディタ設定

#### VSCode 拡張機能

- **ESLint**: JavaScript/TypeScript リンター
- **Prettier**: コードフォーマッター
- **Tailwind CSS IntelliSense**: Tailwind クラス補完
- **Go**: Go言語サポート
- **Docker**: Docker サポート

#### VSCode 設定 (`.vscode/settings.json`)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[go]": {
    "editor.defaultFormatter": "golang.go"
  },
  "go.lintTool": "golangci-lint",
  "go.testFlags": ["-v"]
}
```

---

## 2. コーディング規約

### 2.1 フロントエンド (TypeScript/React)

#### ファイル命名規則

- コンポーネント: PascalCase (`ReviewCard.tsx`)
- ユーティリティ: camelCase (`formatDate.ts`)
- ページ: kebab-case (`actress-detail.tsx`)

#### コンポーネント設計

- **関数コンポーネント**: クラスコンポーネントは使用しない
- **Props型定義**: すべてのPropsに型を定義

```typescript
interface ReviewCardProps {
  review: Review;
  onEdit: () => void;
}

export function ReviewCard({ review, onEdit }: ReviewCardProps) {
  // ...
}
```

#### Hooks使用規則

- カスタムフック名は `use` で始める
- `useEffect` の依存配列を必ず指定

```typescript
function useReviews(userId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["reviews", userId],
    queryFn: () => fetchReviews(userId),
  });
  return { reviews: data, isLoading };
}
```

#### スタイリング

- **Tailwind CSS**: ユーティリティクラスを使用
- **カスタムCSS**: 最小限に抑える（`globals.css` のみ）

---

### 2.2 バックエンド (Go)

#### パッケージ構成

```
/cmd
  /server       # メインアプリケーション
  /migrate      # DBマイグレーション
/internal
  /api          # APIハンドラー
  /service      # ビジネスロジック
  /repository   # データベースアクセス
  /models       # データモデル
  /middleware   # Echo ミドルウェア
  /config       # 設定管理
/pkg
  /utils        # 汎用ユーティリティ
```

#### 命名規則

- 変数: camelCase (`userId`)
- 定数: PascalCase (`MaxReviewsPerPage`)
- 関数: PascalCase（公開）、camelCase（非公開）

#### エラーハンドリング

```go
// エラーは必ず処理する
if err != nil {
    return echo.NewHTTPError(http.StatusInternalServerError, "Failed to fetch reviews")
}

// カスタムエラー型を使用
type AppError struct {
    Code    string `json:"code"`
    Message string `json:"message"`
}
```

#### ロギング

```go
import "github.com/sirupsen/logrus"

log.WithFields(logrus.Fields{
    "user_id": userID,
    "action": "create_review",
}).Info("Review created successfully")
```

---

### 2.3 共通規約

#### コメント

- 複雑なロジックには必ずコメントを記載
- 公開関数には GoDoc / JSDoc 形式のコメント

```typescript
/**
 * レビューを作成する
 * @param data - レビューデータ
 * @returns 作成されたレビュー
 */
export async function createReview(data: CreateReviewInput): Promise<Review> {
  // ...
}
```

#### 変数名

- 意味のある名前を使用（`x`, `temp` は避ける）
- ブール値は `is`, `has` で始める（`isLoading`, `hasError`）

---

## 3. Git運用ルール

### 3.1 ブランチ戦略

#### ブランチ種別

- **main**: 本番環境と同期
- **feature/xxx**: 機能開発用
- **fix/xxx**: バグ修正用

#### ブランチ命名規則

```
feature/add-tag-filter
fix/review-deletion-bug
hotfix/security-patch
```

---

## 4. テスト戦略

### 4.1 フロントエンドテスト

#### Unit Test (Jest + React Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import { ReviewCard } from './ReviewCard';

describe('ReviewCard', () => {
  it('should display actress name', () => {
    const review = { actress: { name: '山田花子' }, rating: 5 };
    render(<ReviewCard review={review} />);
    expect(screen.getByText('山田花子')).toBeInTheDocument();
  });
});
```

**実行コマンド**:

```bash
npm test
npm run test:coverage
```

**カバレッジ目標**: 70%以上

---

#### E2E Test (Playwright)

```typescript
import { test, expect } from "@playwright/test";

test("should add actress to favorites", async ({ page }) => {
  await page.goto("/search");
  await page.fill('input[name="query"]', "山田花子");
  await page.click('button[type="submit"]');
  await page.click('button:has-text("追加")');
  await expect(page.locator("text=お気に入りに追加しました")).toBeVisible();
});
```

**実行コマンド**:

```bash
npx playwright test
```

---

### 4.2 バックエンドテスト

#### Unit Test (Go testing + testify)

```go
func TestCreateReview(t *testing.T) {
    repo := &mockReviewRepository{}
    service := NewReviewService(repo)

    review, err := service.CreateReview(context.Background(), &CreateReviewInput{
        ActressID: 1,
        Rating: 5,
    })

    assert.NoError(t, err)
    assert.Equal(t, 5, review.Rating)
}
```

**実行コマンド**:

```bash
go test ./... -v
go test ./... -cover
```

**カバレッジ目標**: 80%以上

---

#### Integration Test

```go
func TestReviewAPI(t *testing.T) {
    e := echo.New()
    req := httptest.NewRequest(http.MethodPost, "/api/reviews", strings.NewReader(`{"actress_id": 1}`))
    req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
    rec := httptest.NewRecorder()

    e.ServeHTTP(rec, req)

    assert.Equal(t, http.StatusCreated, rec.Code)
}
```

---

### 4.3 テスト実施タイミング

| テスト種別           | 実施タイミング           | 実施者 |
| :------------------- | :----------------------- | :----- |
| **Unit Test**        | コード変更時（ローカル） | 開発者 |
| **Integration Test** | PR作成時（CI）           | 自動   |
| **E2E Test**         | PRマージ前（CI）         | 自動   |
| **Manual Test**      | リリース前               | QA担当 |

---

## 📚 参考資料

- [Supabase ドキュメント](https://supabase.com/docs)
- [Next.js ドキュメント](https://nextjs.org/docs)
- [Echo ドキュメント](https://echo.labstack.com/guide/)
- [DMM API 仕様](https://affiliate.dmm.com/api/)

---

_Last Updated: 2024-03-28_
