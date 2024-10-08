import React, { useState, useEffect } from 'react';
import { getNiveis, createNivel, updateNivel, deleteNivel } from '../services/Api';
import { useNavigate, useLocation  } from 'react-router-dom';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../pages/styles/Niveis.css';
import logo from '../img/logo_horizontal.png';

function Niveis() {
  const [niveis, setNiveis] = useState([]);
  const [novoNivel, setNovoNivel] = useState('');
  const [nomeNovoNivel, setNomeNovoNivel] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const anoSelecionado = location.state?.anoSelecionado || localStorage.getItem('anoSelecionado');

  useEffect(() => {
    carregarNiveis();
  }, [anoSelecionado]);

  const carregarNiveis = () => {
    getNiveis(anoSelecionado)
      .then(data => {
        const niveisFormatados = data.map(n => ({ id: n['ID'], nivel: n['Nivel'], nome: n['Nome_Nivel'] }));
        setNiveis(niveisFormatados);
      })
      .catch(error => {
        console.error('Erro ao buscar níveis:', error);
        setNiveis([]);
      });
  };

  const adicionarNivel = () => {
    const nivelData = { 
      nivel: novoNivel, 
      nome_nivel: nomeNovoNivel, 
      id_versao_modelo: anoSelecionado 
    };
    createNivel(nivelData)
      .then(() => {
        carregarNiveis();
        setNovoNivel('');
        setNomeNovoNivel('');
      })
      .catch(error => console.error('Erro ao adicionar nível:', error));
  };

  const removerNivel = (id) => {
    deleteNivel(id)
      .then(() => {
        setNiveis(prevNiveis => prevNiveis.filter(n => n.id !== id));
      })
      .catch(error => console.error('Erro ao remover nível:', error));
  };

  const atualizarNivel = (id, nivel, nomeNivel) => {
    const atualizado = { nivel: nivel, nome_nivel: nomeNivel };
    updateNivel(id, atualizado)
      .then(() => {
        setNiveis(prevNiveis => prevNiveis.map(n => (n.id === id ? { ...n, nivel: nivel, nome: nomeNivel } : n)));
      })
      .catch(error => console.error('Erro ao atualizar nível:', error));
  };

  return (
    <div className="container">
      <div className="form-niveis">
        <button className="button-close-form" onClick={() => navigate('/gerenciamento')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h1 className='title-form-gerenciamento'>CADASTRO DE NÍVEIS</h1>
        <div className="input-wrapper">
          <label className="label-gerenciamento">Nível:</label>
          <input
            className="input-field"
            type="text"
            placeholder="Digite a letra do novo nível de maturidade"
            value={novoNivel}
            onChange={(e) => setNovoNivel(e.target.value)}
          />
          <label className="label-gerenciamento">Nome:</label>
          <input
            className="input-field"
            type="text"
            placeholder="Digite o nome do novo nível de maturidade"
            value={nomeNovoNivel}
            onChange={(e) => setNomeNovoNivel(e.target.value)}
          />
        </div>
        <div className='logo-and-button'>
          <img src={logo} className="logo" alt="Logo Checkfy" />
          <button className="button-end-form" onClick={adicionarNivel}>ADICIONAR</button>
        </div>
        <p className="niveis-cadastrados-title">GERENCIAMENTO DOS NÍVEIS CADASTRADOS:</p>
        {niveis.length > 0 ? (
          <table>
            <tbody>
              {niveis.map(nivel => (
                <tr className='tr-nivel' key={nivel.id}>
                  <td className='nivel-inserido-td'>
                    <input
                      className='input-nivel-preenchido'
                      type="text"
                      value={nivel.nivel}
                      onChange={(e) => {
                        const valorAtualizado = e.target.value;
                        setNiveis(niveis.map(n => (n.id === nivel.id ? { ...n, nivel: valorAtualizado } : n)));
                      }}
                    />
                  </td>
                  <td className='nome-nivel-inserido-td'>
                    <input
                      className='input-preenchido-niveis'
                      type="text"
                      value={nivel.nome}
                      onChange={(e) => {
                        const valorAtualizado = e.target.value;
                        setNiveis(niveis.map(n => (n.id === nivel.id ? { ...n, nome: valorAtualizado } : n)));
                      }}
                    />
                  </td>
                  <td className='botoes-acoes'>
                    <button className='button-acao'
                      onClick={() => atualizarNivel(nivel.id, nivel.nivel, nivel.nome)}>ATUALIZAR</button> {/* Novo botão */}
                    <button className='button-acao'
                      onClick={() => removerNivel(nivel.id)}>REMOVER</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className='mensagem-nao-encontrado'>Nenhum nível encontrado.</p>
        )}
      </div>
    </div>
  );
}

export default Niveis;