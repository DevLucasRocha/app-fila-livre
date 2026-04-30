# 🧍 APP FILA LIVRE

O **Fila Livre** é uma solução mobile-first orientada a crowdsourcing que ajuda as pessoas a decidirem o melhor horário para ir a locais com histórico de filas (hospitais, lotéricas, serviços públicos), utilizando heurísticas e contribuição simples de usuários.

## 🚀 Arquitetura do Projeto (Monorepo)

O repositório está estruturado em um formato Monorepo para facilitar o versionamento e a manutenção contínua:

*   `/backend`: API REST de alta performance desenvolvida em **Go (Golang)**.
*   `/database`: Scripts DDL e modelagem física utilizando **MySQL**.
*   `/frontend`: (Em breve) Aplicação web em **React**.

## 🛠️ Stack Tecnológica

*   **Linguagem:** Go 1.22+
*   **Banco de Dados:** MySQL 8.0 (Containerizado via Docker)
*   **Arquitetura:** Camadas (Handler, Service, Repository)

## ⚙️ Como executar localmente

1. Suba o banco de dados via Docker:
   `docker run --name fila-livre-mysql -e MYSQL_ROOT_PASSWORD=admin -e MYSQL_DATABASE=fila_livre -e MYSQL_USER=admin -e MYSQL_PASSWORD=admin -p 3306:3306 -d mysql:8.0`
2. Injete as tabelas na base:
   `Get-Content database\init.sql | docker exec -i fila-livre-mysql mysql -u admin -padmin fila_livre`
3. Entre na pasta do backend e rode a aplicação:
   `cd backend`
   `go run cmd/api/main.go`