package main

import (
	"backend/app/controllers"
	"fmt"
	"os"

	"github.com/labstack/echo/v4"
)

func main() {
	// ポート設定（デフォルト8080）
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Echoインスタンスの作成
	e := echo.New()

	// エンドポイントの定義
	e.GET("/", controllers.Hello)

	// 起動
	fmt.Printf("Server listening on port %s...\n", port)
	e.Logger.Fatal(e.Start(":" + port))
}
