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
	// Configura a conexão com o banco de dados.
	connStr := "admin:admin@tcp(127.0.0.1:3306)/fila_livre?parseTime=true"

	db, err := sql.Open("mysql", connStr)
	if err != nil {
		log.Fatalf("Falha ao configurar o banco: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("Não foi possível conectar ao MySQL: %v", err)
	}
	fmt.Println("Conexão estabelecida com sucesso via MySQL.")

	// Inicializa primeiro os Repositórios (acesso ao banco)
	placeRepo := repositories.NewPlaceRepository(db)
	reportRepo := repositories.NewReportRepository(db)

	// Inicializa os Serviços injetando os Repositórios correspondentes
	placeService := services.NewPlaceService(placeRepo, reportRepo)
	reportService := services.NewReportService(reportRepo)

	// Inicializa os Handlers (rotas HTTP)
	placeHandler := handlers.NewPlaceHandler(placeService)
	reportHandler := handlers.NewReportHandler(reportService)

	// Mapeia a rota de locais.
	http.HandleFunc("/api/v1/places", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			placeHandler.GetPlaces(w, r)
		} else if r.Method == http.MethodPost {
			placeHandler.CreatePlace(w, r)
		}
	})

	// Mapeia a rota de relatos.
	http.HandleFunc("/api/v1/reports", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			reportHandler.GetReportsByPlace(w, r)
		} else if r.Method == http.MethodPost {
			reportHandler.CreateReport(w, r)
		}
	})

	fmt.Println("Servidor inicializado e escutando na porta 8080.")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Erro crítico no servidor: %v", err)
	}
}
