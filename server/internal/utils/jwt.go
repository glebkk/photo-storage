package utils

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func GetJWTClaims(c *gin.Context) (jwt.MapClaims, bool) {
	claimsInterface, ok := c.Get("x-user-claims")
	if !ok {
		return nil, false
	}

	// Type-assert the claims to the jwt.MapClaims type
	claimsObj, ok := claimsInterface.(jwt.MapClaims)
	if !ok {
		return nil, false
	}

	return claimsObj, true
}
