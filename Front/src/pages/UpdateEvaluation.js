import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAvaliacaoById, updateAvaliacao } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../pages/styles/UpdateEvaluation.css';
import logo from '../img/logo_horizontal.png';

function UpdateEvaluation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [avaliacao, setAvaliacao] = useState({
    nome: '',
    descricao: '',
    status: '',
    id_empresa: '',
    id_nivel_solicitado: '',
    id_avaliador_lider: '',
    id_atividade: '',
    id_versao_modelo: ''
  });

  useEffect(() => {
    const fetchAvaliacao = async () => {
      try {
        const data = await getAvaliacaoById(location.state.id);
        setAvaliacao(data);
      } catch (error) {
        console.error('Erro ao buscar avaliação:', error);
      }
    };
    fetchAvaliacao();
  }, [location.state.id]);

  const handleChange = (e) => {
    setAvaliacao({ ...avaliacao, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await updateAvaliacao(location.state.id, avaliacao);
      navigate('/');
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error);
    }
  };

  return (
    <div className="container">
      <form className="form-create-evaluation" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
        <button className="button-close-form" type="button" onClick={() => navigate('/')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h1 className="title-form-gerenciamento">ATUALIZAR AVALIAÇÃO</h1>
        <div className="lista-input">
          <div className="input-wrapper">
            <label className="label-gerenciamento">Nome da avaliação:</label>
            <input
              className="input-field"
              type="text"
              name="nome"
              value={avaliacao.nome}
              onChange={handleChange}
              placeholder="Digite o nome da avaliação"
            />
          </div>
          <div className="input-wrapper">
            <label className="label-gerenciamento">Descrição:</label>
            <input
              className="input-field"
              type="text"
              name="descricao"
              value={avaliacao.descricao}
              onChange={handleChange}
              placeholder="Digite a descrição da avaliação"
            />
          </div>
          <div className="input-wrapper">
            <label className="label-gerenciamento">Status:</label>
            <input
              className="input-field"
              type="text"
              name="status"
              value={avaliacao.status}
              onChange={handleChange}
              placeholder="Digite o status da avaliação"
            />
          </div>
          <div className="input-wrapper">
            <label className="label-gerenciamento">ID da Empresa:</label>
            <input
              className="input-field"
              type="text"
              name="id_empresa"
              value={avaliacao.id_empresa}
              onChange={handleChange}
              placeholder="Digite o ID da empresa"
            />
          </div>
          <div className="input-wrapper">
            <label className="label-gerenciamento">ID do Nível Solicitado:</label>
            <input
              className="input-field"
              type="text"
              name="id_nivel_solicitado"
              value={avaliacao.id_nivel_solicitado}
              onChange={handleChange}
              placeholder="Digite o ID do nível solicitado"
            />
          </div>
          <div className="input-wrapper">
            <label className="label-gerenciamento">ID do Avaliador Líder:</label>
            <input
              className="input-field"
              type="text"
              name="id_avaliador_lider"
              value={avaliacao.id_avaliador_lider}
              onChange={handleChange}
              placeholder="Digite o ID do avaliador líder"
            />
          </div>
          <div className="input-wrapper">
            <label className="label-gerenciamento">ID da Atividade:</label>
            <input
              className="input-field"
              type="text"
              name="id_atividade"
              value={avaliacao.id_atividade}
              onChange={handleChange}
              placeholder="Digite o ID da atividade"
            />
          </div>
          <div className="input-wrapper">
            <label className="label-gerenciamento">ID da Versão do Modelo:</label>
            <input
              className="input-field"
              type="text"
              name="id_versao_modelo"
              value={avaliacao.id_versao_modelo}
              onChange={handleChange}
              placeholder="Digite o ID da versão do modelo"
            />
          </div>
        </div>
        <div className="logo-and-button">
          <img src={logo} className="logo" alt="Logo Checkfy" />
          <button className="button-end-form" type="submit">ATUALIZAR</button>
        </div>
      </form>
    </div>
  );
}

export default UpdateEvaluation;