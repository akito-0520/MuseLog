# Backend

## 概要

MuseLogのバックエンドAPIサーバー。Go言語で実装されており、WebフレームワークにはEcho (v4)を使用。

## 技術スタック

- **言語**: Go 1.24
- **Webフレームワーク**: Echo v4
- **ORM**: GORM
- **コンテナ**: Docker

## ディレクトリ構成

```
backend/
├── main.go              # エントリーポイント
├── app/
│   ├── controllers/     # HTTPリクエストハンドラ
│   ├── services/        # ビジネスロジック
│   ├── models/          # データモデル・DB操作
│   └── middleware/      # Echoミドルウェア
├── api/                 # OpenAPI定義
├── docker-compose.yml
├── go.mod
└── go.sum
```

## セットアップ

### 環境変数の設定

#### 本番環境（GitHub Actions）

本番環境では、GitHub Secretsから直接環境変数が注入されます。

- GitHub Settingsで`CERTBOT_EMAIL`シークレットを設定してください
- デプロイ時に自動的に環境変数として渡されます

### ローカル開発

```bash
# 依存関係のインストール
go mod download

# ローカル起動
go run main.go

# Docker起動（開発環境 - フロントエンド含む）
docker compose --profile development up -d

# Docker起動（本番環境 - バックエンドのみ）
docker compose up -d
```

サーバーはデフォルトで8080ポートで起動します。

### 環境別のDocker起動方法

- **開発環境**: フロントエンドとバックエンドの両方のコンテナが起動します
  - `docker compose --profile development up -d`
- **本番環境**: バックエンドのみが起動します（フロントエンドはVercelにデプロイ）
  - `docker compose up -d`

## アーキテクチャ

MVCベースのレイヤードアーキテクチャを採用しています。

```
リクエスト → Controller → Service → Model → DB
```

各層の詳細は以下を参照:
- [Controller層](./app/controllers/README.md)
- [Service層](./app/services/README.md)
- [Model層](./app/models/README.md)
