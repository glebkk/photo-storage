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
	var router = gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"*"},
		AllowCredentials: true,
		AllowHeaders:     []string{"*"},
	}))

	privateRoutes := router.Group("/")

	//init repos
	userRepo := storage.NewUserRepository(a.db)
	tokenRepo := storage.NewTokenRepository(a.db)

	//init services
	tokenService := service.NewTokenService(tokenRepo)
	authService := service.NewAuthService(userRepo, *tokenService)

	//init middlewares
	privateRoutes.Use(middleware.JwtAuthMiddleware(os.Getenv("JWT_SECRET"), tokenService))

	//init controllers
	authController := controller.NewAuthController(authService)

	//init routes
	routes.RegisterAuthRoutes(&router.RouterGroup, authController)
	routes.RegisterPingRoutes(&router.RouterGroup)

	routes.RegisterUserRoutes(privateRoutes)

	//run server
	if err := router.Run(a.cfg.HTTP.Address); err != nil {
		fmt.Println("Error starting server on host", a.cfg.HTTP.Address)
	}
}

func NewApp(cfg *config.Config, db *sql.DB) *App {
	return &App{
		cfg: cfg,
		db:  db,
	}
}
