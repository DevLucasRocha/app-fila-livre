package repositories

import (
	"database/sql"

	"github.com/DevLucasRocha/app-fila-livre/backend/internal/models"
)

// ReportRepository gerencia as operações de banco de dados para os relatos de fila.
type ReportRepository struct {
	db *sql.DB
}

// NewReportRepository inicializa uma nova instância do repositório de relatos.
func NewReportRepository(db *sql.DB) *ReportRepository {
	return &ReportRepository{db: db}
}

// Create insere um novo relato no banco de dados e atualiza a struct com o ID gerado.
func (r *ReportRepository) Create(report *models.Report) error {
	query := "INSERT INTO reports (user_id, place_id, status) VALUES (?, ?, ?)"

	result, err := r.db.Exec(query, report.UserID, report.PlaceID, report.Status)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	report.ID = int(id)
	return nil
}

// GetByPlaceID busca todos os relatos associados a um local específico.
func (r *ReportRepository) GetByPlaceID(placeID int) ([]models.Report, error) {
	query := "SELECT id, user_id, place_id, status, created_at FROM reports WHERE place_id = ?"
	rows, err := r.db.Query(query, placeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Inicializa como slice vazio para garantir retorno de [] em vez de null no JSON.
	reports := []models.Report{}
	for rows.Next() {
		var rep models.Report
		err := rows.Scan(&rep.ID, &rep.UserID, &rep.PlaceID, &rep.Status, &rep.CreatedAt)
		if err != nil {
			return nil, err
		}
		reports = append(reports, rep)
	}
	return reports, nil
}
