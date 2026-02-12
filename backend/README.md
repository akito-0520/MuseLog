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

```bash
# 依存関係のインストール
go mod download

# ローカル起動
go run main.go

# Docker起動
docker compose up -d
```

サーバーはデフォルトで8080ポートで起動します。

## アーキテクチャ

MVCベースのレイヤードアーキテクチャを採用しています。

```
リクエスト → Controller → Service → Model → DB
```

各層の詳細は以下を参照:
- [Controller層](./app/controllers/README.md)
- [Service層](./app/services/README.md)
- [Model層](./app/models/README.md)
