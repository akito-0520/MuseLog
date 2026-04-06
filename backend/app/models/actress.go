package models

import "time"

type Actress struct {
	ID        int64     `gorm:"type:bigserial;primaryKey"`
	Name      string    `gorm:"type:varchar(100);not null"`
	ImageURL  *string   `gorm:"type:text"`
	FanzaURL  *string   `gorm:"type:text"`
	Bust      *int16    `gorm:"type:smallint;check:bust > 0 AND bust < 200"`
	Waist     *int16    `gorm:"type:smallint;check:waist > 0 AND waist < 200"`
	Hip       *int16    `gorm:"type:smallint;check:hip > 0 AND hip < 200"`
	Height    *int16    `gorm:"type:smallint;check:height > 0 AND height < 300"`
	Cup       *string   `gorm:"type:varchar(5)"`
	CreatedAt time.Time `gorm:"type:timestamptz;not null;default:now()"`
	UpdatedAt time.Time `gorm:"type:timestamptz;not null;default:now()"`
}
