import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAvaliacaoById } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css'; 
import '../components/styles/Etapas.css';
import '../components/styles/EtapaResultadoAvaliacaoFinal.css';

function EtapaResultadoAvaliacaoFinal({ onNext }) {
  const location = useLocation();
  const [avaliacao, setAvaliacao] = useState(null); // Initialize as null
  const [isLoading, setIsLoading] = useState(true); // Set initial loading state to true

  useEffect(() => {
    const fetchAvaliacao = async () => {
      setIsLoading(true);
      try {
        const data = await getAvaliacaoById(location.state.id);
        setAvaliacao({
          ...data,
          resultado: data.nivel_solicitado // Preenchendo o resultado com o nível solicitado
        });
      } catch (error) {
        console.error('Erro ao buscar avaliação:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvaliacao();
  }, [location.state.id]);

  if (isLoading) {
    return <div>Carregando...</div>; // Display loading indicator while data is being fetched
  }

  if (!avaliacao) {
    return <div>Erro ao carregar dados da avaliação.</div>; // Handle case where data is null
  }

  return (
    <div className='container-etapa'>
      <h1 className='title-form'>RESULTADO DA AVALIAÇÃO FINAL</h1>
  
      <div className='dica-div'>
        <strong className='dica-titulo'>Observação:</strong>
        <p className='dica-texto'>
          Por favor, confirme a visualização do resultado final da avaliação para que a equipe possa prosseguir com os próximos passos do processo.
        </p>
      </div>
  
      <div className="lista-input">
        <table className='tabela-etapas'>
          <tbody>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Nome da Empresa Avaliada:</th>
              <td className='valor-etapas'>{avaliacao.nome_empresa}</td>
            </tr>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Nível Solicitado:</th>
              <td className='valor-etapas'>{avaliacao.nivel_solicitado}</td>
            </tr>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Resultado da Avaliação:</th>
              <td className='valor-etapas'>{avaliacao.resultado}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px'
      }}>
        <button
          className='button-confirmar-visualizacao'
          onClick={onNext}
          disabled={isLoading}
        >
          CONFIRMAR VISUALIZAÇÃO
        </button>
      </div>
    </div>
  );
}

export default EtapaResultadoAvaliacaoFinal;