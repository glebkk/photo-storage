package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/glebkk/photo-storage/server/internal/model"
	"github.com/golang-jwt/jwt/v5"
)

type UserService interface {
	UpdatePassword(userId int64, oldPassword string, newPassword string) error
}

type UserController struct {
	userService UserService
}

func (us *UserController) UpdatePassword(c *gin.Context) {
	claimsInterface, ok := c.Get("x-user-claims")
	if !ok {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	// Type-assert the claims to the jwtClaims type
	claimsObj, ok := claimsInterface.(jwt.MapClaims)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Что-то пошло не так",
		})
		return
	}
	userId := int64(claimsObj["id"].(float64))

	req := model.UpdatePasswordRequest{}
	if err := c.ShouldBindBodyWithJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Не все поля заданы или неверный json",
		})
		return
	}

	err := us.userService.UpdatePassword(userId, req.OldPassword, req.NewPassword)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Пароль успешно обновлен",
	})
}

func NewUserController(userService UserService) *UserController {
	return &UserController{
		userService: userService,
	}
}
