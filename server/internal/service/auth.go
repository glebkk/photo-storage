package service

import (
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/glebkk/photo-storage/server/internal/model"
	jwt "github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var (
	errBadCredentials = errors.New("email or password is incorrect")
)

type UserRepository interface {
	Create(user model.RegisterRequest) error
	GetByLogin(login string) (*model.User, error)
}

type AuthService struct {
	userRepo UserRepository
}

func (as *AuthService) Register(user model.RegisterRequest) error {
	hashPass, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)

	if err != nil {
		return fmt.Errorf("hash pasw err: %w", err)
	}

	user.Password = string(hashPass)
	err = as.userRepo.Create(user)

	if err != nil {
		return fmt.Errorf("db create err: %w", err)
	}

	return nil
}

func (as *AuthService) Login(logReq model.LoginRequest) (*model.LoginResponse, error) {
	user, err := as.userRepo.GetByLogin(logReq.Login)

	fmt.Println("user from db: ", user)

	if err != nil {
		return nil, errBadCredentials
	}

	if err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(logReq.Password)); err != nil {
		return nil, errBadCredentials
	}

	payload := jwt.MapClaims{
		"sub": user.Login,
		"exp": time.Now().Add(time.Hour * 72).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, payload)

	fmt.Println(os.Getenv("JWT_SECRET"))

	t, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return nil, err
	}

	return &model.LoginResponse{AccessToken: t}, nil
}

func NewAuthService(userRepo UserRepository) *AuthService {
	return &AuthService{
		userRepo: userRepo,
	}
}
