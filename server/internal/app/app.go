package app

import (
	"database/sql"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/glebkk/photo-storage/server/internal/config"
	"github.com/glebkk/photo-storage/server/internal/controller"
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

	userRepo := storage.NewUserRepository(a.db)
	authService := service.NewAuthService(userRepo)
	authController := controller.NewAuthController(authService)

	routes.RegisterAuthRoutes(&router.RouterGroup, authController)
	routes.RegisterPingRoutes(&router.RouterGroup)
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
