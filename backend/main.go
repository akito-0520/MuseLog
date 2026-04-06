package main

import (
	"backend/app/controllers"
	"backend/app/models"
	"fmt"
	"os"

	"github.com/labstack/echo/v4"
	"log/slog"
)

func main() {
	// ポート設定（デフォルト8080）
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// dbの初期化
	_, err := models.InitDB()
	if err != nil {
		slog.Error("failed to connect db", "error", err)
		os.Exit(1)
	}

	// Echoインスタンスの作成
	e := echo.New()

	// エンドポイントの定義
	e.GET("/", controllers.Hello)

	// 起動
	fmt.Printf("Server listening on port %s...\n", port)
	e.Logger.Fatal(e.Start(":" + port))
}
