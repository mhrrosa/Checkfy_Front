import React, { useState } from 'react';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Etapas.css';
import '../components/styles/Button.css';
import { enviarEmailSolicitarFeedback } from '../services/Api';

function EtapaEmailFeedbackSoftex({ onNext, avaliacaoId }) {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmail = async () => {
    setLoading(true);
    try {
      await enviarEmailSolicitarFeedback(avaliacaoId);
      setEmailSent(true);
      alert('E-mail enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      alert('Erro ao enviar e-mail. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container-etapa'>
      <h1 className='title-form'>SOLICITAR LINK DE FEEDBACK SOFTEX</h1>
      <div className='dica-div'>
        <strong className='dica-titulo'>Observação:</strong>
        <p className='dica-texto'>
          Ao clicar no botão abaixo, um e-mail será enviado para a Softex solicitando o link do formulário de feedback.
        </p>
      </div>
      <button
        className='button-next'
        onClick={handleSendEmail}
        disabled={loading || emailSent}
        style={{
          backgroundColor: emailSent ? 'gray' : '',
          cursor: emailSent ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Enviando...' : emailSent ? 'Enviado' : 'ENVIAR EMAIL'}
      </button>
      <br />
      <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default EtapaEmailFeedbackSoftex;