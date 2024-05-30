package storage

import (
	"database/sql"

	"github.com/glebkk/photo-storage/server/internal/model"
)

type AlbumRepository struct {
	db *sql.DB
}

func NewAlbumRepository(db *sql.DB) *AlbumRepository {
	return &AlbumRepository{db: db}
}

func (r *AlbumRepository) Create(album *model.Album) error {
	stmt, err := r.db.Prepare("INSERT INTO albums (user_id, name, description) VALUES ($1, $2, $3)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(album.UserId, album.Name, album.Description)
	return err
}

func (r *AlbumRepository) GetByID(id int) (*model.Album, error) {
	row := r.db.QueryRow("SELECT id, user_id, title, description, FROM model.Albums WHERE id = $1", id)
	album := &model.Album{}
	err := row.Scan(&album.ID, &album.UserId, &album.Name, &album.Description)
	return album, err
}

// Добавьте другие методы, как удаление, обновление, и получение списка альбомов
