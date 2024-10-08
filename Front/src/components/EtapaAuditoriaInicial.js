import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAvaliacaoById, enviarEmailResultadoAvaliacaoInicial } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaAuditoriaAvaliacaoInicial.css';

function EtapaAuditoriaInicial({ onNext, onDuploNext }) {
  const location = useLocation();
  const [avaliacao, setAvaliacao] = useState({
    nome: '',
    descricao: '',
    id_empresa: '',
    id_nivel_solicitado: '',
    id_avaliador_lider: '',
    id_atividade: '',
    id_versao_modelo: '',
    relatorio_ajuste: '',
    caminho_arquivo_relatorio_ajuste_inicial: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState('APROVAR');
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const fetchAvaliacao = async () => {
      setIsLoading(true);
      try {
        const data = await getAvaliacaoById(location.state.id);
        setAvaliacao(data);
      } catch (error) {
        console.error('Erro ao buscar avaliação:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvaliacao();
  }, [location.state.id]);

  const handleNext = () => {
    onNext();
  };

  const handleDuploNext = async () => {
    const confirmacao = window.confirm('Um e-mail será enviado aos participantes informando o resultado da auditoria inicial. Deseja continuar?');
  
    if (confirmacao) {
      setButtonText('ENVIANDO E-MAIL');
      setIsLoading(true);

      try {
        await enviarEmailResultadoAvaliacaoInicial(location.state.id);
        alert('E-mail enviado com sucesso!');
        onDuploNext();
      } catch (error) {
        console.error('Erro ao enviar o e-mail:', error);
        alert('Houve um erro ao enviar o e-mail. Tente novamente.');
      } finally {
        setIsLoading(false);
        setButtonText('APROVAR');
      }
    }
  };

  return (
    <div className='container-etapa'>
      <h1 className='title-form'>AUDITORIA DA AVALIAÇÃO INICIAL</h1>
      <div className="lista-input">
        <table className='tabela-etapas'>
          <tbody>
            {[{ label: "Nome da empresa", value: avaliacao.nome_empresa },
              { label: "Descrição", value: avaliacao.descricao },
              { label: "Nível Solicitado", value: avaliacao.nivel_solicitado },
              { label: "Nome do Avaliador Líder", value: avaliacao.nome_avaliador_lider },
              { label: "Cronograma", value: avaliacao.cronograma_planejamento },
              { label: "Atividades Planejadas", value: avaliacao.atividade_planejamento },
              { label: "Relatório de Ajuste", value: avaliacao.descricao_relatorio_ajuste_inicial }]
              .map((item, index) => (
                <tr key={index} className='linha-etapas'>
                  <th className='label-etapas'>
                    {item.label}:
                  </th>
                  <td className='valor-etapas'>
                    {item.value}
                  </td>
                </tr>
              ))}
            {avaliacao.caminho_arquivo_relatorio_ajuste_inicial && (
              <tr className='linha-etapas'>
                <th className='label-etapas'>
                  Arquivo de Relatório de Ajuste:
                </th>
                <td className='valor-etapas'>
                  <button className='button-mostrar-relatorio'
                    onClick={() => window.open(`http://127.0.0.1:5000/uploads/${avaliacao.caminho_arquivo_relatorio_ajuste_inicial}`, '_blank')}
                    disabled={isLoading}
                  >
                    MOSTRAR
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px'
      }}>
        <div className='div-botoes-aprovar-reprovar'>
          <button
            onClick={handleDuploNext}
            className='button-aprovar-relatorio'
            onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = '#45a049')}
            onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = '#4CAF50')}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner" style={{
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #3498db',
                borderRadius: '50%',
                width: '15px',
                height: '15px',
                animation: 'spin 1s linear infinite',
                display: 'inline-block'
              }}></div>
            ) : (
              buttonText
            )}
          </button>
          <button
            onClick={handleNext}
            className='button-reprovar-relatorio'
            onMouseOver={(e) => e.target.style.backgroundColor = '#d32f2f'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f44336'}
            disabled={isLoading}
          >
            REPROVAR
          </button>
        </div>
      </div>
    </div>
  );
}

export default EtapaAuditoriaInicial;
