package services

import (
	"time"

	"github.com/DevLucasRocha/app-fila-livre/backend/internal/models"
	"github.com/DevLucasRocha/app-fila-livre/backend/internal/repositories"
)

// PlaceService gerencia as regras de negócio dos locais.
type PlaceService struct {
	placeRepo  *repositories.PlaceRepository
	reportRepo *repositories.ReportRepository // Adicionada a dependência de relatos
}

// NewPlaceService inicializa o serviço conectando os repositórios necessários.
func NewPlaceService(placeRepo *repositories.PlaceRepository, reportRepo *repositories.ReportRepository) *PlaceService {
	return &PlaceService{placeRepo: placeRepo, reportRepo: reportRepo}
}

// ListarLocais retorna todos os estabelecimentos com o status dinâmico calculado.
func (s *PlaceService) ListarLocais() ([]models.Place, error) {
	places, err := s.placeRepo.GetAll()
	if err != nil {
		return nil, err
	}

	// Define a janela de tempo: considera apenas relatos das últimas 2 horas.
	duasHorasAtras := time.Now().Add(-2 * time.Hour)

	// Itera sobre cada local para calcular a lotação atual.
	for i := range places {
		reports, err := s.reportRepo.GetRecentByPlaceID(places[i].ID, duasHorasAtras)

		// Se houver erro ou nenhum relato recente, define como sem dados.
		if err != nil || len(reports) == 0 {
			places[i].CurrentStatus = "sem_dados"
			continue
		}

		// Inicializa o contador de votos.
		contagem := map[string]int{"vazia": 0, "moderada": 0, "cheia": 0}
		for _, r := range reports {
			contagem[r.Status]++
		}

		// Calcula qual status recebeu a maioria absoluta dos votos.
		statusAtual := "vazia"
		maxVotos := contagem["vazia"]

		if contagem["moderada"] > maxVotos {
			statusAtual = "moderada"
			maxVotos = contagem["moderada"]
		}
		if contagem["cheia"] > maxVotos {
			statusAtual = "cheia"
		}

		// Atribui a cor/status vencedor ao local.
		places[i].CurrentStatus = statusAtual
	}

	return places, nil
}

// CriarNovoLocal gerencia a criação de um ponto de interesse.
func (s *PlaceService) CriarNovoLocal(p *models.Place) error {
	return s.placeRepo.Create(p)
}
