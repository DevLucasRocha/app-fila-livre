package models

import "time"

// Representar relato de fila
type Report struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id"`
	PlaceID   int       `json:"place_id"`
	Status    string    `json:"status"` // Ex: "pouca", "moderada", "cheia"
	CreatedAt time.Time `json:"created_at"`
}
