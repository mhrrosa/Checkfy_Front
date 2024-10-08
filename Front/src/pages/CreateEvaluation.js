import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { startNewEvaluation, getNiveis, getVersaoModelo } from '../services/Api';
import { UserContext } from '../contexts/UserContext'; // Importe o UserContext
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../pages/styles/CreateEvaluation.css';
import logo from '../img/logo_horizontal.png';

function CreateEvaluation() {
  const [evaluationName, setEvaluationName] = useState('');
  const [descricao, setDescricao] = useState('');
  const [nivelSolicitado, setNivelSolicitado] = useState('');
  const [niveis, setNiveis] = useState([]);
  const [adjuntoEmails, setAdjuntoEmails] = useState(['']);
  const [colaboradorEmails, setColaboradorEmails] = useState(['']);
  const [versoesModelo, setVersoesModelo] = useState([]);
  const [idVersaoModelo, setIdVersaoModelo] = useState('');
  const { userId, setUserId } = useContext(UserContext); // Obtenha o userId e setUserId do contexto
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      const storedUserId = sessionStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);  // Caso o userId não esteja definido, tente definir novamente a partir do sessionStorage
      } else {
        console.warn("ID de usuário não encontrado no sessionStorage, redirecionando para login.");
        navigate('/login-cadastro');  // Redireciona para login se o userId não for encontrado
      }
    }
    carregarDadosIniciais();
  }, [userId, setUserId, navigate]);

  useEffect(() => {
    if (idVersaoModelo) {
      carregarNiveis(idVersaoModelo);
    }
  }, [idVersaoModelo]);

  const carregarDadosIniciais = async () => {
    try {
      const versoesData = await getVersaoModelo();
      const versoesFormatadas = versoesData.map(v => ({ id: v['ID'], nome: v['Nome'] }));
      setVersoesModelo(versoesFormatadas);

      if (versoesFormatadas.length > 0) {
        const versaoId = versoesFormatadas[0].id;
        setIdVersaoModelo(versaoId);
      }
    } catch (error) {
      console.error('Erro ao buscar dados iniciais:', error);
    }
  };

  const carregarNiveis = async (versaoId) => {
    try {
      const niveisData = await getNiveis(versaoId);
      const niveisFormatados = niveisData.map(n => ({ id: n['ID'], nivel: n['Nivel'] }));
      setNiveis(niveisFormatados);
    } catch (error) {
      console.error('Erro ao buscar níveis:', error);
    }
  };

  const handleStartEvaluation = async (event) => {
    event.preventDefault();
    
    if (!userId) {
      alert('ID de usuário não encontrado. Por favor, faça login novamente.');
      return;
    }

    const data = {
      evaluationName,
      descricao,
      nivelSolicitado,
      adjuntoEmails,
      colaboradorEmails,
      idVersaoModelo,
      idUsuario: userId
    };

    try {
      const response = await startNewEvaluation(data);
      navigate('/home', { state: { setup: response } });
    } catch (error) {
      console.error('Erro ao iniciar avaliação:', error);
    }
  };

  const addEmail = (setEmails) => {
    setEmails(currentEmails => [...currentEmails, '']);
  };

  const updateEmail = (index, value, setEmails) => {
    setEmails(currentEmails => currentEmails.map((email, idx) => idx === index ? value : email));
  };

  const removeEmail = (index, setEmails) => {
    setEmails(currentEmails => currentEmails.filter((_, idx) => idx !== index));
  };

  return (
    <div className="container">
      <form className="form-create-evaluation">
        <button className="button-close-form" onClick={() => navigate('/home')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h1 className="title-form-gerenciamento">CRIAR AVALIAÇÃO</h1>
        <div className="lista-input">
          <div className="input-wrapper">
            <label className="label-gerenciamento">Nome da avaliação:</label>
            <input
              className="input-field"
              type="text"
              value={evaluationName}
              onChange={(e) => setEvaluationName(e.target.value)}
              placeholder="Digite o nome da avaliação"
            />
          </div>
          <div className="input-wrapper">
            <label className="label-gerenciamento">Descrição:</label>
            <input
              className="input-field"
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Digite a descrição da avaliação"
            />
          </div>
          <div className="input-wrapper">
            <label className="label-gerenciamento">Versão do Modelo:</label>
            <select
              className="input-field"
              value={idVersaoModelo}
              onChange={(e) => setIdVersaoModelo(e.target.value)}
            >
              <option value="" disabled>Selecione a Versão</option>
              {versoesModelo.map(v => (
                <option key={v.id} value={v.id}>{v.nome}</option>
              ))}
            </select>
          </div>
          <div className="input-wrapper">
            <label className="label-gerenciamento">Nível Solicitado:</label>
            <select
              className="input-field"
              value={nivelSolicitado}
              onChange={(e) => setNivelSolicitado(e.target.value)}
            >
              <option value="" disabled>Selecione o Nível</option>
              {niveis.map(n => (
                <option key={n.id} value={n.id}>{n.nivel}</option>
              ))}
            </select>
          </div>
          {adjuntoEmails.map((email, index) => (
            <div key={index} className="input-wrapper">
              <label className="label-gerenciamento">Email Avaliador Adjunto:</label>
              <div className="input-group">
                <input
                  className="input-field-email"
                  type="email"
                  value={email}
                  onChange={(e) => updateEmail(index, e.target.value, setAdjuntoEmails)}
                  placeholder="Digite o email do avaliador adjunto"
                />
                <button className="button-add-email" type="button" onClick={() => addEmail(setAdjuntoEmails)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </button>
              </div>
              {adjuntoEmails.length > 1 && (
                <button className="button-remove" type="button" onClick={() => removeEmail(index, setAdjuntoEmails)}>REMOVER</button>
              )}
            </div>
          ))}
          {colaboradorEmails.map((email, index) => (
            <div key={index} className="input-wrapper">
              <label className="label-gerenciamento">Email Colaborador Empresarial:</label>
              <div className="input-group">
                <input
                  className="input-field-email"
                  type="email"
                  value={email}
                  onChange={(e) => updateEmail(index, e.target.value, setColaboradorEmails)}
                  placeholder="Digite o email do colaborador empresarial"
                />
                <button className="button-add-email" type="button" onClick={() => addEmail(setColaboradorEmails)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </button>
              </div>
              {colaboradorEmails.length > 1 && (
                <button className="button-remove" type="button" onClick={() => removeEmail(index, setColaboradorEmails)}>REMOVER</button>
              )}
            </div>
          ))}
        </div>
        <div className='logo-and-button'>
          <img src={logo} className="logo" alt="Logo Checkfy" />
          <button className="button-end-form" onClick={handleStartEvaluation}>ADICIONAR</button>
        </div>
      </form>
    </div>
  );
}

export default CreateEvaluation;