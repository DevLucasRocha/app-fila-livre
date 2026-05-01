import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Sun, Moon } from 'lucide-react';
import api from '../services/api'; 

export default function PlaceDetails({ isDark, toggleTheme }) {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [selectedVote, setSelectedVote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const themeColors = {
    bg: isDark ? '#0f172a' : '#f8fafc',
    text: isDark ? '#f8fafc' : '#1e293b',
    subtext: isDark ? '#94a3b8' : '#64748b',
    header: isDark ? '#1e293b' : '#2563eb',
    headerText: isDark ? '#f8fafc' : '#ffffff'
  };

  const btnBaseStyle = {
    width: '100%',
    padding: '20px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    marginBottom: '15px'
  };

  const handleConfirm = async () => {
    if (!selectedVote) return;
    setIsSubmitting(true);
    
    try {
      await api.post('/reports', {
        user_id: 1,
        place_id: parseInt(id),
        status: selectedVote
      });
      navigate('/');
    } catch (error) {
      console.error("Erro ao enviar relato:", error);
      alert("Ocorreu um erro na conexão com o servidor.");
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: themeColors.bg, minHeight: '100vh' }}>
      
      <header style={{ backgroundColor: themeColors.header, color: themeColors.headerText, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: themeColors.headerText, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={24} />
          </button>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Registrar Relato</h2>
        </div>
        <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: themeColors.headerText, cursor: 'pointer' }}>
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </header>

      <main style={{ padding: '20px' }}>
        <p style={{ textAlign: 'center', color: themeColors.subtext, marginBottom: '30px', fontSize: '16px' }}>
          Como está a fila neste local agora?
        </p>

        <button 
          onClick={() => setSelectedVote('vazia')}
          className="btn-animate"
          style={{ ...btnBaseStyle, backgroundColor: '#22c55e', opacity: selectedVote && selectedVote !== 'vazia' ? 0.4 : 1 }}
        >
          Tranquila / Vazia
          {selectedVote === 'vazia' && <CheckCircle2 size={24} />}
        </button>

        <button 
          onClick={() => setSelectedVote('moderada')}
          className="btn-animate"
          style={{ ...btnBaseStyle, backgroundColor: '#eab308', opacity: selectedVote && selectedVote !== 'moderada' ? 0.4 : 1 }}
        >
          Moderada
          {selectedVote === 'moderada' && <CheckCircle2 size={24} />}
        </button>

        <button 
          onClick={() => setSelectedVote('cheia')}
          className="btn-animate"
          style={{ ...btnBaseStyle, backgroundColor: '#ef4444', opacity: selectedVote && selectedVote !== 'cheia' ? 0.4 : 1 }}
        >
          Lotada / Cheia
          {selectedVote === 'cheia' && <CheckCircle2 size={24} />}
        </button>

        {selectedVote && (
          <button 
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="btn-animate"
            style={{ 
              width: '100%', padding: '15px', marginTop: '20px', 
              backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', 
              border: 'none', fontSize: '16px', fontWeight: 'bold', 
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? 'Enviando...' : 'Confirmar Relato'}
          </button>
        )}
      </main>
    </div>
  );
}