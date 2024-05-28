package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/glebkk/photo-storage/server/internal/model"
)

type AuthService interface {
	Register(user model.RegisterRequest) (*model.AuthResponse, error)
	Login(logReq model.LoginRequest) (*model.AuthResponse, error)
	Logout(refreshToken string) error
	RefreshToken(token string) (*model.AuthResponse, error)
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

	authRes, err := ac.service.Register(user)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, err)
		return
	}
	c.SetCookie("refresh_token", authRes.RefreshToken, 30*24*60*60*1000, "/", "localhost", true, true)

	c.JSON(http.StatusOK, authRes)
}

func (ac *AuthController) Login(c *gin.Context) {
	logReq := model.LoginRequest{}
	if err := c.ShouldBindBodyWithJSON(&logReq); err != nil {
		c.JSON(http.StatusInternalServerError, "not valid json")
		return
	}

	authRes, err := ac.service.Login(logReq)
	if err != nil {
		fmt.Print(err)
		c.JSON(http.StatusForbidden, err.Error())
		return
	}
	c.SetCookie("refresh_token", authRes.RefreshToken, 30*24*60*60*1000, "/", "localhost", true, true)

	c.JSON(http.StatusOK, authRes)
}

func (ac *AuthController) Logout(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, "")
		return
	}

	err = ac.service.Logout(refreshToken)

	if err != nil {
		c.JSON(http.StatusUnauthorized, "")
		return
	}

	c.SetCookie("refresh_token", "", -1, "/", "localhost", false, true)
	c.JSON(http.StatusOK, "")

}

func (ac *AuthController) Refresh(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, "")
		return
	}

	authResp, err := ac.service.RefreshToken(refreshToken)

	if err != nil {
		c.JSON(http.StatusUnauthorized, "")
		return
	}

	c.SetCookie("refresh_token", authResp.RefreshToken, 30*24*60*60*1000, "/", "localhost", false, true)
	c.JSON(http.StatusOK, authResp)
}

func NewAuthController(service AuthService) *AuthController {
	return &AuthController{
		service: service,
	}
}
