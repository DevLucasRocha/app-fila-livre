import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Sun, Moon, AlertCircle, Zap, ZapOff, MapPin, Clock, Calendar } from 'lucide-react';
import api from '../services/api';

export default function PlaceDetails({ isDark, toggleTheme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVote, setSelectedVote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

useEffect(() => {
    api.get('/places')
      .then(res => {
        // Encontra o local específico na lista que veio do banco
        const found = res.data.find(p => p.id === parseInt(id));
        setPlace(found || null);
        setLoading(false);
        setIsOnline(true);
      })
      .catch((err) => {
        console.error("Erro na API:", err);
        setIsOnline(false);
        setLoading(false);
      });
  }, [id]);

  const themeColors = {
    bg: isDark ? '#0f172a' : '#fff9f2',             
    card: isDark ? '#1e293b' : '#fcf5eb',
    text: isDark ? '#f8fafc' : '#2d3436',
    subtext: isDark ? '#94a3b8' : '#787878',
    border: isDark ? '#334155' : '#ebdcca',
    header: isDark ? '#1e293b' : '#3d3d3d',
    headerText: isDark ? '#f8fafc' : '#fff9f2'
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    if (type === 'success') setTimeout(() => navigate('/'), 1500);
  };

  const handleConfirm = async () => {
    if (!selectedVote || !isOnline) return;
    setIsSubmitting(true);
    try {
      await api.post('/reports', { user_id: 1, place_id: parseInt(id), status: selectedVote });
      // Notifica o restante da aplicação para refetch dos dados (Home escuta esse evento)
      window.dispatchEvent(new Event('dataUpdated'));
      showToast('Relato enviado com sucesso!', 'success');
    } catch {
      showToast('Erro ao conectar com o servidor.', 'error');
      setIsSubmitting(false);
    }
  };

  if (loading) return <div style={{ backgroundColor: themeColors.bg, minHeight: '100vh', padding: '50px', textAlign: 'center', color: themeColors.text }}>Carregando dados...</div>;

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: themeColors.bg, minHeight: '100vh', position: 'relative', transition: 'background 0.3s' }}>
      
      <header style={{ backgroundColor: themeColors.header, color: themeColors.headerText, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: themeColors.headerText, cursor: 'pointer' }}><ArrowLeft size={24} /></button>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Detalhes da unidade</h2>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '20px', 
          backgroundColor: isOnline ? '#ef4444' : '#64748b', color: '#fff', fontSize: '11px', fontWeight: 'bold'
        }}>
          {isOnline ? <Zap size={12} fill="#fff" className="animate-pulse" /> : <ZapOff size={12} />}
          {isOnline ? 'AO VIVO' : 'OFFLINE'}
        </div>
      </header>

      <main style={{ padding: '20px' }} className="fade-in">
        <div style={{ marginBottom: '25px' }}>
          <h1 style={{ color: themeColors.text, margin: '0 0 8px 0', fontSize: '26px', fontWeight: '800' }}>{place?.name}</h1>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: themeColors.subtext, marginBottom: '15px' }}>
            <MapPin size={18} style={{ marginTop: '2px', flexShrink: 0 }} /> 
            <span style={{ fontSize: '15px' }}>{place?.address}</span>
          </div>
          <span style={{ backgroundColor: isDark ? '#3b82f630' : '#3b82f615', color: '#3b82f6', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            {place?.category}
          </span>
        </div>

        <section style={{ backgroundColor: themeColors.card, padding: '20px', borderRadius: '20px', marginBottom: '30px', border: `1px solid ${themeColors.border}`, boxShadow: '0 6px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', borderBottom: `1px solid ${themeColors.border}`, paddingBottom: '12px' }}>
            <Clock size={20} color="#3b82f6" />
            <h4 style={{ margin: 0, fontSize: '16px', color: themeColors.text, fontWeight: '700' }}>Planeje sua Visita</h4>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Calendar size={18} color={themeColors.subtext} />
                <div style={{ fontSize: '14px' }}>
                    <span style={{ color: themeColors.subtext }}><strong>Horário: </strong></span>
                    <span style={{ color: themeColors.text, fontWeight: '600' }}>{place?.business_hours}</span>
                </div>
            </div>

            <div style={{ padding: '14px', backgroundColor: isDark ? '#ef444415' : '#ef444408', borderRadius: '12px', borderLeft: '5px solid #ef4444' }}>
                <span style={{ display: 'block', fontSize: '10px', color: '#ef4444', fontWeight: '900', textTransform: 'uppercase', marginBottom: '4px' }}>Pico Estimado</span>
                <span style={{ fontSize: '15px', color: themeColors.text, fontWeight: '700' }}>{place?.peak_times}</span>
            </div>

            <div style={{ padding: '14px', backgroundColor: isDark ? '#22c55e15' : '#22c55e08', borderRadius: '12px', borderLeft: '5px solid #22c55e' }}>
                <span style={{ display: 'block', fontSize: '10px', color: '#22c55e', fontWeight: '900', textTransform: 'uppercase', marginBottom: '4px' }}>Melhor Horário</span>
                <span style={{ fontSize: '15px', color: themeColors.text, fontWeight: '700' }}>{place?.quiet_times}</span>
            </div>
          </div>
        </section>

        <h4 style={{ color: themeColors.text, marginBottom: '15px', fontSize: '17px', fontWeight: '700' }}>Como está a fila agora?</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { id: 'pouca', label: 'Tranquila / Pouca', color: '#22c55e' },
            { id: 'moderada', label: 'Moderada', color: '#eab308' },
            { id: 'cheia', label: 'Lotada / Cheia', color: '#ef4444' }
          ].map((vote) => (
            <button 
              key={vote.id}
              disabled={!isOnline}
              onClick={() => setSelectedVote(vote.id)}
              className="btn-voto"
              style={{ 
                width: '100%', padding: '22px', borderRadius: '18px', border: 'none', color: 'white', fontWeight: '800', fontSize: '17px', cursor: isOnline ? 'pointer' : 'not-allowed',
                backgroundColor: vote.color,
                boxShadow: selectedVote === vote.id ? `0 0 25px ${vote.color}60` : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                opacity: (selectedVote && selectedVote !== vote.id) || !isOnline ? 0.35 : 1,
              }}
            >
              {vote.label}
              {selectedVote === vote.id && <CheckCircle2 size={24} />}
            </button>
          ))}
        </div>

        {selectedVote && isOnline && (
          <button onClick={handleConfirm} disabled={isSubmitting} className="fade-in" style={{ width: '100%', padding: '20px', marginTop: '25px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '15px', border: 'none', fontWeight: '800', fontSize: '18px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)' }}>
            {isSubmitting ? 'Registrando...' : 'Confirmar Registro'}
          </button>
        )}
      </main>

      {toast.show && (
        <div className="toast-enter" style={{ position: 'fixed', bottom: '30px', left: '20px', right: '20px', backgroundColor: toast.type === 'success' ? '#22c55e' : '#ef4444', color: 'white', padding: '18px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 100, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
          <AlertCircle size={20} />
          <span style={{ fontWeight: '700' }}>{toast.message}</span>
        </div>
      )}
    </div>
  );
}