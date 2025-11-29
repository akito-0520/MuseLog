# Muse Log 💋

**Muse Log** は、お気に入りの女優や作品を収集・管理し、美しいカード形式で共有できる「裏研究」プラットフォームです。
サーバーレス技術（AWS Lambda + Go）と最新のBaaS（Supabase）を組み合わせ、**「クロスデバイス同期」「高速なレスポンス」「堅牢なセキュリティ」**を実現しています。

![Architecture](https://img.shields.io/badge/Architecture-Serverless-orange)
![Tech](https://img.shields.io/badge/Tech-Go_×_Next.js-blue)
![DB](https://img.shields.io/badge/DB-Supabase_PostgreSQL-green)

## 🚀 特徴

- **Account Sync**: Supabase Authによるセキュアなアカウント管理。PCで保存したリストをスマホで即座に確認できます。
- **Smart Sharing**: お気に入りリストをOGP（画像付きカード）としてSNSで美しく共有。
- **High Performance**: Go言語による爆速Lambdaバックエンド。
- **Privacy First**: 収集するのはメールアドレスのみ。検索履歴や閲覧データは厳重に保護されます。

## 🏗 アーキテクチャ

AWS Lambda (Go) と Supabase (Auth & DB) を連携させたハイブリッド構成です。

```mermaid
graph TD
    User((User))
    
    subgraph "Frontend (AWS Amplify)"
        NextJS["Next.js App (App Router)"]
    end

    subgraph "Supabase Platform"
        SupabaseAuth["Supabase Auth<br/>(JWT Management)"]
        Postgres[("PostgreSQL DB")]
    end

    subgraph "AWS Cloud (Backend)"
        APIGW["API Gateway (HTTP API)"]
        
        subgraph "Go Runtime"
            Lambda["Lambda Function<br/>(Business Logic)"]
            Middleware["Middleware<br/>(JWT Verify)"]
        end
        
        SSM["SSM Parameter Store<br/>(API Keys)"]
    end

    subgraph "External API"
        DMM["DMM / FANZA API"]
    end

    %% Auth Flow
    User -->|"Login / Sign up"| NextJS
    NextJS -->|"Auth Request"| SupabaseAuth
    SupabaseAuth -->|"Return JWT"| NextJS

    %% Data Flow
    NextJS -->|"API Request (w/ Token)"| APIGW
    APIGW --> Lambda
    Lambda --> Middleware
    Middleware -.->|"Verify Signature"| SupabaseAuth
    
    Lambda -->|"Search"| DMM
    Lambda -->|"Read/Write (User Data)"| Postgres

## 🛠 技術スタック

| カテゴリ | 技術選定 | 役割 |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14+** (App Router) | UI / SSR / OGP生成 |
| **Styling** | **Tailwind CSS** + **shadcn/ui** | デザインシステム |
| **Backend** | **Go** (AWS Lambda) | ビジネスロジック / API処理 |
| **Infrastructure** | **AWS CDK** (Go) | IaC (インフラのコード化) |
| **Database** | **Supabase** (PostgreSQL) | ユーザーデータ / レビュー保存 |
| **Auth** | **Supabase Auth** | 認証 (Email/Pass, Social Login) |
| **API** | **DMM API** | 女優・作品データの検索 |

⚠️ 免責事項 (Disclaimer)
本アプリは個人の技術研究を目的とした非公式アプリです。 データの取得には [DMM.com](https://affiliate.dmm.com/api/) WebサービスAPI を利用しています。

<a href="https://affiliate.dmm.com/api/"> <img src="https://pics.dmm.com/af/web_service/com_135_17.gif" width="135" height="17" alt="WEB SERVICE BY DMM.com" /> </a>

本アプリ内で表示されるコンテンツの著作権は各権利者に帰属します。

本アプリの利用により生じた損害について、開発者は一切の責任を負いません。

© 2025 Muse Log Project