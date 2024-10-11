import React, { useState, useEffect } from 'react';
import {
  getAvaliacaoById,
  getProcessosPorAvaliacao,
  getResultadosEsperadosPorProcesso,
  getProjetosByAvaliacao,
  getEvidenciasPorResultado,
  getRelatorioAuditoriaFinal,
  inserirRelatorioAuditoriaFinal,
  atualizarRelatorioAuditoriaFinal,
  getGrausImplementacaoEmpresa,
  getGrausImplementacao,
  getProcessos,
  getPerguntasCapacidadeProjeto,
  getPerguntasCapacidadeOrganizacional,
  getCapacidadeProcessoProjeto,
  getCapacidadeProcessoOrganizacional,
  notificaParticipantesResultadoAvaliacaoFinal,
  getEvidenciasPorPerguntaProjeto,
  getEvidenciasPorPerguntaOrganizacional
} from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Container.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaEvidencia.css';
import '../components/styles/EtapaAuditoriaFinal.css';
import '../components/styles/EtapaResumoCaracterizacao.css';

function EtapaAuditoriaFinal({ avaliacaoId, idVersaoModelo, onNext, onDuploNext }) {
  const [processos, setProcessos] = useState([]);
  const [resultadosEsperados, setResultadosEsperados] = useState({});
  const [projetos, setProjetos] = useState([]);
  const [evidencias, setEvidencias] = useState({});
  const [activeParentTab, setActiveParentTab] = useState('Informações Gerais');
  const [activeChildTab, setActiveChildTab] = useState(null);
  const [avaliacao, setAvaliacao] = useState(null);
  const [aprovacao, setAprovacao] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [relatorioExiste, setRelatorioExiste] = useState(false);
  const [arrayResumo, setArrayResumo] = useState([]);
  const [grausImplementacao, setGrausImplementacao] = useState({});
  const [activeTab, setActiveTab] = useState(null);
  const [processosOrganizacionais, setProcessosOrganizacionais] = useState([]);
  const [perguntasProjeto, setPerguntasProjeto] = useState([]);
  const [perguntasOrganizacional, setPerguntasOrganizacional] = useState([]);
  const [respostasProjeto, setRespostasProjeto] = useState({});
  const [respostasOrganizacional, setRespostasOrganizacional] = useState({});
  const [activeChildProjectTab, setActiveChildProjectTab] = useState(null);
  const [activeChildOrganizationalTab, setActiveChildOrganizationalTab] = useState(null);
  const [idNivel, setIdNivel] = useState(null);

  const [evidenciasProjeto, setEvidenciasProjeto] = useState({});
  const [evidenciasOrganizacional, setEvidenciasOrganizacional] = useState({});

  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento adicionado

  const parentTabs = ['Informações Gerais', 'Processos', 'Resumo da Caracterização da Avaliação', 'Projeto', 'Organizacional', 'Resultado Auditoria'];

  const descricaoToAbbr = {
    "Gerência de Projetos": "GPR",
    "Engenharia de Requisitos": "REQ",
    "Projeto e Construção do Produto": "PCP",
    "Integração do Produto": "ITP",
    "Verificação e Validação": "VV",
    "Gerência de Configuração": "GCO",
    "Aquisição": "AQU",
    "Medição": "MED",
    "Gerência de Decisões": "GDE",
    "Gerência de Recursos Humanos": "GRH",
    "Gerência de Processos": "GPC",
    "Gerência Organizacional": "ORG"
  };

  const processCodes = ['GCO', 'AQU', 'MED', 'GDE', 'GRH', 'GPC', 'ORG'];

  useEffect(() => {
    if (avaliacaoId && idVersaoModelo) {
      carregarDados();
    }
  }, [avaliacaoId, idVersaoModelo]);

  useEffect(() => {
    if (idNivel) {
      carregarPerguntasProjeto();
      carregarPerguntasOrganizacional();
    }
  }, [idNivel]);

  useEffect(() => {
    if (activeChildTab) {
      carregarResultadosEsperados(activeChildTab);
    }
  }, [activeChildTab]);

  useEffect(() => {
    if (processos.length > 0 && activeParentTab === 'Resumo da Caracterização da Avaliação') {
      setActiveTab(processos[0].ID);
    }
  }, [processos, activeParentTab]);

  useEffect(() => {
    if (activeParentTab === 'Projeto' && projetos.length > 0) {
      setActiveChildProjectTab(projetos[0].ID);
    }
  }, [activeParentTab, projetos]);

  useEffect(() => {
    if (activeParentTab === 'Organizacional' && processosOrganizacionais.length > 0) {
      setActiveChildOrganizationalTab(processosOrganizacionais[0].ID);
    }
  }, [activeParentTab, processosOrganizacionais]);

  // Adicionando useEffect para carregar evidências do projeto
  useEffect(() => {
    if (projetos.length > 0 && perguntasProjeto.length > 0) {
      carregarEvidenciasProjeto();
    }
  }, [projetos, perguntasProjeto]);

  // Adicionando useEffect para carregar evidências organizacionais
  useEffect(() => {
    if (processosOrganizacionais.length > 0 && perguntasOrganizacional.length > 0) {
      carregarEvidenciasOrganizacional();
    }
  }, [processosOrganizacionais, perguntasOrganizacional]);

  const handleNextStep = () => {
    if (aprovacao === 'Aprovar') {
      // Exibir a mensagem de confirmação
      const confirmarEnvio = window.confirm('Ao continuar, um e-mail será enviado aos participantes. Deseja continuar?');
      if (confirmarEnvio) {
        notificaParticipantesResultadoAvaliacaoFinal(avaliacaoId)
          .then(() => {
            alert('E-mail enviado com sucesso!');
            onDuploNext(); // Avançar duas etapas
          })
          .catch((error) => {
            console.error('Erro ao enviar notificação:', error);
            alert('Erro ao enviar notificação.');
          });
      } else {
        return;
      }
    } else {
      onNext(); // Avançar uma etapa
    }
  };

  const carregarDados = async () => {
    try {
      const avaliacaoData = await getAvaliacaoById(avaliacaoId);
      setAvaliacao(avaliacaoData);
      if (avaliacaoData && avaliacaoData.id_nivel_solicitado) {
        setIdNivel(avaliacaoData.id_nivel_solicitado);
      }

      await carregarRelatorioAuditoriaFinal();

      await carregarProjetos();

      await carregarProcessosOrganizacionais();

      await carregarRespostasProjeto();
      await carregarRespostasOrganizacional();

      const processosLoaded = await carregarProcessos();

      await carregarGrausImplementacao();

      // Carregar resultados esperados para todos os processos
      for (const processo of processosLoaded) {
        await carregarResultadosEsperados(processo.ID);
      }

      // Carregar resumo da caracterização da avaliação
      await carregarResumoAvaliacao(processosLoaded);

      // Removendo chamadas para carregar evidências daqui
      // await carregarEvidenciasProjeto();
      // await carregarEvidenciasOrganizacional();

      if (activeParentTab === 'Processos') {
        if (processosLoaded.length > 0) {
          setActiveChildTab(processosLoaded[0].ID);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados da avaliação:', error);
    } finally {
      setIsLoading(false); // Definir isLoading como false após a busca
    }
  };

  const carregarProcessos = async () => {
    try {
      const data = await getProcessosPorAvaliacao(avaliacaoId, idVersaoModelo);
      setProcessos(data.processos);
      return data.processos;
    } catch (error) {
      console.error('Erro ao carregar processos:', error);
      return [];
    }
  };

  const carregarProjetos = async () => {
    try {
      const data = await getProjetosByAvaliacao(avaliacaoId);
      setProjetos(data);

      // Initialize respostasProjeto with default nota
      const initialRespostas = {};
      data.forEach(projeto => {
        initialRespostas[projeto.ID] = { nota: 'Não avaliado (NA)' };
      });
      setRespostasProjeto(initialRespostas);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };

  const carregarProcessosOrganizacionais = async () => {
    try {
      const data = await getProcessos(idVersaoModelo);
      const filteredProcesses = data.filter(processo => {
        const abbr = descricaoToAbbr[processo.Descricao];
        return processCodes.includes(abbr);
      });
      setProcessosOrganizacionais(filteredProcesses);

      // Initialize respostasOrganizacional with default nota
      const initialRespostas = {};
      filteredProcesses.forEach(processo => {
        initialRespostas[processo.ID] = { nota: 'Não avaliado (NA)' };
      });
      setRespostasOrganizacional(initialRespostas);
    } catch (error) {
      console.error('Erro ao carregar processos organizacionais:', error);
    }
  };

  useEffect(() => {
    if (idNivel) {
      carregarPerguntasProjeto();
      carregarPerguntasOrganizacional();
    }
  }, [idNivel]);

  const carregarPerguntasProjeto = async () => {
    if (!idNivel) return;
    try {
      const data = await getPerguntasCapacidadeProjeto(idNivel);
      setPerguntasProjeto(data);
    } catch (error) {
      console.error('Erro ao carregar perguntas do projeto:', error);
    }
  };

  const carregarPerguntasOrganizacional = async () => {
    if (!idNivel) return;
    try {
      const data = await getPerguntasCapacidadeOrganizacional(idNivel);
      setPerguntasOrganizacional(data);
    } catch (error) {
      console.error('Erro ao carregar perguntas organizacionais:', error);
    }
  };

  const carregarRespostasProjeto = async () => {
    try {
      const data = (await getCapacidadeProcessoProjeto(avaliacaoId)) || [];
      setRespostasProjeto(prevState => {
        const novasRespostas = { ...prevState };
        data.forEach(item => {
          const projectId = item.ID_Projeto;
          const nota = item.Nota;
          novasRespostas[projectId] = { nota };
        });
        return novasRespostas;
      });
    } catch (error) {
      console.error('Erro ao carregar respostas do projeto:', error);
    }
  };

  const carregarRespostasOrganizacional = async () => {
    try {
      const data = (await getCapacidadeProcessoOrganizacional(avaliacaoId)) || [];
      setRespostasOrganizacional(prevState => {
        const novasRespostas = { ...prevState };
        data.forEach(item => {
          const processId = item.ID_Processo;
          const nota = item.Nota;
          novasRespostas[processId] = { nota };
        });
        return novasRespostas;
      });
    } catch (error) {
      console.error('Erro ao carregar respostas organizacionais:', error);
    }
  };

  const carregarEvidenciasProjeto = async () => {
    try {
      const novasEvidencias = {};
      for (const projeto of projetos) {
        for (const pergunta of perguntasProjeto) {
          const data = await getEvidenciasPorPerguntaProjeto(pergunta.ID, projeto.ID);
          novasEvidencias[projeto.ID] = {
            ...(novasEvidencias[projeto.ID] || {}),
            [pergunta.ID]: data
          };
        }
      }
      setEvidenciasProjeto(novasEvidencias);
    } catch (error) {
      console.error('Erro ao carregar evidências do projeto:', error);
    }
  };

  const carregarEvidenciasOrganizacional = async () => {
    try {
      const novasEvidencias = {};
      for (const processo of processosOrganizacionais) {
        for (const pergunta of perguntasOrganizacional) {
          const data = await getEvidenciasPorPerguntaOrganizacional(pergunta.ID, processo.ID);
          novasEvidencias[processo.ID] = {
            ...(novasEvidencias[processo.ID] || {}),
            [pergunta.ID]: data
          };
        }
      }
      setEvidenciasOrganizacional(novasEvidencias);
    } catch (error) {
      console.error('Erro ao carregar evidências organizacionais:', error);
    }
  };


  const carregarResultadosEsperados = async (processoId) => {
    try {
      const data = await getResultadosEsperadosPorProcesso(processoId, avaliacaoId);
      setResultadosEsperados(prevResultados => ({
        ...prevResultados,
        [processoId]: data
      }));

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

  const carregarRelatorioAuditoriaFinal = async () => {
    try {
      const data = await getRelatorioAuditoriaFinal(avaliacaoId);
      if (data && data.descricao) {
        if (data.descricao === 'Aprovado') {
          setAprovacao('Aprovar');
          setJustificativa('');
        } else {
          setAprovacao('Reprovar');
          setJustificativa(data.descricao);
        }
        setRelatorioExiste(true);
      } else {
        setAprovacao('');
        setJustificativa('');
        setRelatorioExiste(false);
      }
    } catch (error) {
      console.error('Erro ao carregar relatório de auditoria final:', error);
    }
  };

  const carregarResumoAvaliacao = async (processosLoaded) => {
    try {
      const resumo = await getGrausImplementacaoEmpresa(avaliacaoId);
      if (resumo && resumo.length > 0) {
        await montarArrayComResumo(resumo, processosLoaded);
      } else {
        console.log('Nenhum resumo encontrado.');
      }
    } catch (error) {
      console.error('Erro ao carregar resumo da caracterização da avaliação:', error);
    }
  };

  const montarArrayComResumo = async (resumo, processosLoaded) => {
    try {
      const arrayInicial = [];

      for (const processo of processosLoaded) {
        let resultados = resultadosEsperados[processo.ID];
        if (!resultados) {
          resultados = await getResultadosEsperadosPorProcesso(processo.ID, avaliacaoId);
          setResultadosEsperados(prevResultados => ({
            ...prevResultados,
            [processo.ID]: resultados
          }));
        }

        resultados.forEach(resultado => {
          const notaResumo = resumo.find(item => item.ID_Resultado_Esperado === resultado.ID)?.Nota || 'Não avaliado (NA)';

          arrayInicial.push({
            id_processo: processo.ID,
            processo_descricao: processo.Descricao,
            id_resultado_esperado: resultado.ID,
            resultado_descricao: resultado.Descricao,
            nota: notaResumo
          });
        });
      }

      setArrayResumo(arrayInicial);
    } catch (error) {
      console.error('Erro ao montar array com resumo:', error);
    }
  };

  const renderProcessosContent = () => {
    return (
      <>
        <div className="tabs">
          {processos.map((processo) => (
            <button
              key={processo.ID}
              className={`tab-button ${activeChildTab === processo.ID ? 'active' : ''}`}
              onClick={() => setActiveChildTab(processo.ID)}
            >
              {descricaoToAbbr[processo.Descricao] || processo.Descricao}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {processos.map(processo => (
            activeChildTab === processo.ID && (
              <div key={processo.ID}>
                <label className='label-etapas'>Processo: </label>
                <h2 className='title-processo-evidencia'>{processo.Descricao}</h2>
                {resultadosEsperados[processo.ID] && resultadosEsperados[processo.ID].map(resultado => {
                  const notaIndex = resultado.Descricao.indexOf('NOTA');
                  const descricao = notaIndex !== -1 ? resultado.Descricao.substring(0, notaIndex).trim() : resultado.Descricao;
                  const nota = notaIndex !== -1 ? resultado.Descricao.substring(notaIndex).trim() : '';
                  return (
                    <div className='div-resultado-esperado-evidencia' key={resultado.ID}>
                      <label className='label-etapas'>Resultado Esperado: </label>
                      <h3 className='title-resultado-evidencia'>{descricao}</h3>
                      {nota && <div className='nota-adicional-div'><p className='nota-adicional-resultado'>{nota}</p></div>}
                      <div className='div-projetos-evidencia-caracterizacao-auditoria-final'>  
                        {projetos.filter(proj => proj.ID_Avaliacao === avaliacaoId).map(projeto => (
                          <div key={projeto.ID}>
                            <h4 className='title-projeto-evidencia'>Projeto: {projeto.Nome_Projeto}</h4>
                            <p className='nota-grau-auditoria-final'>Nota: {grausImplementacao[`${resultado.ID}-${projeto.ID}`] || "Não avaliado (NA)"}</p>
                            <div>
                              {evidencias[`${resultado.ID}-${projeto.ID}`] && evidencias[`${resultado.ID}-${projeto.ID}`]
                                .map(evidencia => (
                                  <div className='evidencia-processos-auditoria-final' key={evidencia.id}>
                                    <p className='title-evidencia'>Evidência: {evidencia.nomeArquivo}</p>
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
      </>
    );
  };

  const renderProjetoContent = () => {
    if (!projetos || projetos.length === 0) {
      return <p>Carregando projetos...</p>;
    }

    return (
      <>
        <div className="tabs">
          {projetos.map(projeto => (
            <button
              key={projeto.ID}
              className={`tab-button ${activeChildProjectTab === projeto.ID ? 'active' : ''}`}
              onClick={() => setActiveChildProjectTab(projeto.ID)}
            >
              {projeto.Nome_Projeto}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {projetos.map(projeto =>
            activeChildProjectTab === projeto.ID && (
              <div key={projeto.ID}>
                <h2 className="title-caracterizacao-capacidade-auditoria">{projeto.Nome_Projeto}</h2>
                <table className="tabela-caracterizacao-capacidade-auditoria">
                  <thead>
                    <tr>
                      <th>Descrição</th>
                      <th>Evidências</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perguntasProjeto.map(pergunta => (
                      <tr key={pergunta.ID}>
                        <td>{pergunta.pergunta}</td>
                        <td>
                          {evidenciasProjeto[projeto.ID]?.[pergunta.ID]?.length > 0 ? (
                            evidenciasProjeto[projeto.ID][pergunta.ID].map(evidencia => (
                              <div className='evidencia-e-botoes' key={evidencia.ID}>
                                <button className='button-mostrar-documento-etapa-evidencia'
                                  onClick={() =>
                                    window.open(
                                      `http://127.0.0.1:5000/uploads/${evidencia.Caminho_Arquivo}`,
                                      '_blank'
                                    )
                                  }
                                >
                                  Mostrar
                                </button>
                              </div>
                            ))
                          ) : (
                            <p>Sem evidências.</p>
                          )}
                        </td>
                      </tr>
                    ))}
                    {/* Nota Final */}
                    <tr>
                      <td><strong>Nota Final</strong></td>
                      <td>
                        {respostasProjeto[projeto.ID]?.nota || "Não avaliado (NA)"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </>
    );
  };

  // Função para renderizar o conteúdo da aba "Organizacional"
  const renderOrganizacionalContent = () => {
    if (!processosOrganizacionais || processosOrganizacionais.length === 0) {
      return <p>Carregando processos organizacionais...</p>;
    }

    return (
      <>
        <div className="tabs">
          {processosOrganizacionais.map(processo => (
            <button
              key={processo.ID}
              className={`tab-button ${activeChildOrganizationalTab === processo.ID ? 'active' : ''}`}
              onClick={() => setActiveChildOrganizationalTab(processo.ID)}
            >
              {descricaoToAbbr[processo.Descricao] || processo.Descricao}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {processosOrganizacionais.map(processo =>
            activeChildOrganizationalTab === processo.ID && (
              <div key={processo.ID}>
                <h2 className="title-caracterizacao-capacidade-auditoria">{processo.Descricao}</h2>
                <table className="tabela-caracterizacao-capacidade-auditoria">
                  <thead>
                    <tr>
                      <th>Descrição</th>
                      <th>Evidências</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perguntasOrganizacional.map(pergunta => (
                      <tr key={pergunta.ID}>
                        <td>{pergunta.pergunta}</td>
                        <td>
                          {evidenciasOrganizacional[processo.ID]?.[pergunta.ID]?.length > 0 ? (
                            evidenciasOrganizacional[processo.ID][pergunta.ID].map(evidencia => (
                              <div className='evidencia-e-botoes' key={evidencia.ID}>
                                <button className='button-mostrar-documento-etapa-evidencia'
                                  onClick={() =>
                                    window.open(
                                      `http://127.0.0.1:5000/uploads/${evidencia.Caminho_Arquivo}`,
                                      '_blank'
                                    )
                                  }
                                >
                                  Mostrar
                                </button>
                              </div>
                            ))
                          ) : (
                            <p>Sem evidências.</p>
                          )}
                        </td>
                      </tr>
                    ))}
                    {/* Nota Final */}
                    <tr>
                      <td><strong>Nota Final</strong></td>
                      <td>
                        {respostasOrganizacional[processo.ID]?.nota || "Não avaliado (NA)"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </>
    );
  };

  const renderResultadoAuditoriaContent = () => {
    return (
      <div className="container-etapa">
        <h2 className='title-form-auditoria-final'>RESULTADO DA AUDITORIA</h2>
        <div className="div-opcao-aprovacao">
          <p className='label-etapas'>Selecione uma opção:</p>
          <select
            value={aprovacao}
            onChange={(e) => setAprovacao(e.target.value)}
            className="select-aprovacao"
          >
            {aprovacao === '' && <option value="">Selecione</option>}
            <option value="Aprovar">Aprovar</option>
            <option value="Reprovar">Reprovar</option>
          </select>
        </div>
        {aprovacao === 'Reprovar' && (
          <>
            <textarea
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              placeholder="Escreva a justificativa da reprovação"
              className="input-textarea-avaliacao"
            />
          </>
        )}

        <button className="button-save" onClick={salvarDecisao}>SALVAR</button>
        <button className='button-next' onClick={handleNextStep}>PRÓXIMA ETAPA</button>
      </div>
    );
  };

  const salvarDecisao = async () => {
    if (aprovacao === '') {
      alert('Por favor, selecione uma opção.');
      return;
    }

    if (aprovacao === 'Reprovar' && justificativa.trim() === '') {
      alert('Por favor, forneça uma justificativa para a reprovação.');
      return;
    }

    try {
      const data = {
        descricao: aprovacao === 'Reprovar' ? justificativa : 'Aprovado',
        idAvaliacao: avaliacaoId,
      };

      if (relatorioExiste) {
        await atualizarRelatorioAuditoriaFinal(data);
        alert('Decisão atualizada com sucesso!');
      } else {
        await inserirRelatorioAuditoriaFinal(data);
        alert('Decisão salva com sucesso!');
        setRelatorioExiste(true);
      }
    } catch (error) {
      console.error('Erro ao salvar decisão:', error);
      alert('Erro ao salvar decisão.');
    }
  };

  const renderResumoAvaliacaoContent = () => {
        return (
      <div className="container-etapa">
        <div className="tabs">
          {processos.map((processo, index) => (
            <button
              key={processo.ID}
              className={`tab-button ${activeTab === processo.ID ? 'active' : ''}`}
              onClick={() => setActiveTab(processo.ID)}
            >
              {descricaoToAbbr[processo.Descricao] || processo.Descricao}
            </button>
          ))}
        </div>
        <div className="tab-content">
          <h2 className='title-form-auditoria-final'>RESUMO DA CARACTERIZAÇÃO DA AVALIAÇÃO</h2>
          <table className='resumo-tabela'>
            <thead>
              <tr>
                <th>Resultado Esperado</th>
                <th>Nota</th>
              </tr>
            </thead>
            <tbody>
              {arrayResumo
                .filter(item => item.id_processo === activeTab)
                .map(item => {
                  const notaIndex = item.resultado_descricao.indexOf('NOTA');
                  const descricao = notaIndex !== -1 ? item.resultado_descricao.substring(0, notaIndex).trim() : item.resultado_descricao;
                  const nota = notaIndex !== -1 ? item.resultado_descricao.substring(notaIndex).trim() : '';
                  return (
                    <tr key={item.id_resultado_esperado}>
                      <td>
                        <span className='resultado-esperado'>
                          {descricao}
                        </span>
                        {nota && <div className='nota-adicional-tabela'><p className='nota-adicional-resultado-tabela'>{nota}</p></div>}
                      </td>
                      <td>{item.nota}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeParentTab) {
      case 'Informações Gerais':
        return renderInformacoesGeraisContent();
      case 'Processos':
        return renderProcessosContent();
      case 'Projeto':
        return renderProjetoContent();
      case 'Resumo da Caracterização da Avaliação':
        return renderResumoAvaliacaoContent();
      case 'Organizacional':
        return renderOrganizacionalContent();
      case 'Resultado Auditoria':
        return renderResultadoAuditoriaContent();
      default:
        return null;
    }
  };

  const renderInformacoesGeraisContent = () => {
    if (!avaliacao) {
      return <p>Carregando dados...</p>;
    }

    return (
      <div className="conteudo-informacoes-gerais">
        <h2 className='title-form-auditoria-final'>INFORMAÇÕES GERAIS</h2>
        <table className='tabela-etapas'>
          <tbody>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Nome da Avaliação:</th>
              <td className='valor-etapas'>{avaliacao.nome}</td>
            </tr>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Descrição:</th>
              <td className='valor-etapas'>{avaliacao.descricao}</td>
            </tr>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Avaliador Líder:</th>
              <td className='valor-etapas'>{avaliacao.nome_avaliador_lider}</td>
            </tr>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Empresa:</th>
              <td className='valor-etapas'>{avaliacao.nome_empresa}</td>
            </tr>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Nível Solicitado:</th>
              <td className='valor-etapas'>{avaliacao.nivel_solicitado}</td>
            </tr>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Versão do Modelo:</th>
              <td className='valor-etapas'>{avaliacao.nome_versao_modelo}</td>
            </tr>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Atividade Planejamento:</th>
              <td className='valor-etapas'>{avaliacao.atividade_planejamento}</td>
            </tr>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Cronograma Planejamento:</th>
              <td className='valor-etapas'>{avaliacao.cronograma_planejamento}</td>
            </tr>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Ata de Reunião de Abertura:</th>
              <td className='valor-etapas'>{avaliacao.ata_reuniao_abertura}</td>
            </tr>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Descrição Relatório de Ajuste Inicial:</th>
              <td className='valor-etapas'>{avaliacao.descricao_relatorio_ajuste_inicial}</td>
            </tr>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Arquivo de Relatório de Ajuste Inicial:</th>
              <td className='valor-etapas'>
                <button
                  className="button-mostrar-relatorio-auditoria"
                  onClick={() => window.open(`http://127.0.0.1:5000/uploads/${avaliacao.caminho_arquivo_relatorio_ajuste_inicial}`, '_blank')}
                >
                  VISUALIZAR RELATÓRIO
                </button>
              </td>
            </tr>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Parecer Final:</th>
              <td className='valor-etapas'>{avaliacao.parecer_final}</td>
            </tr>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Nível Atribuído:</th>
              <td className='valor-etapas'>{avaliacao.nivel_atribuido}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  if (isLoading) {
    return <div>Carregando...</div>; // Exibe um indicador de carregamento enquanto os dados são buscados
  }

  return (
    <div className="container-etapa">
      <h1 className='title-form'>AUDITORIA FINAL</h1>
      <div className='dica-div'>
        <strong className="dica-titulo">Observação:</strong>
        <p className='dica-texto'>
          Aqui você pode visualizar as evidências que comprovam a implementação dos processos e o nível de capacidade de processo.
        </p>
      </div>
      <div className="parent-tabs">
        {parentTabs.map(tab => (
          <button
            key={tab}
            className={`tab-button ${activeParentTab === tab ? 'active' : ''}`}
            onClick={() => {
              setActiveParentTab(tab);
              if (tab === 'Processos' && processos.length > 0) {
                setActiveChildTab(processos[0].ID);
                carregarResultadosEsperados(processos[0].ID);
              } else if (tab === 'Projeto' && projetos.length > 0) {
                setActiveChildProjectTab(projetos[0].ID);
              } else if (tab === 'Organizacional' && processosOrganizacionais.length > 0) {
                setActiveChildOrganizationalTab(processosOrganizacionais[0].ID);
              } else {
                setActiveChildTab(null);
                setActiveChildProjectTab(null);
                setActiveChildOrganizationalTab(null);
              }
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="parent-tab-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default EtapaAuditoriaFinal;