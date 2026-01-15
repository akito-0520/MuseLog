# Controller

## 概要

Controllerは、APIリクエストの受信とレスポンスの送信を担当する
リクエストを受信した後に対応するサービスを呼び出す処理を行う
ルーターに登録するハンドラー関数を記述する

## 役割

- リクエストのバリデーション
- レスポンスオブジェクトへの変換
- サービスの呼び出し

## ファイル構成

```bash
controllers/
  ├── user.go       # ユーザー関連のハンドラー関数
  ├── hoge.go       # hoge関連のハンドラー関数
  └── fuga.go       # fuga関連のハンドラー関数
```

## 規則・方針

### ファイル分割方針

- 1つのリソース（機能）につき1ファイル
- 共通のレスポンス構造体は別ファイルに分離可能

### ファイル命名規則

- ファイル名はリソース名の単数形・小文字
- 例: ユーザー関連 → user.go、投稿関連 → post.go

### 関数命名規則

- パスカルケースで記述（エクスポートするため）
- HTTPメソッド + リソース名の形式を基本とする
- 一覧取得: `GetUsers`, `ListUsers`
- 単体取得: `GetUser`
- 作成: `CreateUser`
- 更新: `UpdateUser`
- 削除: `DeleteUser`

## 実装パターン

仮の実装パターンなので適宜修正を加える必要があります

### ハンドラー関数の基本形

```go
func GetUser(c echo.Context) error {
    // 1. パラメータの取得・バリデーション
    id := c.Param("id")

    // 2. Serviceの呼び出し
    user, err := services.GetUser(id)
    if err != nil {
        return c.JSON(http.StatusNotFound, ErrorResponse{Message: "User not found"})
    }

    // 3. レスポンスの返却
    return c.JSON(http.StatusOK, user)
}
```

### レスポンス構造体

```go
type UserResponse struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

type ErrorResponse struct {
    Message string `json:"message"`
}
```

## 注意事項

- Controller内でビジネスロジックを書かない（Serviceに委譲する）
- DBへの直接アクセスは禁止（Serviceを経由する）

## 関連ドキュメント

- [Service層](../services/README.md)
- [Model層](../models/README.md)