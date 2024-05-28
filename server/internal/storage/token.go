package storage

import (
	"database/sql"

	"github.com/glebkk/photo-storage/server/internal/model"
)

type TokenRepository struct {
	db *sql.DB
}

func (tr *TokenRepository) Create(token model.Token) error {
	err := tr.db.QueryRow("INSERT INTO tokens(user_id, refresh_token) VALUES($1, $2)", token.UserId, token.RefreshToken)
	if err != nil {
		return err.Err()
	}

	return nil
}

func (tr *TokenRepository) SaveToken(id int64, token string) error {
	// Update exist
	stmt, err := tr.db.Prepare("UPDATE tokens SET refresh_token = $1 WHERE user_id = $2")
	if err != nil {
		return err
	}
	defer stmt.Close()

	result, err := stmt.Exec(token, id)
	if err != nil {
		return err
	}

	// Create if not exists
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected > 0 {
		return nil
	}

	insertStmt, err := tr.db.Prepare("INSERT INTO tokens (refresh_token, user_id) VALUES ($1, $2)")
	if err != nil {
		return err
	}
	defer insertStmt.Close()

	_, err = insertStmt.Exec(token, id)
	if err != nil {
		return err
	}

	return nil
}

func (tr *TokenRepository) RemoveByToken(token string) error {
	err := tr.db.QueryRow("DELETE FROM tokens WHERE refresh_token = $1", token)
	if err != nil {
		return err.Err()
	}

	return nil
}

func NewTokenRepository(db *sql.DB) *TokenRepository {
	return &TokenRepository{
		db: db,
	}
}
