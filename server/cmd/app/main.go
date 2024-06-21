package main

import (
	"database/sql"
	"fmt"
	"os"
	"strconv"

	"github.com/glebkk/photo-storage/server/internal/app"
	"github.com/glebkk/photo-storage/server/internal/config"
	_ "github.com/lib/pq"
)

func main() {
	cfg := config.MustLoad()
	fmt.Println(cfg)
	fmt.Println(cfg.DataBase.Password)
	host := os.Getenv("DB_HOST")
	dbName := os.Getenv("DB_NAME")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbPort, _ := strconv.Atoi(os.Getenv("DB_PORT"))
	dbUser := os.Getenv("DB_USER")
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=require",
		host, dbPort, dbUser, dbPassword, dbName)

	fmt.Println(dbName, dbPassword, dbPort, dbUser, host)
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
