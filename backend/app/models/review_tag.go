package models

import "time"

type ReviewTag struct {
	ID        int64     `gorm:"type:bigserial;primaryKey"`
	ReviewID  int64     `gorm:"type:bigint;not null"`
	TagID     int64     `gorm:"type:bigint;not null"`
	CreatedAt time.Time `gorm:"type:timestamptz;not null;default:now()"`
	UpdatedAt time.Time `gorm:"type:timestamptz;not null;default:now()"`
}
