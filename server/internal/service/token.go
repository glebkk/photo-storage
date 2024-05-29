package service

import (
	"fmt"
	"time"

	"github.com/glebkk/photo-storage/server/internal/config"
	jwt "github.com/golang-jwt/jwt/v5"
)

type TokenRepository interface {
	SaveToken(id int64, token string) error
	RemoveByToken(token string) error
}

type TokenService struct {
	tokenRepo TokenRepository
	cfg       config.Config
}

type TokenPayload struct {
	login string
}

func (ts *TokenService) GenerateTokens(payload TokenPayload) (string, string, error) {

	access_token := jwt.NewWithClaims(jwt.SigningMethodHS512,
		jwt.MapClaims{
			"login": payload.login,
			"exp":   time.Now().Add(ts.cfg.AccessExpire).Unix(),
		},
	)
	refresh_token := jwt.NewWithClaims(jwt.SigningMethodHS512,
		jwt.MapClaims{
			"login": payload.login,
			"exp":   time.Now().Add(ts.cfg.RefreshExpire).Unix(),
		},
	)
	access_jwt, err := access_token.SignedString([]byte(ts.cfg.AccessSecret))
	if err != nil {
		return "", "", fmt.Errorf("error create access_jwt %w: ", err)
	}
	refresh_jwt, err := refresh_token.SignedString([]byte(ts.cfg.RefreshSecret))
	if err != nil {
		return "", "", fmt.Errorf("error create refresh_jwt %w: ", err)
	}
	return access_jwt, refresh_jwt, nil
}

func (ts *TokenService) SaveToken(user_id int64, refresh_token string) {
	ts.tokenRepo.SaveToken(user_id, refresh_token)
}

func (ts *TokenService) RemoveToken(refreshToken string) error {
	err := ts.tokenRepo.RemoveByToken(refreshToken)
	if err != nil {
		return err
	}

	return nil
}

func (ts *TokenService) ValidateToken(t string, secret_key string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(t, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			fmt.Println(ok, token.Header["alg"])
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secret_key), nil
	})

	if err != nil {
		fmt.Println("tokens_service validate_token: ", err)
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		fmt.Println("tokens_service claims: ", err)
		return nil, fmt.Errorf("Not valid token")
	}

	return claims, nil
}

func NewTokenService(tokenRepo TokenRepository, config config.Config) *TokenService {
	return &TokenService{
		tokenRepo: tokenRepo,
		cfg:       config,
	}
}
