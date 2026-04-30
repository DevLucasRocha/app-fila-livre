package services

import (
	"github.com/DevLucasRocha/app-fila-livre/backend/internal/models"
	"github.com/DevLucasRocha/app-fila-livre/backend/internal/repositories"
)

type PlaceService struct {
	repo *repositories.PlaceRepository
}

func NewPlaceService(r *repositories.PlaceRepository) *PlaceService {
	return &PlaceService{repo: r}
}

func (s *PlaceService) ListarLocais() ([]models.Place, error) {
	return s.repo.GetAll()
}

func (s *PlaceService) CriarNovoLocal(p *models.Place) error {
	return s.repo.Create(p)
}
