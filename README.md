# Fila Livre

### Monitoramento Inteligente de Filas em Tempo Real

<p align="center">

![Go](https://img.shields.io/badge/Backend-Go-00ADD8?style=for-the-badge\&logo=go)
![React](https://img.shields.io/badge/Frontend-React-20232A?style=for-the-badge\&logo=react)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge\&logo=vite)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge\&logo=mysql)


![Docker](https://img.shields.io/badge/Container-Docker-2496ED?style=for-the-badge\&logo=docker)
![Status](https://img.shields.io/badge/status-em%20deploy-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

</p>

---

## 💡 Proposta

Diariamente, milhares de pessoas perdem horas em filas por não saberem o melhor horário para ir a um local.

O **Fila Livre** resolve esse problema combinando:

* 🧠 **Inteligência Coletiva** → usuários reportam o status em tempo real
* 📊 **Heurística Preditiva** → o sistema estima a lotação quando não há usuários ativos

Mesmo sem dados recentes, o sistema calcula automaticamente a ocupação com base no histórico e horário atual.

---

## 🚀 Principais Features

### 🔮 Heurística Preditiva (Predictive Fallback)

* Estima a lotação (*Cheia, Moderada, Vazia*)
* Baseada em horários de pico + tempo atual

### ⏳ TTL de 5 Minutos

* Relatos expiram automaticamente
* Evita dados desatualizados ou manipulados

### 📅 Regras Dinâmicas de Expediente

* Detecta dias e horários automaticamente
* Exemplo: locais fechados fora do horário comercial

### 🧱 Clean Architecture

```
Handlers → Services → Repositories
```

---

## 🏗️ Estrutura do Projeto

```
app-fila-livre/
├── backend/    # API REST em Golang
├── frontend/   # SPA em React + Vite
└── database/   # Scripts SQL (MySQL)
```

---

## 🛠️ Stack Tecnológica

**Backend**

* Golang
* go-sql-driver/mysql

**Banco de Dados**

* MySQL 8.0

**Frontend**

* React
* Vite
* Axios
* React Router DOM

**UI/UX**

* Componentização
* Dark/Light Mode
* Lucide Icons

---

## 🐳 Como Executar Localmente

### 1. Banco de Dados (Docker)

```bash
docker run --name fila-livre-mysql \
  -e MYSQL_ROOT_PASSWORD=admin \
  -e MYSQL_DATABASE=fila_livre \
  -p 3306:3306 \
  -d mysql:8.0

Get-Content database\init.sql | docker exec -i fila-livre-mysql mysql -u root -padmin fila_livre
```

---

### 2. Backend

```bash
cd backend
go run cmd/api/main.go
```

📍 [http://localhost:8080/api/v1](http://localhost:8080/api/v1)

---

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

📍 [http://localhost:5173](http://localhost:5173)

---

## 📡 API Endpoints

### Locais

* `GET /places` → Lista locais com status (real ou estimado)
* `POST /places` → Cria novo local

### Relatos

* `GET /reports?place_id={id}` → Histórico
* `POST /reports` → Novo relato

---

## ⚙️ Variáveis de Ambiente

| Variável | Padrão     |
| -------- | ---------- |
| DB_USER  | root       |
| DB_PASS  | admin      |
| DB_HOST  | 127.0.0.1  |
| DB_PORT  | 3306       |
| DB_NAME  | fila_livre |

---

## 📌 Observações

* Funciona sem configuração extra (modo local)
* Em produção, usar variáveis de ambiente
* Arquitetura pronta para escalar

---

## 🧠 Objetivo

Projeto desenvolvido com foco em:

* Integridade de dados
* Performance
* Utilidade pública
