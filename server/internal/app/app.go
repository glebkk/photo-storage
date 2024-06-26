package app

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/glebkk/photo-storage/server/internal/config"
	"github.com/glebkk/photo-storage/server/internal/controller"
	"github.com/glebkk/photo-storage/server/internal/middleware"
	"github.com/glebkk/photo-storage/server/internal/service"
	"github.com/glebkk/photo-storage/server/internal/storage"
	"github.com/glebkk/photo-storage/server/internal/transport/rest/routes"
)

type App struct {
	cfg *config.Config
	db  *sql.DB
}

func (a *App) Run() {
	fmt.Println(a.cfg.PhotosPath)

	var router = gin.Default()

	router.Static("/public", "./photos")
	myCors := cors.DefaultConfig()
	myCors.AllowOrigins = []string{"http://localhost:5173", "http://localhost:5173/", "https://photo-storage-nyea.vercel.app/", "https://photo-storage-nyea.vercel.app"}
	myCors.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	myCors.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	myCors.AllowCredentials = true
	router.Use(cors.New(myCors))

	privateRoutes := router.Group("/")

	//init repos
	userRepo := storage.NewUserRepository(a.db)
	tokenRepo := storage.NewTokenRepository(a.db)
	photoRepo := storage.NewPhotoRepository(a.db)
	albumRepo := storage.NewAlbumRepository(a.db)

	//init services
	tokenService := service.NewTokenService(tokenRepo, userRepo, *a.cfg)
	authService := service.NewAuthService(userRepo, *tokenService)
	photoService := service.NewPhotoService(photoRepo)
	userService := service.NewUserService(userRepo)
	albumService := service.NewAlbumService(albumRepo)
	//init middlewares
	privateRoutes.Use(middleware.JwtAuthMiddleware(a.cfg.JwtConfig.AccessSecret, tokenService))

	//init controllers
	authController := controller.NewAuthController(authService)
	photoController := controller.NewPhotoController(photoService, *a.cfg)
	userController := controller.NewUserController(userService)
	albumController := controller.NewAlbumController(albumService)

	//init routes
	routes.RegisterAuthRoutes(&router.RouterGroup, authController)
	routes.RegisterPingRoutes(&router.RouterGroup)

	routes.RegisterUserRoutes(privateRoutes, userController)
	routes.RegisterPhotoRoutes(privateRoutes, photoController)
	routes.RegisterAlbumRoutes(privateRoutes, albumController)

	//run server
	port := os.Getenv("PORT")
	if err := router.Run(a.cfg.HTTP.Address + ":" + port); err != nil {
		fmt.Println("Error starting server on host", a.cfg.HTTP.Address)
	}
}

func NewApp(cfg *config.Config, db *sql.DB) *App {
	return &App{
		cfg: cfg,
		db:  db,
	}
}
