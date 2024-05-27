package main

import (
	"database/sql"
	"fmt"

	"github.com/glebkk/photo-storage/server/internal/app"
	"github.com/glebkk/photo-storage/server/internal/config"
	_ "github.com/lib/pq"
)

func main() {
	cfg := config.MustLoad()

	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		cfg.DataBase.Host, cfg.DataBase.Port, cfg.DataBase.User, cfg.DataBase.Password, cfg.DataBase.Name)

	db, err := sql.Open("postgres", psqlInfo)
	if err := db.Ping(); err != nil {
		fmt.Print("db connect err: ", err)
		return
	}

	if err != nil {
		fmt.Println("[-] DB Open error err", err)
		return
	}

	app := app.NewApp(cfg, db)

	app.Run()
}
