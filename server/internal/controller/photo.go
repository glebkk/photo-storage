package controller

import (
	"fmt"
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/glebkk/photo-storage/server/internal/config"
	"github.com/glebkk/photo-storage/server/internal/model"
	"github.com/glebkk/photo-storage/server/internal/service"
	"github.com/google/uuid"

	"github.com/golang-jwt/jwt/v5"
)

type PhotoController struct {
	photoService *service.PhotoService
	cfg          config.Config
}

func (pc *PhotoController) UploadPhoto(c *gin.Context) {
	var req model.PhotoUploadRequest
	if err := c.ShouldBind(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "Файл или название не переданны",
		})
		return
	}
	fmt.Println(req)
	// return

	claimsInterface, ok := c.Get("x-user-claims")
	if !ok {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	// Type-assert the claims to the jwtClaims type
	claimsObj, ok := claimsInterface.(jwt.MapClaims)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Что-то пошло не так",
		})
		return
	}

	userId := int64(claimsObj["id"].(float64))
	// The file cannot be received.

	// Retrieve file information
	extension := filepath.Ext(req.File.Filename)
	// Generate random file name for the new uploaded file so it doesn't override the old file with same name
	newFileName := uuid.New().String() + extension

	// The file is received, so let's save it
	if err := c.SaveUploadedFile(req.File, fmt.Sprintf("%s%d%s%s", pc.cfg.PhotosPath, userId, "/", newFileName)); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "Не удалось сохранить файл",
		})
		return
	}

	var photoCreate model.PhotoCreate
	photoCreate.Name = req.Name
	photoCreate.FilePath = newFileName
	photoCreate.UserId = userId
	photoId, err := pc.photoService.Create(photoCreate)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}
	// File saved successfully. Return proper result
	c.JSON(http.StatusOK, model.PhotoUploadResponse{
		Photo: model.Photo{
			ID:       photoId,
			Name:     photoCreate.Name,
			FilePath: photoCreate.FilePath,
			UserId:   userId,
		},
	},
	)
}

func (pc *PhotoController) GetAll(c *gin.Context) {
	claimsInterface, ok := c.Get("x-user-claims")
	if !ok {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	// Type-assert the claims to the jwtClaims type
	claimsObj, ok := claimsInterface.(jwt.MapClaims)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Что-то пошло не так",
		})
		return
	}

	userId := int64(claimsObj["id"].(float64))

	photos, err := pc.photoService.GetAll(userId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "Не удалось получить фотографии",
		})
		return
	}

	c.JSON(http.StatusOK, photos)
}

func (pc *PhotoController) Delete(c *gin.Context) {
	name := c.Query("name")
	if name == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "Введите имя",
		})
	}

	claimsInterface, ok := c.Get("x-user-claims")
	if !ok {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	// Type-assert the claims to the jwtClaims type
	claimsObj, ok := claimsInterface.(jwt.MapClaims)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Что-то пошло не так",
		})
		return
	}

	userId := int64(claimsObj["id"].(float64))

	err := pc.photoService.Delete(name, userId)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "Неверное имя",
		})
	}

	c.Status(http.StatusNoContent)

}

func NewPhotoController(photoService *service.PhotoService, cfg config.Config) *PhotoController {
	return &PhotoController{
		photoService: photoService,
		cfg:          cfg,
	}
}
