import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapPin, Users, Search, Moon, Sun } from 'lucide-react';
import api from './services/api';
import PlaceDetails from './pages/PlaceDetails';

function Home({ isDark, toggleTheme }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem('@FilaLivre:search') || '');
  const [filterCategory, setFilterCategory] = useState(() => localStorage.getItem('@FilaLivre:category') || 'Todos');

  useEffect(() => {
    api.get('/places')
      .then(response => {
        setPlaces(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem('@FilaLivre:search', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    localStorage.setItem('@FilaLivre:category', filterCategory);
  }, [filterCategory]);

  // Paleta de Cores Refinada (Creme e Grafite no modo claro)
  const themeColors = {
    bg: isDark ? '#0f172a' : '#fff9f2', 
    card: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f8fafc' : '#2d3436', 
    subtext: isDark ? '#94a3b8' : '#7f8c8d',
    border: isDark ? '#334155' : '#e0d5c1', 
    header: isDark ? '#1e293b' : '#3d3d3d', 
    headerText: isDark ? '#f8fafc' : '#fff9f2'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'vazia': return '#4ade80'; 
      case 'moderada': return '#facc15'; 
      case 'cheia': return '#f87171'; 
      default: return '#94a3b8'; 
    }
  };

  const removeAcentos = (texto) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filteredPlaces = places.filter(place => {
    const matchSearch = removeAcentos(place.name).includes(removeAcentos(searchTerm));
    const matchCategory = filterCategory === 'Todos' || place.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: themeColors.bg, minHeight: '100vh', paddingBottom: '20px', transition: 'background 0.3s' }}>
      
      <header style={{ backgroundColor: themeColors.header, color: themeColors.headerText, padding: '25px 20px', textAlign: 'center', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <button onClick={toggleTheme} style={{ position: 'absolute', top: '25px', right: '20px', background: 'none', border: 'none', color: themeColors.headerText, cursor: 'pointer' }}>
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Users size={32} /> Fila Livre
        </h1>
        <p style={{ margin: '5px 0 0', fontSize: '13px', opacity: 0.8, fontWeight: '500', letterSpacing: '0.5px' }}>Monitoramento em Tempo Real</p>
      </header>

      <main style={{ padding: '0 15px', marginTop: '20px' }}>
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <Search size={20} color={themeColors.subtext} style={{ position: 'absolute', left: '15px', top: '14px' }} />
          <input 
            type="text" 
            placeholder="Buscar unidade..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '14px 15px 14px 48px', borderRadius: '14px', border: `1px solid ${themeColors.border}`, backgroundColor: themeColors.card, color: themeColors.text, fontSize: '16px', outline: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', overflowX: 'auto', paddingBottom: '8px' }}>
          {['Todos', 'Hospital', 'Lotérica'].map(cat => (
            <button 
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap', transition: '0.2s',
                backgroundColor: filterCategory === cat ? '#3b82f6' : themeColors.card,
                color: filterCategory === cat ? '#ffffff' : themeColors.text,
                boxShadow: filterCategory === cat ? '0 4px 10px rgba(59, 130, 246, 0.4)' : 'none',
                border: filterCategory !== cat ? `1px solid ${themeColors.border}` : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="animate-pulse" style={{ backgroundColor: themeColors.card, padding: '20px', borderRadius: '18px', border: `1px solid ${themeColors.border}`, height: '120px' }}>
                <div style={{ width: '60%', height: '22px', backgroundColor: themeColors.border, borderRadius: '4px', marginBottom: '15px' }}></div>
                <div style={{ width: '40%', height: '16px', backgroundColor: themeColors.border, borderRadius: '4px' }}></div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {filteredPlaces.length === 0 && <p style={{ textAlign: 'center', color: themeColors.subtext, marginTop: '30px' }}>Nenhum local no radar.</p>}
            
            {filteredPlaces.map((place) => (
              <Link to={`/place/${place.id}`} key={place.id} style={{ display: 'block', textDecoration: 'none', backgroundColor: themeColors.card, padding: '20px', borderRadius: '18px', border: `1px solid ${themeColors.border}`, position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', transition: 'transform 0.2s' }}>
                <div style={{ position: 'absolute', top: '20px', right: '20px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: getStatusColor(place.current_status || 'sem_dados'), boxShadow: `0 0 10px ${getStatusColor(place.current_status || 'sem_dados')}60` }}></div>
                <h3 style={{ margin: '0 0 10px', fontSize: '19px', color: themeColors.text, fontWeight: '700' }}>{place.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: themeColors.subtext, fontSize: '14px', marginBottom: '10px' }}>
                  <MapPin size={16} /> {place.category}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: themeColors.text, fontSize: '15px', fontWeight: '600' }}>
                  <Users size={18} color={themeColors.subtext} /> Lotação: <span style={{ color: getStatusColor(place.current_status || 'sem_dados') }}>{(place.current_status || 'desconhecido').replace('_', ' ')}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  const [isDark, setIsDark] = useState(() => JSON.parse(localStorage.getItem('@FilaLivre:theme')) ?? true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    localStorage.setItem('@FilaLivre:theme', JSON.stringify(!isDark));
  };

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