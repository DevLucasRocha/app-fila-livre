import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapPin, Users, Activity, Search, Moon, Sun } from 'lucide-react';
import api from './services/api';
import PlaceDetails from './pages/PlaceDetails';

// --- TELA INICIAL ---
function Home({ isDark, toggleTheme }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Inicializa o estado lendo a Memória Cache do navegador (ou assume o padrão)
  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem('@FilaLivre:search') || '');
  const [filterCategory, setFilterCategory] = useState(() => localStorage.getItem('@FilaLivre:category') || 'Todos');

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

  // 2. Atualiza a Memória Cache silenciosamente toda vez que o usuário digita ou clica
  useEffect(() => {
    localStorage.setItem('@FilaLivre:search', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    localStorage.setItem('@FilaLivre:category', filterCategory);
  }, [filterCategory]);

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

 // Função que remove acentos e deixa tudo em minúsculo
  const removeAcentos = (texto) => {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  // Filtro Inteligente
  const filteredPlaces = places.filter(place => {
    // Aplica a normalização no nome do local e no que o usuário digitou
    const nomeNormalizado = removeAcentos(place.name);
    const buscaNormalizada = removeAcentos(searchTerm);
    
    const matchSearch = nomeNormalizado.includes(buscaNormalizada);
    const matchCategory = filterCategory === 'Todos' || place.category === filterCategory;
    
    return matchSearch && matchCategory;
  });

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: themeColors.bg, minHeight: '100vh', paddingBottom: '20px' }}>
      
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

       {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Gera 4 blocos de Skeleton simulando os cards */}
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="animate-pulse" style={{ backgroundColor: themeColors.card, padding: '18px', borderRadius: '16px', border: `1px solid ${themeColors.border}`, height: '110px' }}>
                <div style={{ width: '60%', height: '20px', backgroundColor: themeColors.border, borderRadius: '4px', marginBottom: '15px' }}></div>
                <div style={{ width: '40%', height: '15px', backgroundColor: themeColors.border, borderRadius: '4px', marginBottom: '10px' }}></div>
                <div style={{ width: '50%', height: '15px', backgroundColor: themeColors.border, borderRadius: '4px' }}></div>
              </div>
            ))}
          </div>
        ) : (

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {filteredPlaces.length === 0 && <p style={{ textAlign: 'center', color: themeColors.subtext }}>Nenhum local encontrado.</p>}
            
            {filteredPlaces.map((place) => (
              <Link to={`/place/${place.id}`} key={place.id} className="card-hover" style={{ display: 'block', textDecoration: 'none', backgroundColor: themeColors.card, padding: '18px', borderRadius: '16px', border: `1px solid ${themeColors.border}`, position: 'relative' }}>
                
                <div style={{ position: 'absolute', top: '18px', right: '18px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: getStatusColor(place.current_status || 'sem_dados'), boxShadow: isDark ? `0 0 8px ${getStatusColor(place.current_status || 'sem_dados')}80` : 'none' }}></div>

                <h3 style={{ margin: '0 0 10px', fontSize: '18px', color: themeColors.text, fontWeight: '600', paddingRight: '20px' }}>{place.name}</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: themeColors.subtext, fontSize: '14px', marginBottom: '8px' }}>
                  <MapPin size={16} /> {place.category}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: themeColors.text, fontSize: '14px' }}>
                  <Users size={16} /> Lotação: <strong style={{ color: getStatusColor(place.current_status || 'sem_dados'), textTransform: 'capitalize' }}>{(place.current_status || 'sem dados').replace('_', ' ')}</strong>
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
  // 3. Aplica o mesmo conceito de Cache para o Tema Claro/Escuro
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('@FilaLivre:theme');
    return savedTheme ? JSON.parse(savedTheme) : true; // Dark mode por padrão
  });

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