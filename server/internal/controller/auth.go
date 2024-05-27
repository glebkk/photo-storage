package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/glebkk/photo-storage/server/internal/model"
)

type AuthService interface {
	Register(user model.RegisterRequest) error
	Login(logReq model.LoginRequest) (*model.LoginResponse, error)
}

type AuthController struct {
	service AuthService
}

func (ac *AuthController) Register(c *gin.Context) {
	var user model.RegisterRequest
	err := c.ShouldBindBodyWithJSON(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, "not valid json")
		return
	}

	err = ac.service.Register(user)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{})
}

func (ac *AuthController) Login(c *gin.Context) {
	logReq := model.LoginRequest{}
	if err := c.ShouldBindBodyWithJSON(&logReq); err != nil {
		c.JSON(http.StatusInternalServerError, "not valid json")
		return
	}

	logRes, err := ac.service.Login(logReq)
	if err != nil {
		fmt.Print(err)
		c.JSON(http.StatusForbidden, err.Error())
		return
	}

	c.JSON(http.StatusOK, logRes)
}

func NewAuthController(service AuthService) *AuthController {
	return &AuthController{
		service: service,
	}
}
