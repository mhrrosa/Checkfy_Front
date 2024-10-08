import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProcessos, createProcesso, updateProcesso, deleteProcesso } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../pages/styles/Processos.css';
import logo from '../img/logo_horizontal.png';

function Processos() {
  const [processos, setProcessos] = useState([]);
  const [novoProcessoDescricao, setNovoProcessoDescricao] = useState('');
  const [novoProcessoTipo, setNovoProcessoTipo] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const anoSelecionado = location.state?.anoSelecionado || localStorage.getItem('anoSelecionado');

  useEffect(() => {
    carregarProcessos();
  }, [anoSelecionado]);

  const carregarProcessos = () => {
    if (!anoSelecionado) return;
    getProcessos(anoSelecionado)
      .then(data => {
        const processosFormatados = data.map(p => ({ id: p['ID'], descricao: p['Descricao'], tipo: p['Tipo'] }));
        setProcessos(processosFormatados);
      })
      .catch(error => {
        console.error('Erro ao buscar processos:', error);
        setProcessos([]);
      });
  };

  const adicionarProcesso = () => {
    const processoData = {
      descricao: novoProcessoDescricao,
      tipo: novoProcessoTipo,
      id_versao_modelo: anoSelecionado
    };
    createProcesso(processoData)
      .then(novo => {
        // Atualize a lista de processos após a confirmação de inserção no banco
        carregarProcessos();
        setNovoProcessoDescricao('');
        setNovoProcessoTipo('');
      })
      .catch(error => console.error('Erro ao adicionar processo:', error));
  };

  const removerProcesso = (id) => {
    deleteProcesso(id)
      .then(() => {
        setProcessos(prevProcessos => prevProcessos.filter(p => p.id !== id));
      })
      .catch(error => console.error('Erro ao remover processo:', error));
  };

  const atualizarProcesso = (id, novaDescricao, novoTipo) => {
    const atualizado = {
      nova_descricao: novaDescricao,
      novo_tipo: novoTipo
    };
    updateProcesso(id, atualizado)
      .then(() => {
        setProcessos(prevProcessos => prevProcessos.map(p => (p.id === id ? { ...p, descricao: novaDescricao, tipo: novoTipo } : p)));
      })
      .catch(error => console.error('Erro ao atualizar processo:', error));
  };

  return (
    <div className="container">
      <div className="form-section-process">
        <button className="button-close-form" onClick={() => navigate('/gerenciamento', { state: { anoSelecionado } })}>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h1 className='title-form-gerenciamento'>CADASTRO DE PROCESSOS</h1>
        <div className='lista-input'>
          <div className='input-wrapper'>
            <label className="label-gerenciamento">Nome:</label>
            <input
              className="input-field"
              type="text"
              placeholder="Digite o nome do processo"
              value={novoProcessoDescricao}
              onChange={(e) => setNovoProcessoDescricao(e.target.value)}
            />
          </div>
          <div className='input-wrapper'>
            <label className="label-gerenciamento">Categoria:</label>
            <input
              className="input-field"
              type="text"
              placeholder="Digite a categoria do processo"
              value={novoProcessoTipo}
              onChange={(e) => setNovoProcessoTipo(e.target.value)}
            />
          </div>
        </div>
        <div className='logo-and-button'>
          <img src={logo} className="logo" alt="Logo Checkfy" />
          <button className="button-end-form" onClick={adicionarProcesso}>ADICIONAR</button>
        </div>
        <p className="processos-cadastrados-title">GERENCIAMENTO DOS PROCESSOS CADASTRADOS:</p>
        {processos.length > 0 ? (
          <table>
            <tbody>
              {processos.map(processo => (
                <tr className='tr-processo' key={processo.id}>
                  <td className='nome-inserido-td'>
                    <input
                      className='input-preenchido'
                      type="text"
                      value={processo.descricao}
                      onChange={(e) => {
                        const novaDescricao = e.target.value;
                        setProcessos(prevProcessos => prevProcessos.map(p => (p.id === processo.id ? { ...p, descricao: novaDescricao } : p)));
                      }}
                    />
                  </td>
                  <td>
                    <input
                      className='input-preenchido'
                      type="text"
                      value={processo.tipo}
                      onChange={(e) => {
                        const novoTipo = e.target.value;
                        setProcessos(prevProcessos => prevProcessos.map(p => (p.id === processo.id ? { ...p, tipo: novoTipo } : p)));
                      }}
                    />
                  </td>
                  <td className='acoes-td'>
                    <button className='button-acao' 
                      onClick={() => atualizarProcesso(processo.id, processo.descricao, processo.tipo)}>ATUALIZAR</button>
                    <button className='button-acao'
                      onClick={() => removerProcesso(processo.id)}>REMOVER</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className='mensagem-nao-encontrado'>Nenhum processo encontrado.</p>
        )}
      </div>
    </div>
  );
}

export default Processos;
