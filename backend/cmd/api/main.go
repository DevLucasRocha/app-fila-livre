package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/DevLucasRocha/app-fila-livre/backend/internal/handlers"
	"github.com/DevLucasRocha/app-fila-livre/backend/internal/repositories"
	"github.com/DevLucasRocha/app-fila-livre/backend/internal/services"
	_ "github.com/go-sql-driver/mysql"
)

// Permitir CORS nas rotas
func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Definir cabeçalhos mínimos para CORS
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept")
		w.Header().Set("Access-Control-Allow-Credentials", "false")

		// Responder preflight (OPTIONS) imediatamente
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

func main() {
	// Configura a conexão com o banco de dados usando variáveis de ambiente com fallback.
	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "root"
	}
	dbPass := os.Getenv("DB_PASS")
	if dbPass == "" {
		dbPass = "admin"
	}
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "127.0.0.1"
	}
	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		dbPort = "3306"
	}
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "fila_livre"
	}

	connStr := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", dbUser, dbPass, dbHost, dbPort, dbName)

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

	// Inicializar serviços com os repositórios
	placeService := services.NewPlaceService(placeRepo)
	reportService := services.NewReportService(reportRepo)

	// Inicializa os Handlers (rotas HTTP)
	placeHandler := handlers.NewPlaceHandler(placeService)
	reportHandler := handlers.NewReportHandler(reportService)

	// Mapear rota /api/v1/places
	http.HandleFunc("/api/v1/places", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			// Retornar todos os locais
			placeHandler.GetAll(w, r)
		} else if r.Method == http.MethodPost {
			// Criar novo local
			placeHandler.Create(w, r)
		}
	}))

	// Mapeia a rota de relatos.
	http.HandleFunc("/api/v1/reports", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			reportHandler.GetReportsByPlace(w, r)
		} else if r.Method == http.MethodPost {
			reportHandler.CreateReport(w, r)
		}
	}))

	apiPort := os.Getenv("PORT")
	if apiPort == "" {
		apiPort = "8080" // Fallback para rodar localmente
	}

	fmt.Printf("Servidor inicializado e escutando na porta %s.\n", apiPort)
	if err := http.ListenAndServe(":"+apiPort, nil); err != nil {
		log.Fatalf("Erro crítico no servidor: %v", err)
	}
}
