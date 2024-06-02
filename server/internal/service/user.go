package service

import (
	"errors"
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	userRepo UserRepository
}

func (us *UserService) UpdatePassword(userId int64, oldPassword string, newPassword string) error {
	user, err := us.userRepo.GetById(userId)

	if err != nil {
		fmt.Println(err)
		return errors.New("неверный пароль")
	}

	if err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(oldPassword)); err != nil {
		fmt.Println(err)
		return errors.New("неверный пароль")
	}

	hashPass, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)

	if err != nil {
		return errors.New("не получилось хэшировать новый пароль")
	}

	err = us.userRepo.UpdatePassword(userId, string(hashPass))
	return err
}

func NewUserService(userRepo UserRepository) *UserService {
	return &UserService{
		userRepo: userRepo,
	}
}
