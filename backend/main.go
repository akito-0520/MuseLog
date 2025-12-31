package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func main() {
	// ポート設定（デフォルト8000）
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}


	// ハンドラ定義
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "success",
			"message": "Go Backend is running via GitHub Actions!",
		})
		fmt.Println("Request handled")
	})

	// 起動
	fmt.Printf("Server listening on port %s...\n", port)
	http.ListenAndServe(":"+port, nil)
}