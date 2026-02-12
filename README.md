# Muse Log 💋

**Muse Log** は、お気に入りの女優や作品を収集・管理し、美しいカード形式で共有できる「裏研究」プラットフォームです。
Dockerコンテナとしてデプロイされ、BaaS（Supabase）と連携することで、**「クロスデバイス同期」「高速なレスポンス」「堅牢なセキュリティ」**を実現しています。

![Architecture](https://img.shields.io/badge/Architecture-Docker_Container-blue)
![Tech](https://img.shields.io/badge/Tech-Go_×_Next.js-blue)
![DB](https://img.shields.io/badge/DB-Supabase_PostgreSQL-green)

## 🚀 特徴

- **Account Sync**: Supabase Authによるセキュアなアカウント管理。PCで保存したリストをスマホで即座に確認できます。
- **Smart Sharing**: お気に入りリストをOGP（画像付きカード）としてSNSで美しく共有。
- **High Performance**: Go言語による高速なバックエンド。
- **Privacy First**: 収集するのはメールアドレスのみ。検索履歴や閲覧データは厳重に保護されます。

-----

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
        style SupaAuth fill:#3ECF8E,stroke:#333,color:white
        style SupaDB fill:#3ECF8E,stroke:#333,color:white
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
    GoApp -->|"6. Search"| DMM
    GoApp -->|"7. Verify & Query"| SupaDB

    subgraph "Logging"
        LocalLogs["Server Logs<br/>(stdout/stderr)"]
        style LocalLogs fill:#666,stroke:#333,color:white
    end
```

## 🧩 構成要素と役割

### 1\. Frontend & Entry Point

| サービス | 技術スタック | 役割・選定理由 |
| :--- | :--- | :--- |
| **Vercel** | **Next.js** | **フロントエンドのホスティング**。<br>GitHubへのプッシュを検知して自動デプロイを行う。Next.jsとの親和性が非常に高い。 |
| **Nginx** | - | **リバースプロキシ**。<br>さくらのVPS上で動作し、バックエンドコンテナへのリクエストを振り分ける。SSL終端やアクセス制御も担当。 |

### 2\. Backend (Compute)

| サービス | 技術スタック | 役割・選定理由 |
| :--- | :--- | :--- |
| **Docker** | **Go (Echo)** | **ビジネスロジックの中枢**。<br>さくらのVPS上でGo製のWebアプリケーションをコンテナ化して実行。デプロイの再現性とポータビリティを確保する。 |

### 3\. Database & Auth (SaaS)

| サービス | 技術スタック | 役割・選定理由 |
| :--- | :--- | :--- |
| **Supabase Auth** | - | **認証基盤**。<br>ユーザー管理（メール/パスワード、SNSログイン）を提供し、アクセストークン（JWT）を発行する。 |
| **Supabase DB** | **PostgreSQL** | **リレーショナルデータベース**。<br>ユーザーのプロフィール、お気に入りリスト、タグ情報などを保存。<br>Goバックエンドからの接続には内蔵の\*\*Connection Pooler (Supavisor)\*\*を使用する。 |

### 4\. External

| サービス | 役割 |
| :--- | :--- |
| **DMM API** | 女優情報、作品情報、パッケージ画像の取得元。 |

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
        bigint id PK
        string nickname
        string email "Unique"
        string password_digest
        datetime created_at "登録日"
        datetime updated_at "更新日"
    }

    actresses {
        bigint id  PK
        string name
        string image_url "サムネイル画像のURL"
        string fanza_url "公式/アフィリエイトURL"
        smallint bust
        smallint waist
        smallint hip
        smallint height
        varchar(5) cup
        datetime created_at "登録日"
        datetime updated_at "更新日"
    }

    reviews {
        bigint id PK
        bigint user_id FK
        bigint actress_id FK
        smallint rating "1〜5の個人的評価"
        string favorite_video_title "お気に入りの動画タイトル"
        string favorite_video_url "お気に入りの動画URL"
        string memo
        datetime created_at "登録日"
        datetime updated_at "更新日"
    }

    tags {
        bigint id PK
        bigint user_id FK
        string name
        datetime created_at "登録日"
        datetime updated_at "更新日"
    }

    review_tags {
        bigint id PK
        bigint review_id FK
        bigint tag_id FK
        datetime created_at "登録日"
        datetime updated_at "更新日"
    }
```

## 🚀 デプロイ戦略

フロントエンドとバックエンドは完全に分離してデプロイします。

| 対象 | トリガー | CI/CD パイプライン |
| :--- | :--- | :--- |
| **Frontend** | `main`ブランチへのPush | **Vercel**が自動で検知し、ビルドとデプロイを実行する。 |
| **Backend** | `main`ブランチへのPush | **GitHub Actions**が以下の処理を自動で実行する。<br>1. Goのテストを実行<br>2. Dockerイメージをビルド<br>3. イメージを **GHCR** (GitHub Container Registry) へプッシュ<br>4. 本番サーバーへSSH接続し、`docker compose`コマンドで最新のイメージをプルしてコンテナを再起動 |

## 🐳 Dockerの使用方針

開発環境から本番環境まで、一貫してDockerを利用します。

  - **本番 (Production):** さくらのVPS上で`docker-compose.yml` に基づいて、Goバックエンドコンテナをサーバー上で実行します。
  - **開発 (Local):** `docker-compose` を使用して、本番に近い環境でアプリケーションを起動し、ホットリロードを活用して開発効率を高めます。

-----

⚠️ 免責事項 (Disclaimer)
本アプリは個人の技術研究を目的とした非公式アプリです。 データの取得には [DMM.com](https://affiliate.dmm.com/api/) WebサービスAPI を利用しています。

<a href="https://affiliate.dmm.com/api/"> <img src="https://pics.dmm.com/af/web_service/com_135_17.gif" width="135" height="17" alt="WEB SERVICE BY DMM.com" /> </a>

本アプリ内で表示されるコンテンツの著作権は各権利者に帰属します。

本アプリの利用により生じた損害について、開発者は一切の責任を負いません。

*Created by Muse Log Architecture Team*
