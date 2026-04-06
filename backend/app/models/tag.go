package models

import "time"

type Tag struct {
	ID        int64     `gorm:"type:bigserial;primaryKey"`
	UserID    string    `gorm:"type:uuid;not null"`
	Name      string    `gorm:"type:varchar(50);not null"`
	CreatedAt time.Time `gorm:"type:timestamptz;not null;default:now()"`
	UpdatedAt time.Time `gorm:"type:timestamptz;not null;default:now()"`
}
