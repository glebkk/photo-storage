package routes

import "github.com/gin-gonic/gin"

type PhotoController interface {
	UploadPhoto(c *gin.Context)
	GetAll(c *gin.Context)
	Delete(c *gin.Context)
}

func RegisterPhotoRoutes(rg *gin.RouterGroup, pc PhotoController) {
	photo := rg.Group("/photo")
	photo.POST("/", pc.UploadPhoto)
	photo.GET("/", pc.GetAll)
	photo.DELETE("/", pc.Delete)
}
