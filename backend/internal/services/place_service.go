package services

import (
	"regexp"
	"strconv"
	"time"

	"github.com/DevLucasRocha/app-fila-livre/backend/internal/models"
	"github.com/DevLucasRocha/app-fila-livre/backend/internal/repositories"
)

type PlaceService struct {
	repo *repositories.PlaceRepository
}

func NewPlaceService(repo *repositories.PlaceRepository) *PlaceService {
	return &PlaceService{repo: repo}
}

// Extrair horas do texto e comparar com hora atual
func isHourInRange(timeText string, currentHour int) bool {
	if timeText == "" {
		return false
	}
	re := regexp.MustCompile(`(\d{2})h-(\d{2})h`)
	matches := re.FindAllStringSubmatch(timeText, -1)

	for _, match := range matches {
		start, _ := strconv.Atoi(match[1])
		end, _ := strconv.Atoi(match[2])
		if currentHour >= start && currentHour < end {
			return true
		}
	}
	return false
}

// Obter locais aplicando regras de negócio
func (s *PlaceService) GetAll() ([]models.Place, error) {
	places, err := s.repo.GetAll()
	if err != nil {
		return nil, err
	}

	loc, err := time.LoadLocation("America/Sao_Paulo")
	if err != nil {
		loc = time.UTC
	}

	now := time.Now().In(loc)
	currentHour := now.Hour()
	currentWeekday := now.Weekday()

	for i := range places {
		p := &places[i]

		// REGRA 1: Invalidar voto após 5 minutos
		if p.CurrentStatus != "sem_dados" && p.CurrentStatus != "" {
			// Verificar TTL de 5 minutos
			if time.Since(p.UpdatedAt) > 5*time.Minute {
				p.CurrentStatus = "sem_dados"
			}
		}

		isFechada := false

		// REGRA 2: Determinar fechamento por horário
		if p.Category == "Lotérica" {
			if currentWeekday == time.Sunday {
				isFechada = true
			} else if currentWeekday == time.Saturday {
				if currentHour < 8 || currentHour >= 12 {
					isFechada = true
				}
			} else {
				if currentHour < 8 || currentHour >= 18 {
					isFechada = true
				}
			}
		}

		if isFechada {
			p.CurrentStatus = "fechada"
			p.IsPredicted = true
			continue
		}

		// REGRA 3: Aplicar predição de fila quando não houver dados
		if p.CurrentStatus == "sem_dados" || p.CurrentStatus == "" {
			p.IsPredicted = true

			if isHourInRange(p.PeakTimes, currentHour) {
				p.CurrentStatus = "cheia"
			} else if isHourInRange(p.QuietTimes, currentHour) {
				p.CurrentStatus = "pouca"
			} else {
				p.CurrentStatus = "moderada"
			}
		} else {
			p.IsPredicted = false
		}
	}

	return places, nil
}

// Create repassa a criação para o repositório
func (s *PlaceService) Create(p *models.Place) error {
	return s.repo.Create(p)
}
