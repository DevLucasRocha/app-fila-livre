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

  // Banco de dados auxiliar para info real de São Luís
  const extraInfo = {
    1: { address: "Av. Prof. Carlos Cunha, 2000 - Jaracaty", hours: "Aberto 24h", peak: "07h - 10h / 17h - 19h" },
    2: { address: "R. do Passeio, s/n - Centro", hours: "Aberto 24h", peak: "08h - 12h / 18h - 20h" },
    3: { address: "Av. Jerônimo de Albuquerque, 540 - Bequimão", hours: "Aberto 24h", peak: "07h - 09h / 16h - 18h" },
    4: { address: "Av. Eng. Emiliano Macieira, s/n - Cidade Operária", hours: "Aberto 24h", peak: "Seg a Sex: Manhã Inteira" },
    5: { address: "Av. dos Portugueses, s/n - Anjo da Guarda", hours: "Aberto 24h", peak: "Trocas de Plantão (07h/19h)" },
    6: { address: "Av. Jerônimo de Albuquerque (Cohab/Cohatrac)", hours: "Seg a Sex: 08h-18h | Sáb: 08h-12h", peak: "11h - 14h (Almoço)" },
    7: { address: "R. do Quebra Pote (Tropical Shopping) - Renascença", hours: "Seg a Sex: 09h-19h | Sáb: 09h-13h", peak: "Início/Final de Mês" },
    8: { address: "Av. Colares Moreira (Shopping Monumental) - Renascença", hours: "Seg a Sex: 08h-18h | Sáb: 08h-12h", peak: "12h - 14h" },
    9: { address: "Praça 17 de Agosto - João Paulo", hours: "Seg a Sex: 08h-17h | Sáb: 08h-12h", peak: "Dias de Pagamento" },
  };

  const info = extraInfo[id] || { address: "São Luís - MA", hours: "Consulte o local", peak: "Horário comercial" };

  useEffect(() => {
    api.get('/places')
      .then(res => {
        const found = res.data.find(p => p.id === parseInt(id));
        setPlace(found);
        setLoading(false);
      })
      .catch(() => {
        setIsOnline(false);
        setLoading(false);
      });
  }, [id]);

  const themeColors = {
    bg: isDark ? '#0f172a' : '#f8fafc',
    card: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f8fafc' : '#1e293b',
    subtext: isDark ? '#94a3b8' : '#64748b',
    header: isDark ? '#1e293b' : '#2563eb',
    headerText: isDark ? '#f8fafc' : '#ffffff',
    border: isDark ? '#334155' : '#e2e8f0',
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
      showToast('Relato enviado!', 'success');
    } catch {
      showToast('Erro de conexão.', 'error');
      setIsSubmitting(false);
    }
  };

  if (loading) return <div style={{ color: themeColors.text, textAlign: 'center', padding: '50px' }}>Carregando dados...</div>;

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: themeColors.bg, minHeight: '100vh', position: 'relative' }}>
      
      <header style={{ backgroundColor: themeColors.header, color: themeColors.headerText, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: themeColors.headerText, cursor: 'pointer' }}><ArrowLeft size={24} /></button>
        <h2 style={{ margin: 0, fontSize: '18px' }}>Relatar Estado</h2>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '20px', 
          backgroundColor: isOnline ? '#ef4444' : '#64748b', color: '#fff', fontSize: '10px', fontWeight: 'bold'
        }}>
          {isOnline ? <Zap size={12} fill="#fff" className="animate-pulse" /> : <ZapOff size={12} />}
          {isOnline ? 'AO VIVO' : 'OFFLINE'}
        </div>
      </header>

      <main style={{ padding: '20px' }} className="fade-in">
        <div style={{ marginBottom: '25px' }}>
          <h1 style={{ color: themeColors.text, margin: '0 0 5px 0', fontSize: '24px', fontWeight: '800' }}>{place?.name}</h1>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: themeColors.subtext, marginBottom: '12px' }}>
            <MapPin size={18} style={{ marginTop: '2px', flexShrink: 0 }} /> 
            <span style={{ fontSize: '14px', lineHeight: '1.4' }}>{info.address}</span>
          </div>
          <span style={{ backgroundColor: isDark ? '#3b82f630' : '#3b82f615', color: '#3b82f6', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            {place?.category}
          </span>
        </div>

        {/* QUADRO DE HORÁRIOS REALISTA */}
        <section style={{ backgroundColor: themeColors.card, padding: '18px', borderRadius: '16px', marginBottom: '25px', border: `1px solid ${themeColors.border}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', borderBottom: `1px solid ${themeColors.border}`, paddingBottom: '10px' }}>
            <Clock size={18} color="#3b82f6" />
            <h4 style={{ margin: 0, fontSize: '15px', color: themeColors.text }}>Funcionamento e Pico</h4>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={16} color={themeColors.subtext} />
                <div style={{ fontSize: '14px' }}>
                    <span style={{ color: themeColors.subtext }}>Horário: </span>
                    <span style={{ color: themeColors.text, fontWeight: '600' }}>{info.hours}</span>
                </div>
            </div>

            <div style={{ padding: '12px', backgroundColor: isDark ? '#ef444410' : '#ef444405', borderRadius: '10px', borderLeft: '4px solid #ef4444' }}>
                <span style={{ display: 'block', fontSize: '11px', color: '#ef4444', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px' }}>Pico Estimado</span>
                <span style={{ fontSize: '15px', color: themeColors.text, fontWeight: '600' }}>{info.peak}</span>
            </div>
            
            <p style={{ margin: '5px 0 0', fontSize: '11px', color: themeColors.subtext, fontStyle: 'italic' }}>
              * Os horários de pico são baseados na média histórica desta unidade em São Luís.
            </p>
          </div>
        </section>

        <h4 style={{ color: themeColors.text, marginBottom: '15px', fontSize: '16px' }}>Informe a situação agora:</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { id: 'vazia', label: 'Tranquila / Vazia', color: '#22c55e' },
            { id: 'moderada', label: 'Moderada', color: '#eab308' },
            { id: 'cheia', label: 'Lotada / Cheia', color: '#ef4444' }
          ].map((vote) => (
            <button 
              key={vote.id}
              disabled={!isOnline}
              onClick={() => setSelectedVote(vote.id)}
              className="btn-voto"
              style={{ 
                width: '100%', padding: '20px', borderRadius: '15px', border: 'none', color: 'white', fontWeight: '800', fontSize: '16px', cursor: isOnline ? 'pointer' : 'not-allowed',
                backgroundColor: vote.color,
                boxShadow: selectedVote === vote.id ? `0 0 20px ${vote.color}60` : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                opacity: (selectedVote && selectedVote !== vote.id) || !isOnline ? 0.4 : 1,
              }}
            >
              {vote.label}
              {selectedVote === vote.id && <CheckCircle2 size={24} />}
            </button>
          ))}
        </div>

        {selectedVote && isOnline && (
          <button onClick={handleConfirm} disabled={isSubmitting} className="fade-in" style={{ width: '100%', padding: '18px', marginTop: '20px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.5)' }}>
            {isSubmitting ? 'Enviando...' : 'Confirmar Registro'}
          </button>
        )}
      </main>

      {toast.show && (
        <div className="toast-enter" style={{ position: 'fixed', bottom: '30px', left: '20px', right: '20px', backgroundColor: toast.type === 'success' ? '#22c55e' : '#ef4444', color: 'white', padding: '18px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 100, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)' }}>
          <AlertCircle size={20} />
          <span style={{ fontWeight: 'bold' }}>{toast.message}</span>
        </div>
      )}
    </div>
  );
}