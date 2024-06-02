package storage

import (
	"database/sql"
	"errors"
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
		return 0, errors.New("пользователь с таким логином уже существует")
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

func (ur *UserRepository) GetById(id int64) (*model.User, error) {
	sqlRow := "SELECT * FROM users where id = $1"

	row := ur.db.QueryRow(sqlRow, id)
	var user model.User
	err := row.Scan(&user.Id, &user.Login, &user.Password)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (ur *UserRepository) UpdatePassword(userId int64, newPassword string) error {
	row := ur.db.QueryRow("UPDATE users SET password = $1 WHERE id = $2", newPassword, userId)
	if row.Err() != nil {
		fmt.Println(row.Err())
		return errors.New("не верный пароль")
	}

	return nil
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{
		db: db,
	}
}
