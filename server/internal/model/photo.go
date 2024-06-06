package model

import (
	"mime/multipart"
	"time"
)

type Photo struct {
	ID        int64     `json:"id"`
	UserId    int64     `json:"userId"`
	FilePath  string    `json:"filePath"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"createdAt"`
}

type PhotoCreate struct {
	UserId   int64  `json:"userId"`
	FilePath string `json:"filePath"`
	Name     string `json:"name"`
}

type PhotoUploadRequest struct {
	Name string                `form:"name"`
	File *multipart.FileHeader `form:"file"`
}

type PhotoUploadResponse struct {
	Photo
}

type PhotoResponse struct {
	MonthYear string  `json:"monthYear"`
	Photos    []Photo `json:"photos"`
}
