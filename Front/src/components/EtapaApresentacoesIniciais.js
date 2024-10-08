import React, { useState, useEffect } from 'react';
import { getApresentacaoEquipe, salvarApresentacaoEquipe } from '../services/Api';  // Importando as funções da API
import '../components/styles/Etapas.css';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';

function EtapaApresentacoesIniciais({ onNext, avaliacaoId }) {
  const [apresentacoesRealizadas, setApresentacoesRealizadas] = useState(null);
  const [equipeTreinada, setEquipeTreinada] = useState(null);
  const [dadosSalvos, setDadosSalvos] = useState(false);

  // Buscar os dados de apresentação inicial e equipe treinada ao montar o componente
  useEffect(() => {
    async function fetchApresentacaoEquipe() {
      try {
        const response = await getApresentacaoEquipe(avaliacaoId);
        if (response) {
          setApresentacoesRealizadas(response.apresentacao_inicial);
          setEquipeTreinada(response.equipe_treinada);
          setDadosSalvos(true);
        }
      } catch (error) {
        console.error('Erro ao buscar os dados de apresentação e equipe:', error);
      }
    }

    fetchApresentacaoEquipe();
  }, [avaliacaoId]);

  // Função para salvar os dados
  const handleSave = async () => {
    try {
      await salvarApresentacaoEquipe({
        idAvaliacao: avaliacaoId,
        apresentacaoInicial: apresentacoesRealizadas,
        equipeTreinada: equipeTreinada
      });
      alert('Dados salvos com sucesso!');
      setDadosSalvos(true);  // Indica que os dados foram salvos
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  };

  // Avançar para a próxima etapa
  const handleNextStep = () => {
    if (apresentacoesRealizadas !== null && equipeTreinada !== null && dadosSalvos) {
      onNext();  // Avançar para a próxima etapa
    } else {
      alert('Por favor, salve os dados antes de avançar.');
    }
  };

  const handleCheckboxChangeApresentacoes = (value) => {
    setApresentacoesRealizadas(value);
    setDadosSalvos(false);  // Marcar como não salvo quando um valor for alterado
  };

  const handleCheckboxChangeEquipe = (value) => {
    setEquipeTreinada(value);
    setDadosSalvos(false);  // Marcar como não salvo quando um valor for alterado
  };

  const isSaveButtonEnabled = apresentacoesRealizadas !== null && equipeTreinada !== null;
  const isNextButtonEnabled = dadosSalvos && apresentacoesRealizadas === true && equipeTreinada === true;

  return (
    <div className='container-etapa'>
      <h1 className='title-form'>APRESENTAÇÕES INICIAIS E TREINAMENTO</h1>
      <div className='dica-div'>
        <strong className='diva-titulo'>Observação:</strong>
        <p className='dica-texto'>
          Na etapa inicial, é necessário realizar o treinamento da equipe de 
          avaliação e as apresentações dos processos da unidade organizacional. O treinamento pode ser conduzido por 
          um avaliador adjunto, com a presença obrigatória do avaliador líder, e tem uma duração recomendada de cerca de 
          30 minutos. A apresentação dos processos da unidade organizacional, apoiada pelo implementador MPS, deve durar 
          entre 30 a 60 minutos e focar exclusivamente nos processos da unidade. Em certos casos, a critério do avaliador líder, o treinamento pode ser reduzido ou omitido se todos os representantes da 
          empresa já tiverem participado de avaliações MPS ou de cursos oficiais equivalentes.
        </p>
      </div>
      {/* Seção para "As apresentações iniciais foram realizadas?" */}
      <label className="label">As apresentações iniciais foram realizadas?</label>
      <div className='checkbox-wrapper-project'>
        <div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={apresentacoesRealizadas === true}
              onChange={() => handleCheckboxChangeApresentacoes(true)}
            />
            Sim
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={apresentacoesRealizadas === false}
              onChange={() => handleCheckboxChangeApresentacoes(false)}
            />
            Não
          </label>
        </div>
      </div>

      {/* Seção para "A equipe foi treinada?" */}
      <label className="label">A equipe foi treinada?</label>
      <div className='checkbox-wrapper-project'>
        <div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={equipeTreinada === true}
              onChange={() => handleCheckboxChangeEquipe(true)}
            />
            Sim
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={equipeTreinada === false}
              onChange={() => handleCheckboxChangeEquipe(false)}
            />
            Não
          </label>
        </div>
      </div>

      {/* Botão "Salvar" */}
      <button
        className={`button-save ${isSaveButtonEnabled ? '' : 'button-disabled'}`}
        onClick={handleSave}
        disabled={!isSaveButtonEnabled}
      >
        SALVAR
      </button>

      {/* Botão "Próxima Etapa" */}
      <button
        className={`button-next ${isNextButtonEnabled ? '' : 'button-disabled'}`}
        onClick={handleNextStep}
        disabled={!isNextButtonEnabled}
      >
        PRÓXIMA ETAPA
      </button>
    </div>
  );
}

export default EtapaApresentacoesIniciais;