package repositories

import (
	"database/sql"
	"time"

	"github.com/DevLucasRocha/app-fila-livre/backend/internal/models"
)

// Gerir operações de relatos no banco
type ReportRepository struct {
	db *sql.DB
}

// Criar novo repositório de relatos
func NewReportRepository(db *sql.DB) *ReportRepository {
	return &ReportRepository{db: db}
}

// Inserir relato e atualizar status do local
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

	// Atualizar status atual na tabela places
	updateQuery := "UPDATE places SET current_status = ? WHERE id = ?"
	_, err = r.db.Exec(updateQuery, report.Status, report.PlaceID)
	if err != nil {
		return err
	}

	return nil
}

// Buscar relatos por ID de local
func (r *ReportRepository) GetByPlaceID(placeID int) ([]models.Report, error) {
	query := "SELECT id, user_id, place_id, status, created_at FROM reports WHERE place_id = ?"
	rows, err := r.db.Query(query, placeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

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

// Buscar relatos recentes por local a partir de uma data
func (r *ReportRepository) GetRecentByPlaceID(placeID int, since time.Time) ([]models.Report, error) {
	query := "SELECT id, user_id, place_id, status, created_at FROM reports WHERE place_id = ? AND created_at >= ?"
	rows, err := r.db.Query(query, placeID, since)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

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
