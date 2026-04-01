# 画面遷移・ルーティング定義

本ドキュメントは Muse Log の画面遷移フロー、URL設計、ナビゲーション構造を定義します。

## 📑 目次

1. [全体画面遷移図](#1-全体画面遷移図)
2. [ルーティングテーブル](#2-ルーティングテーブル)
3. [認証フロー](#3-認証フロー)
4. [画面別遷移パターン](#4-画面別遷移パターン)
5. [モーダル・ダイアログ](#5-モーダルダイアログ)
6. [エラーページ](#6-エラーページ)
7. [URL設計ガイドライン](#7-url設計ガイドライン)

---

## 1. 全体画面遷移図

### 1.1 メインフロー

```mermaid
graph TD
    Start([アプリ起動]) --> CheckAuth{認証状態確認}

    %% 未認証フロー
    CheckAuth -->|未ログイン| Login[ログイン画面<br/>/login]
    Login -->|Googleでログイン| OAuth[OAuth認証]
    Login -->|新規登録| SignUp[新規登録画面<br/>/signup]
    SignUp -->|アカウント作成| OAuth
    OAuth -->|認証成功| Home

    %% 認証済みフロー
    CheckAuth -->|ログイン済み| Home[一覧画面<br/>/actresses]

    %% 一覧画面からの遷移
    Home -->|カードクリック| DetailModal[詳細モーダル]
    Home -->|ボトムナビ「検索」| Search[検索画面<br/>/search]
    Home -->|ボトムナビ「設定」| Settings[設定画面<br/>/settings]
    Home -->|ヘッダーロゴ| Home

    %% 詳細モーダルからの遷移
    DetailModal -->|編集ボタン| Detail[女優詳細・編集画面<br/>/actresses/:id]
    DetailModal -->|削除| ConfirmDelete[削除確認モーダル]
    ConfirmDelete -->|削除実行| Home
    DetailModal -->|閉じる| Home

    %% 検索画面からの遷移
    Search -->|追加ボタン| RatingModal[評価入力モーダル]
    RatingModal -->|追加する| Search
    RatingModal -->|キャンセル| Search
    Search -->|ヘッダーロゴ| Home

    %% 詳細画面からの遷移
    Detail -->|更新する| Detail
    Detail -->|削除ボタン| ConfirmDelete
    Detail -->|戻るボタン| Home

    %% 設定画面からの遷移
    Settings -->|ログアウト確認| LogoutConfirm[ログアウト確認ダイアログ]
    LogoutConfirm -->|ログアウト| Logout[ログアウト処理]
    Logout --> Login
    Settings -->|ヘッダーロゴ| Home

    %% スタイル
    classDef authPage fill:#FFE5E5,stroke:#FF6B6B,stroke-width:2px
    classDef mainPage fill:#E5F5FF,stroke:#4DABF7,stroke-width:2px
    classDef modal fill:#FFF4E5,stroke:#FFB84D,stroke-width:2px
    classDef process fill:#E5FFE5,stroke:#51CF66,stroke-width:2px

    class Login,SignUp,OAuth authPage
    class Home,Search,Detail,Settings mainPage
    class DetailModal,RatingModal,ConfirmDelete,LogoutConfirm modal
    class Logout process
```

---

### 1.2 認証フロー（詳細）

```mermaid
graph TD
    Start([ユーザー訪問]) --> CheckURL{アクセスURL確認}

    %% 公開ページ
    CheckURL -->|/login, /signup| Public[公開ページ表示]
    Public --> End1([表示完了])

    %% 保護されたページ
    CheckURL -->|/actresses, /search, /settings| Protected{認証チェック}

    Protected -->|JWT有効| AllowAccess[ページ表示]
    AllowAccess --> End2([表示完了])

    Protected -->|JWT無効/なし| RedirectLogin[/loginへリダイレクト]
    RedirectLogin --> StoreRedirect[元のURLを保存]
    StoreRedirect --> ShowLogin[ログイン画面表示]

    ShowLogin --> UserLogin[ユーザーがログイン]
    UserLogin --> GetJWT[JWT取得]
    GetJWT --> RedirectOriginal[元のURLへリダイレクト]
    RedirectOriginal --> AllowAccess

    %% スタイル
    classDef decision fill:#FFE5E5,stroke:#FF6B6B,stroke-width:2px
    classDef action fill:#E5F5FF,stroke:#4DABF7,stroke-width:2px
    classDef endpoint fill:#E5FFE5,stroke:#51CF66,stroke-width:2px

    class CheckURL,Protected decision
    class RedirectLogin,StoreRedirect,ShowLogin,UserLogin,GetJWT,RedirectOriginal action
    class Public,AllowAccess,End1,End2 endpoint
```

---

## 2. ルーティングテーブル

### 2.1 Next.js App Router ディレクトリ構造

```
app/
├── (auth)/              # 認証関連のレイアウトグループ
│   ├── login/
│   │   └── page.tsx     # /login
│   └── signup/
│       └── page.tsx     # /signup
│
├── (main)/              # メインアプリのレイアウトグループ
│   ├── layout.tsx       # 共通レイアウト（ヘッダー・フッター）
│   ├── actresses/
│   │   ├── page.tsx     # /actresses（一覧）
│   │   └── [id]/
│   │       └── page.tsx # /actresses/:id（詳細）
│   ├── search/
│   │   └── page.tsx     # /search
│   └── settings/
│       ├── page.tsx     # /settings
│       └── profile/
│           └── page.tsx # /settings/profile
│
├── api/                 # API Routes（バックエンドへのプロキシ）
│   └── [...path]/
│       └── route.ts
│
├── not-found.tsx        # 404ページ
├── error.tsx            # エラーページ
├── layout.tsx           # ルートレイアウト
└── page.tsx             # / (ルートページ → /actresses へリダイレクト)
```

---

### 2.2 ルーティング一覧

| パス                | ページ名           | 認証 | 説明                                                   |
| :------------------ | :----------------- | :--- | :----------------------------------------------------- |
| `/`                 | ルートページ       | -    | `/actresses` へ自動リダイレクト                  |
| `/login`            | ログイン画面       | ❌   | OAuth (Google / Apple) またはメール/PW ログイン  |
| `/signup`           | 新規登録画面       | ❌   | OAuth (Google / Apple) またはメール/PW 新規登録  |
| `/actresses`        | 一覧画面（ホーム） | ✅   | お気に入り一覧（ページネーション・ソート・検索） |
| `/actresses/:id`    | 女優詳細・編集画面 | ✅   | レビュー編集・削除                               |
| `/search`           | 検索画面           | ✅   | DMM API で女優検索・お気に入り追加               |
| `/settings`         | 設定画面           | ✅   | メール/PW変更（モーダル）、OAuth連携、ログアウト |
| `/404`              | 404ページ          | -    | ページが見つかりません                           |
| `/error`            | エラーページ       | -    | サーバーエラー                                   |

---

### 2.3 クエリパラメータ

#### `/actresses` (一覧画面)

```
/actresses?sort=created_at&order=desc&tag=巨乳&rating_min=4&q=山田
```

| パラメータ | 型     | 説明                                                            | デフォルト   |
| :--------- | :----- | :-------------------------------------------------------------- | :----------- |
| `sort`     | string | ソートキー (`created_at`, `rating_desc`, `rating_asc`, `name`) | `created_at` |
| `q`        | string | 女優名で検索（部分一致）                                        | -            |
| `page`     | number | ページ番号                                                      | `1`          |

**実装（TanStack Query / Client Component）**:

```typescript
// app/actresses/page.tsx（"use client"）
const [sort, setSort] = useState<SortKey>("created_at");
const [query, setQuery] = useState("");
const [page, setPage] = useState(1);

const { data } = useQuery({
  queryKey: ["reviews", { page, sort, q: query }],
  queryFn: () => fetchReviews({ page, sort, q: query }),
  placeholderData: keepPreviousData,
});
```

---

#### `/search` (検索画面)

```
/search?q=山田
```

| パラメータ | 型     | 説明           | デフォルト |
| :--------- | :----- | :------------- | :--------- |
| `q`        | string | 検索キーワード | -          |

---

## 3. 認証フロー

### 3.1 ログイン後のリダイレクト

#### パターン1: 直接 `/login` にアクセスした場合

```
/login → ログイン成功 → /actresses
```

#### パターン2: 保護されたページにアクセスしてリダイレクトされた場合

```
/actresses/:id → 未ログイン検知 → /login?redirect=/actresses/:id
→ ログイン成功 → /actresses/:id (元のページに戻る)
```

**実装例（Next.js Middleware）**:

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("sb-access-token");
  const { pathname } = request.nextUrl;

  // 保護されたルート
  const protectedRoutes = ["/actresses", "/search", "/settings"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // ログイン済みユーザーが /login にアクセスした場合
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/actresses", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

---

### 3.2 ログアウト処理

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Supabase

    User->>Frontend: 「ログアウト」ボタンをクリック
    Frontend->>Supabase: supabase.auth.signOut()
    Supabase->>Frontend: セッション削除
    Frontend->>Frontend: Cookie削除
    Frontend->>User: /login へリダイレクト
```

**実装例**:

```typescript
// components/LogoutButton.tsx
async function handleLogout() {
  await supabase.auth.signOut();
  router.push("/login");
}
```

---

## 4. 画面別遷移パターン

### 4.1 ログイン画面 (`/login`)

#### 遷移元

- 未ログイン時に保護されたページへアクセス
- ログアウト後

#### 遷移先

| トリガー                   | 遷移先                   | 条件     |
| :------------------------- | :----------------------- | :------- |
| 「Googleでログイン」ボタン | OAuth認証 → `/actresses` | 認証成功 |
| 「アカウント作成」リンク   | `/signup`                | -        |

---

### 4.2 新規登録画面 (`/signup`)

#### 遷移元

- ログイン画面の「アカウント作成」リンク

#### 遷移先

| トリガー               | 遷移先                   | 条件     |
| :--------------------- | :----------------------- | :------- |
| 「Googleで登録」ボタン | OAuth認証 → `/actresses` | 認証成功 |
| 「ログイン」リンク     | `/login`                 | -        |

---

### 4.3 一覧画面 (`/actresses`)

#### 遷移元

- ログイン成功後
- ヘッダーロゴクリック
- フッター「一覧」タブ
- 詳細画面の「戻る」ボタン
- 検索画面からお気に入り追加後

#### 遷移先

| トリガー                   | 遷移先                              | 条件 |
| :------------------------- | :---------------------------------- | :--- |
| カードクリック             | 詳細モーダル（同一ページ）  | -    |
| 詳細モーダル「編集」ボタン | `/actresses/:id`            | -    |
| ボトムナビ「検索」タブ     | `/search`                   | -    |
| ボトムナビ「設定」タブ     | `/settings`                 | -    |
| ヘッダーロゴ               | `/actresses`                | -    |
| FABボタン（+）             | 女優追加フロー（TODO）      | -    |
| ページネーション           | 同一ページ内で状態更新      | -    |
| ソート変更                 | 同一ページ内で状態更新      | -    |

---

### 4.4 女優詳細・編集画面 (`/actresses/:id`)

#### 遷移元

- 一覧画面の詳細モーダル「編集」ボタン

#### 遷移先

| トリガー           | 遷移先                          | 条件           |
| :----------------- | :------------------------------ | :------------- |
| 「更新する」ボタン | 同一ページ（成功トースト表示）  | 変更あり・成功 |
| 「削除」ボタン     | 削除確認モーダル → `/actresses` | 削除成功       |
| ヘッダー `←` ボタン | `/actresses`                   | -              |
| ヘッダーロゴ       | `/actresses`                    | -              |

**URL例**:

```
/actresses/123
```

---

### 4.5 検索画面 (`/search`)

#### 遷移元

- 一覧画面ヘッダー「検索」ボタン
- フッター「検索」タブ

#### 遷移先

| トリガー             | 遷移先                          | 条件     |
| :------------------- | :------------------------------ | :------- |
| 「追加」ボタン       | 評価入力モーダル → `/actresses` | 保存成功 |
| ヘッダーロゴ         | `/actresses`                    | -        |
| フッター「一覧」タブ | `/actresses`                    | -        |

---

### 4.6 設定画面 (`/settings`)

#### 遷移元

- ボトムナビ「設定」タブ

#### 遷移先

| トリガー                    | 遷移先                           | 条件           |
| :-------------------------- | :------------------------------- | :------------- |
| 「メールアドレス」行        | `EmailEditModal` 表示（同一ページ内） | -          |
| 「パスワード」行            | `PasswordEditModal` 表示（同一ページ内） | -        |
| OAuth「連携する」ボタン     | OAuth認証フロー（Supabase）      | -              |
| OAuth「解除」ボタン         | 解除確認ダイアログ（同一ページ内） | -            |
| 「ログアウト」行            | ログアウト確認ダイアログ → `/login` | 確認後        |
| 「アカウントを削除」行      | `DeleteAccountModal` 表示        | -              |
| ヘッダーロゴ                | `/actresses`                     | -              |

---

## 5. モーダル・ダイアログ

### 5.1 モーダル一覧

| モーダル名                 | コンポーネント          | 表示元                               | 目的                       | 閉じる方法                              |
| :------------------------- | :---------------------- | :----------------------------------- | :------------------------- | :-------------------------------------- |
| **詳細モーダル**           | `ActressDetailModal`    | 一覧画面のカードクリック             | 女優情報・評価の表示       | 背景クリック、×ボタン、ESCキー          |
| **評価入力モーダル**       | `AddReviewModal`        | 検索画面「追加」ボタン               | お気に入り追加時の評価入力 | 「追加する」ボタン、「キャンセル」ボタン、×ボタン |
| **削除確認ダイアログ**     | `DeleteConfirmDialog`   | 詳細画面・詳細モーダル「削除」ボタン | お気に入り削除の確認       | 「キャンセル」「削除」ボタン            |
| **ログアウト確認ダイアログ** | `DeleteConfirmDialog` | 設定画面「ログアウト」行             | ログアウトの確認           | 「キャンセル」「ログアウト」ボタン      |
| **メール変更モーダル**     | `EmailEditModal`        | 設定画面「メールアドレス」行         | メールアドレス変更         | 「保存」「キャンセル」ボタン            |
| **パスワード変更モーダル** | `PasswordEditModal`     | 設定画面「パスワード」行             | パスワード変更             | 「保存」「キャンセル」ボタン            |
| **アカウント削除モーダル** | `DeleteAccountModal`    | 設定画面「アカウントを削除」行       | アカウント削除の確認       | 「削除」「キャンセル」ボタン            |
| **OAuth解除ダイアログ**   | `DeleteConfirmDialog`   | 設定画面 OAuth「解除」ボタン         | OAuth連携解除の確認        | 「解除する」「キャンセル」ボタン        |

---

### 5.2 モーダルの実装方針

#### URL変更なし（状態管理）

モーダルは URL を変更せず、React の状態管理で表示/非表示を切り替えます。

**理由**:

- モーダルは一時的なUI要素であり、独立したページではない
- ブラウザバックでモーダルを閉じる体験は混乱を招く
- SEO対象外

**実装例**:

```typescript
// 一覧画面
const [selectedReview, setSelectedReview] = useState<Review | null>(null);

return (
  <>
    <ReviewList onCardClick={(review) => setSelectedReview(review)} />
    {selectedReview && (
      <ReviewDetailModal
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
      />
    )}
  </>
);
```

---

### 5.3 モーダル内の画面遷移

詳細モーダルから「編集」ボタンをクリックした場合:

```
/actresses (モーダル表示中) → /actresses/:id (フルページ遷移)
```

モーダルを閉じてから遷移するのではなく、即座にページ遷移します。

---

## 6. エラーページ

### 6.1 404ページ (`not-found.tsx`)

#### 表示条件

- 存在しないURLにアクセス
- 削除済みのレビューにアクセス（`/actresses/:id` で該当IDが存在しない）

#### 表示内容

- 「ページが見つかりません」メッセージ
- ホームへのリンク（`/actresses`）

**実装例**:

```typescript
// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-gray-600">ページが見つかりません</p>
      <Link href="/actresses" className="mt-6 btn-primary">
        ホームに戻る
      </Link>
    </div>
  );
}
```

---

### 6.2 エラーページ (`error.tsx`)

#### 表示条件

- サーバーエラー（500エラー）
- APIエラー
- 予期しないエラー

#### 表示内容

- 「エラーが発生しました」メッセージ
- 「再試行」ボタン
- ホームへのリンク

**実装例**:

```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">エラー</h1>
      <p className="mt-4 text-gray-600">{error.message || 'エラーが発生しました'}</p>
      <div className="mt-6 flex gap-4">
        <button onClick={reset} className="btn-primary">
          再試行
        </button>
        <Link href="/actresses" className="btn-secondary">
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}
```

---

## 7. URL設計ガイドライン

### 7.1 基本原則

1. **RESTful**: リソース指向のURL設計
   - ✅ `/actresses/:id`
   - ❌ `/getActress?id=123`

2. **小文字・ケバブケース**: 単語の区切りはハイフン
   - ✅ `/settings/profile`
   - ❌ `/Settings/Profile`, `/settings_profile`

3. **複数形**: コレクションは複数形
   - ✅ `/actresses`
   - ❌ `/actress`

4. **短く明確**: 階層は最小限に
   - ✅ `/actresses/:id`
   - ❌ `/user/favorites/actresses/:id`

5. **クエリパラメータ**: フィルター・ソート・ページネーション
   - ✅ `/actresses?page=2&sort=rating`
   - ❌ `/actresses/page/2/sort/rating`

---

### 7.2 動的パラメータの命名

| パラメータ名 | 説明               | 例                 |
| :----------- | :----------------- | :----------------- |
| `:id`        | リソースID（数値） | `/actresses/123`   |
| `:shareId`   | 共有ID（文字列）   | `/share/abc123xyz` |

---

### 7.3 パンくずリストのための階層設計

```
ホーム (/) > お気に入り一覧 (/actresses) > 女優詳細 (/actresses/:id)
ホーム (/) > 検索 (/search)
ホーム (/) > 設定 (/settings) > プロフィール編集 (/settings/profile)
```

**実装例**:

```typescript
// components/Breadcrumb.tsx
const breadcrumbs = [
  { label: "ホーム", href: "/" },
  { label: "お気に入り一覧", href: "/actresses" },
  { label: "山田花子", href: `/actresses/${id}` },
];
```

---

## 8. ナビゲーションコンポーネント設計

### 8.1 ヘッダー（ロゴのみ）

```typescript
// app/(main)/layout.tsx 内
<header className="fixed top-0 left-0 right-0 z-50 h-14 ...">
  <Link href="/actresses">
    MuseLog💋
  </Link>
</header>
```

ヘッダーにはロゴのみ配置。検索・設定へのナビゲーションはボトムナビで行う。

---

### 8.2 ボトムナビゲーション（全デバイス共通）

```typescript
// app/(main)/layout.tsx 内
const NAV_ITEMS = [
  { href: "/search",    label: "検索", icon: Search     },
  { href: "/actresses", label: "一覧", icon: LayoutGrid  },
  { href: "/settings",  label: "設定", icon: Settings    },
];

<nav className="fixed bottom-0 left-0 right-0 h-16 ...">
  {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
    <Link
      key={href}
      href={href}
      className="flex flex-col items-center gap-0.5 ..."
    >
      <Icon size={22} />
      <span className="text-xs">{label}</span>
    </Link>
  ))}
</nav>
```

アクティブ状態の判定は `usePathname()` で行う。

---

## 9. プリフェッチ戦略

### 9.1 Next.js Link コンポーネントのプリフェッチ

Next.js は `<Link>` コンポーネントで自動的にプリフェッチを行います。

```typescript
// プリフェッチ有効（デフォルト）
<Link href="/actresses/123">詳細を見る</Link>

// プリフェッチ無効（動的コンテンツの場合）
<Link href="/search" prefetch={false}>検索</Link>
```

---

### 9.2 プログラマティックナビゲーション

```typescript
import { useRouter } from "next/navigation";

function ReviewCard({ review }: { review: Review }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/actresses/${review.id}`);
  };

  const handleDelete = async () => {
    await deleteReview(review.id);
    router.refresh(); // 現在のページを再検証
  };
}
```

---

## 10. 画面遷移のパフォーマンス最適化

### 10.1 サーバーコンポーネント vs クライアントコンポーネント

| 画面             | 種別             | 理由                                       |
| :--------------- | :--------------- | :----------------------------------------- |
| `/actresses`     | Client Component | TanStack Query でのソート・検索・ページネーション |
| `/actresses/:id` | Client Component | react-hook-form、フォーム状態管理          |
| `/search`        | Client Component | リアルタイム検索、デバウンス処理           |
| `/settings`      | Client Component | モーダル管理、OAuth状態管理                |

---

### 10.2 ローディング UI

各ルートに `loading.tsx` を配置してSuspense境界を定義:

```
app/
├── actresses/
│   ├── loading.tsx      # 一覧画面のローディング
│   ├── page.tsx
│   └── [id]/
│       ├── loading.tsx  # 詳細画面のローディング
│       └── page.tsx
```

**実装例**:

```typescript
// app/actresses/loading.tsx
export default function Loading() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {[...Array(20)].map((_, i) => (
        <Skeleton key={i} className="h-80" />
      ))}
    </div>
  );
}
```

---

## 11. まとめ

### 主要画面のパス一覧（再掲）

| 画面             | パス             | 認証 |
| :--------------- | :--------------- | :--- |
| ログイン         | `/login`         | ❌   |
| 新規登録         | `/signup`        | ❌   |
| 一覧（ホーム）   | `/actresses`     | ✅   |
| 女優詳細・編集   | `/actresses/:id` | ✅   |
| 検索             | `/search`        | ✅   |
| 設定             | `/settings`      | ✅   |

---

_Last Updated: 2026-04-01_
