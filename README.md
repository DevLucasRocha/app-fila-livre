# Fila Livre

Aplicação simples para monitoramento de filas por crowdsourcing. Usuários reportam o estado atual ("pouca", "moderada", "cheia") e a API agrega relatos para estimar lotação recente.
    
**Finalidade:** facilitar a tomada de decisão sobre qual horário visitar serviços sujeitos a filas.

## Arquitetura

- Monorepo com duas partes principais:
  - `backend/` — API REST em Go (camadas: handlers → services → repositories).
  - `frontend/` — SPA em React + Vite consumindo a API.
  - `database/` — script `init.sql` com as tabelas mínimas (`users`, `places`, `reports`).

## Stack

- Go (backend)
- MySQL (banco de dados)
- React + Vite (frontend)
- Axios (cliente HTTP)

## Endpoints principais

- `GET /api/v1/places` — lista locais com status calculado (últimas 2 horas).
- `POST /api/v1/places` — cria novo local (recebe JSON do `Place`).
- `GET /api/v1/reports?place_id={id}` — lista relatos de um local.
- `POST /api/v1/reports` — registra um relato `{ user_id, place_id, status }`.

## Como executar (desenvolvimento)

1. Subir um container MySQL (exemplo):

```powershell
docker run --name fila-livre-mysql -e MYSQL_ROOT_PASSWORD=admin -e MYSQL_DATABASE=fila_livre -e MYSQL_USER=admin -e MYSQL_PASSWORD=admin -p 3306:3306 -d mysql:8.0
```

2. Carregar esquema:

```powershell
Get-Content database\init.sql | docker exec -i fila-livre-mysql mysql -u root -padmin fila_livre
```

3. Iniciar backend (na pasta `backend`):

```powershell
cd backend
go run cmd/api/main.go
```

4. Iniciar frontend (na pasta `frontend`):

```bash
cd frontend
npm install
npm run dev
```

## Possíveis causas de falha na comunicação (verificações rápidas)

- Backend não rodando: verifique `go run` e logs na porta `:8080`.
- CORS: backend precisa expor `Access-Control-Allow-Origin` (atualizado no código).
- URL base do frontend: `src/services/api.js` aponta para `http://localhost:8080/api/v1`.
- Credenciais do MySQL: ajuste `connStr` em `backend/cmd/api/main.go` ou use variáveis de ambiente.
- Banco vazio: verifique se as tabelas foram criadas via `database/init.sql`.

## Observações de manutenção

- Código organizado em camadas (handlers → services → repositories).
- Respostas JSON usam `snake_case` para interoperabilidade com o frontend.
- Recomenda-se usar variáveis de ambiente para configuração de DB em produção.

## Limpeza de arquivos

- Nenhum arquivo padrão do template React foi removido automaticamente; a pasta `.vite/` é cache e pode ser ignorada no controle de versão.

## Contato rápido (para executar testes locais)

- Abrir `http://localhost:5173` (ou porta exibida pelo Vite) após iniciar o frontend.
- Verificar `http://localhost:8080/api/v1/places` no navegador ou curl para validar resposta JSON.

---

Arquivo atualizado: documentação mínima de funcionamento, stack e instruções de execução.