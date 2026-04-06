package models

import "time"

type User struct {
	ID        string    `gorm:"type:uuid;primaryKey"`
	Email     string    `gorm:"type:varchar(255);not null;uniqueIndex"`
	CreatedAt time.Time `gorm:"type:timestamptz;not null;default:now()"`
	UpdatedAt time.Time `gorm:"type:timestamptz;not null;default:now()"`
}
