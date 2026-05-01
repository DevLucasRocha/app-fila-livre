import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '../services/api'; // Importa o nosso comunicador com o Go

export default function PlaceDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [selectedVote, setSelectedVote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Previne múltiplos cliques

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
    transition: 'all 0.2s ease',
    marginBottom: '15px'
  };

  // Função disparada ao clicar em "Confirmar Relato"
  const handleConfirm = async () => {
    if (!selectedVote) return;
    
    setIsSubmitting(true);
    
    try {
      // Monta o JSON (Payload) e envia o POST para o backend
      await api.post('/reports', {
        user_id: 1, // Fixado como 1 temporariamente para simular um usuário
        place_id: parseInt(id),
        status: selectedVote
      });
      
      // Se a requisição deu sucesso (HTTP 201), redireciona de volta para a Home
      navigate('/');
    } catch (error) {
      console.error("Erro ao enviar relato:", error);
      alert("Ocorreu um erro na conexão com o servidor.");
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      
      <header style={{ backgroundColor: '#2563eb', color: 'white', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button 
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0, fontSize: '20px' }}>Registrar Relato</h2>
      </header>

      <main style={{ padding: '20px' }}>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '30px', fontSize: '16px' }}>
          Como está a fila neste local agora?
        </p>

        <button 
          onClick={() => setSelectedVote('vazia')}
          style={{ ...btnBaseStyle, backgroundColor: '#22c55e', opacity: selectedVote && selectedVote !== 'vazia' ? 0.5 : 1 }}
        >
          Tranquila / Vazia
          {selectedVote === 'vazia' && <CheckCircle2 size={24} />}
        </button>

        <button 
          onClick={() => setSelectedVote('moderada')}
          style={{ ...btnBaseStyle, backgroundColor: '#eab308', opacity: selectedVote && selectedVote !== 'moderada' ? 0.5 : 1 }}
        >
          Moderada
          {selectedVote === 'moderada' && <CheckCircle2 size={24} />}
        </button>

        <button 
          onClick={() => setSelectedVote('cheia')}
          style={{ ...btnBaseStyle, backgroundColor: '#ef4444', opacity: selectedVote && selectedVote !== 'cheia' ? 0.5 : 1 }}
        >
          Lotada / Cheia
          {selectedVote === 'cheia' && <CheckCircle2 size={24} />}
        </button>

        {selectedVote && (
          <button 
            onClick={handleConfirm}
            disabled={isSubmitting}
            style={{ 
              width: '100%', 
              padding: '15px', 
              marginTop: '20px', 
              backgroundColor: '#1f2937', 
              color: 'white', 
              borderRadius: '8px', 
              border: 'none', 
              fontSize: '16px', 
              fontWeight: 'bold', 
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