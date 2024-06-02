package routes

import (
	"github.com/gin-gonic/gin"
)

type UserController interface {
	UpdatePassword(c *gin.Context)
}

func RegisterUserRoutes(rg *gin.RouterGroup, userController UserController) {
	user := rg.Group("/user")

	user.PUT("/password", userController.UpdatePassword)
}
