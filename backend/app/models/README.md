# Model

## 概要

Model層は、アプリケーションで扱うデータの構造を定義し、DBとのやりとりを担当する層である
DBからのデータ取得・保存といった永続化に関する処理は全てこの層で行う
Service層から呼び出され、DBに直接アクセスする唯一の層として機能する

## Model層の役割

- DBとのやりとり
- データ構造の定義
- データの整合性保証

## ファイル構成

```bash
model/
  ├── user.go          # ユーザー関連のモデル
  ├── hoge.go          # hoge関連のモデル
  └── db.go            # DB接続の共通処理
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
    ID    int
    Name  string
    Email string
}
```

### CRUD操作の実装

```go
func SaveUser(db *sql.DB, user *User) error { ... }
func DeleteUser(db *sql.DB, userID int) error { ... }
```

## 使用方法

## 注意事項

構造体のレシーバメソッドで書くパターンもあるが今回は関数で記述する

## 関連ドキュメント