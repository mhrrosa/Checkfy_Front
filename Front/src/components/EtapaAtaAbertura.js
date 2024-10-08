import React, { useState, useEffect } from 'react';
import { getAvaliacaoById, inserir_ata_reuniao } from '../services/Api';
import { useNavigate } from 'react-router-dom';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaAtividadesPlanejamento.css';

function AtaReuniaoAbertura({onNext, avaliacaoId }) {
  const [ataReuniao, setAtaReuniao] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (avaliacaoId) {
      carregarAtaReuniao();
    }
  }, [avaliacaoId]);

  const carregarAtaReuniao = async () => {
    try {
      const data = await getAvaliacaoById(avaliacaoId);
  
      if (data) {
        setAtaReuniao(data.ata_reuniao_abertura || '');
      }
    } catch (error) {
      console.error('Erro ao carregar dados da ata de reunião:', error);
    }
  };
  
  const salvarAtaReuniao = async () => {
    try {
      const data = {
        ataReuniao: ataReuniao,
      };

      await inserir_ata_reuniao(avaliacaoId, data);
      alert('Ata de reunião salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar a ata de reunião:', error);
      alert('Erro ao salvar a ata de reunião. Tente novamente.');
    }
  };

  return (
    <div className='container-etapa'>
      <div className='title-container'>
        <h1 className='title-form'>ATA DE REUNIÃO DE ABERTURA DA AVALIAÇÃO FINAL</h1>
      </div>
        <div className='dica-div'>
            <strong className='dica-titulo'>Observação:</strong> {/* Texto de dica mais escuro */}
            <p className='dica-texto'>
            1 - Avaliador Líder: Apresentou os níveis MR-MPS e o processo de avaliação. Explicou o Acordo de Confidencialidade, escopo e nível de maturidade pleiteado.
            </p>
            <p className='dica-texto'>
            2 - Patrocinador: Reforçou o motivo da avaliação e a importância do apoio dos colaboradores. Destacou a prioridade de respeitar horários e ser sincero nas entrevistas.
            </p>
            <p className='dica-texto'>
            3 - Cronograma: O cronograma da avaliação foi apresentado e todos os participantes foram informados dos momentos de suas contribuições.
            </p>
            <p className='dica-texto'>
            4 - Presença: Todos os colaboradores entrevistados devem estar presentes. Ausentes por força maior serão informados no início de suas entrevistas.
            </p>
        </div>
        <label className="label-etapas">Ata de Reunião:</label>
        <div className='dica-div'>
          <strong className='dica-titulo'>Observação:</strong>
          <p className="dica-texto">
            Dica para preencher: adicionar dica
          </p>
        </div>
        <br></br>
        <div className='textarea-wrapper'>
        <textarea
          className="input-textarea-avaliacao"
          value={ataReuniao}
          onChange={(e) => setAtaReuniao(e.target.value)}
          rows="4"
        ></textarea>
      </div>

      <button className='button-save' onClick={salvarAtaReuniao}>SALVAR</button>
      <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default AtaReuniaoAbertura;
