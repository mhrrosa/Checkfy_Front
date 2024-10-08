import React, { useState, useEffect } from 'react';
import { getAvaliacaoById, inserir_planejamento, atualizarStatusAvaliacao } from '../services/Api';
import { useNavigate } from 'react-router-dom';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaAtividadesPlanejamento.css';

function EtapaAtividadesPlanejamento({ onNext, avaliacaoId }) {
  const [avaliacaoAprovada, setAvaliacaoAprovada] = useState(false);
  const [planejamentoAtividades, setPlanejamentoAtividades] = useState('');
  const [planejamentoCronograma, setPlanejamentoCronograma] = useState('');
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    if (avaliacaoId) {
      carregarAvaliacao();
    }
  }, [avaliacaoId]);

  const carregarAvaliacao = async () => {
    try {
      const data = await getAvaliacaoById(avaliacaoId);
  
      if (data) {
        const isAprovacaoSoftex = data.aprovacao_softex === 1; // Converte 1 para true
        setAvaliacaoAprovada(isAprovacaoSoftex);
        setPlanejamentoAtividades(data.atividade_planejamento || '');
        setPlanejamentoCronograma(data.cronograma_planejamento || '');
      }
    } catch (error) {
      console.error('Erro ao carregar dados da avaliação:', error);
    }
  };

  const salvarPlanejamento = async () => {
    try {
      const data = {
        aprovacaoSoftex: avaliacaoAprovada,
        atividadePlanejamento: planejamentoAtividades,
        cronogramaPlanejamento: planejamentoCronograma,
      };

      await inserir_planejamento(avaliacaoId, data);
      alert('Planejamento salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar o planejamento:', error);
      alert('Erro ao salvar o planejamento. Tente novamente.');
    }
  };

  const handleCheckboxChange = (value) => {
    setAvaliacaoAprovada(value);
  };

  const finalizar = async () => {
    try {
      // Atualiza o status para "Cancelada" (id_status = 5)
      await atualizarStatusAvaliacao(avaliacaoId, { id_status: 5 });
      alert('Status atualizado para Cancelada');
      navigate('/home'); // Navega para a página inicial
    } catch (error) {
      console.error('Erro ao atualizar o status da avaliação:', error);
      alert('Erro ao finalizar a avaliação. Tente novamente.');
    }
  };

  return (
    <div className='container-etapa'>
      <div className='title-container'>
        <h1 className='title-form'>APROVAÇÃO PELA SOFTEX</h1>
      </div>
      <div className='dica-div'>
        <strong className='dica-titulo'>Observação:</strong> {/* Texto de dica mais escuro */}
        <p className='dica-texto'>
          A Softex responderá o email encaminhado com a aprovação ou não da avaliação.
        </p>
      </div>
      <label className="label">Avaliação aprovada pela Softex?</label>
      <div className='checkbox-wrapper-project'>
        <div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={avaliacaoAprovada === true}
              onChange={() => handleCheckboxChange(true)}
            />
            Sim
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={avaliacaoAprovada === false}
              onChange={() => handleCheckboxChange(false)}
            />
            Não
          </label>
        </div>
      </div>

      {/* Exibe os campos de planejamento apenas se a avaliação estiver aprovada */}
      {avaliacaoAprovada && (
        <>

          <h1 className="title-form">PLANEJAMENTO DE ATIVIDADES E CRONOGRAMA</h1>
          <div className='textarea-wrapper'>
            <label className="label">Planejamento de atividades para a avaliação:</label>
            <div className='dica-div'>
              <strong className="dica-titulo">Observação:</strong>
              <p className='dica-texto'>
                Preencha com as atividades que serão realizadas durante a avaliação.
              </p>
            </div>
            <textarea
              value={planejamentoAtividades}
              onChange={(e) => setPlanejamentoAtividades(e.target.value)}
              rows="4"
              className="input-textarea-avaliacao"
            ></textarea>
          </div>
          <div className='textarea-wrapper'>
            <label className="label">Planejamento de cronograma para a avaliação:</label>
            <div className='dica-div'>
              <strong className='dica-titulo'>Observação:</strong>
              <p className="dica-texto">
                Uma base para estimar o tempo da avaliação inicial, da avaliação final e a composição da equipe sugerida pelo MA-MPS:
                <ul>
                    <li><strong>Níveis A e B:</strong> 4-5 dias, com avaliador líder, adjunto(s) e representante(s) da unidade.</li>
                    <li><strong>Níveis C e D:</strong> 2-4 dias, com avaliador líder, adjunto(s) e opcionalmente representante(s).</li>
                    <li><strong>Níveis E e F:</strong> 2-3 dias, com avaliador líder, adjunto(s) e opcionalmente representante(s).</li>
                    <li><strong>Nível G:</strong> 1-2 dias, com avaliador líder e opcionalmente adjunto(s) e representante(s).</li>
                </ul>
              </p>
            </div>
            <textarea
              value={planejamentoCronograma}
              onChange={(e) => setPlanejamentoCronograma(e.target.value)}
              rows="4"
              className="input-textarea-avaliacao"
            ></textarea>
          </div>
        </>
      )}

      {/* Botão de Salvar sempre visível */}
      <button className='button-save' onClick={salvarPlanejamento}>SALVAR</button>

      {avaliacaoAprovada ? (
        <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
      ) : (
        <button className='button-next' onClick={finalizar}>FINALIZAR</button>
      )}
    </div>
  );
}

export default EtapaAtividadesPlanejamento;