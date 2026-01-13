# GEMINI.md

今後のやりとりは日本語で行います。

## プロジェクト概要

このプロジェクトはGo言語で書かれたバックエンドサービスです。Webフレームワークには[Echo](https.github.com/labstack/echo)を利用しています。Dockerコンテナとして実行されるように構成されています。

アプリケーションは`controllers`、`middleware`、`models`、`services`といったディレクトリ構成になっており、一般的なWebアプリケーションのアーキテクチャを採用しています。

## ビルドと実行

### Docker

Docker Composeを利用してプロジェクトを起動するのが最も簡単です。

```bash
docker-compose up -d
```

これによりバックエンドサービスが起動し、`http://localhost:8080`でアクセス可能になります。

### ローカル開発

ローカル環境で開発用にアプリケーションを起動する場合は、以下のコマンドを実行します。

```bash
go run main.go
```

デフォルトでは8080ポートでサーバーが起動します。

## 開発規約

このプロジェクトは、標準的なGoのプロジェクトレイアウトに従っています。

*   `main.go`: アプリケーションのエントリーポイント
*   `app/controllers`: HTTPリクエストハンドラ
*   `app/models`: データモデル
*   `app/services`: ビジネスロジック
*   `app/middleware`: Echoフレームワークのミドルウェア
*   `api/`: OpenAPIドキュメントなどのAPI定義ファイル
*   `go.mod`: プロジェクトの依存関係を管理