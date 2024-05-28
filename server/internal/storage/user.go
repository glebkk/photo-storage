package storage

import (
	"database/sql"
	"fmt"

	"github.com/glebkk/photo-storage/server/internal/model"

	_ "github.com/lib/pq"
)

type UserRepository struct {
	db *sql.DB
}

func (ur *UserRepository) Create(user model.RegisterRequest) (int64, error) {
	var id int64
	err := ur.db.QueryRow("INSERT INTO users(login, password) VALUES($1, $2) RETURNING id", user.Login, user.Password).Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("%w", err)
	}

	return id, nil
}

func (ur *UserRepository) GetByLogin(login string) (*model.User, error) {
	sqlRow := "SELECT * FROM users where login = $1"

	row := ur.db.QueryRow(sqlRow, login)
	var user model.User
	err := row.Scan(&user.Id, &user.Login, &user.Password)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{
		db: db,
	}
}
