import React, { useState, useEffect } from 'react';
import {
  getAvaliacaoById,
  getProcessosPorAvaliacao,
  getResultadosEsperadosPorProcesso,
  getProjetosByAvaliacao,
  getEvidenciasPorResultado,
  getRelatorioAuditoriaFinal,
  getGrausImplementacaoEmpresa,
  addGrauImplementacaoEmpresa,
  updateGrausImplementacaoEmpresa,
  addOrUpdateGrauImplementacao,
  getGrausImplementacao,
  getProcessos,
  getPerguntasCapacidadeProjeto,
  getPerguntasCapacidadeOrganizacional,
  getCapacidadeProcessoProjeto,
  addCapacidadeProcessoProjeto,
  updateCapacidadeProcessoProjeto,
  getCapacidadeProcessoOrganizacional,
  addCapacidadeProcessoOrganizacional,
  updateCapacidadeProcessoOrganizacional,
  getNiveisLimitado,
  updateResultadoFinal,
  getEvidenciasPorPerguntaProjeto,
  addEvidenciaProjeto,
  deleteEvidenciaProjeto,
  getEvidenciasPorPerguntaOrganizacional,
  addEvidenciaOrganizacional,
  deleteEvidenciaOrganizacional,
  uploadFile,
} from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Container.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaEvidencia.css';
import '../components/styles/EtapaResumoCaracterizacao.css';
import '../components/styles/EtapaRealizarAjusteAvaliacaoFinal.css';
import '../components/styles/EtapaCaracterizacao.css';
import img_certo from '../img/certo.png';
import img_errado from '../img/errado.png';

function EtapaRealizarAjusteAvaliacaoFinal({ avaliacaoId, idVersaoModelo, onBack }) {
  const [processos, setProcessos] = useState([]);
  const [resultadosEsperados, setResultadosEsperados] = useState({});
  const [projetos, setProjetos] = useState([]);
  const [evidencias, setEvidencias] = useState({});
  const [activeParentTab, setActiveParentTab] = useState('Resultado Auditoria');
  const [activeChildTab, setActiveChildTab] = useState(null);
  const [avaliacao, setAvaliacao] = useState(null);
  const [aprovacao, setAprovacao] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [relatorioExiste, setRelatorioExiste] = useState(false);
  const [arrayResumo, setArrayResumo] = useState([]);
  const [resumoSalvo, setResumoSalvo] = useState(false);
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
  const [parecerFinal, setParecerFinal] = useState('');
  const [selectedNivel, setSelectedNivel] = useState('');
  const [niveis, setNiveis] = useState([]);
  const [nivelDisabled, setNivelDisabled] = useState(false);

  const [evidenciasProjeto, setEvidenciasProjeto] = useState({});
  const [evidenciasOrganizacional, setEvidenciasOrganizacional] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  const parentTabs = [
    'Resultado Auditoria',
    'Informações Gerais',
    'Processos',
    'Resumo da Caracterização da Avaliação',
    'Projeto',
    'Organizacional',
    'Concluir Ajustes',
  ];

  const options = [
    'Totalmente implementado (T)',
    'Largamente implementado (L)',
    'Parcialmente implementado (P)',
    'Não implementado (N)',
    'Não avaliado (NA)',
    'Fora do escopo (F)',
  ];

  const descricaoToAbbr = {
    'Gerência de Projetos': 'GPR',
    'Engenharia de Requisitos': 'REQ',
    'Projeto e Construção do Produto': 'PCP',
    'Integração do Produto': 'ITP',
    'Verificação e Validação': 'VV',
    'Gerência de Configuração': 'GCO',
    'Aquisição': 'AQU',
    'Medição': 'MED',
    'Gerência de Decisões': 'GDE',
    'Gerência de Recursos Humanos': 'GRH',
    'Gerência de Processos': 'GPC',
    'Gerência Organizacional': 'ORG',
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

  const salvarNotas = async () => {
    try {
      const entries = Object.entries(grausImplementacao);
      for (const [key, nota] of entries) {
        const [resultadoId, projetoId] = key.split('-');
        await addOrUpdateGrauImplementacao({
          nota,
          resultadoId: parseInt(resultadoId),
          projetoId: parseInt(projetoId),
        });
      }
      alert('Notas salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar notas:', error);
      alert('Erro ao salvar notas.');
    }
  };

  const carregarDados = async () => {
    try {
      const avaliacaoData = await getAvaliacaoById(avaliacaoId);
      setAvaliacao(avaliacaoData);

      if (avaliacaoData && avaliacaoData.id_nivel_solicitado) {
        setIdNivel(avaliacaoData.id_nivel_solicitado);

        const niveisData = await getNiveisLimitado(
          avaliacaoData.id_versao_modelo,
          avaliacaoData.id_nivel_solicitado
        );
        setNiveis(niveisData);
      }

      setParecerFinal(avaliacaoData.parecer_final || '');
      if (avaliacaoData.parecer_final === 'Satisfeito') {
        setSelectedNivel(avaliacaoData.id_nivel_atribuido || avaliacaoData.id_nivel_solicitado);
        setNivelDisabled(true);
      } else if (avaliacaoData.parecer_final === 'Não Satisfeito') {
        setSelectedNivel(avaliacaoData.id_nivel_atribuido || '');
        setNivelDisabled(false);
      } else {
        setNivelDisabled(true);
      }

      await carregarRelatorioAuditoriaFinal();

      await carregarProjetos();

      await carregarProcessosOrganizacionais();

      await carregarRespostasProjeto();
      await carregarRespostasOrganizacional();

      const processosLoaded = await carregarProcessos();

      await carregarGrausImplementacao();

      for (const processo of processosLoaded) {
        await carregarResultadosEsperados(processo.ID);
      }

      await carregarResumoAvaliacao(processosLoaded);

      if (activeParentTab === 'Processos') {
        if (processosLoaded.length > 0) {
          setActiveChildTab(processosLoaded[0].ID);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados da avaliação:', error);
    } finally {
      setIsLoading(false); // Set loading to false after data is fetched
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

      const initialRespostas = {};
      filteredProcesses.forEach(processo => {
        initialRespostas[processo.ID] = { nota: 'Não avaliado (NA)' };
      });
      setRespostasOrganizacional(initialRespostas);
    } catch (error) {
      console.error('Erro ao carregar processos organizacionais:', error);
    }
  };

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
            [pergunta.ID]: data,
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
            [pergunta.ID]: data,
          };
        }
      }
      setEvidenciasOrganizacional(novasEvidencias);
    } catch (error) {
      console.error('Erro ao carregar evidências organizacionais:', error);
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

  const carregarResultadosEsperados = async processoId => {
    try {
      const data = await getResultadosEsperadosPorProcesso(processoId, avaliacaoId);
      setResultadosEsperados(prevResultados => ({
        ...prevResultados,
        [processoId]: data,
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
        idProjeto: doc[3],
      }));
      setEvidencias(prevEvidencias => ({
        ...prevEvidencias,
        [`${resultadoId}-${projetoId}`]: evidenciasFormatadas,
      }));
    } catch (error) {
      console.error('Erro ao carregar evidencias:', error);
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

  const carregarResumoAvaliacao = async processosLoaded => {
    try {
      const resumo = await getGrausImplementacaoEmpresa(avaliacaoId);

      if (resumo && resumo.length > 0) {
        setResumoSalvo(true);
        await montarArrayComResumo(resumo, processosLoaded);
      } else {
        await montarArrayComResumo([], processosLoaded);
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
            [processo.ID]: resultados,
          }));
        }

        resultados.forEach(resultado => {
          const notaResumo =
            resumo.find(item => item.ID_Resultado_Esperado === resultado.ID)?.Nota ||
            'Não avaliado (NA)';

          arrayInicial.push({
            id_avaliacao: avaliacaoId,
            id_processo: processo.ID,
            processo_descricao: processo.Descricao,
            id_resultado_esperado: resultado.ID,
            resultado_descricao: resultado.Descricao,
            nota: notaResumo,
          });
        });
      }

      setArrayResumo(arrayInicial);
    } catch (error) {
      console.error('Erro ao montar array com resumo:', error);
    }
  };

  const handleParecerFinalChange = e => {
    const valor = e.target.value;
    setParecerFinal(valor);

    if (valor === 'Satisfeito') {
      setSelectedNivel(avaliacao.id_nivel_solicitado);
      setNivelDisabled(true);
    } else if (valor === 'Não Satisfeito') {
      setSelectedNivel('');
      setNivelDisabled(false);
    } else {
      setSelectedNivel('');
      setNivelDisabled(true);
    }
  };

  const handleSaveInformacoesGerais = () => {
    if (!parecerFinal || !selectedNivel) {
      alert('Por favor, selecione o parecer final e o nível atribuído.');
      return;
    }

    const data = {
      idAvaliacao: avaliacaoId,
      parecerFinal: parecerFinal,
      idNivelAtribuido: selectedNivel,
    };

    updateResultadoFinal(avaliacaoId, data)
      .then(() => {
        alert('Informações gerais atualizadas com sucesso!');
      })
      .catch(error => {
        console.error('Erro ao atualizar informações gerais:', error);
        alert('Erro ao atualizar informações gerais. Tente novamente.');
      });
  };

  const handleSelectChange = (evento, resultadoId, projetoId) => {
    const nota = evento.target.value;
    setGrausImplementacao(prevGraus => ({
      ...prevGraus,
      [`${resultadoId}-${projetoId}`]: nota,
    }));
  };

  const handleRespostaProjetoChange = (projectId, value) => {
    setRespostasProjeto(prevState => ({
      ...prevState,
      [projectId]: { nota: value },
    }));
  };

  const handleRespostaOrganizacionalChange = (processId, value) => {
    setRespostasOrganizacional(prevState => ({
      ...prevState,
      [processId]: { nota: value },
    }));
  };

  const handleFileChangeProjeto = async (projectId, perguntaId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await uploadFile(formData);
      const result = await response.json();
      if (response.ok) {
        const data = {
          id_pergunta: perguntaId,
          id_projeto: projectId,
          caminho_arquivo: result.filepath,
          nome_arquivo: file.name,
        };
        await addEvidenciaProjeto(data);
        await carregarEvidenciasProjeto();
      } else {
        console.error('Erro ao fazer upload do arquivo:', result.message);
      }
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
    }
  };

  const handleDeleteEvidenciaProjeto = async (projectId, perguntaId, evidenciaId) => {
    try {
      await deleteEvidenciaProjeto(evidenciaId);
      await carregarEvidenciasProjeto();
    } catch (error) {
      console.error('Erro ao deletar evidência:', error);
    }
  };

  const handleFileChangeOrganizacional = async (processId, perguntaId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await uploadFile(formData);
      const result = await response.json();
      if (response.ok) {
        const data = {
          id_pergunta: perguntaId,
          id_processo: processId,
          caminho_arquivo: result.filepath,
          nome_arquivo: file.name,
          id_avaliacao: avaliacaoId,
        };
        await addEvidenciaOrganizacional(data);
        await carregarEvidenciasOrganizacional();
      } else {
        console.error('Erro ao fazer upload do arquivo:', result.message);
      }
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
    }
  };

  const handleDeleteEvidenciaOrganizacional = async (processId, perguntaId, evidenciaId) => {
    try {
      await deleteEvidenciaOrganizacional(evidenciaId);
      await carregarEvidenciasOrganizacional();
    } catch (error) {
      console.error('Erro ao deletar evidência:', error);
    }
  };

  const salvarRespostasProjeto = async () => {
    try {
      const dataToSend = Object.keys(respostasProjeto).map(projectId => ({
        id_avaliacao: avaliacaoId,
        id_projeto: projectId,
        nota: respostasProjeto[projectId].nota,
      }));

      if (dataToSend.length === 0) {
        console.warn('Nenhuma resposta para salvar na aba Projeto.');
        return;
      }

      const existingData = await getCapacidadeProcessoProjeto(avaliacaoId);
      const existingProjectIds = existingData ? existingData.map(item => item.ID_Projeto) : [];

      const dataToUpdate = dataToSend.filter(item => existingProjectIds.includes(item.id_projeto));
      const dataToInsert = dataToSend.filter(
        item => !existingProjectIds.includes(item.id_projeto)
      );

      if (dataToUpdate.length > 0) {
        await updateCapacidadeProcessoProjeto(dataToUpdate);
      }

      if (dataToInsert.length > 0) {
        await addCapacidadeProcessoProjeto(dataToInsert);
      }

      alert('Respostas do projeto salvas com sucesso.');
    } catch (error) {
      console.error('Erro ao salvar respostas do projeto:', error);
      alert('Erro ao salvar respostas do projeto.');
    }
  };

  const salvarRespostasOrganizacional = async () => {
    try {
      const dataToSend = Object.keys(respostasOrganizacional).map(processId => ({
        id_avaliacao: avaliacaoId,
        id_processo: processId,
        nota: respostasOrganizacional[processId].nota,
      }));

      if (dataToSend.length === 0) {
        console.warn('Nenhuma resposta para salvar na aba Organizacional.');
        return;
      }

      const existingData = await getCapacidadeProcessoOrganizacional(avaliacaoId);
      const existingProcessIds = existingData ? existingData.map(item => item.ID_Processo) : [];

      const dataToUpdate = dataToSend.filter(item =>
        existingProcessIds.includes(item.id_processo)
      );
      const dataToInsert = dataToSend.filter(
        item => !existingProcessIds.includes(item.id_processo)
      );

      if (dataToUpdate.length > 0) {
        await updateCapacidadeProcessoOrganizacional(dataToUpdate);
      }

      if (dataToInsert.length > 0) {
        await addCapacidadeProcessoOrganizacional(dataToInsert);
      }

      alert('Respostas organizacionais salvas com sucesso.');
    } catch (error) {
      console.error('Erro ao salvar respostas organizacionais:', error);
      alert('Erro ao salvar respostas organizacionais.');
    }
  };

  const handleSaveProjeto = () => {
    salvarRespostasProjeto();
  };

  const handleSaveOrganizacional = () => {
    salvarRespostasOrganizacional();
  };

  const handleNotaChange = (resultadoId, nota) => {
    setArrayResumo(prevArray =>
      prevArray.map(item =>
        item.id_resultado_esperado === resultadoId ? { ...item, nota: nota } : item
      )
    );
  };

  const salvarResumoCaracterizacao = async () => {
    try {
      if (resumoSalvo) {
        await updateGrausImplementacaoEmpresa(arrayResumo);
        alert('Resumo atualizado com sucesso!');
      } else {
        const response = await addGrauImplementacaoEmpresa(arrayResumo);
        if (response.message === 'Graus de implementação inseridos com sucesso!') {
          setResumoSalvo(true);
          alert('Resumo salvo com sucesso!');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar resumo:', error);
      alert('Erro ao salvar resumo.');
    }
  };

  const renderProcessosContent = () => {
    return (
      <>
        <div className="tabs">
          {processos.map(processo => (
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
          {processos.map(processo =>
            activeChildTab === processo.ID ? (
              <div key={processo.ID}>
                <label className="label-etapas">Processo: </label>
                <h2 className="title-processo-caracterizacao">{processo.Descricao}</h2>
                {resultadosEsperados[processo.ID] &&
                  resultadosEsperados[processo.ID].map(resultado => {
                    const notaIndex = resultado.Descricao.indexOf('NOTA');
                    const descricao =
                      notaIndex !== -1
                        ? resultado.Descricao.substring(0, notaIndex).trim()
                        : resultado.Descricao;
                    const nota =
                      notaIndex !== -1 ? resultado.Descricao.substring(notaIndex).trim() : '';
                    return (
                      <div className="div-resultado-esperado-caracterizacao" key={resultado.ID}>
                        <label className="label-etapas">Resultado Esperado: </label>
                        <h3 className="title-resultado-caracterizacao">{descricao}</h3>
                        {nota && (
                          <div className="nota-adicional-div">
                            <p className="nota-adicional-resultado">{nota}</p>
                          </div>
                        )}
                        <div className="div-projeto-evidencias-ajuste-avaliacao-final">
                          {projetos
                            .filter(proj => proj.ID_Avaliacao === avaliacaoId)
                            .map(projeto => (
                              <div key={projeto.ID}>
                                <h4 className="title-projeto-caracterizacao">
                                  Projeto: {projeto.Nome_Projeto}
                                </h4>
                                <select
                                  className="select-grau-ajuste-avaliacao-final"
                                  value={
                                    grausImplementacao[`${resultado.ID}-${projeto.ID}`] ||
                                    'Não avaliado (NA)'
                                  }
                                  onChange={e => handleSelectChange(e, resultado.ID, projeto.ID)}
                                >
                                  {options.map((option, index) => (
                                    <option key={index} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                                <div>
                                  {evidencias[`${resultado.ID}-${projeto.ID}`] &&
                                    evidencias[`${resultado.ID}-${projeto.ID}`].map(evidencia => (
                                      <div className="evidencia-e-botao" key={evidencia.id}>
                                        <p className="title-evidencia-caracterizacao">
                                          Evidência: {evidencia.nomeArquivo}
                                        </p>
                                        <button
                                          className="button-mostrar-documento-etapa-evidencia"
                                          onClick={() =>
                                            window.open(
                                              `http://127.0.0.1:5000/uploads/${evidencia.caminhoArquivo}`,
                                              '_blank'
                                            )
                                          }
                                        >
                                          Mostrar
                                        </button>
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
            ) : null
          )}
        </div>
        <button className="button-save" onClick={salvarNotas}>
          SALVAR NOTAS
        </button>
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
            activeChildProjectTab === projeto.ID ? (
              <div key={projeto.ID}>
                <h2 className="title-caracterizacao-capacidade-processo">{projeto.Nome_Projeto}</h2>
                <table className="tabela-caracterizacao-capacidade-processo">
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
                                <button className='button-excluir-documento-etapa-evidencia'
                                  onClick={() =>
                                    handleDeleteEvidenciaProjeto(projeto.ID, pergunta.ID, evidencia.ID)
                                  }
                                >
                                  Excluir
                                </button>
                              </div>
                            ))
                          ) : (
                            <input
                              type="file"
                              onChange={e => handleFileChangeProjeto(projeto.ID, pergunta.ID, e)}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                    {/* Nota Final */}
                    <tr>
                      <td>
                        <strong className="label-etapas">Nota Final</strong>
                      </td>
                      <td>
                        <select
                          className="select-grau-caracterizacao-capacidade-processo"
                          value={respostasProjeto[projeto.ID]?.nota || 'Não avaliado (NA)'}
                          onChange={e => handleRespostaProjetoChange(projeto.ID, e.target.value)}
                        >
                          {options.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : null
          )}
        </div>
        <button className="button-save" onClick={handleSaveProjeto}>
          SALVAR
        </button>
      </>
    );
  };

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
              className={`tab-button ${
                activeChildOrganizationalTab === processo.ID ? 'active' : ''
              }`}
              onClick={() => setActiveChildOrganizationalTab(processo.ID)}
            >
              {descricaoToAbbr[processo.Descricao] || processo.Descricao}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {processosOrganizacionais.map(processo =>
            activeChildOrganizationalTab === processo.ID ? (
              <div key={processo.ID}>
                <h2 className="title-caracterizacao-capacidade-processo">{processo.Descricao}</h2>
                <table className="tabela-caracterizacao-capacidade-processo">
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
                                <button className='button-excluir-documento-etapa-evidencia'
                                  onClick={() =>
                                    handleDeleteEvidenciaOrganizacional(
                                      processo.ID,
                                      pergunta.ID,
                                      evidencia.ID
                                    )
                                  }
                                >
                                  Excluir
                                </button>
                              </div>
                            ))
                          ) : (
                            <input
                              type="file"
                              onChange={e =>
                                handleFileChangeOrganizacional(processo.ID, pergunta.ID, e)
                              }
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                    {/* Nota Final */}
                    <tr>
                      <th>
                        <strong className="label-etapas">Nota Final</strong>
                      </th>
                      <td>
                        <select
                          className="select-grau-caracterizacao-capacidade-processo"
                          value={respostasOrganizacional[processo.ID]?.nota || 'Não avaliado (NA)'}
                          onChange={e => handleRespostaOrganizacionalChange(processo.ID, e.target.value)}
                        >
                          {options.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : null
          )}
        </div>
        <button className="button-save" onClick={handleSaveOrganizacional}>
          SALVAR
        </button>
      </>
    );
  };

  const renderResultadoAuditoriaContent = () => {
    return (
      <div className="container-etapas">
        <h2 className="title-form-auditoria-final">RESULTADO DA AUDITORIA FINAL</h2>
        {aprovacao === 'Aprovar' && (
          <>
            <div className="div-resultado-auditoria">
              <p className="label-etapas">Auditoria Aprovada</p>
              <img src={img_certo} className="imagem-certo-errado" alt="certo" />
            </div>
          </>
        )}
        {aprovacao === 'Reprovar' && (
          <>
            <div className="div-resultado-auditoria">
              <p className="label-etapas">Auditoria Reprovada</p>
              <img src={img_errado} className="imagem-certo-errado" alt="errado" />
            </div>
            <p className="label-etapas">Justificativa: {justificativa}</p>
          </>
        )}
      </div>
    );
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
          <h2 className="title-form-auditoria-final">RESUMO DA CARACTERIZAÇÃO DA AVALIAÇÃO</h2>
          <table className="resumo-tabela">
            <thead>
              <tr className="tr-table-resumo-caracterizacao">
                <th className="resultado-esperado-head">Resultado Esperado</th>
                <th className="nota-head">Nota</th>
              </tr>
            </thead>
            <tbody>
              {processos.map(processo =>
                activeTab === processo.ID
                  ? (resultadosEsperados[processo.ID] || []).map(resultado => {
                      const notaIndex = resultado.Descricao.indexOf('NOTA');
                      const descricao =
                        notaIndex !== -1
                          ? resultado.Descricao.substring(0, notaIndex).trim()
                          : resultado.Descricao;
                      const nota =
                        notaIndex !== -1 ? resultado.Descricao.substring(notaIndex).trim() : '';
                      const itemResumo = arrayResumo.find(
                        item => item.id_resultado_esperado === resultado.ID
                      );
                      return (
                        <tr className="tr-table-resumo-caracterizacao" key={resultado.ID}>
                          <td className="resultado-esperado-body">
                            <span className="resultado-esperado">{descricao}</span>
                            {nota && (
                              <div className="nota-adicional-tabela">
                                <p className="nota-adicional-resultado-tabela">{nota}</p>
                              </div>
                            )}
                          </td>
                          <td className="nota-body">
                            {itemResumo?.nota === 'Escolher L ou P' ||
                            itemResumo?.nota === 'Escolher L, N ou P' ? (
                              <select
                                className="select-grau-resumo-caracterizacao-invalido"
                                onChange={e => handleNotaChange(resultado.ID, e.target.value)}
                                value=""
                              >
                                {itemResumo?.nota === 'Escolher L ou P' ? (
                                  <>
                                    <option value="" disabled>
                                      Selecione L ou P
                                    </option>
                                    <option value="Largamente implementado (L)">
                                      Largamente implementado (L)
                                    </option>
                                    <option value="Parcialmente implementado (P)">
                                      Parcialmente implementado (P)
                                    </option>
                                  </>
                                ) : (
                                  <>
                                    <option value="" disabled>
                                      Selecione L, N ou P
                                    </option>
                                    <option value="Largamente implementado (L)">
                                      Largamente implementado (L)
                                    </option>
                                    <option value="Não implementado (N)">
                                      Não implementado (N)
                                    </option>
                                    <option value="Parcialmente implementado (P)">
                                      Parcialmente implementado (P)
                                    </option>
                                  </>
                                )}
                              </select>
                            ) : (
                              <select
                                className="select-grau-resumo-caracterizacao"
                                value={itemResumo?.nota || 'Não avaliado (NA)'}
                                onChange={e => handleNotaChange(resultado.ID, e.target.value)}
                              >
                                <option value="Totalmente implementado (T)">
                                  Totalmente implementado (T)
                                </option>
                                <option value="Largamente implementado (L)">
                                  Largamente implementado (L)
                                </option>
                                <option value="Parcialmente implementado (P)">
                                  Parcialmente implementado (P)
                                </option>
                                <option value="Não implementado (N)">Não implementado (N)</option>
                                <option value="Não avaliado (NA)">Não avaliado (NA)</option>
                                <option value="Fora do escopo (F)">Fora do escopo (F)</option>
                              </select>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  : null
              )}
            </tbody>
          </table>
        </div>
        <button className="button-save" onClick={salvarResumoCaracterizacao}>
          {resumoSalvo ? 'ATUALIZAR' : 'SALVAR'}
        </button>
      </div>
    );
  };

  const renderInformacoesGeraisContent = () => {
    if (!avaliacao) {
      return <p>Carregando dados...</p>;
    }

    return (
      <div className="conteudo-etapas">
        <h2 className="title-form-auditoria-final">INFORMAÇÕES GERAIS</h2>
        <table className="table-informacoes-gerais-ajuste-avaliacao-final">
          <tbody>
            <tr>
              <th>Nome da Avaliação:</th>
              <td>{avaliacao.nome}</td>
            </tr>
            <tr>
              <th>Descrição:</th>
              <td>{avaliacao.descricao}</td>
            </tr>
            <tr>
              <th>Avaliador Líder:</th>
              <td>{avaliacao.nome_avaliador_lider}</td>
            </tr>
            <tr>
              <th>Empresa:</th>
              <td>{avaliacao.nome_empresa}</td>
            </tr>
            <tr>
              <th>Nível Solicitado:</th>
              <td>{avaliacao.nivel_solicitado}</td>
            </tr>
            <tr>
              <th>Versão do Modelo:</th>
              <td>{avaliacao.nome_versao_modelo}</td>
            </tr>
            <tr>
              <th>Atividade Planejamento:</th>
              <td>{avaliacao.atividade_planejamento}</td>
            </tr>
            <tr>
              <th>Cronograma Planejamento:</th>
              <td>{avaliacao.cronograma_planejamento}</td>
            </tr>
            <tr>
              <th>Ata de Reunião de Abertura:</th>
              <td>{avaliacao.ata_reuniao_abertura}</td>
            </tr>
            <tr>
              <th>Descrição Relatório de Ajuste Inicial:</th>
              <td>{avaliacao.descricao_relatorio_ajuste_inicial}</td>
            </tr>
            <tr>
              <th>Parecer Final:</th>
              <td>
                <select
                  value={parecerFinal}
                  onChange={handleParecerFinalChange}
                  className="select-ajuste-avaliacao-final"
                >
                  <option value="">Selecione um resultado</option>
                  <option value="Satisfeito">Satisfeito</option>
                  <option value="Não Satisfeito">Não Satisfeito</option>
                </select>
              </td>
            </tr>
            {parecerFinal && (
              <tr>
                <th>Nível Atribuído:</th>
                <td>
                  <select
                    value={selectedNivel}
                    onChange={e => setSelectedNivel(e.target.value)}
                    className="select-ajuste-avaliacao-final"
                    disabled={nivelDisabled}
                  >
                    <option value="">Selecione um nível</option>
                    {niveis.length > 0 &&
                      niveis.map(nivel => (
                        <option key={nivel['ID']} value={nivel['ID']}>
                          {nivel['Nivel']} - {nivel['Nome_Nivel']}
                        </option>
                      ))}
                  </select>
                </td>
              </tr>
            )}
            <tr>
              <th>Nível Atribuído Atual:</th>
              <td>{avaliacao.nivel_atribuido}</td>
            </tr>
            <tr>
              <th>Parecer Final Atual:</th>
              <td>{avaliacao.parecer_final}</td>
            </tr>
          </tbody>
        </table>
        <button className="button-save" onClick={handleSaveInformacoesGerais}>
          SALVAR
        </button>
      </div>
    );
  };

  const renderConcluirAjustesContent = () => {
    const handleConcluirClick = () => {
      const confirmacao = window.confirm(
        'Será solicitado que o auditor realize a auditoria novamente. Deseja continuar?'
      );

      if (confirmacao) {
        onBack();
      }
    };

    return (
      <div className="container-etapas">
        <h2 className="title-form-auditoria-final">CONCLUIR AJUSTES</h2>
        <div className="dica-div">
          <strong className="dica-titulo">Observação:</strong>
          <p className="dica-texto">
            Ao clicar em "CONCLUIR", o auditor será solicitado a realizar a auditoria novamente.
          </p>
        </div>
        <button className="button-next" onClick={handleConcluirClick}>
          CONCLUIR
        </button>
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
      case 'Organizacional':
        return renderOrganizacionalContent();
      case 'Resultado Auditoria':
        return renderResultadoAuditoriaContent();
      case 'Resumo da Caracterização da Avaliação':
        return renderResumoAvaliacaoContent();
      case 'Concluir Ajustes':
        return renderConcluirAjustesContent();
      default:
        return null;
    }
  };

  // Before rendering, check if data is still loading
  if (isLoading) {
    return <div>Carregando...</div>; // Display loading indicator while data is being fetched
  }

  return (
    <div className="container-etapa">
      <h1 className="title-form">AJUSTE DA AVALIAÇÃO FINAL</h1>
      <div className="dica-div">
        <strong className="dica-titulo">Observação:</strong>
        <p className="dica-texto">
          Aqui você pode visualizar e ajustar as informações relacionadas à avaliação final.
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
      <div className="parent-tab-content">{renderContent()}</div>
    </div>
  );
}

export default EtapaRealizarAjusteAvaliacaoFinal;