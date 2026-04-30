package repositories

import (
	"database/sql"

	"github.com/DevLucasRocha/app-fila-livre/backend/internal/models"
)

type PlaceRepository struct {
	db *sql.DB
}

// NewPlaceRepository cria uma nova instância do repositório
func NewPlaceRepository(db *sql.DB) *PlaceRepository {
	return &PlaceRepository{db: db}
}

// GetAll busca todos os locais no MySQL
func (r *PlaceRepository) GetAll() ([]models.Place, error) {
	query := "SELECT id, name, category, lat, lng, created_at FROM places"
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var places []models.Place
	for rows.Next() {
		var p models.Place
		// O Scan copia os valores das colunas do banco para a nossa struct em Go
		err := rows.Scan(&p.ID, &p.Name, &p.Category, &p.Lat, &p.Lng, &p.CreatedAt)
		if err != nil {
			return nil, err
		}
		places = append(places, p)
	}
	return places, nil
}

// Create insere um novo local no banco
func (r *PlaceRepository) Create(p *models.Place) error {
	query := "INSERT INTO places (name, category, lat, lng) VALUES (?, ?, ?, ?)"
	// O Exec executa o comando sem esperar linhas de retorno (DML)
	_, err := r.db.Exec(query, p.Name, p.Category, p.Lat, p.Lng)
	return err
}
