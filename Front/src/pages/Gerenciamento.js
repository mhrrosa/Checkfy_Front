import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GerenciamentoVersaoModelo from '../components/GerenciamentoVersaoModelo';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Button.css';
import '../pages/styles/Gerenciamento.css';

function Gerenciamento() {
  const navigate = useNavigate();
  const location = useLocation();
  const anoSelecionado = location.state?.anoSelecionado || localStorage.getItem('anoSelecionado');

  const navigateWithAno = (path) => {
    navigate(path, { state: { anoSelecionado } });
  };

  return (
    <div className="container">
      <h1>GERENCIAMENTO</h1>
      <GerenciamentoVersaoModelo />
      <div className='botoes-home-gerenciamento'>
        <button className='button-home-gerenciamento' onClick={() => navigateWithAno('/processos')}>PROCESSOS</button>
        <button className='button-home-gerenciamento' onClick={() => navigateWithAno('/niveis')}>NÍVEIS</button>
        <button className='button-home-gerenciamento' onClick={() => navigateWithAno('/resultados-esperados')}>RESULTADOS ESPERADOS</button>
      </div>
    </div>
  );
}

export default Gerenciamento;
