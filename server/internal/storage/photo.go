package storage

import (
	"database/sql"
	"fmt"

	"github.com/glebkk/photo-storage/server/internal/model"
	"github.com/lib/pq"
)

type PhotoRepository struct {
	db *sql.DB
}

func NewPhotoRepository(db *sql.DB) *PhotoRepository {
	return &PhotoRepository{db: db}
}

func (r *PhotoRepository) Create(photo *model.PhotoCreate) (int64, error) {
	var id int64
	err := r.db.QueryRow("INSERT INTO photos (user_id, name, file_path) VALUES ($1, $2, $3) RETURNING id", photo.UserId, photo.Name, photo.FilePath).Scan(&id)

	if err != nil {
		if pgErr, ok := err.(*pq.Error); ok {
			if pgErr.Code == "23505" {
				return -1, fmt.Errorf("вы уже добавляли фото с таким именем %s", photo.Name)
			}
		}
		return -1, fmt.Errorf("не удалось сохранить фото")
	}
	return id, nil
}

func (r *PhotoRepository) GetByID(id int64) (*model.Photo, error) {
	row := r.db.QueryRow("SELECT id, user_id, name, file_path, created_at FROM photos WHERE id = $1", id)
	photo := &model.Photo{}
	err := row.Scan(&photo.ID, &photo.UserId, &photo.Name, &photo.FilePath, &photo.CreatedAt)
	return photo, err
}

func (r *PhotoRepository) GetAll(userId int64) ([]*model.Photo, error) {
	query := `
        SELECT 
        	p.id, p.user_id, p.file_path, p.name, p.created_at
        FROM 
            photos p
        WHERE 
            p.user_id = $1
		ORDER BY p.created_at DESC
    `

	rows, err := r.db.Query(query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var photos []*model.Photo
	for rows.Next() {
		photo := &model.Photo{}
		if err := rows.Scan(&photo.ID, &photo.UserId, &photo.FilePath, &photo.Name, &photo.CreatedAt); err != nil {
			return nil, err
		}
		photos = append(photos, photo)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return photos, nil
}

func (r *PhotoRepository) Delete(name string, userId int64) error {
	row := r.db.QueryRow("DELETE FROM photos WHERE name = $1 and user_id = $2", name, userId)
	return row.Err()
}

// Добавьте другие методы, как удаление, обновление, и получение списка фотографий
