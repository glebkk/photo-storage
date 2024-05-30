package service

import (
	"errors"
	"fmt"

	"github.com/glebkk/photo-storage/server/internal/model"
	"golang.org/x/crypto/bcrypt"
)

var (
	errBadCredentials = errors.New("email or password is incorrect")
)

type UserRepository interface {
	Create(user model.RegisterRequest) (int64, error)
	GetByLogin(login string) (*model.User, error)
}

type AuthService struct {
	userRepo     UserRepository
	tokenService TokenService
}

func (as *AuthService) Register(user model.RegisterRequest) (*model.AuthResponse, error) {
	hashPass, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)

	if err != nil {
		return nil, err
	}

	user.Password = string(hashPass)
	id, err := as.userRepo.Create(user)

	if err != nil {
		return nil, err
	}

	access_token, refresh_token, err := as.tokenService.GenerateTokens(TokenPayload{id: id, login: user.Login})
	if err != nil {
		return nil, err
	}

	as.tokenService.SaveToken(id, refresh_token)

	return &model.AuthResponse{
		RefreshToken: refresh_token,
		AccessToken:  access_token,
		User: model.ProfileResponse{
			Id:    id,
			Login: user.Login,
		},
	}, nil
}

func (as *AuthService) Login(logReq model.LoginRequest) (*model.AuthResponse, error) {
	user, err := as.userRepo.GetByLogin(logReq.Login)

	if err != nil {
		return nil, errBadCredentials
	}

	if err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(logReq.Password)); err != nil {
		return nil, errBadCredentials
	}

	access_token, refresh_token, err := as.tokenService.GenerateTokens(TokenPayload{id: user.Id, login: user.Login})
	if err != nil {
		return nil, err
	}

	as.tokenService.SaveToken(user.Id, refresh_token)

	return &model.AuthResponse{
		RefreshToken: refresh_token,
		AccessToken:  access_token,
		User: model.ProfileResponse{
			Id:    user.Id,
			Login: user.Login,
		},
	}, nil
}

func (as *AuthService) Logout(refreshToken string) error {
	err := as.tokenService.RemoveToken(refreshToken)
	if err != nil {
		return err
	}

	return nil
}

func (as *AuthService) RefreshToken(refreshToken string) (*model.AuthResponse, error) {
	claims, err := as.tokenService.ValidateToken(refreshToken, as.tokenService.cfg.JwtConfig.RefreshSecret)
	if err != nil {
		fmt.Println("auth-service validatetoken: ", err)
		return nil, err
	}
	user, err := as.userRepo.GetByLogin(claims["login"].(string))
	if err != nil {
		fmt.Println("auth-service no user: ", err)
		return nil, err
	}
	access_token, refresh_token, err := as.tokenService.GenerateTokens(TokenPayload{id: int64(claims["id"].(float64)), login: claims["login"].(string)})

	if err != nil {
		fmt.Println("auth-service gen token: ", err)
		return nil, err
	}

	as.tokenService.SaveToken(user.Id, refresh_token)

	return &model.AuthResponse{
		RefreshToken: refresh_token,
		AccessToken:  access_token,
		User: model.ProfileResponse{
			Id:    user.Id,
			Login: user.Login,
		},
	}, nil
}

func NewAuthService(userRepo UserRepository, tokenService TokenService) *AuthService {
	return &AuthService{
		userRepo:     userRepo,
		tokenService: tokenService,
	}
}
