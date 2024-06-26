package routes

import "github.com/gin-gonic/gin"

type AuthController interface {
	Login(c *gin.Context)
	Register(c *gin.Context)
	Refresh(c *gin.Context)
	Logout(c *gin.Context)
}

func RegisterAuthRoutes(rg *gin.RouterGroup, uc AuthController) {
	auth := rg.Group("/auth")
	auth.POST("/login", uc.Login)
	auth.POST("/register", uc.Register)
	auth.GET("/refresh", uc.Refresh)
	auth.POST("/logout", uc.Logout)
}
