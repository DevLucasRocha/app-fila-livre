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

// cria uma nova instância do handler injetando o serviço necessário
func NewPlaceHandler(s *services.PlaceService) *PlaceHandler {
	return &PlaceHandler{service: s}
}

// gerencia a rota de listagem de locais e retorno os dados em JSON
func (h *PlaceHandler) GetPlaces(w http.ResponseWriter, r *http.Request) {
	locais, err := h.service.ListarLocais()
	if err != nil {
		// responde com erro 500 se algo falhar na busca
		http.Error(w, "Erro ao buscar locais", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	// serializa os dados para o formato que o frontend espera
	json.NewEncoder(w).Encode(locais)
}

// receba os dados do novo local e solicito a criação ao serviço
func (h *PlaceHandler) CreatePlace(w http.ResponseWriter, r *http.Request) {
	var p models.Place
	// decodifica o corpo da requisição JSON para a minha struct
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "Dados inválidos", http.StatusBadRequest)
		return
	}

	if err := h.service.CriarNovoLocal(&p); err != nil {
		http.Error(w, "Erro ao salvar local", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	// confirma a criação enviando o objeto de volta
	json.NewEncoder(w).Encode(p)
}
