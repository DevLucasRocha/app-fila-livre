package models

import "time"

// Place representa a tabela 'places' do banco de dados.
// As tags `json:"..."` definem como os dados serão exibidos na API.
type Place struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Category  string    `json:"category"`
	Lat       float64   `json:"lat"`
	Lng       float64   `json:"lng"`
	CreatedAt time.Time `json:"created_at"`
}
