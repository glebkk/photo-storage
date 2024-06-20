package model

type Album struct {
	ID     int64  `json:"id"`
	UserId int64  `json:"userId"`
	Name   string `json:"name"`
}

type AlbumCreate struct {
	Name string `json:"name"`
}

type PhotoAlbum struct {
	AlbumId int64 `json:"albumId"`
	PhotoId int64 `json:"photoId"`
}

type AlbumResponse struct {
	ID     int64   `json:"id"`
	UserId int64   `json:"userId"`
	Name   string  `json:"name"`
	Photos []Photo `json:"photos"`
}
