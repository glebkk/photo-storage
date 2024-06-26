package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RegisterPingRoutes(rg *gin.RouterGroup) {
	ping := rg.Group("/ping")

	ping.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, "pong")
	})
}
