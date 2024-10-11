import React, { useState, useEffect } from 'react';
import {
  getProcessosPorAvaliacao,
  getResultadosEsperadosPorProcesso,
  getGrausImplementacao,
  getGrausImplementacaoEmpresa,
  addGrauImplementacaoEmpresa,
  updateGrausImplementacaoEmpresa,
} from '../services/Api';
import '../components/styles/EtapaResumoCaracterizacao.css';
import '../components/styles/Button.css';
import '../components/styles/Container.css';
import '../components/styles/Body.css';
import '../components/styles/Etapas.css';

function EtapaResumoCaracterizacao({ avaliacaoId, idVersaoModelo, onNext }) {
  const [processos, setProcessos] = useState([]);
  const [resultadosEsperados, setResultadosEsperados] = useState({});
  const [arrayResumo, setArrayResumo] = useState([]); // Array to save evaluation data
  const [resumoSalvo, setResumoSalvo] = useState(false); // State to determine if it will be "SAVE" or "UPDATE"
  const [dropdownVisible, setDropdownVisible] = useState(null); // Control which dropdown is visible
  const [activeTab, setActiveTab] = useState(null); // State for the active tab
  const [isLoading, setIsLoading] = useState(true); // Added loading state

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

  useEffect(() => {
    if (processos.length > 0) {
      setActiveTab(processos[0].ID);
    }
  }, [processos]);

  const carregarDados = async () => {
    try {
      // Check if a summary already exists
      const resumo = await getGrausImplementacaoEmpresa(avaliacaoId);

      if (resumo && resumo.length > 0) {
        // If there is a saved summary, use these notes directly
        setResumoSalvo(true);
        await montarArrayComResumo(resumo);
      } else {
        // If there is no summary, fetch implementation grades and calculate notes
        const graus = await getGrausImplementacao(avaliacaoId);
        await montarArrayComCalculo(graus);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false); // Set loading to false after data is fetched
    }
  };

  const carregarResultadosEsperados = async (processoId) => {
    try {
      const data = await getResultadosEsperadosPorProcesso(processoId, avaliacaoId);
      setResultadosEsperados((prevResultados) => ({
        ...prevResultados,
        [processoId]: data,
      }));
    } catch (error) {
      console.error('Erro ao carregar resultados esperados:', error);
    }
  };

  const montarArrayComResumo = async (resumo) => {
    try {
      const processosData = await getProcessosPorAvaliacao(avaliacaoId, idVersaoModelo);
      setProcessos(processosData.processos);

      const arrayInicial = [];

      for (const processo of processosData.processos) {
        const resultados = await getResultadosEsperadosPorProcesso(processo.ID, avaliacaoId);
        setResultadosEsperados((prevResultados) => ({
          ...prevResultados,
          [processo.ID]: resultados,
        }));

        // For each expected result, get the note from the summary
        resultados.forEach((resultado) => {
          const notaResumo =
            resumo.find((item) => item.ID_Resultado_Esperado === resultado.ID)?.Nota ||
            'Não avaliado (NA)';

          arrayInicial.push({
            id_avaliacao: avaliacaoId,
            id_processo: processo.ID,
            id_resultado_esperado: resultado.ID,
            nota: notaResumo, // Use the summary note or 'NA'
          });
        });
      }

      setArrayResumo(arrayInicial); // Save the array with the summary notes
    } catch (error) {
      console.error('Erro ao montar array com resumo:', error);
    }
  };

  const montarArrayComCalculo = async (graus) => {
    try {
      const processosData = await getProcessosPorAvaliacao(avaliacaoId, idVersaoModelo);
      setProcessos(processosData.processos);

      const arrayInicial = [];

      for (const processo of processosData.processos) {
        const resultados = await getResultadosEsperadosPorProcesso(processo.ID, avaliacaoId);
        setResultadosEsperados((prevResultados) => ({
          ...prevResultados,
          [processo.ID]: resultados,
        }));

        // For each expected result, calculate the note based on the grades
        resultados.forEach((resultado) => {
          const notasParaResultado = graus
            .filter((grau) => grau.ID_Resultado_Esperado === resultado.ID)
            .map((grau) => grau.Nota);
          const notaFinal = calcularCaracterizacaoUnidade(notasParaResultado);

          arrayInicial.push({
            id_avaliacao: avaliacaoId,
            id_processo: processo.ID,
            id_resultado_esperado: resultado.ID,
            nota: notaFinal, // Use the calculated note
          });
        });
      }

      setArrayResumo(arrayInicial); // Save the array with the calculated notes
    } catch (error) {
      console.error('Erro ao montar array com cálculo:', error);
    }
  };

  const handleNotaChange = (resultadoId, nota) => {
    setArrayResumo((prevArray) =>
      prevArray.map((item) =>
        item.id_resultado_esperado === resultadoId ? { ...item, nota: nota } : item
      )
    );
    setDropdownVisible(null); // Close the dropdown after selection
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

  // Updated function with new logic
  const calcularCaracterizacaoUnidade = (notas) => {
    if (notas.length === 0) return 'Não avaliado (NA)'; // No notes

    // Rule 4: If there is at least one 'F', return 'Fora do escopo (F)'
    if (notas.includes('Fora do escopo (F)')) return 'Fora do escopo (F)';

    // Basic checks for the case where all notes are the same
    if (notas.every((nota) => nota === 'Totalmente implementado (T)'))
      return 'Totalmente implementado (T)';
    if (notas.every((nota) => nota === 'Largamente implementado (L)'))
      return 'Largamente implementado (L)';
    if (notas.every((nota) => nota === 'Parcialmente implementado (P)'))
      return 'Parcialmente implementado (P)';
    if (notas.every((nota) => nota === 'Não implementado (N)')) return 'Não implementado (N)';
    if (notas.every((nota) => nota === 'Fora do escopo (F)')) return 'Fora do escopo (F)';

    const temT = notas.includes('Totalmente implementado (T)');
    const temL = notas.includes('Largamente implementado (L)');
    const temP = notas.includes('Parcialmente implementado (P)');
    const temN = notas.includes('Não implementado (N)');
    const temNA = notas.includes('Não avaliado (NA)');

    // Rule 3: If there is at least one 'N', return 'Escolher L, N ou P'
    if (temN) return 'Escolher L, N ou P';

    // Rule 2: If there is at least one 'P' and no 'N', return 'Escolher L ou P'
    if (temP && !temN) return 'Escolher L ou P';

    // Rule 1: If there is 'T' and 'L', or 'T', 'L', and 'NA', return 'Largamente implementado (L)'
    if ((temT && temL) || (temT && temL && temNA)) return 'Largamente implementado (L)';

    // If nothing applies, return 'Não avaliado (NA)'
    return 'Não avaliado (NA)';
  };

  // Check if any item has notes that require a choice
  const desabilitarBotao = arrayResumo.some(
    (item) => item.nota === 'Escolher L ou P' || item.nota === 'Escolher L, N ou P'
  );

  if (isLoading) {
    return <div>Carregando...</div>; // Display loading indicator while data is being fetched
  }

  return (
    <div className="container-etapa">
      <h1 className="title-form">RESUMO DA CARACTERIZAÇÃO</h1>
      <div className="tabs">
        {processos.map((processo, index) => (
          <button
            key={processo.ID}
            className={`tab-button ${activeTab === processo.ID ? 'active' : ''}`}
            onClick={() => setActiveTab(processo.ID)}
          >
            {/* Abbreviate process descriptions */}
            {processo.Descricao === 'Gerência de Projetos'
              ? 'GPR'
              : processo.Descricao === 'Engenharia de Requisitos'
              ? 'REQ'
              : processo.Descricao === 'Projeto e Construção do Produto'
              ? 'PCP'
              : processo.Descricao === 'Integração do Produto'
              ? 'ITP'
              : processo.Descricao === 'Verificação e Validação'
              ? 'VV'
              : processo.Descricao === 'Gerência de Configuração'
              ? 'GCO'
              : processo.Descricao === 'Aquisição'
              ? 'AQU'
              : processo.Descricao === 'Medição'
              ? 'MED'
              : processo.Descricao === 'Gerência de Decisões'
              ? 'GDE'
              : processo.Descricao === 'Gerência de Recursos Humanos'
              ? 'GRH'
              : processo.Descricao === 'Gerência de Processos'
              ? 'GPC'
              : processo.Descricao === 'Gerência Organizacional'
              ? 'ORG'
              : processo.Descricao}
          </button>
        ))}
      </div>
      <div className="tab-content">
        <table className="resumo-tabela">
          <thead>
            <tr className="tr-table-resumo-caracterizacao">
              <th className="resultado-esperado-head">Resultado Esperado</th>
              <th className="nota-head">Nota</th>
            </tr>
          </thead>
          <tbody>
            {processos.map((processo) =>
              activeTab === processo.ID
                ? (resultadosEsperados[processo.ID] || []).map((resultado) => {
                    const notaIndex = resultado.Descricao.indexOf('NOTA');
                    const descricao =
                      notaIndex !== -1
                        ? resultado.Descricao.substring(0, notaIndex).trim()
                        : resultado.Descricao;
                    const nota =
                      notaIndex !== -1 ? resultado.Descricao.substring(notaIndex).trim() : '';
                    const itemResumo = arrayResumo.find(
                      (item) => item.id_resultado_esperado === resultado.ID
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
                              onChange={(e) => handleNotaChange(resultado.ID, e.target.value)}
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
                              onChange={(e) => handleNotaChange(resultado.ID, e.target.value)}
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
      <button
        className="button-save"
        onClick={salvarResumoCaracterizacao}
        disabled={desabilitarBotao}
      >
        {resumoSalvo ? 'ATUALIZAR' : 'SALVAR'}
      </button>
      <button className="button-next" onClick={onNext}>
        PRÓXIMA ETAPA
      </button>
    </div>
  );
}

export default EtapaResumoCaracterizacao;