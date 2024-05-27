package storage

import (
	"database/sql"
	"fmt"

	"github.com/glebkk/photo-storage/server/internal/model"

	pq "github.com/lib/pq"
)

type UserRepository struct {
	db *sql.DB
}

func (ur *UserRepository) Create(user model.RegisterRequest) error {

	stmt, err := ur.db.Prepare("INSERT INTO users(login, password) VALUES($1, $2)")
	if err != nil {
		return fmt.Errorf("%w", err)
	}

	_, err = stmt.Exec(user.Login, user.Password)
	if err != nil {
		if err, ok := err.(*pq.Error); ok {
			return fmt.Errorf("%w", err)
		}

		return fmt.Errorf("%w", err)
	}

	return nil
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
