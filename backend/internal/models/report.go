package models

import "time"

// define a estrutura do relato de fila, mapeando a tabela 'reports'
type Report struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id"`
	PlaceID   int       `json:"place_id"`
	Status    string    `json:"status"` // Ex: "vazia", "moderada", "cheia"
	CreatedAt time.Time `json:"created_at"`
}