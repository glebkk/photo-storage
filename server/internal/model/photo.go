package model

import "mime/multipart"

type Photo struct {
	ID       int64  `json:"id"`
	UserId   int64  `json:"userId"`
	FilePath string `json:"filePath"`
	Name     string `json:"name"`
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
