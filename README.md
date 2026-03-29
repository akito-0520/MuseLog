# Muse Log 💋

**Muse Log** は、お気に入りの女優や作品を収集・管理し、美しいカード形式で共有できる「裏研究」プラットフォームです。
Dockerコンテナとしてデプロイされ、BaaS（Supabase）と連携することで、**「クロスデバイス同期」「高速なレスポンス」「堅牢なセキュリティ」**を実現しています。

![Architecture](https://img.shields.io/badge/Architecture-Docker_Container-blue)
![Tech](https://img.shields.io/badge/Tech-Go_×_Next.js-blue)
![DB](https://img.shields.io/badge/DB-Supabase_PostgreSQL-green)

## 📚 ドキュメント構成

- **README.md** (本ファイル): プロジェクト概要・システムアーキテクチャ
- **[REQUIREMENTS.md](./REQUIREMENTS.md)**: 機能要件・画面仕様
- **[TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md)**: 技術仕様・非機能要件・データ設計
- **[DEVELOPMENT.md](./DEVELOPMENT.md)**: 開発環境・運用ガイド
- **[DEPLOYMENT.md](./DEPLOYMENT.md)**: デプロイ手順
- **[SCREEN_FLOW.md](./SCREEN_FLOW.md)**: 画面遷移図

## 🚀 特徴

- **Account Sync**: Supabase Authによるセキュアなアカウント管理。PCで保存したリストをスマホで即座に確認できます。
- **Smart Sharing**: お気に入りリストをOGP（画像付きカード）としてSNSで美しく共有。
- **High Performance**: Go言語による高速なバックエンド。
- **Privacy First**: 収集するのはメールアドレスのみ。検索履歴や閲覧データは厳重に保護されます。

---

## 🗺 システム構成図

```mermaid
graph TD
    %% ユーザー層
    User((User / Browser))

    %% フロントエンド (Vercel)
    subgraph "Frontend Hosting (Vercel)"
        Next["Next.js App"]
        style Next fill:#000000,stroke:#333,color:white
    end

    %% バックエンド (VPS/EC2)
    subgraph "さくらのVPS"
        subgraph "Docker Host"
            GoApp["Go Backend Container<br/>(Echo Framework)"]
            style GoApp fill:#00ADD8,stroke:#333,color:white
        end

        Nginx["Nginx<br/>(Reverse Proxy)"]
        style Nginx fill:#269539,stroke:#333,color:white
    end

    %% 外部SaaS (Supabase)
    subgraph "Supabase Platform"
        SupaAuth["Supabase Auth<br/>(Login / JWT)"]
        SupaDB[("PostgreSQL DB<br/>User Data")]
        SupaStorage["Supabase Storage<br/>(OGP Images)"]
        style SupaAuth fill:#3ECF8E,stroke:#333,color:white
        style SupaDB fill:#3ECF8E,stroke:#333,color:white
        style SupaStorage fill:#3ECF8E,stroke:#333,color:white
    end

    %% 外部データソース
    subgraph "External API"
        DMM["DMM / FANZA API"]
        style DMM fill:#DDD,stroke:#333,color:black
    end


    %% --- データフロー ---

    %% 1. 画面表示
    User -->|"1. Access & Login"| Next
    Next -->|"2. Auth Request"| SupaAuth
    SupaAuth -->|"3. Issue JWT"| Next

    %% 2. APIリクエスト
    Next -->|"4. Request + JWT"| Nginx
    Nginx -->|"5. Forward"| GoApp

    %% 3. 処理実行
    GoApp -.->|Log| LocalLogs

    %% 4. 外部連携
    GoApp -->|"6. Search (with cache)"| Redis
    Redis -.->|Cache Miss| DMM
    GoApp -->|"7. Verify & Query"| SupaDB
    GoApp -->|"8. Upload OGP"| SupaStorage

    subgraph "Logging & Monitoring"
        LocalLogs["Server Logs<br/>(stdout/stderr)"]
        Sentry["Sentry<br/>(Error Tracking)"]
        style LocalLogs fill:#666,stroke:#333,color:white
        style Sentry fill:#362D59,stroke:#333,color:white
    end

    GoApp -.->|Error Report| Sentry
```

## 🧩 構成要素と役割

### 1. Frontend & Entry Point

| サービス   | 技術スタック                | 役割・選定理由                                                                                                                                                |
| :--------- | :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Vercel** | **Next.js 14 (App Router)** | **フロントエンドのホスティング**。<br>GitHubへのプッシュを検知して自動デプロイを行う。Next.jsとの親和性が非常に高い。<br>Edge Functions, ISR, SSRをサポート。 |
| **Nginx**  | -                           | **リバースプロキシ**。<br>さくらのVPS上で動作し、バックエンドコンテナへのリクエストを振り分ける。SSL終端やアクセス制御も担当。                                |

### 2. Backend (Compute)

| サービス   | 技術スタック           | 役割・選定理由                                                                                                                                                                              |
| :--------- | :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Docker** | **Go 1.21+ (Echo v4)** | **ビジネスロジックの中枢**。<br>さくらのVPS上でGo製のWebアプリケーションをコンテナ化して実行。デプロイの再現性とポータビリティを確保する。<br>高速なAPIレスポンスと低メモリフットプリント。 |

### 3. Database & Auth (SaaS)

| サービス             | 技術スタック         | 役割・選定理由                                                                                                                                                                                                                      |
| :------------------- | :------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Supabase Auth**    | -                    | **認証基盤**。<br>ユーザー管理（メール/パスワード、OAuth）を提供し、アクセストークン（JWT）を発行する。<br>メール確認、パスワードリセット機能を内蔵。                                                                               |
| **Supabase DB**      | **PostgreSQL 15+**   | **リレーショナルデータベース**。<br>ユーザーのプロフィール、お気に入りリスト、タグ情報などを保存。<br>Goバックエンドからの接続には**Supavisor (Connection Pooler)** を使用。<br>Row Level Security (RLS) による細かいアクセス制御。 |
| **Supabase Storage** | **S3互換ストレージ** | **画像・ファイルストレージ**。<br>OGP画像の保存、女優画像のキャッシュ（オプション）。                                                                                                                                               |

### 4. External Services

| サービス              | 役割                                                                                             |
| :-------------------- | :----------------------------------------------------------------------------------------------- |
| **DMM API**           | 女優情報、作品情報、パッケージ画像の取得元。<br>**レート制限**: 要確認（通常1秒1リクエスト程度） |
| **Sentry** (Optional) | エラートラッキング・パフォーマンス監視                                                           |

---

## 📊 データ構造（DBスキーマ）

アプリケーションの核となるデータモデルは、公開情報（actresses）と個人情報（reviews, tags）を明確に分離した正規化構造を採用しています。

```mermaid
erDiagram
    users ||--o{ reviews : "has"
    actresses ||--o{ reviews : "referenced by"
    reviews ||--o{ review_tags : "has"
    tags ||--o{ review_tags : "belongs to"
    users ||--o{ tags : "owns"

    users {
        uuid id PK "Supabase Auth ID"
        string nickname
        string email "Unique, from Supabase Auth"
        datetime created_at
        datetime updated_at
    }

    actresses {
        bigint id PK "Auto increment"
        string dmm_actress_id "Unique, DMM API ID"
        string name "女優名"
        string image_url "サムネイル画像URL (DMM or Supabase Storage)"
        string fanza_url "公式/アフィリエイトURL"
        smallint bust
        smallint waist
        smallint hip
        smallint height
        varchar(5) cup
        datetime created_at
        datetime updated_at
    }

    reviews {
        bigint id PK
        uuid user_id FK "users.id"
        bigint actress_id FK "actresses.id"
        smallint rating
        string favorite_video_title
        string favorite_video_url
        text memo
        datetime created_at
        datetime updated_at
        string unique_user_actress "UK: user_id + actress_id"
    }

    tags {
        bigint id PK
        uuid user_id FK "users.id"
        string name "タグ名"
        datetime created_at
        datetime updated_at
        string unique_user_tag "UK: user_id + name"
    }

    review_tags {
        bigint id PK
        bigint review_id FK "reviews.id"
        bigint tag_id FK "tags.id"
        datetime created_at
        datetime updated_at
        string unique_review_tag "UK: review_id + tag_id"
    }
```

**詳細なスキーマ定義・制約・インデックスは [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md) を参照**

---

## 🚀 デプロイ戦略

フロントエンドとバックエンドは完全に分離してデプロイします。

| 対象         | トリガー               | CI/CD パイプライン                                                                                                                                                                                                                                                                                                    |
| :----------- | :--------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | `main`ブランチへのPush | **Vercel**が自動で検知し、ビルドとデプロイを実行する。<br>プレビューデプロイは Pull Request 単位で自動生成。                                                                                                                                                                                                          |
| **Backend**  | `main`ブランチへのPush | **GitHub Actions**が以下の処理を自動で実行する。<br>1. Goのテストを実行（カバレッジ80%以上）<br>2. Dockerイメージをビルド<br>3. イメージを **GHCR** (GitHub Container Registry) へプッシュ<br>4. 本番サーバーへSSH接続し、`docker compose`コマンドで最新のイメージをプルしてコンテナを再起動<br>5. ヘルスチェック実行 |

---

## 🐳 Dockerの使用方針

開発環境から本番環境まで、一貫してDockerを利用します。

- **本番 (Production):** さくらのVPS上で `backend/docker-compose.yml` に基づいて、Goバックエンドコンテナをサーバー上で実行します。
- **開発 (Local):** 同じく `backend/docker-compose.yml` を使用して、本番に近い環境でアプリケーションを起動し、ホットリロードを活用して開発効率を高めます。

```bash
# 開発環境起動
cd backend
docker-compose up

# 本番環境起動（さくらのVPS上など）
cd backend
docker-compose up -d
```

---

## 🔐 セキュリティ方針

### 認証・認可

- **JWT**: Supabase Authが発行。有効期限1時間、リフレッシュトークンで自動更新。
- **RLS (Row Level Security)**: Supabase DB で各ユーザーのデータを完全分離。
- **CORS**: フロントエンドドメインのみ許可。

### データ保護

- **HTTPS**: 全通信を暗号化（Let's Encrypt）
- **環境変数**: GitHub Secrets, `.env.local` で管理。本番環境では環境変数注入。
- **パスワード**: Supabase Authが bcrypt でハッシュ化。

**詳細なセキュリティ仕様は [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md) を参照**

---

## 🧪 テスト戦略

| テスト種別            | ツール                            | カバレッジ目標   |
| :-------------------- | :-------------------------------- | :--------------- |
| **Backend Unit Test** | Go testing                        | 80%以上          |
| **Integration Test**  | Supertest (API), Playwright (E2E) | 主要フロー100%   |
| **Manual Test**       | -                                 | リリース前に実施 |

---

## 📞 サポート・問い合わせ

- **Issue Tracker**: [GitHub Issues](https://github.com/akito-0520/MuseLog/issues)
- **開発者**: akito-0520, Rtosshy, f-yusei

---

⚠️ **免責事項 (Disclaimer)**

本アプリは個人の技術研究を目的とした非公式アプリです。データの取得には [DMM.com](https://affiliate.dmm.com/api/) WebサービスAPI を利用しています。

<a href="https://affiliate.dmm.com/api/">
  <img src="https://pics.dmm.com/af/web_service/com_135_17.gif" width="135" height="17" alt="WEB SERVICE BY DMM.com" />
</a>

本アプリ内で表示されるコンテンツの著作権は各権利者に帰属します。本アプリの利用により生じた損害について、開発者は一切の責任を負いません。

---

_Created by Muse Log Architecture Team_
