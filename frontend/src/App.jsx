import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapPin, Users, Activity } from 'lucide-react';
import api from './services/api';

// --- TELA INICIAL ---
function Home() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assim que a tela carrega, o React executa essa função para buscar os dados no Go
  useEffect(() => {
    api.get('/places')
      .then(response => {
        setPlaces(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar locais:", error);
        setLoading(false);
      });
  }, []);

  // Função para transformar o status (ex: "cheia") em uma cor visual para o card
  const getStatusColor = (status) => {
    switch (status) {
      case 'vazia': return '#22c55e'; // Verde
      case 'moderada': return '#eab308'; // Amarelo
      case 'cheia': return '#ef4444'; // Vermelho
      default: return '#9ca3af'; // Cinza (Sem dados)
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: '#f3f4f6', minHeight: '100vh', paddingBottom: '20px' }}>
      {/* Cabeçalho do App */}
      <header style={{ backgroundColor: '#2563eb', color: 'white', padding: '20px', textAlign: 'center', borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Activity size={28} /> Fila Livre
        </h1>
        <p style={{ margin: '5px 0 0', fontSize: '14px', opacity: 0.8 }}>Hospitais e Lotéricas em tempo real</p>
      </header>

      {/* Lista de Locais */}
      <main style={{ padding: '0 15px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Carregando locais...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {places.map((place) => (
              <div key={place.id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'relative' }}>
                
                {/* Indicador de Status (A bolinha colorida) */}
                <div style={{ position: 'absolute', top: '15px', right: '15px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: getStatusColor(place.current_status) }}></div>

                <h3 style={{ margin: '0 0 10px', fontSize: '18px', color: '#1f2937' }}>{place.name}</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#6b7280', fontSize: '14px', marginBottom: '5px' }}>
                  <MapPin size={16} /> {place.category}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#6b7280', fontSize: '14px' }}>
                  <Users size={16} /> Lotação: <strong>{place.current_status.replace('_', ' ')}</strong>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// --- ROTAS DO APP ---
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;