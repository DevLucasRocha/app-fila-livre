package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/DevLucasRocha/app-fila-livre/backend/internal/handlers"
	"github.com/DevLucasRocha/app-fila-livre/backend/internal/repositories"
	"github.com/DevLucasRocha/app-fila-livre/backend/internal/services"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	// define a string de conexão para o meu container MySQL
	connStr := "admin:admin@tcp(127.0.0.1:3306)/fila_livre?parseTime=true"

	db, err := sql.Open("mysql", connStr)
	if err != nil {
		log.Fatalf("Eu falhei ao configurar o banco: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("Eu não consegui conectar ao MySQL: %v", err)
	}
	fmt.Println("Conexão estabelecida com sucesso via MySQL.")

	// define as camadas seguindo a ordem de dependência
	repo := repositories.NewPlaceRepository(db)
	service := services.NewPlaceService(repo)
	handler := handlers.NewPlaceHandler(service)

	// define as rotas da minha API
	http.HandleFunc("/api/v1/places", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			handler.GetPlaces(w, r)
		} else if r.Method == http.MethodPost {
			handler.CreatePlace(w, r)
		}
	})

	fmt.Println("Servidor inicializado e escutando na porta 8080.")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Eu encontrei um erro crítico no servidor: %v", err)
	}
}
