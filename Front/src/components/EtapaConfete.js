import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { getAvaliacaoById, atualizarStatusAvaliacao } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Container.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaConfete.css';
import img_certo from '../img/certo.png';

function EtapaConfete({ avaliacaoId }) {
  const [avaliacao, setAvaliacao] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento adicionado
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvaliacao = async () => {
      try {
        const data = await getAvaliacaoById(avaliacaoId);
        setAvaliacao(data);
      } catch (error) {
        console.error('Erro ao buscar avaliação:', error);
      } finally {
        setIsLoading(false); // Definir isLoading como false após a busca
      }
    };

    fetchAvaliacao();
  }, [avaliacaoId]);

  const handleFinalizar = async () => {
    try {
      // Atualiza o status da avaliação para "Concluída" (id_status = 3)
      await atualizarStatusAvaliacao(avaliacaoId, { id_status: 3 });
      alert('Avaliação marcada como concluída com sucesso!');
      navigate('/'); // Redireciona para a página inicial
    } catch (error) {
      console.error('Erro ao atualizar status da avaliação:', error);
      alert('Erro ao finalizar a avaliação. Tente novamente.');
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>; // Exibe um indicador de carregamento enquanto os dados são buscados
  }

  return (
    <div className="container-etapa">
      <Confetti 
        width={'1200px'}
      />
      <h1 className="title-form">AVALIAÇÃO CONCLUÍDA</h1>
      {avaliacao && (
        <div className="avaliacao-detalhes">
          <table className="tabela-confete">
            <tbody>
              <tr>
                <td className="label-etapas"><strong>Empresa avaliada:</strong></td>
                <td>{avaliacao.nome_empresa}</td>
              </tr>
              <tr>
                <td className="label-etapas"><strong>Avaliador líder:</strong></td>
                <td>{avaliacao.nome_avaliador_lider}</td>
              </tr>
              <tr>
                <td className="label-etapas"><strong>Versão do modelo MPS.BR:</strong></td>
                <td>{avaliacao.nome_versao_modelo}</td>
              </tr>
              <tr>
                <td className="label-etapas"><strong>Nível solicitado:</strong></td>
                <td>{avaliacao.nivel_solicitado}</td>
              </tr>
              <tr>
                <td className="label-etapas"><strong>Resultado:</strong></td>
                <td>
                  <div className='div-resultado-auditoria-confete'>
                    Aprovado
                    <img src={img_certo} className="imagem-certo-errado" alt="certo" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <button onClick={handleFinalizar} className="button-sair-avaliacao"><strong>Finalizar</strong></button>
    </div>
  );
}

export default EtapaConfete;