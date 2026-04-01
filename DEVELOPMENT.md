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

---

### 1.2 フロントエンド環境構築

#### 1. リポジトリクローン

```bash
git clone https://github.com/akito-0520/MuseLog.git
cd frontend
```

#### 2. 依存関係インストール

```bash
npm install
```

#### 3. 環境変数設定

`.env.example` ファイルをコピーして `.env.local` を作成:

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
git clone https://github.com/akito-0520/MuseLog.git
cd backend
```

#### 2. 環境変数設定

`.env.example` ファイルをコピーして `.env` を作成:

```bash
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_DB_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres

# DMM API
DMM_API_ID=xxx
DMM_AFFILIATE_ID=xxx

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

#### 4. マイグレーション実行

プロジェクトで採用しているマイグレーション手段に応じてコマンドを実行してください。

```bash
# 例: Supabase を用いたマイグレーション
supabase db push

# 例: SQL ファイルを直接適用する場合（DATABASE_URL は適宜変更）
psql "$DATABASE_URL" -f path/to/migrations.sql
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

#### アーキテクチャ方針

以下の特性より、MVCアーキテクチャライクなアーキテクチャを選定:

- 基本的にCRUDがメイン
- 外部サービスとのやり取りはDMM APIだけ
- 認証やキーワード検索はSupabaseに委譲

#### ディレクトリ構成

以下の特性より、MVCアーキテクチャライクなアーキテクチャを選定

- 基本的にCRUDがメイン
- 外部サービスとのやり取りはDMM APIだけ
- 認証やキーワード検索はSupabaseに投げている

```
.
├── main.go             # エントリポイント（Echoの起動、DB接続）
├── app/
│   ├── controllers/    # リクエストの受け取り、レスポンスの返却（Echoに依存）
│   ├── services/       # ビジネスロジック、DMM APIとの通信
│   ├── models/         # 構造体定義（GORM等のDBスキーマ）
│   └── middleware/     # SupabaseのJWT認証チェック
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
import "log/slog"

slog.Info("Review created successfully",
    "user_id", userID,
    "action", "create_review",
)

// エラーログの例
slog.Error("Failed to fetch reviews",
    "user_id", userID,
    "error", err,
)
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

小規模なアプリケーションのため、ローカルでの動作確認をレビュイーとレビュアーが実施することで品質を担保します。単体テストは採用せず、ユーザー体験の保証にはE2Eテストを活用します。

### 4.1 フロントエンドテスト

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

バックエンドのテスト方針については別途検討します。基本的にはUnitテストとE2Eテストにより品質を担保します。

---

### 4.3 テスト実施タイミング

| テスト種別      | 実施タイミング   | 実施者                 |
| :-------------- | :--------------- | :--------------------- |
| **E2E Test**    | PRマージ前（CI） | 自動                   |
| **Unit Test**   | PRマージ前（CI） | 自動                   |
| **Manual Test** | PR作成時         | レビュイー・レビュアー |

---

## 📚 参考資料

- [Supabase ドキュメント](https://supabase.com/docs)
- [Next.js ドキュメント](https://nextjs.org/docs)
- [Echo ドキュメント](https://echo.labstack.com/guide/)
- [DMM API 仕様](https://affiliate.dmm.com/api/)

---

_Last Updated: 2026-04-01_
