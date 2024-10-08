import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import {
  getProcessosPorAvaliacao,
  getResultadosEsperadosPorProcesso,
  getProjetosByAvaliacao,
  getEvidenciasPorResultado,
  getGrausImplementacao,
  addOrUpdateGrauImplementacao
} from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Form.css';
import '../components/styles/Etapas.css';
import '../components/styles/Button.css';
import '../components/styles/EtapaCaracterizacao.css';

Modal.setAppElement('#root');

function EtapaCaracterizacao({ onNext, avaliacaoId, idVersaoModelo }) {
  const [processos, setProcessos] = useState([]);
  const [resultadosEsperados, setResultadosEsperados] = useState({});
  const [projetos, setProjetos] = useState([]);
  const [evidencias, setEvidencias] = useState({});
  const [selectedProcessoId, setSelectedProcessoId] = useState(null);
  const [selectedResultadoId, setSelectedResultadoId] = useState(null);
  const [selectedProjetoId, setSelectedProjetoId] = useState(null);
  const [grausImplementacao, setGrausImplementacao] = useState({});
  const [activeTab, setActiveTab] = useState(null); // Estado para a aba ativa

  const options = [
    "Totalmente implementado (T)",
    "Largamente implementado (L)",
    "Parcialmente implementado (P)",
    "Não implementado (N)",
    "Não avaliado (NA)",
    "Fora do escopo (F)"
  ];

  useEffect(() => {
    if (avaliacaoId && idVersaoModelo) {
      carregarDados();
    }
  }, [avaliacaoId, idVersaoModelo]);

  useEffect(() => {
    if (activeTab) {
      carregarResultadosEsperados(activeTab);
    }
  }, [activeTab]);

  const carregarDados = async () => {
    await carregarProjetos();
    await carregarProcessos();
    await carregarGrausImplementacao();
    if (activeTab) {
      await carregarResultadosEsperados(activeTab);
    } else if (processos.length > 0) {
      setActiveTab(processos[0].ID);
    }
  };

  const carregarProcessos = async () => {
    try {
      const data = await getProcessosPorAvaliacao(avaliacaoId, idVersaoModelo);
      setProcessos(data.processos);
      if (data.processos.length > 0) {
        setActiveTab(data.processos[0].ID); // Defina a primeira aba como ativa
        await carregarResultadosEsperados(data.processos[0].ID); // Carregar resultados e evidências para o primeiro processo
      }
    } catch (error) {
      console.error('Erro ao carregar processos:', error);
    }
  };

  const carregarProjetos = async () => {
    try {
      const data = await getProjetosByAvaliacao(avaliacaoId);
      setProjetos(data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };

  const carregarResultadosEsperados = async (processoId) => {
    try {
      const data = await getResultadosEsperadosPorProcesso(processoId, avaliacaoId);
      setResultadosEsperados(prevResultados => ({
        ...prevResultados,
        [processoId]: data
      }));
  
      // Agora, carrega as evidências para cada resultado esperado e cada projeto
      if (projetos.length > 0) {
        for (const resultado of data) {
          for (const projeto of projetos) {
            await carregarEvidencias(resultado.ID, projeto.ID);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar resultados esperados:', error);
    }
  };

  const carregarEvidencias = async (resultadoId, projetoId) => {
    try {
      const data = await getEvidenciasPorResultado(resultadoId, projetoId);
      const evidenciasFormatadas = data.map(doc => ({
        id: doc[0],
        caminhoArquivo: doc[1],
        nomeArquivo: doc[2],
        idProjeto: doc[3]
      }));
      setEvidencias(prevEvidencias => ({
        ...prevEvidencias,
        [`${resultadoId}-${projetoId}`]: evidenciasFormatadas
      }));
    } catch (error) {
      console.error('Erro ao carregar evidencias:', error);
    }
  };

  const carregarGrausImplementacao = async () => {
    try {
      const data = await getGrausImplementacao(avaliacaoId);
      const graus = {};
      data.forEach(grau => {
        graus[`${grau.ID_Resultado_Esperado}-${grau.ID_Projeto}`] = grau.Nota;
      });
      setGrausImplementacao(graus);
    } catch (error) {
      console.error('Erro ao carregar graus de implementação:', error);
    }
  };

  const handleSelectChange = async (evento, resultadoId, projetoId) => {
    const nota = evento.target.value;
    try {
      await addOrUpdateGrauImplementacao({ nota, resultadoId, projetoId });
      setGrausImplementacao(prevGraus => ({
        ...prevGraus,
        [`${resultadoId}-${projetoId}`]: nota
      }));
    } catch (error) {
      console.error('Erro ao atualizar grau de implementação:', error);
    }
  };

  return (
    <div className="container-etapa">
      <h1 className='title-form'>CARACTERIZAÇÃO DE GRAU DE CADA RESULTADO ESPERADO DO PROCESSO</h1>
      <div className='dica-div'>
        <strong className="dica-titulo">Observação:</strong>
        <p className='dica-texto'>
          Evidências são indicadores que comprovam a implementação dos processos e o nível de capacidade de processo.
        </p>
        <p className='dica-texto'>
          Para cada processo, adicione as evidências para cada resultado esperado.
        </p>
      </div>
      <div className="tabs">
        {processos.map((processo, index) => (
          <button
            key={processo.ID}
            className={`tab-button ${activeTab === processo.ID ? 'active' : ''}`}
            onClick={() => setActiveTab(processo.ID)}
          >
            {processo.Descricao === "Gerência de Projetos" ? "GPR" :
             processo.Descricao === "Engenharia de Requisitos" ? "REQ" : 
             processo.Descricao === "Projeto e Construção do Produto" ? "PCP" :
             processo.Descricao === "Integração do Produto" ? "ITP" :
             processo.Descricao === "Verificação e Validação" ? "VV" :
             processo.Descricao === "Gerência de Configuração" ? "GCO" :
             processo.Descricao === "Aquisição" ? "AQU" :
             processo.Descricao === "Medição" ? "MED" :
             processo.Descricao === "Gerência de Decisões" ? "GDE" :
             processo.Descricao === "Gerência de Recursos Humanos" ? "GRH" :
             processo.Descricao === "Gerência de Processos" ? "GPC" :
             processo.Descricao === "Gerência Organizacional" ? "ORG" :
             processo.Descricao}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {processos.map(processo => (
          activeTab === processo.ID && (
            <div key={processo.ID}>
              <label className='label-etapas'>Processo:</label>
              <h2 className='title-processo-caracterizacao'>{processo.Descricao}</h2>
              {resultadosEsperados[processo.ID] && resultadosEsperados[processo.ID].map(resultado => {
                const notaIndex = resultado.Descricao.indexOf('NOTA');
                const descricao = notaIndex !== -1 ? resultado.Descricao.substring(0, notaIndex).trim() : resultado.Descricao;
                const nota = notaIndex !== -1 ? resultado.Descricao.substring(notaIndex).trim() : '';
                return (
                  <div className='div-resultado-esperado-caracterizacao' key={resultado.ID}>
                    <h3 className='title-resultado-caracterizacao'>{descricao}</h3>
                    {nota && <div className='nota-adicional-div'><p className='nota-adicional-resultado'>{nota}</p></div>}
                    <div className='div-projetos-evidencia-caracterizacao'>
                      {projetos.filter(proj => proj.ID_Avaliacao === avaliacaoId).map(projeto => (
                        <div key={projeto.ID}>
                          <h4 className='title-projeto-caracterizacao'>Projeto: {projeto.Nome_Projeto}</h4>
                          <select
                            className='select-grau-caracterizacao'
                            value={grausImplementacao[`${resultado.ID}-${projeto.ID}`] || "Não avaliado (NA)"}
                            onChange={(e) => handleSelectChange(e, resultado.ID, projeto.ID)}
                          >
                            {options.map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                          </select>
                          <div>
                            {evidencias[`${resultado.ID}-${projeto.ID}`] && evidencias[`${resultado.ID}-${projeto.ID}`]
                              .map(evidencia => (
                                <div className='evidencia-e-botao' key={evidencia.id}>
                                  <p className='title-evidencia-caracterizacao'>Evidencia: {evidencia.nomeArquivo}</p>
                                  <button className='button-mostrar-documento-etapa-evidencia' onClick={() => window.open(`http://127.0.0.1:5000/uploads/${evidencia.caminhoArquivo}`, '_blank')}>Mostrar</button>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ))}
      </div>
      <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default EtapaCaracterizacao;