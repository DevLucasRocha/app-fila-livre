package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/DevLucasRocha/app-fila-livre/backend/internal/models"
	"github.com/DevLucasRocha/app-fila-livre/backend/internal/services"
)

// ReportHandler gerencia as requisições HTTP relacionadas aos relatos.
type ReportHandler struct {
	service *services.ReportService
}

// NewReportHandler inicializa um novo handler de relatos.
func NewReportHandler(s *services.ReportService) *ReportHandler {
	return &ReportHandler{service: s}
}

// CreateReport processa a requisição para registrar o status de uma fila.
func (h *ReportHandler) CreateReport(w http.ResponseWriter, r *http.Request) {
	var report models.Report

	// Decodifica o JSON recebido na requisição.
	if err := json.NewDecoder(r.Body).Decode(&report); err != nil {
		http.Error(w, "Dados inválidos", http.StatusBadRequest)
		return
	}

	// Envia o relato para a camada de serviço validar e salvar.
	if err := h.service.RegistrarRelato(&report); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(report)
}

// GetReportsByPlace processa a requisição para listar relatos de um local específico.
func (h *ReportHandler) GetReportsByPlace(w http.ResponseWriter, r *http.Request) {
	// Extrai o parâmetro "place_id" da URL (ex: /api/v1/reports?place_id=1).
	placeIDStr := r.URL.Query().Get("place_id")
	if placeIDStr == "" {
		http.Error(w, "O parâmetro place_id é obrigatório", http.StatusBadRequest)
		return
	}

	// Converte o ID de string para inteiro.
	placeID, err := strconv.Atoi(placeIDStr)
	if err != nil {
		http.Error(w, "place_id deve ser um número válido", http.StatusBadRequest)
		return
	}

	// Busca os relatos na camada de serviço.
	reports, err := h.service.ObterRelatosPorLocal(placeID)
	if err != nil {
		http.Error(w, "Erro ao buscar relatos", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reports)
}
