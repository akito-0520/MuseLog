# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

MuseLogバックエンドはGo言語で書かれたWebサービスです。WebフレームワークにはEcho (v4)を使用しています。

## ビルド・実行コマンド

```bash
# ローカル開発
go run main.go

# Docker Composeで起動
docker-compose up -d

# 依存関係の更新
go mod tidy
```

サーバーはデフォルトで8080ポートで起動します（環境変数`PORT`で変更可能）。

## アーキテクチャ

MVCベースのアーキテクチャを採用しています。Serviceレイヤーでビジネスロジックを分離しています。

```
リクエスト → Controller → Service → Model → DB
```

- **Controller** (`app/controllers/`): HTTPリクエストハンドラ。リクエストのバリデーション、レスポンス変換、Serviceの呼び出し
- **Service** (`app/services/`): ビジネスロジック
- **Model** (`app/models/`): データ構造の定義とDB操作
- **Middleware** (`app/middleware/`): Echoミドルウェア
- **api/**: OpenAPIドキュメント（`openapi.yaml`）

## コーディング規約

### Model層
- 1テーブル = 1ファイル（テーブル名の単数形・小文字で命名）
- 構造体名はパスカルケース・単数形（例: `User`, `Post`）
- CRUD関数名: `GetUser`, `CreateUser`, `UpdateUser`, `DeleteUser`
- 複数取得: `GetUsers`, `GetUsersByCondition`
- レシーバメソッドではなく関数で記述する

### Controller層
- 機能単位でファイルを分割