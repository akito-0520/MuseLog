package main

import (
	"backend/app/models"
	"log/slog"
	"os"
)

func main() {
	db, err := models.InitDB()
	if err != nil {
		slog.Error("failed to connect db", "error", err)
		os.Exit(1)
	}

	slog.Info("running migration...")

	err = db.AutoMigrate(
		&models.User{},
		&models.Actress{},
		&models.Review{},
		&models.Tag{},
		&models.ReviewTag{},
	)
	if err != nil {
		slog.Error("migration failed", "error", err)
		os.Exit(1)
	}

	slog.Info("migration completed successfully")
}
