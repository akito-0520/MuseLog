# Service

## 概要

Serviceは、アプリケーションのビジネスロジックを担当する
Controllerから呼び出され、Modelを利用してデータの取得・加工を行う

## 役割

- ビジネスロジックの実装
- 複数のModelを組み合わせた処理
- トランザクション管理
- 外部APIとの連携

## ファイル構成

```bash
services/
  ├── user.go        # ユーザー関連のビジネスロジック
  ├── post.go        # 投稿関連のビジネスロジック
  └── auth.go        # 認証関連のビジネスロジック
```

## 規則・方針

### ファイル分割方針

- 1つの機能ドメインにつき1ファイル
- 複数のModelにまたがる処理もServiceに記述

### ファイル命名規則

- ファイル名は機能ドメイン名の単数形・小文字
- 例: ユーザー関連 → user.go、認証関連 → auth.go

### 関数命名規則

- パスカルケースで記述（エクスポートするため）
- 処理内容を表す動詞から始める
- 例: `RegisterUser`, `AuthenticateUser`, `CalculateTotal`

## 実装パターン

### 基本的なService関数

```go
func GetUserProfile(ctx context.Context, userID int) (*UserProfile, error) {
    // Modelからデータを取得
    user, err := models.GetUser(ctx, userID)
    if err != nil {
        return nil, err
    }

    // ビジネスロジック（データの加工など）
    profile := &UserProfile{
        ID:       user.ID,
        Name:     user.Name,
        Email:    user.Email,
    }

    return profile, nil
}
```

### 複数Modelを組み合わせた処理

```go
func GetUserWithPosts(ctx context.Context, userID int) (*UserWithPosts, error) {
    user, err := models.GetUser(ctx, userID)
    if err != nil {
        return nil, err
    }

    posts, err := models.GetPostsByUserID(ctx, userID)
    if err != nil {
        return nil, err
    }

    return &UserWithPosts{
        User:  user,
        Posts: posts,
    }, nil
}
```

### トランザクションを使った処理

```go
func TransferPoints(ctx context.Context, fromID, toID, amount int) error {
    db := models.GetDB(ctx)
    return db.Transaction(func(tx *gorm.DB) error {
        // トランザクション用のContextを作成
        txCtx := context.WithValue(ctx, "db", tx)

        if err := models.DeductPoints(txCtx, fromID, amount); err != nil {
            return err
        }

        if err := models.AddPoints(txCtx, toID, amount); err != nil {
            return err
        }

        return nil
    })
}
```

## 注意事項

- HTTPリクエスト/レスポンスの処理はControllerに任せる
- DB操作の詳細はModelに委譲する
- Serviceは純粋なビジネスロジックに集中する

## 関連ドキュメント

- [Controller層](../controllers/README.md)
- [Model層](../models/README.md)
