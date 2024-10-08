import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import {
  getProcessosPorAvaliacao,
  getResultadosEsperadosPorProcesso,
  getProjetosByAvaliacao,
  getDocumentosPorProjeto,
  addDocumento,
  updateDocumento,
  deleteDocumento,
  addEvidencia,
  getEvidenciasPorResultado,
  deleteEvidencia
} from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Container.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaEvidencia.css';

Modal.setAppElement('#root');

function EtapaEvidencia({ avaliacaoId, idVersaoModelo, onNext }) {
  const [processos, setProcessos] = useState([]);
  const [resultadosEsperados, setResultadosEsperados] = useState({});
  const [projetos, setProjetos] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [evidencias, setEvidencias] = useState({});
  const [selectedProcessoId, setSelectedProcessoId] = useState(null);
  const [selectedResultadoId, setSelectedResultadoId] = useState(null);
  const [selectedProjetoId, setSelectedProjetoId] = useState(null);
  const [novoDocumentoNome, setNovoDocumentoNome] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(null); // Estado para a aba ativa

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
  
      // Aguarde o carregamento dos projetos antes de carregar as evidências
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
  

  const carregarDocumentos = async (projetoId) => {
    try {
      const data = await getDocumentosPorProjeto(projetoId);
      const documentosFormatados = data.map(doc => ({
        id: doc['ID'],
        caminhoArquivo: doc['Caminho_Arquivo'],
        nomeArquivo: doc['Nome_Arquivo'],
        idProjeto: doc['ID_Projeto']
      }));
      setDocumentos(documentosFormatados);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
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

  const recarregarEvidencias = async () => {
    const newEvidencias = {};
    for (const processoId of Object.keys(resultadosEsperados)) {
      for (const resultado of resultadosEsperados[processoId]) {
        for (const projeto of projetos) {
          const data = await getEvidenciasPorResultado(resultado.ID, projeto.ID);
          newEvidencias[`${resultado.ID}-${projeto.ID}`] = data.map(doc => ({
            id: doc[0],
            caminhoArquivo: doc[1],
            nomeArquivo: doc[2],
            idProjeto: doc[3]
          }));
        }
      }
    }
    setEvidencias(newEvidencias);
  };

  const handleDocumentoUpload = async () => {
    if (!fileToUpload) {
      console.error('Nenhum arquivo selecionado');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileToUpload);

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (response.ok) {
        const documentoData = { caminho_arquivo: result.filepath, nome_arquivo: novoDocumentoNome, id_projeto: selectedProjetoId };
        const documentoResponse = await addDocumento(documentoData);
        const novoDocumento = {
          id: documentoResponse.documentoId,
          caminhoArquivo: result.filepath,
          nomeArquivo: novoDocumentoNome,
          idProjeto: selectedProjetoId
        };
        setDocumentos(prevDocumentos => [...prevDocumentos, novoDocumento]);
        setNovoDocumentoNome('');
        setFileToUpload(null);
      } else {
        console.error('Erro ao fazer upload do arquivo:', result.message);
      }
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
    }
  };

  const handleAtualizarDocumento = async (id, nomeArquivo, caminhoArquivo) => {
    const documentoData = { caminho_arquivo: caminhoArquivo, nome_arquivo: nomeArquivo, id_projeto: selectedProjetoId };
    try {
      await updateDocumento(id, documentoData);
      await carregarEvidencias(selectedResultadoId, selectedProjetoId);
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
    }
  };

  const handleDeletarDocumento = async (documentoId) => {
    try {
      await deleteDocumento(documentoId);
      setDocumentos(prevDocumentos => prevDocumentos.filter(doc => doc.id !== documentoId));
      recarregarEvidencias(); // Recarregar todas as evidências após a exclusão
    } catch (error) {
      console.error('Erro ao deletar documento:', error);
    }
  };

  const handleAdicionarEvidencia = async (documentoId) => {
    try {
      const evidenciaData = { id_resultado_esperado: selectedResultadoId, id_documento: documentoId };
      await addEvidencia(evidenciaData);
      const novaEvidencia = {
        id: documentoId,
        caminhoArquivo: documentos.find(doc => doc.id === documentoId).caminhoArquivo,
        nomeArquivo: documentos.find(doc => doc.id === documentoId).nomeArquivo,
        idProjeto: selectedProjetoId
      };
      setEvidencias(prevEvidencias => ({
        ...prevEvidencias,
        [`${selectedResultadoId}-${selectedProjetoId}`]: [...(prevEvidencias[`${selectedResultadoId}-${selectedProjetoId}`] || []), novaEvidencia]
      }));
    } catch (error) {
      console.error('Erro ao adicionar evidência:', error);
    }
  };

  const handleExcluirEvidencia = async (resultadoId, documentoId) => {
    try {
      await deleteEvidencia({ id_resultado_esperado: resultadoId, id_documento: documentoId });
      recarregarEvidencias(); // Recarregar todas as evidências após a exclusão
    } catch (error) {
      console.error('Erro ao excluir evidência:', error);
    }
  };

  const openModal = async (processoId, resultadoId, projetoId) => {
    setSelectedProcessoId(processoId);
    setSelectedResultadoId(resultadoId);
    setSelectedProjetoId(projetoId);
    await carregarDocumentos(projetoId);
    await carregarEvidencias(resultadoId, projetoId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProcessoId(null);
    setSelectedResultadoId(null);
    setSelectedProjetoId(null);
    setDocumentos([]);
  };

  return (
    <div className="container-etapa">
      <h1 className='title-form'>ADICIONAR EVIDÊNCIAS</h1>
      <div className='dica-div'>
        <strong className="dica-titulo">Dica:</strong>
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
              <label className='label-etapas'>Processo: </label>
              <h2 className='title-processo-evidencia'>{processo.Descricao}</h2>
              {resultadosEsperados[processo.ID] && resultadosEsperados[processo.ID].map(resultado => {
                const notaIndex = resultado.Descricao.indexOf('NOTA');
                const descricao = notaIndex !== -1 ? resultado.Descricao.substring(0, notaIndex).trim() : resultado.Descricao;
                const nota = notaIndex !== -1 ? resultado.Descricao.substring(notaIndex).trim() : '';
                return (
                  <div className='div-resultado-esperado-evidencia' key={resultado.ID}>
                    <h3 className='title-resultado-evidencia'>{descricao}</h3>
                    {nota && <div className='nota-adicional-div'><p className='nota-adicional-resultado'>{nota}</p></div>}
                    <div className='div-projetos-evidencia'>
                      {projetos.filter(proj => proj.ID_Avaliacao === avaliacaoId).map(projeto => (
                        <div key={projeto.ID}>
                          <h4 className='title-projeto-evidencia'>Projeto: {projeto.Nome_Projeto}</h4>
                          <button className='button-documentos-etapa-evidencia' onClick={() => openModal(processo.ID, resultado.ID, projeto.ID)}>Gerenciar Documentos</button>
                          <div>
                            {evidencias[`${resultado.ID}-${projeto.ID}`] && evidencias[`${resultado.ID}-${projeto.ID}`]
                              .map(evidencia => (
                                <div className='evidencia-e-botoes' key={evidencia.id}>
                                  <p className='title-evidencia'>Evidência: {evidencia.nomeArquivo}</p>
                                  <button className='button-mostrar-documento-etapa-evidencia' onClick={() => window.open(`http://127.0.0.1:5000/uploads/${evidencia.caminhoArquivo}`, '_blank')}>Mostrar</button>
                                  <button className='button-excluir-documento-etapa-evidencia' onClick={() => handleExcluirEvidencia(resultado.ID, evidencia.id)}>Excluir</button>
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
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Gerenciar Documentos" className="modal" overlayClassName="modal-overlay">
        <div className="form-section-document">
          <button className="button-close-form-etapa" onClick={closeModal}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div className='title-document'>
            <h2>GERENCIAR DOCUMENTOS</h2>
          </div>
          <div className='input-wrapper'>
            <label className="label-documento-evidencia">Nome do Novo Documento:</label>
            <input
              className="input-field"
              type="text"
              placeholder="Digite uma descrição para o novo documento"
              value={novoDocumentoNome || ''}
              onChange={(e) => setNovoDocumentoNome(e.target.value)}
            />
          </div>
          <div className='input-wrapper-file-document'>
            <label className="label-arquivo-evidencia">Upload de Novo Arquivo:</label>
            <input
              className="input-field-file-document"
              type="file"
              id="file"
              onChange={(e) => setFileToUpload(e.target.files[0])}
            />
            <label htmlFor="file">Escolha um arquivo</label>
            {fileToUpload && <p className='arquivo-adicionado'>Arquivo adicionado</p>}
            <button className="button-add-document" type="button" onClick={handleDocumentoUpload}>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </button>
          </div>
          <h3 className='title-document'>Documentos Existentes:</h3>
          <table className='documentos-existente-table'>
            <tbody>
              {documentos.map(doc => (
                <tr className='input-botoes-documento-preenchido' key={doc.id}>
                  <td>
                    <input
                      className='input-field-documento-preenchido'
                      type="text"
                      value={doc.nomeArquivo}
                      onChange={(e) => setDocumentos(documentos.map(d => d.id === doc.id ? { ...d, nomeArquivo: e.target.value } : d))}
                    />
                  </td>
                  <td>
                    <button className='acoes-botao-document' onClick={() => handleAtualizarDocumento(doc.id, doc.nomeArquivo, doc.caminhoArquivo)}>ATUALIZAR</button>
                  </td>
                  <td>
                    <button className='acoes-botao-document' onClick={() => handleDeletarDocumento(doc.id)}>REMOVER</button>
                  </td>
                  <td>
                    <button className='acoes-botao-document' onClick={() => handleAdicionarEvidencia(doc.id)}>ADICIONAR EVIDÊNCIA</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
      <button className='button-next' onClick={onNext}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default EtapaEvidencia;