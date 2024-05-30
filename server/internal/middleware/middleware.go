package middleware

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/glebkk/photo-storage/server/internal/service"
)

func JwtAuthMiddleware(secret string, tokenService *service.TokenService) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.Request.Header.Get("Authorization")
		fmt.Println(authHeader)
		token := strings.Split(authHeader, " ")
		fmt.Println(token, len(token))
		if len(token) != 2 {
			c.JSON(http.StatusUnauthorized, gin.H{})
			c.Abort()
			return
		}
		authToken := token[1]
		claims, err := tokenService.ValidateToken(authToken, secret)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{})
			c.Abort()
			return
		}
		fmt.Println(claims)
		c.Set("x-user-claims", claims)
		c.Next()
	}
}
