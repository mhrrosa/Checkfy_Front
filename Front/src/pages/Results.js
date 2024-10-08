import React from 'react';
import { useLocation } from 'react-router-dom';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../pages/styles/Results.css';

function Results() {
  const location = useLocation();
  const { finalResponses } = location.state || {};

  return (
    <div className="container">
      <h1 className="results-title">Resultados da Avaliação</h1>
      <div className="results-section">
        {finalResponses ?
          Object.entries(finalResponses).map(([key, value], index) => (
            <p key={index}>Resposta {key}: {value.toString()}</p>
          ))
          : <p className='mensagem-nao-encontrado'>Nenhuma resposta foi registrada.</p>
        }
      </div>
    </div>
  );
}

export default Results;