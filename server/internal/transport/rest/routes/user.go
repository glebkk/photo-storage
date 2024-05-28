package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/glebkk/photo-storage/server/internal/model"
	"github.com/golang-jwt/jwt/v5"
)

type UserController interface {
	Create(c *gin.Context)
}

func RegisterUserRoutes(rg *gin.RouterGroup) {
	product := rg.Group("/user")
	product.GET("/", func(ctx *gin.Context) {
		claimsInterface, ok := ctx.Get("x-user-claims")
		if !ok {
			ctx.JSON(http.StatusUnauthorized, gin.H{})
			return
		}

		// Type-assert the claims to the jwtClaims type
		claimsObj, ok := claimsInterface.(jwt.MapClaims)
		if !ok {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "unable to parse user claims",
			})
			return
		}

		ctx.JSON(http.StatusOK, model.ProfileResponse{
			Login: claimsObj["login"].(string),
		})
	})
}
