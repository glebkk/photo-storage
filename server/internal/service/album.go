package service

import (
	"errors"

	"github.com/glebkk/photo-storage/server/internal/model"
	"github.com/glebkk/photo-storage/server/internal/storage"
)

type AlbumService struct {
	albumRepo storage.AlbumRepository
}

func NewAlbumService(albumRepo *storage.AlbumRepository) *AlbumService {
	return &AlbumService{
		albumRepo: *albumRepo,
	}
}

func (as *AlbumService) GetAlbums(userId int64) ([]model.AlbumResponse, error) {
	var userAlbums []model.AlbumResponse
	albums, err := as.albumRepo.GetAlbumByUserId(userId)
	if err != nil {
		return nil, err
	}

	for _, album := range albums {
		photos, err := as.albumRepo.GetPhotosByAlbumId(album.ID)
		if err != nil {
			return nil, err
		}

		var photosSlice []model.Photo
		if photos != nil {
			photosSlice = photos
		} else {
			photosSlice = make([]model.Photo, 0)
		}

		userAlbums = append(userAlbums, model.AlbumResponse{
			ID:     album.ID,
			UserId: album.UserId,
			Name:   album.Name,
			Photos: photosSlice,
		})
	}

	return userAlbums, nil

}

func (as *AlbumService) CreateAlbum(album model.Album) (int64, error) {
	id, err := as.albumRepo.Create(&album)
	return id, err
}

func (as *AlbumService) DeletePhotoFromAlbum(photoAlbum *model.PhotoAlbum) error {
	err := as.albumRepo.DeletePhotoFromAlbum(photoAlbum)
	return err
}

func (as *AlbumService) UploadPhotoToAlbum(userId int64, photoAlbum *model.PhotoAlbum) error {

	ok := as.albumRepo.IsAlbumBelongsUser(photoAlbum.AlbumId, userId)
	if !ok {
		return errors.New("альбом не принадлежит пользователю")
	}

	err := as.albumRepo.AddPhotoToAlbum(photoAlbum)
	return err
}

func (as *AlbumService) DeleteAlbum(userId int64, albumId int64) error {
	ok := as.albumRepo.IsAlbumBelongsUser(albumId, userId)
	if !ok {
		return errors.New("альбом не принадлежит пользователю")
	}
	return as.albumRepo.DeleteAlbum(albumId)
}
