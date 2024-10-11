import React, { useState, useEffect } from 'react';
import { getProjetosByAvaliacao, createProjeto, updateProjeto } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/EtapaProjeto.css';
import logo from '../img/logo_horizontal.png';

function EtapaProjeto({ onNext, avaliacaoId }) {
  const [projetos, setProjetos] = useState([]);
  const [novoProjetoNome, setNovoProjetoNome] = useState('');
  const [novoProjetoHabilitado, setNovoProjetoHabilitado] = useState(false);
  const [editandoProjeto, setEditandoProjeto] = useState(false);
  const [selectedProjetoId, setSelectedProjetoId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    if (avaliacaoId) {
      carregarProjetos();
    }
  }, [avaliacaoId]);

  const carregarProjetos = async () => {
    try {
      const data = await getProjetosByAvaliacao(avaliacaoId);
      setProjetos(data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    } finally {
      setIsLoading(false); // Set loading to false after data is fetched
    }
  };

  const salvarProjeto = async () => {
    try {
      const projetoData = { avaliacaoId, nome: novoProjetoNome, habilitado: novoProjetoHabilitado };
      if (editandoProjeto) {
        await updateProjeto(selectedProjetoId, projetoData);
      } else {
        await createProjeto(projetoData);
      }
      await carregarProjetos();
      resetarFormulario();
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
    }
  };

  const resetarFormulario = () => {
    setNovoProjetoNome('');
    setNovoProjetoHabilitado(false);
    setEditandoProjeto(false);
    setSelectedProjetoId(null);
  };

  const atualizarProjeto = async (projetoId, nome, habilitado) => {
    try {
      const projetoData = { nome, habilitado };
      await updateProjeto(projetoId, projetoData);
      setProjetos(prevProjetos =>
        prevProjetos.map(proj => (proj['ID'] === projetoId ? { ...proj, Nome_Projeto: nome, Projeto_Habilitado: habilitado } : proj))
      );
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>; // Display loading indicator while data is being fetched
  }

  return (
    <div className='container-etapa'>
      <div className='title-container'>
        <h1 className='title-form'>SELEÇÃO DE PROJETOS PARA AVALIAÇÃO</h1>
      </div>
      <div className='lista-input'>
        <div className='input-wrapper-project'>
          <label className="label-etapas">Nome do Projeto:</label>
          <input
            type="text"
            value={novoProjetoNome}
            onChange={(e) => setNovoProjetoNome(e.target.value)}
            className="input-field"
          />
        </div>
        <div className='checkbox-wrapper-project'>
          <label className="label-etapas">Projeto Habilitado:</label>
          <input
            className='checkbox-project'
            type="checkbox"
            checked={novoProjetoHabilitado}
            onChange={(e) => setNovoProjetoHabilitado(e.target.checked)}
          />
        </div>
      </div>
      <div className='logo-and-button'>
        <button className="button-add-project" onClick={salvarProjeto}>
          {editandoProjeto ? 'ATUALIZAR' : 'ADICIONAR'}
        </button>
      </div>
      <p className="projetos-cadastrados-title">PROJETOS CADASTRADOS:</p>
      {projetos.length > 0 ? (
        <table className='table'>
          <tbody>
            {projetos.map((projeto) => (
              <tr className='tr-projeto' key={projeto.ID}>
                <td className='projeto-inserido-td'>
                  <input
                    className='input-preenchido-projeto'
                    type="text"
                    value={projeto.Nome_Projeto}
                    onChange={(e) => {
                      const valorAtualizado = e.target.value;
                      setProjetos(projetos.map(proj => (proj.ID === projeto.ID ? { ...proj, Nome_Projeto: valorAtualizado } : proj)));
                    }}
                  />
                </td>
                <td className='projeto-checkbox-inserido-td'>
                  <label className='label-etapas'>
                    Habilitado:
                    <input
                      className='checkbox-projeto-status'
                      type="checkbox"
                      checked={projeto.Projeto_Habilitado}
                      onChange={(e) => {
                        const habilitado = e.target.checked;
                        setProjetos(projetos.map(proj => (proj.ID === projeto.ID ? { ...proj, Projeto_Habilitado: habilitado } : proj)));
                      }}
                    />
                  </label>
                </td>
                <td className='acao-td-projetos'>
                  <button
                    className='button-update-project'
                    onClick={() => atualizarProjeto(projeto.ID, projeto.Nome_Projeto, projeto.Projeto_Habilitado)}
                  >
                    ATUALIZAR
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className='nenhum-encontrado'>Nenhum projeto encontrado.</p>
      )}
      <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default EtapaProjeto;