import React, { useState } from 'react';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaConfirmarAvaliacaoFinal.css';
import { enviarEmailAuditorAvaliacaoFinal } from '../services/Api';

function EtapaConfirmarAvaliacaoFinal({ onNext, avaliacaoId }) {
  const [loading, setLoading] = useState(false);
  const [confirmado, setConfirmado] = useState(false);

  const handleConfirmarAvaliacao = async () => {
    const confirmacao = window.confirm(
      'Tem certeza que deseja confirmar a avaliação final? Isso não poderá ser desfeito.'
    );
    
    if (!confirmacao) return;

    setLoading(true);
    try {
      await enviarEmailAuditorAvaliacaoFinal(avaliacaoId);
      setConfirmado(true);
      alert('Auditoria da avaliação final solicitada com sucesso!');
    } catch (error) {
      console.error('Erro ao solicitar a auditoria da avaliação final:', error);
      alert('Erro ao solicitar a auditoria da avaliação final.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container-etapa'>
      <h2 className='title-form'>CONFIRMAR AVALIAÇÃO FINAL</h2>
      <div className='dica-div'>
        <strong className='dica-titulo'>Observação:</strong>
        <p className='dica-texto'>
          Ao clicar no botão abaixo, você estará solicitando a auditoria da avaliação final. 
          Tenha certeza de que todos os dados estão corretos antes de continuar.
        </p>
      </div>
      <button
        className='button-solicitar-auditoria'
        onClick={handleConfirmarAvaliacao}
        disabled={loading || confirmado}
        style={{
          backgroundColor: confirmado ? 'gray' : '',
          cursor: confirmado ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Enviando email...' : confirmado ? 'AUDITORIA SOLICITADA' : 'SOLICITAR AUDITORIA'}
      </button>
      <br />
      <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default EtapaConfirmarAvaliacaoFinal;