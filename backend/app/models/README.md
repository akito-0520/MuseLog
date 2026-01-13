# Model

## 概要

Modelは、アプリケーションで扱うデータの構造を定義し、DBとのやりとりを担当する
DBからのデータ取得・保存といった永続化に関する処理は全て行う
Serviceから呼び出され、DBに直接アクセスする

## 役割

- DBとのやりとり
- データ構造の定義
- データの整合性保証

## ファイル構成

```bash
models/
  ├── user.go        # ユーザー関連のモデル
  ├── hoge.go        # hoge関連のモデル
  └── db.go          # DB接続の共通処理
```

## 規則・方針

### ファイル分割方針

- 1つのテーブル（エンティティ）につき1ファイル
- 共通処理は別ファイルに分離

### ファイル命名規則

- ファイル名はテーブル名の単数形・小文字
- 例: usersテーブル → user.go

### 構造体命名規則

- パスカルケースで記述
- テーブル名の単数形
- 例: User, Post, Comment

### 関数命名規則

- CRUD操作: GetUser, CreateUser, UpdateUser, DeleteUser
- 複数取得: GetUsers, GetUsersByCondition
- その他: FindUserByID など具体的な名前

## 実装パターン

### 構造体の定義

```go
type User struct {
    ID        int       `json:"id"`
    Name      string    `json:"name"`
    Email     string    `json:"email"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}
```

### Contextからのdb取得

```go
// db.go にヘルパー関数を定義

// コンテキスト用のキー型を定義（外部からは参照されないようにする）
type dbContextKey struct{}

var dbKey = dbContextKey{}

func GetDB(ctx context.Context) *gorm.DB {
    return ctx.Value(dbKey).(*gorm.DB)
}
```

### CRUD操作の実装

```go
// 単体取得
func GetUser(ctx context.Context, id int) (*User, error) {
    db := GetDB(ctx)
    var user User
    if err := db.First(&user, id).Error; err != nil {
        return nil, err
    }
    return &user, nil
}

// 一覧取得
func GetUsers(ctx context.Context) ([]User, error) {
    db := GetDB(ctx)
    var users []User
    if err := db.Find(&users).Error; err != nil {
        return nil, err
    }
    return users, nil
}

// 作成
func CreateUser(ctx context.Context, user *User) error {
    db := GetDB(ctx)
    return db.Create(user).Error
}

// 更新
func UpdateUser(ctx context.Context, user *User) error {
    db := GetDB(ctx)
    return db.Save(user).Error
}

// 削除
func DeleteUser(ctx context.Context, id int) error {
    db := GetDB(ctx)
    return db.Delete(&User{}, id).Error
}
```

### 条件付き取得

```go
func GetUserByEmail(ctx context.Context, email string) (*User, error) {
    db := GetDB(ctx)
    var user User
    if err := db.Where("email = ?", email).First(&user).Error; err != nil {
        return nil, err
    }
    return &user, nil
}
```

## 注意事項

- アクティブレコードパターンではなくリポジトリパターンでDB操作関数を記述する
- Controllerから直接呼び出さない（Serviceを経由する）

## 関連ドキュメント

- [Controller層](../controllers/README.md)
- [Service層](../services/README.md)
