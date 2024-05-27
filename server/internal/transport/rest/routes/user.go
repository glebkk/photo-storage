package routes

import (
	"github.com/gin-gonic/gin"
)

type UserController interface {
	Create(c *gin.Context)
}

func RegisterUserRoutes(rg *gin.RouterGroup, uc UserController) {
	product := rg.Group("/user")
	product.GET("/", uc.Create)
}
