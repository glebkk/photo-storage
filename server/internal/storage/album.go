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

func (r *AlbumRepository) Create(album *model.Album) (int64, error) {
	var id int64
	err := r.db.QueryRow("INSERT INTO albums (user_id, name) VALUES ($1, $2) RETURNING id", album.UserId, album.Name).Scan(&id)
	if err != nil {
		return -1, err
	}
	return id, err
}

func (r *AlbumRepository) GetByID(id int) (*model.Album, error) {
	row := r.db.QueryRow("SELECT id, user_id, name FROM model.Albums WHERE id = $1", id)
	album := &model.Album{}
	err := row.Scan(&album.ID, &album.UserId, &album.Name)
	return album, err
}

func (r *AlbumRepository) GetAlbumByUserId(userId int64) ([]*model.Album, error) {
	query := `
        SELECT 
        	id, user_id, name
        FROM 
            albums
        WHERE 
            user_id = $1
    `

	rows, err := r.db.Query(query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var albums []*model.Album
	for rows.Next() {
		album := &model.Album{}
		if err := rows.Scan(&album.ID, &album.UserId, &album.Name); err != nil {
			return nil, err
		}
		albums = append(albums, album)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return albums, nil
}

func (r *AlbumRepository) GetPhotosByAlbumId(albumId int64) ([]model.Photo, error) {
	var photos []model.Photo

	rows, err := r.db.Query(`
        SELECT p.id, p.user_id, p.file_path, p.name, p.created_at
        FROM photos p
        JOIN photo_album pa ON p.id = pa.photo_id
        WHERE pa.album_id = $1
    `, albumId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var photo model.Photo
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

func (r *AlbumRepository) AddPhotoToAlbum(photoAlbum *model.PhotoAlbum) error {
	stmt, err := r.db.Prepare("INSERT INTO photo_album (photo_id, album_id) VALUES ($1, $2)")
	if err != nil {
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec(photoAlbum.PhotoId, photoAlbum.AlbumId)
	return err
}

func (r *AlbumRepository) DeletePhotoFromAlbum(photoAlbum *model.PhotoAlbum) error {
	err := r.db.QueryRow("DELETE FROM photo_album where photo_id = $1 and album_id = $2", photoAlbum.PhotoId, photoAlbum.AlbumId)
	return err.Err()
}

func (r *AlbumRepository) IsAlbumBelongsUser(albumId int64, userId int64) bool {
	query := `
		SELECT COUNT(*) 
		FROM albums
		WHERE id = $1 AND user_id = $2
	`

	var count int64
	err := r.db.QueryRow(query, albumId, userId).Scan(&count)
	if err != nil {
		return false
	}

	if count == 0 {
		return false
	}

	return true
}

func (r *AlbumRepository) DeleteAlbum(albumId int64) error {
	row := r.db.QueryRow("DELETE FROM albums WHERE id = $1", albumId)
	return row.Err()
}

// Добавьте другие методы, как удаление, обновление, и получение списка альбомов
