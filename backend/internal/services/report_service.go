package services

import (
	"errors"

	"github.com/DevLucasRocha/app-fila-livre/backend/internal/models"
	"github.com/DevLucasRocha/app-fila-livre/backend/internal/repositories"
)

// Centralizar regras de relatos
type ReportService struct {
	repo *repositories.ReportRepository
}

// Criar novo serviço de relatos
func NewReportService(repo *repositories.ReportRepository) *ReportService {
	return &ReportService{repo: repo}
}

// Validar e registrar relato
func (s *ReportService) RegistrarRelato(report *models.Report) error {
	if report.Status != "pouca" && report.Status != "moderada" && report.Status != "cheia" {
		return errors.New("status inválido: deve ser 'pouca', 'moderada' ou 'cheia'")
	}

	return s.repo.Create(report)
}

// Buscar relatos por local
func (s *ReportService) ObterRelatosPorLocal(placeID int) ([]models.Report, error) {
	return s.repo.GetByPlaceID(placeID)
}
