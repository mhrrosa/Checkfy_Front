const baseUrl = 'https://checkfybackend.vercel.app/';

function post(url, data) {
  return fetch(`${baseUrl}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erro na requisição POST para ${url}: ${response.status}`);
    }
    return response.json();
  })
  .catch(error => {
    console.error('Erro ao realizar POST:', error);
    throw error;
  });
}

function get(url) {
  return fetch(`${baseUrl}${url}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na requisição GET');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Erro ao realizar GET:', error);
      throw error;
    });
}

function put(url, data) {
  return fetch(`${baseUrl}${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Erro na requisição PUT para ${url}: ${response.status}`);
    }
    return response.json();
  }).catch(error => {
    console.error('Erro ao realizar PUT:', error);
    throw error;
  });
}

function deleteRequest(url) {
  return fetch(`${baseUrl}${url}`, {
    method: 'DELETE'
  }).then(response => {
    if (!response.ok) {
      throw new Error('Erro na requisição DELETE');
    }
    return response.json();
  }).catch(error => {
    console.error('Erro ao realizar DELETE:', error);
    throw error;
  });
}

function remove(url) {
  return fetch(`${baseUrl}${url}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro na requisição DELETE');
    }
    return response.json();
  })
  .catch(error => {
    console.error('Erro ao realizar DELETE:', error);
    throw error;
  });
}

// Funções para avaliação
function startNewEvaluation(data) {
  const url = '/add_avaliacao';
  return post(url, data)
    .then(response => {
      return response;
    });
}

function getAllAvaliacoes(userId) {
  return get(`/listar_avaliacoes/${userId}`);
}

function deleteAvaliacao(id) {
  return remove(`/deletar_avaliacao/${id}`);
}

function getAvaliacaoById(id) {
  return get(`/avaliacao/${id}`);
}

function updateAvaliacao(id, data) {
  return put(`/atualizar_avaliacao/${id}`, data);
}

function updateIdAtividade(id, idAtividade) {
  return put(`/atualizar_atividade/${id}`, { id_atividade: idAtividade });
}

// Funções para Níveis
function createNivel(data) {
  return post('/add_nivel', data);
}

function getNiveis(idVersaoModelo) {
  return get(`/get_niveis/${idVersaoModelo}`);
}

function getNiveisLimitado(idVersaoModelo, idNivelSolicitado) {
  return get(`/get_niveis_limitado/${idVersaoModelo}/${idNivelSolicitado}`);
}

function updateNivel(id, data) {
  return put(`/update_nivel/${id}`, data);
}

function deleteNivel(id) {
  return deleteRequest(`/delete_nivel/${id}`);
}

// Funções para Processos
function getProcessos(idVersaoModelo) {
  return get(`/get_processos/${idVersaoModelo}`);
}

function createProcesso(data) {
  return post('/add_processo', data);
}

function updateProcesso(id, data) {
  return put(`/update_processo/${id}`, data);
}

function deleteProcesso(id) {
  return deleteRequest(`/delete_processo/${id}`);
}

// Funções para Resultados Esperados
function getResultadosEsperados(processosId) {
  const query = processosId.join(',');
  return fetch(`${baseUrl}/get_resultados_esperados?processosId=${query}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na requisição GET');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Erro ao realizar GET:', error);
      throw error;
    });
}

function createResultadoEsperado(data) {
  return post('/add_resultado_esperado', data);
}

function updateResultadoEsperado(id, data) {
  return put(`/update_resultado_esperado/${id}`, data);
}

function deleteResultadoEsperado(id) {
  return deleteRequest(`/delete_resultado_esperado/${id}`);
}

// Funções para Projetos e Documentos
function getProjetosByAvaliacao(avaliacaoId) {
  return get(`/get_projetos_by_avaliacao/${avaliacaoId}`)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error('Erro ao buscar projetos:', error);
      throw error;
    });
}

function createProjeto(data) {
  return post('/add_projeto', data);
}

function updateProjeto(id, data) {
  return put(`/update_projeto/${id}`, data);
}

function addDocumento(data) {
  return post('/add_documento', data)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error('Erro ao adicionar documento:', error);
      throw error;
    });
}

function getDocumentosPorProjeto(idProjeto) {
  return get(`/documentos_por_projeto/${idProjeto}`);
}

function updateDocumento(id, data) {
  return put(`/update_documento/${id}`, data);
}

function deleteDocumento(id) {
  return deleteRequest(`/delete_documento/${id}`);
}

// Funções para Evidenciaes
function addEvidencia(data) {
  return post('/add_evidencia', data);
}

function getEvidenciasPorResultado(resultadoId, projetoId) {
  return get(`/get_evidencias_por_resultado/${resultadoId}/${projetoId}`)
    .then(response => {
      return response;
    });
}

function updateEvidencia(id, data) {
  return put(`/update_evidencia/${id}`, data);
}

function deleteEvidencia(data) {
  const { id_resultado_esperado, id_documento } = data;
  return deleteRequest(`/delete_evidencia/${id_resultado_esperado}/${id_documento}`);
}

function getProcessosPorAvaliacao(avaliacaoId, idVersaoModelo) {
  return get(`/get_processos_por_avaliacao/${avaliacaoId}/${idVersaoModelo}`).then(response => {
    return response;
  });
}

function getResultadosEsperadosPorProcesso(processoId, avaliacaoId) {
  return get(`/get_resultados_esperados_por_processo/${processoId}/${avaliacaoId}`).then(response => {
    return response;
  });
}

// Função para grau de implementação do processo do projeto
function addOrUpdateGrauImplementacao(data) {
  return post('/add_or_update_grau_implementacao', data)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error('Erro ao adicionar/atualizar grau de implementação:', error);
      throw error;
    });
}

function getGrausImplementacao(avaliacaoId) {
  return get(`/get_graus_implementacao/${avaliacaoId}`)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error('Erro ao buscar graus de implementação:', error);
      throw error;
    });
}


function getVersaoModelo(){
  return get(`/get_versao_modelo`)
}

function addVersaoModelo(data){
  return post('/add_versao_modelo', data)
  .then(response => {
    return response;
  })
  .catch(error => {
    console.error('Erro ao adicionar versão do modelo:', error);
    throw error;
  });
}

function deleteVersaoModelo(idVersaoModelo){
  return idVersaoModelo(`/delete_versao_modelo/${idVersaoModelo}`);
}

function updateVersaoModelo(idVersaoModelo, data){
  return put(`/update_versao_modelo/${idVersaoModelo}`, data);
}

function getEmpresas(){
  return get(`/get_empresas`)
}

function addEmpresa(data){
  return post('/add_empresa', data)
  .then(response => {
    return response;
  })
  .catch(error => {
    console.error('Erro ao adicionar versão do modelo:', error);
    throw error;
  });
}

function deleteEmpresa(idEmpresa){
  return deleteRequest(`/delete_empresa/${idEmpresa}`);
}

function updateEmpresa(idEmpresa, data){
  return put(`/update_empresa/${idEmpresa}`, data);
}

function empresaAvaliacaoInsert(avaliacaoId, data){
  return put(`/empresa_avaliacao_insert/${avaliacaoId}`, data);
}

function getInstituicoes(){
  return get(`/get_instituicoes`)
}

function addInstituicao(data){
  return post('/add_instituicao', data)
  .then(response => {
    return response;
  })
  .catch(error => {
    console.error('Erro ao adicionar versão do modelo:', error);
    throw error;
  });
}

function deleteInstituicao(idInstituicao){
  return deleteRequest(`/delete_instituicao/${idInstituicao}`);
}

function updateInstituicao(idInstituicao, data){
  return put(`/update_instituicao/${idInstituicao}`, data);
}

function instituicaoAvaliacaoInsert(avaliacaoId, data){
  return put(`/instituicao_avaliacao_insert/${avaliacaoId}`, data);
}

function inserir_planejamento(avaliacaoId, data){
  return put(`/inserir_planejamento/${avaliacaoId}`, data);
}

function inserir_ata_reuniao(avaliacaoId, data){
  return put(`/inserir_ata_reuniao/${avaliacaoId}`, data);
}

function registerUser(data) {
  const url = '/cadastro';
  return post(url, data)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error('Erro ao realizar o cadastro:', error);
      throw error;
    });
}

function loginUser(email, password) {
  const url = '/login';
  const data = { email, senha: password }; // Certifique-se de que a chave no objeto corresponde à esperada no backend
  return post(url, data)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error('Erro ao realizar o login:', error);
      throw error;
    });
}

function uploadAcordoConfidencialidade(avaliacaoId, file) {
  const formData = new FormData();
  formData.append('file', file);
  return fetch(`${baseUrl}/upload_acordo_confidencialidade/${avaliacaoId}`, {
      method: 'POST',
      body: formData,
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Erro no upload do Acordo de Confidencialidade');
      }
      return response.json();
  })
  .catch(error => {
      console.error('Erro ao realizar upload:', error);
      throw error;
  });
}

function getAcordoConfidencialidade(avaliacaoId) {
  return fetch(`${baseUrl}/get_acordo_confidencialidade/${avaliacaoId}`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Erro ao buscar o Acordo de Confidencialidade');
          }
          return response.json();
      })
      .catch(error => {
          console.error('Erro ao buscar Acordo de Confidencialidade:', error);
          throw error;
      });
}

function getAtividade(){
  return get(`/get_atividade`)
}

function enviarEmailAvaliacao(avaliacaoId) {
  return post(`/enviar_email/${avaliacaoId}`);
}

function enviarEmailSolicitarFeedback(avaliacaoId) {
  return post(`/enviar_email_solicitar_feedback/${avaliacaoId}`);
}

function enviarEmailAuditorAvaliacaoFinal(avaliacaoId) {
  return post(`/enviar_email_auditor_avaliacao_final/${avaliacaoId}`);
}

function addAuditor(data) {
  const url = '/add_auditor';
  return post(url, data)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error('Erro ao adicionar auditor:', error);
      throw error;
    });
}

function getEmailAuditor(idAvaliacao) {
  return get(`/get_email_auditor/${idAvaliacao}`)
    .then(response => {
      return response.email;
    })
    .catch(error => {
      console.error('Erro ao buscar email do auditor:', error);
      throw error;
    });
}

function updateEmailAuditor(idAvaliacao, data) {
  return put(`/update_email_auditor/${idAvaliacao}`, data);
}

function salvarApresentacaoEquipe(data) {
  return post('/salvar_apresentacao_equipe', data);
}

function getApresentacaoEquipe(idAvaliacao) {
  return get(`/get_apresentacao_equipe/${idAvaliacao}`);
}

function inserirRelatorioInicial(data) {
  return post('/inserir_relatorio_inicial', data);
}

function atualizarRelatorioInicial(data) {
  return put('/atualizar_relatorio_inicial', data);
}

function getRelatorioInicial(idAvaliacao) {
  return get(`/get_relatorio_inicial/${idAvaliacao}`);
}

function inserirRelatorioAuditoriaFinal(data) {
  return post('/inserir_relatorio_auditoria_final', data);
}

function atualizarRelatorioAuditoriaFinal(data) {
  return put('/atualizar_relatorio_auditoria_final', data);
}

function getRelatorioAuditoriaFinal(idAvaliacao) {
  return get(`/get_relatorio_auditoria_final/${idAvaliacao}`);
}

function enviarEmailRelatorioAjusteInicial(avaliacaoId) {
  return post(`/enviar_email_auditor/${avaliacaoId}`);
}

function enviarEmailDataAvaliacao(avaliacaoId) {
  return post(`/enviar_email_auditor_data_avaliacao_final/${avaliacaoId}`);
}

function enviarEmailResultadoAvaliacaoInicial(avaliacaoId) {
  return post(`/notificar_participantes_resultado_avaliacao_inicial/${avaliacaoId}`);
}

// Função para atualizar a empresa em Ajuste de Avaliação Inicial
function updateEmpresaAjusteAvaliacaoInicial(idEmpresa, data) {
  return put(`/update_empresa_ajuste_avaliacao_inicial/${idEmpresa}`, data);
}

// Função para atualizar a avaliação em Ajuste de Avaliação Inicial
function updateAvaliacaoAjusteInicial(idAvaliacao, data) {
  return put(`/update_avaliacao_ajuste_inicial/${idAvaliacao}`, data);
}

// Função para atualizar o relatório em Ajuste de Avaliação Inicial
function updateRelatorioAjusteAvaliacaoInicial(idAvaliacao, data) {
  return put(`/update_relatorio_ajuste_avaliacao_inicial/${idAvaliacao}`, data);
}

function addData(data) {
  return post('/add_data_avaliacao', data);
}

function getData(avaliacaoId) {
  return get(`/get_data_avaliacao/${avaliacaoId}`);
}

function updateData(avaliacaoId, data) {
  return put(`/update_data_avaliacao/${avaliacaoId}`, data);
}

// Rota para obter graus de implementação
function getGrausImplementacaoEmpresa(avaliacaoId) {
  return get(`/get_graus_implementacao_empresa/${avaliacaoId}`)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error('Erro ao buscar graus de implementação:', error);
      throw error;
    });
}

// Rota para adicionar ou atualizar graus de implementação
function addGrauImplementacaoEmpresa(data) {
  return post('/insert_graus_implementacao_empresa', data)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error('Erro ao adicionar/atualizar grau de implementação:', error);
      throw error;
    });
}

function updateGrausImplementacaoEmpresa(data) {
  return put('/update_graus_implementacao_empresa', data)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error('Erro ao atualizar grau de implementação:', error);
      throw error;
    });
}

function updateResultadoFinal(avaliacaoId, data) {
  return put(`/update_resultado_final/${avaliacaoId}`, data);
}


function getPerguntasCapacidadeOrganizacional(idNivel) {
  return get(`/get_perguntas_capacidade_processo_organizacional/${idNivel}`);
}

function getCapacidadeProcessoOrganizacional(avaliacaoId) {
  return get(`/get_capacidade_processo_organizacional/${avaliacaoId}`)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error('Erro ao buscar capacidade do processo:', error);
      throw error;
    });
}

function addCapacidadeProcessoOrganizacional(data) {
  return post('/insert_capacidade_processo_organizacional', data)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error('Erro ao adicionar capacidade do processo:', error);
      throw error;
    });
}

function updateCapacidadeProcessoOrganizacional(data) {
  return put('/update_capacidade_processo_organizacional', data)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error('Erro ao atualizar capacidade do processo:', error);
      throw error;
    });
}

function getPerguntasCapacidadeProjeto(idNivel) {
  return get(`/get_perguntas_capacidade_processo_projeto/${idNivel}`);
}

function getCapacidadeProcessoProjeto(avaliacaoId) {
  return get(`/get_capacidade_processo_projeto/${avaliacaoId}`)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error('Erro ao buscar capacidade do processo:', error);
      throw error;
    });
}

function addCapacidadeProcessoProjeto(data) {
  return post('/insert_capacidade_processo_projeto', data)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error('Erro ao adicionar capacidade do processo:', error);
      throw error;
    });
}

function updateCapacidadeProcessoProjeto(data) {
  return put('/update_capacidade_processo_projeto', data)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error('Erro ao atualizar capacidade do processo:', error);
      throw error;
    });
}

function notificaParticipantesResultadoAvaliacaoFinal(avaliacaoId) {
  return post(`/notificar_participantes_resultado_avaliacao_final/${avaliacaoId}`);
}

function getEvidenciasPorPerguntaProjeto(perguntaId, projetoId) {
  return get(`/get_evidencias_por_pergunta_projeto/${perguntaId}/${projetoId}`);
}

function addEvidenciaProjeto(data) {
  return post('/add_evidencia_projeto', data);
}

function deleteEvidenciaProjeto(evidenciaId) {
  return deleteRequest(`/delete_evidencia_projeto/${evidenciaId}`);
}

function getEvidenciasPorPerguntaOrganizacional(perguntaId, processoId) {
  return get(`/get_evidencias_por_pergunta_organizacional/${perguntaId}/${processoId}`);
}

function addEvidenciaOrganizacional(data) {
  return post('/add_evidencia_organizacional', data);
}

function deleteEvidenciaOrganizacional(evidenciaId) {
  return deleteRequest(`/delete_evidencia_organizacional/${evidenciaId}`);
}

function uploadFile(formData) {
  return fetch(`${baseUrl}/upload`, {
    method: 'POST',
    body: formData,
  });
}

function atualizarStatusAvaliacao(avaliacaoId, data) {
  return put(`/atualizar_status_avaliacao/${avaliacaoId}`, data);
}

export {
  startNewEvaluation,
  getAllAvaliacoes,
  deleteAvaliacao,
  getAvaliacaoById,
  updateAvaliacao,
  updateIdAtividade,
  getNiveis,
  getNiveisLimitado,
  createNivel,
  updateNivel,
  deleteNivel,
  getProcessos,
  createProcesso,
  updateProcesso,
  deleteProcesso,
  getResultadosEsperados,
  createResultadoEsperado,
  updateResultadoEsperado,
  deleteResultadoEsperado,
  getProjetosByAvaliacao,
  createProjeto,
  updateProjeto,
  addDocumento,
  getDocumentosPorProjeto,
  updateDocumento,
  deleteDocumento,
  addEvidencia,
  getEvidenciasPorResultado,
  updateEvidencia,
  deleteEvidencia,
  getProcessosPorAvaliacao,
  getResultadosEsperadosPorProcesso,
  addOrUpdateGrauImplementacao,
  getGrausImplementacao,
  getVersaoModelo,
  addVersaoModelo,
  deleteVersaoModelo,
  updateVersaoModelo,
  getEmpresas,
  addEmpresa,
  deleteEmpresa,
  updateEmpresa,
  empresaAvaliacaoInsert,
  getInstituicoes,
  addInstituicao,
  deleteInstituicao,
  updateInstituicao,
  instituicaoAvaliacaoInsert,
  inserir_planejamento,
  inserir_ata_reuniao,
  registerUser,
  loginUser,
  uploadAcordoConfidencialidade,
  getAcordoConfidencialidade,
  getAtividade,
  enviarEmailAvaliacao,
  enviarEmailSolicitarFeedback,
  enviarEmailAuditorAvaliacaoFinal,
  addAuditor,
  getEmailAuditor,
  updateEmailAuditor,
  salvarApresentacaoEquipe,
  getApresentacaoEquipe,
  inserirRelatorioInicial,
  atualizarRelatorioInicial,
  getRelatorioInicial,
  inserirRelatorioAuditoriaFinal,
  atualizarRelatorioAuditoriaFinal,
  getRelatorioAuditoriaFinal,
  enviarEmailRelatorioAjusteInicial,
  enviarEmailDataAvaliacao,
  enviarEmailResultadoAvaliacaoInicial,
  updateEmpresaAjusteAvaliacaoInicial,
  updateAvaliacaoAjusteInicial,
  updateRelatorioAjusteAvaliacaoInicial,
  addData,
  getData,
  updateData,
  getGrausImplementacaoEmpresa,
  addGrauImplementacaoEmpresa,
  updateGrausImplementacaoEmpresa,
  updateResultadoFinal,
  getPerguntasCapacidadeOrganizacional,
  getPerguntasCapacidadeProjeto,
  getCapacidadeProcessoOrganizacional,
  addCapacidadeProcessoOrganizacional,
  updateCapacidadeProcessoOrganizacional,
  getCapacidadeProcessoProjeto,
  addCapacidadeProcessoProjeto,
  updateCapacidadeProcessoProjeto,
  notificaParticipantesResultadoAvaliacaoFinal,
  getEvidenciasPorPerguntaProjeto,
  addEvidenciaProjeto,
  deleteEvidenciaProjeto,
  getEvidenciasPorPerguntaOrganizacional,
  addEvidenciaOrganizacional,
  deleteEvidenciaOrganizacional,
  uploadFile,
  atualizarStatusAvaliacao
};
