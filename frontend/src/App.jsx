import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapPin, Users, Activity, Search, Moon, Sun, Filter } from 'lucide-react';
import api from './services/api';
import PlaceDetails from './pages/PlaceDetails';

// --- TELA INICIAL ---
function Home({ isDark, toggleTheme }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todos');

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

  // Definir paleta de cores dinâmica baseada no tema
  const themeColors = {
    bg: isDark ? '#0f172a' : '#f8fafc',
    card: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f8fafc' : '#1e293b',
    subtext: isDark ? '#94a3b8' : '#64748b',
    border: isDark ? '#334155' : '#e2e8f0',
    header: isDark ? '#1e293b' : '#2563eb',
    headerText: isDark ? '#f8fafc' : '#ffffff'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'vazia': return '#4ade80'; 
      case 'moderada': return '#facc15'; 
      case 'cheia': return '#f87171'; 
      default: return '#94a3b8'; 
    }
  };

  // Processar filtros e busca na lista
  const filteredPlaces = places.filter(place => {
    const matchSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === 'Todos' || place.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: themeColors.bg, minHeight: '100vh', paddingBottom: '20px' }}>
      
      {/* Cabeçalho */}
      <header style={{ backgroundColor: themeColors.header, color: themeColors.headerText, padding: '20px', textAlign: 'center', borderBottom: `3px solid ${isDark ? '#3b82f6' : '#1d4ed8'}`, position: 'relative' }}>
        <button onClick={toggleTheme} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: themeColors.headerText, cursor: 'pointer' }}>
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
        <h1 style={{ margin: 0, fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Activity size={28} color={isDark ? "#3b82f6" : "#ffffff"} /> Fila Livre
        </h1>
        <p style={{ margin: '5px 0 0', fontSize: '14px', opacity: 0.9 }}>Monitoramento em Tempo Real</p>
      </header>

      <main style={{ padding: '0 15px', marginTop: '15px' }}>
        
        {/* Barra de Pesquisa */}
        <div style={{ position: 'relative', marginBottom: '15px' }}>
          <Search size={20} color={themeColors.subtext} style={{ position: 'absolute', left: '15px', top: '12px' }} />
          <input 
            type="text" 
            placeholder="Buscar unidade..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 15px 12px 45px', borderRadius: '12px', border: `1px solid ${themeColors.border}`, backgroundColor: themeColors.card, color: themeColors.text, fontSize: '16px', outline: 'none' }}
          />
        </div>

        {/* Filtros de Categoria */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '5px' }}>
          {['Todos', 'Hospital', 'Lotérica'].map(cat => (
            <button 
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className="btn-animate"
              style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap',
                backgroundColor: filterCategory === cat ? '#3b82f6' : themeColors.card,
                color: filterCategory === cat ? '#ffffff' : themeColors.text,
                border: filterCategory !== cat ? `1px solid ${themeColors.border}` : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Lista de Locais */}
        {loading ? (
          <p style={{ textAlign: 'center', color: themeColors.subtext }}>Buscando locais no radar...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {filteredPlaces.length === 0 && <p style={{ textAlign: 'center', color: themeColors.subtext }}>Nenhum local encontrado.</p>}
            
            {filteredPlaces.map((place) => (
              <Link to={`/place/${place.id}`} key={place.id} className="card-hover" style={{ display: 'block', textDecoration: 'none', backgroundColor: themeColors.card, padding: '18px', borderRadius: '16px', border: `1px solid ${themeColors.border}`, position: 'relative' }}>
                
                <div style={{ position: 'absolute', top: '18px', right: '18px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: getStatusColor(place.current_status), boxShadow: isDark ? `0 0 8px ${getStatusColor(place.current_status)}80` : 'none' }}></div>

                <h3 style={{ margin: '0 0 10px', fontSize: '18px', color: themeColors.text, fontWeight: '600', paddingRight: '20px' }}>{place.name}</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: themeColors.subtext, fontSize: '14px', marginBottom: '8px' }}>
                  <MapPin size={16} /> {place.category}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: themeColors.text, fontSize: '14px' }}>
                  <Users size={16} /> Lotação: <strong style={{ color: getStatusColor(place.current_status), textTransform: 'capitalize' }}>{place.current_status.replace('_', ' ')}</strong>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// --- ROTAS E ESTADO GLOBAL ---
function App() {
  const [isDark, setIsDark] = useState(true);
  const toggleTheme = () => setIsDark(!isDark);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home isDark={isDark} toggleTheme={toggleTheme} />} />
        <Route path="/place/:id" element={<PlaceDetails isDark={isDark} toggleTheme={toggleTheme} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;