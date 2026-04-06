package models

import "time"

type Review struct {
	ID                 int64     `gorm:"type:bigserial;primaryKey"`
	UserID             string    `gorm:"type:uuid;not null"`
	ActressID          int64     `gorm:"type:bigint;not null"`
	Rating             *int16    `gorm:"type:smallint;check:rating >= 1 AND rating <= 5"`
	FavoriteVideoTitle *string   `gorm:"type:varchar(255)"`
	FavoriteVideoURL   *string   `gorm:"type:text"`
	Memo               *string   `gorm:"type:text"`
	CreatedAt          time.Time `gorm:"type:timestamptz;not null;default:now()"`
	UpdatedAt          time.Time `gorm:"type:timestamptz;not null;default:now()"`
}
