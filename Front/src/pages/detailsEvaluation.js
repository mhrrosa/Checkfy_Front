import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAvaliacaoById } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Button.css';
import '../pages/styles/detailsEvaluation.css';
import logo from '../img/logo_horizontal.png';

function DetailsEvaluation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [avaliacao, setAvaliacao] = useState({
    nome: '',
    descricao: '',
    status: '',
    nome_empresa: '',
    nivel_solicitado: '',
    nome_avaliador_lider: '',
    descricao_atividade: '',
    nome_versao_modelo: ''
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

  return (
    <div className="container">
        <form className="form-details-evaluation">
            <button className="button-close-form" type="button" onClick={() => navigate('/')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            </button>
            <h1 className="title-form-gerenciamento">DETALHES DA AVALIAÇÃO</h1>
            <div className="lista-input">
                <div className="input-wrapper">
                    <label className="label-gerenciamento">Nome da avaliação:</label>
                    <input
                        className="input-field"
                        type="text"
                        name="nome"
                        value={avaliacao.nome}
                        readOnly
                    />
                </div>
                <div className="input-wrapper">
                    <label className="label-gerenciamento">Descrição:</label>
                    <textarea
                        className="input-field"
                        name="descricao"
                        value={avaliacao.descricao}
                        readOnly
                    />
                </div>
                <div className="input-grid">
                  <div className="input-wrapper">
                      <label className="label-gerenciamento">Nível Solicitado:</label>
                      <input
                      className="input-field"
                      type="text"
                      name="nivel_solicitado"
                      value={avaliacao.nivel_solicitado}
                      readOnly
                      />
                  </div>
                  <div className="input-wrapper">
                      <label className="label-gerenciamento">Avaliador Líder:</label>
                      <input
                      className="input-field"
                      type="text"
                      name="nome_avaliador_lider"
                      value={avaliacao.nome_avaliador_lider}
                      readOnly
                      />
                  </div>
                  <div className="input-wrapper">
                      <label className="label-gerenciamento">Processo atual:</label>
                      <input
                      className="input-field"
                      type="text"
                      name="descricao_atividade"
                      value={avaliacao.descricao_atividade}
                      readOnly
                      />
                  </div>
                  <div className="input-wrapper">
                      <label className="label-gerenciamento">Versão do Modelo:</label>
                      <input
                      className="input-field"
                      type="text"
                      name="nome_versao_modelo"
                      value={avaliacao.nome_versao_modelo}
                      readOnly
                      />
                  </div>
                </div>
                <div className="logo-and-button">
                <img src={logo} className="logo" alt="Logo Checkfy" />
                <button className="button-end-form" type="button" onClick={() => navigate('/')}>VOLTAR</button>
                </div>
            </div>
        </form>
    </div>
  );
}

export default DetailsEvaluation;