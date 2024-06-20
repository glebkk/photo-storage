package controller

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/glebkk/photo-storage/server/internal/model"
	"github.com/glebkk/photo-storage/server/internal/service"
	"github.com/glebkk/photo-storage/server/internal/utils"
)

type AlbumController struct {
	albumService service.AlbumService
}

func NewAlbumController(albumService *service.AlbumService) *AlbumController {
	return &AlbumController{
		albumService: *albumService,
	}
}

func (ac *AlbumController) GetAlbums(c *gin.Context) {
	claims, ok := utils.GetJWTClaims(c)
	if !ok {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	userId := int64(claims["id"].(float64))

	albums, err := ac.albumService.GetAlbums(userId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusOK, albums)
}

func (ac *AlbumController) CreateAlbum(c *gin.Context) {
	claims, ok := utils.GetJWTClaims(c)
	if !ok {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	var albumCreate model.AlbumCreate

	if err := c.ShouldBindBodyWithJSON(&albumCreate); err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	userId := int64(claims["id"].(float64))

	id, err := ac.albumService.CreateAlbum(model.Album{
		UserId: userId,
		Name:   albumCreate.Name,
	})

	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	c.JSON(http.StatusOK, model.AlbumResponse{ID: id, UserId: userId, Name: albumCreate.Name})

}

func (ac *AlbumController) DeletePhoto(c *gin.Context) {
	photoId, err := strconv.ParseInt(c.Query("photoId"), 10, 64)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "Введите имя",
		})
	}

	albumId, err := strconv.ParseInt(c.Query("albumId"), 10, 64)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "Введите имя",
		})
	}

	err = ac.albumService.DeletePhotoFromAlbum(&model.PhotoAlbum{
		AlbumId: albumId,
		PhotoId: photoId,
	})

	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
	}

	c.Status(http.StatusNoContent)
}

func (ac *AlbumController) UploadPhotoToAlbum(c *gin.Context) {
	claims, ok := utils.GetJWTClaims(c)
	if !ok {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	userId := int64(claims["id"].(float64))

	var photoAlbum model.PhotoAlbum

	if err := c.ShouldBindBodyWithJSON(&photoAlbum); err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	err := ac.albumService.UploadPhotoToAlbum(userId, &photoAlbum)
	fmt.Println(err)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.Status(http.StatusCreated)
}

func (ac *AlbumController) DeleteAlbum(c *gin.Context) {
	id := c.Query("id")
	albumId, err := strconv.ParseInt(id, 10, 64)
	if id == "" || err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "Введите корректно id:(integer)",
		})
	}

	claims, ok := utils.GetJWTClaims(c)
	if !ok {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	userId := int64(claims["id"].(float64))
	err = ac.albumService.DeleteAlbum(userId, albumId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusForbidden, err.Error())
		return
	}

	c.Status(http.StatusNoContent)
}
