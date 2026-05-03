package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/DevLucasRocha/app-fila-livre/backend/internal/models"
	"github.com/DevLucasRocha/app-fila-livre/backend/internal/services"
)

// Gerir requisições de relatos
type ReportHandler struct {
	service *services.ReportService
}

// Criar novo handler de relatos
func NewReportHandler(s *services.ReportService) *ReportHandler {
	return &ReportHandler{service: s}
}

// Validar e registrar relato
func (h *ReportHandler) CreateReport(w http.ResponseWriter, r *http.Request) {
	var report models.Report

	// Decodificar corpo JSON
	if err := json.NewDecoder(r.Body).Decode(&report); err != nil {
		http.Error(w, "Dados inválidos", http.StatusBadRequest)
		return
	}

	// Validar e salvar relato via serviço
	if err := h.service.RegistrarRelato(&report); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	// Retorna o relato criado com ID para uso futuro.
	json.NewEncoder(w).Encode(report)
}

// Listar relatos por local
func (h *ReportHandler) GetReportsByPlace(w http.ResponseWriter, r *http.Request) {
	// Extrair parâmetro "place_id" da URL
	placeIDStr := r.URL.Query().Get("place_id")
	if placeIDStr == "" {
		http.Error(w, "O parâmetro place_id é obrigatório", http.StatusBadRequest)
		return
	}

	// Converter ID para inteiro
	placeID, err := strconv.Atoi(placeIDStr)
	if err != nil {
		http.Error(w, "place_id deve ser um número válido", http.StatusBadRequest)
		return
	}

	// Buscar relatos via serviço
	reports, err := h.service.ObterRelatosPorLocal(placeID)
	if err != nil {
		http.Error(w, "Erro ao buscar relatos", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reports)
}
