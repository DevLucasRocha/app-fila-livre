package models

import "time"

// Place representa a tabela 'places' do banco de dados.
// As tags `json:"..."` definem como os dados serão exibidos na API.
type Place struct {
	ID            int       `json:"id"`
	Name          string    `json:"name"`
	Category      string    `json:"category"`
	Lat           float64   `json:"lat"`
	Lng           float64   `json:"lng"`
	CreatedAt     time.Time `json:"created_at"`
	CurrentStatus string    `json:"current_status"` // indicar se o local está aberto ou fechado
	Address       string    `json:"address"`        // indicar o endereço do local
	BusinessHours string    `json:"business_hours"` // indicar os horários de funcionamento
	PeakTimes     string    `json:"peak_times"`     // indica os horários de pico
	QuietTimes    string    `json:"quiet_times"`    // indica os horários mais tranquilos
	IsPredicted   bool      `json:"is_predicted"`   // mostra o status do local baseado em previsão (aberto ou fechado)
	UpdatedAt     time.Time `json:"-"`              // campo para controle interno, não exposto na API
}
