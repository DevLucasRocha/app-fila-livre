package models

import "time"

// Representar registro de local
type Place struct {
	ID            int       `json:"id"`
	Name          string    `json:"name"`
	Category      string    `json:"category"`
	Lat           float64   `json:"lat"`
	Lng           float64   `json:"lng"`
	CreatedAt     time.Time `json:"created_at"`
	CurrentStatus string    `json:"current_status"` // Indicar status atual (pouca/moderada/cheia/fechada)
	Address       string    `json:"address"`        // Indicar endereço
	BusinessHours string    `json:"business_hours"` // Indicar horário de funcionamento
	PeakTimes     string    `json:"peak_times"`     // Indicar horários de pico
	QuietTimes    string    `json:"quiet_times"`    // Indicar horários tranquilos
	IsPredicted   bool      `json:"is_predicted"`   // Mostrar se status é predito
	UpdatedAt     time.Time `json:"-"`              // Controlar atualização interna
}
