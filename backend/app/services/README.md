# Service

## 概要

Serviceは、外部APIとの連携のみを担当する

## 役割

- 外部APIとの連携（DMM APIなど）
- 外部サービスへのリクエスト送信とレスポンス処理

## ファイル構成

```bash
services/
  └── dmm.go     # DMM API連携
```

## 規則・方針

### ファイル分割方針

- 1つの外部サービスにつき1ファイル

### ファイル命名規則

- ファイル名は外部サービス名の小文字
- 例: DMM → dmm.go

### 関数命名規則

- パスカルケースで記述（エクスポートするため）
- 処理内容を表す動詞から始める
- 例: `FetchDMMItems`, `SearchDMMProducts`

## 実装パターン

仮の実装パターンなので適宜修正を加える必要があります

### 外部API呼び出し

```go
func FetchDMMItems(ctx context.Context, keyword string) (*DMMResponse, error) {
    url := fmt.Sprintf("https://api.dmm.com/affiliate/v3/ItemList?api_id=%s&affiliate_id=%s&keyword=%s",
        os.Getenv("DMM_API_ID"),
        os.Getenv("DMM_AFFILIATE_ID"),
        url.QueryEscape(keyword),
    )

    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil {
        return nil, err
    }

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    var result DMMResponse
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        return nil, err
    }

    return &result, nil
}
```

## 注意事項

- HTTPリクエスト/レスポンスの処理はControllerに任せる
- DB操作はModelに委譲する
- Serviceは外部API連携のみに集中する

## 関連ドキュメント

- [Controller層](../controllers/README.md)
- [Model層](../models/README.md)
