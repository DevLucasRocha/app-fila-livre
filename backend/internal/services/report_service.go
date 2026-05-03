package services

import (
	"errors"

	"github.com/DevLucasRocha/app-fila-livre/backend/internal/models"
	"github.com/DevLucasRocha/app-fila-livre/backend/internal/repositories"
)

// ReportService concentra as regras de negócio relacionadas aos relatos.
type ReportService struct {
	repo *repositories.ReportRepository
}

// NewReportService inicializa o serviço com o repositório necessário.
func NewReportService(repo *repositories.ReportRepository) *ReportService {
	return &ReportService{repo: repo}
}

// RegistrarRelato valida os dados e envia para o repositório persistir.
func (s *ReportService) RegistrarRelato(report *models.Report) error {
	// Validação básica: garante que o status informado é válido.
	if report.Status != "pouca" && report.Status != "moderada" && report.Status != "cheia" {
		return errors.New("status inválido: deve ser 'pouca', 'moderada' ou 'cheia'")
	}

	// TODO: Validar existência de UserID e PlaceID no banco quando necessário.

	return s.repo.Create(report)
}

// ObterRelatosPorLocal busca o histórico de relatos de um estabelecimento.
func (s *ReportService) ObterRelatosPorLocal(placeID int) ([]models.Report, error) {
	return s.repo.GetByPlaceID(placeID)
}
