-- Força a leitura do arquivo em UTF-8 para evitar caracteres estranhos nos acentos
SET NAMES utf8mb4;

-- 1. Criação da Tabela com todas as colunas
CREATE TABLE IF NOT EXISTS places (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    lat DOUBLE NOT NULL,
    lng DOUBLE NOT NULL,
    address VARCHAR(255),
    business_hours VARCHAR(255),
    peak_times VARCHAR(255),
    quiet_times VARCHAR(255),
    current_status VARCHAR(50) DEFAULT 'sem_dados',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Limpa a tabela antes de inserir
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE reports;
TRUNCATE TABLE places;

-- 3. Injeta todos os dados originais (Seeding)
-- HOSPITAIS
INSERT INTO places (name, category, lat, lng, address, business_hours, peak_times, quiet_times, current_status) VALUES
('Hospital UDI', 'Hospital', -2.5020, -44.2980, 'Av. Prof. Carlos Cunha, 2000 - Jaracaty', 'Aberto 24h', '07h-11h / 19h-21h', '15h-17h', 'moderada'),
('Hospital Socorrão I', 'Hospital', -2.5310, -44.3020, 'R. do Passeio, s/n - Centro', 'Aberto 24h', '07h-11h / 19h-21h', '02h-05h', 'cheia'),
('Hospital São Domingos', 'Hospital', -2.5200, -44.2500, 'Av. Jerônimo de Albuquerque, 540 - Bequimão', 'Aberto 24h', '08h-11h / 19h-21h', '02h-07h', 'pouca'),
('Hospital Clementino Moura (Socorrão II)', 'Hospital', -2.5500, -44.2200, 'Av. Eng. Emiliano Macieira, s/n - Cidade Operária', 'Aberto 24h', '07h-11h / 19h-21h', '02h-05h', 'cheia'),
('UPA Itaqui-Bacanga', 'Hospital', -2.5700, -44.3100, 'Av. dos Portugueses, s/n - Anjo da Guarda', 'Aberto 24h', '07h-11h / 19h-21h', '02h-05h', 'moderada');

-- LOTÉRICAS
INSERT INTO places (name, category, lat, lng, address, business_hours, peak_times, quiet_times, current_status) VALUES
('Lotérica Cohab', 'Lotérica', -2.5350, -44.2150, 'Av. Jerônimo de Albuquerque (Cohab/Cohatrac)', 'Seg a Sex: 08h-18h', '11h-14h (Almoço)', '15h-17h', 'cheia'),
('Lotérica Renascença', 'Lotérica', -2.4950, -44.2950, 'Tropical Shopping - Renascença', 'Seg a Sáb: 10h-22h', '18h-20h (Pós-trabalho)', '14h-16h', 'pouca'),
('Lotérica Monumental', 'Lotérica', -2.4960, -44.2970, 'Shopping Monumental - Renascença', 'Seg a Sáb: 08h-18h', '12h-14h', '15h-16h30', 'moderada'),
('Lotérica João Paulo', 'Lotérica', -2.5400, -44.2700, 'Praça 17 de Agosto - João Paulo', 'Seg a Sex: 08h-17h', 'Dias de Pagamento (08h-12h)', '14h-16h', 'cheia');

-- 4. Criação da Tabela de Relatos (Votos dos usuários)
CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    place_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;