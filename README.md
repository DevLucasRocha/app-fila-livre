# Fila Livre | Monitoramento Inteligente de Fila em Tempo Real

O **Fila Livre** é uma plataforma Full-Stack de crowdsourcing projetada para acabar com a imprevisibilidade e a perda de tempo em filas de unidades de serviço (Hospitais, Lotéricas, UPAs, etc.).

## 💡 A Proposta
Diariamente, milhares de pessoas perdem horas preciosas em filas simplesmente por não saberem o melhor horário para visitar um estabelecimento. 

O Fila Livre resolve essa dor combinando **Inteligência Coletiva** (usuários reportando o status ao vivo) com **Heurística Preditiva**. Diferente de apps comuns que mostram telas vazias quando não há usuários ativos, o Fila Livre calcula uma estimativa de lotação cruzando o histórico de horários de pico do local com o relógio atual do sistema. Se não há relato humano, a inteligência do backend assume o controle.

## 🚀 Engenharia e Principais Features

- **Heurística Preditiva (Predictive Fallback):** Na ausência de dados recentes, a API em Go deduz a lotação ("Cheia", "Moderada", "Vazia") mapeando regras de horário do banco de dados e aplicando ao fuso horário real.
- **TTL (Time-To-Live) de 5 Minutos:** Para evitar dados defasados ou vandalismo (trolls travando um status o dia todo), os relatos manuais expiram no backend após 5 minutos, devolvendo o controle para a engine preditiva.
- **Regras Dinâmicas de Expediente:** O algoritmo detecta dias da semana e horários comerciais. Se for sábado à noite, uma Lotérica será automaticamente listada como "Fechada", bloqueando o cálculo de filas.
- **Clean Architecture:** Backend em Go desenhado em camadas rigorosas: `Handlers` (Rotas/HTTP) ➝ `Services` (Regras de Negócio/Horários) ➝ `Repositories` (Interação direta com o banco).

## 🏗️ Estrutura do Monorepo

O projeto está modularizado para escalar e facilitar deploys independentes:
app-fila-livre/
├── backend/    # Cérebro: API REST construída em Golang (Go 1.20+)
├── frontend/   # Interface: Single Page Application em React + Vite
└── database/   # Fundação: Scripts de criação e população inicial do MySQL

🛠️ Stack Tecnológico
Backend: Golang, go-sql-driver/mysql

Banco de Dados: MySQL 8.0 (UTF-8)

Frontend: React, Vite, Axios, React Router Dom

UI/UX: Estilização in-line orientada a componentes, paleta Tom sobre Tom e suporte nativo a Dark/Light Mode. Ícones via Lucide-React.

🐳 Como Executar Localmente (Ambiente de Desenvolvimento)
1. Banco de Dados (Docker)
Suba o contêiner do MySQL e injete as tabelas e dados iniciais:

Bash
# Sobe o banco na porta 3306
docker run --name fila-livre-mysql -e MYSQL_ROOT_PASSWORD=admin -e MYSQL_DATABASE=fila_livre -p 3306:3306 -d mysql:8.0

Get-Content database\init.sql | docker exec -i fila-livre-mysql mysql -u root -padmin fila_livre
2. Backend (Golang API)
Em um terminal, inicie o servidor Go:

Bash
cd backend
go run cmd/api/main.go
A API ficará disponível em http://localhost:8080/api/v1.

3. Frontend (React SPA)
Em outro terminal, instale as dependências e inicie a interface:

Bash
cd frontend
npm install
npm run dev
O aplicativo estará acessível em http://localhost:5173.

📡 Endpoints da API REST
GET /places — Lista os locais processados pelas regras de negócio (Retorna Status Real Humano ou Estimativa do Sistema).

POST /places — Criação de um novo local na base.

GET /reports?place_id={id} — Retorna o histórico de relatos de uma unidade.

POST /reports — Registra um novo voto de usuário, salvando no histórico e atualizando ativamente a tabela de locais.

⚙️ Variáveis de Ambiente (Deploy)
A API foi construída com fallback para rodar localmente sem configurações complexas, mas suporta (e recomenda) a injeção via variáveis de ambiente em produção:

DB_USER (Padrão: root)

DB_PASS (Padrão: admin)

DB_HOST (Padrão: 127.0.0.1)

DB_PORT (Padrão: 3306)

DB_NAME (Padrão: fila_livre)

Fila Livre — Desenvolvido com foco na integridade de dados, performance e utilidade pública.
