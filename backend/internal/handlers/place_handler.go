package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/DevLucasRocha/app-fila-livre/backend/internal/models"
	"github.com/DevLucasRocha/app-fila-livre/backend/internal/services"
)

type PlaceHandler struct {
	service *services.PlaceService
}

func NewPlaceHandler(service *services.PlaceService) *PlaceHandler {
	return &PlaceHandler{service: service}
}

// GetAll responde à rota GET /places
func (h *PlaceHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	// Chamando o método correto com nome padronizado
	places, err := h.service.GetAll()
	if err != nil {
		http.Error(w, "Erro ao buscar locais", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(places)
}

// Create responde à rota POST /places
func (h *PlaceHandler) Create(w http.ResponseWriter, r *http.Request) {
	var p models.Place

	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "Dados inválidos", http.StatusBadRequest)
		return
	}

	// Chamando o método correto com nome padronizado
	if err := h.service.Create(&p); err != nil {
		http.Error(w, "Erro ao criar local", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Local criado com sucesso!"})
}
