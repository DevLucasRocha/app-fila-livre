package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql" //driver do MySQL
)

func main() {
	// FIXME: Externalizar credenciais para variáveis de ambiente (.env) antes do deploy em produção.
	// O formato no MySQL é: usuario:senha@tcp(host:porta)/banco?opcoes
	connStr := "admin:admin@tcp(127.0.0.1:3306)/fila_livre?parseTime=true"

	db, err := sql.Open("mysql", connStr)
	if err != nil {
		log.Fatalf("falha ao inicializar a configuração do banco de dados: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("falha ao estabelecer conexao com o banco de dados: %v", err)
	}
	fmt.Println("Conexão com o banco de dados 'fila_livre' estabelecida com sucesso via MySQL.")

	http.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "API do Fila Livre operando normalmente com MySQL.")
	})

	fmt.Println("Servidor inicializado e escutando na porta 8080.")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("erro critico na execucao do servidor web: %v", err)
	}
}
