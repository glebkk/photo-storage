package service

import (
	"github.com/glebkk/photo-storage/server/internal/model"
)

type PhotoRepository interface {
	Create(photo *model.PhotoCreate) (int64, error)
	GetByID(userId int64) (*model.Photo, error)
	GetAll(userId int64) ([]*model.Photo, error)
	Delete(name string, userId int64) error
}

type PhotoService struct {
	photoRepo PhotoRepository
}

func (ps *PhotoService) Create(photo model.PhotoCreate) (int64, error) {
	id, err := ps.photoRepo.Create(&photo)
	if err != nil {
		return -1, err
	}
	return id, nil
}

func (ps *PhotoService) GetAll(userId int64) ([]*model.Photo, error) {
	photos, err := ps.photoRepo.GetAll(userId)
	if err != nil {
		return nil, err
	}

	return photos, nil
}

func (ps *PhotoService) Delete(name string, userId int64) error {
	err := ps.photoRepo.Delete(name, userId)
	if err != nil {
		return err
	}

	return nil
}

func NewPhotoService(photoRepo PhotoRepository) *PhotoService {
	return &PhotoService{
		photoRepo: photoRepo,
	}
}
