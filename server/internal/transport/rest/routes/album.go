package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/glebkk/photo-storage/server/internal/controller"
)

func RegisterAlbumRoutes(rg *gin.RouterGroup, ac *controller.AlbumController) {
	album := rg.Group("/album")
	album.GET("/", ac.GetAlbums)
	album.POST("/", ac.CreateAlbum)
	album.DELETE("/", ac.DeleteAlbum)
	album.DELETE("/photo", ac.DeletePhoto)
	album.POST("/photo", ac.UploadPhotoToAlbum)
}
