import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getAvaliacaoById,
  updateEmpresaAjusteAvaliacaoInicial,
  updateAvaliacaoAjusteInicial,
  atualizarRelatorioInicial
} from '../services/Api'; // Funções de atualização do backend
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaRealizarAjusteAvaliacaoInicial.css';

function EtapaRealizarAjusteAvaliacaoInicial({ onBack }) {
  const location = useLocation();
  const [avaliacao, setAvaliacao] = useState(null); // Initialize as null
  const [isSaving, setIsSaving] = useState(false); // Controle de múltiplas submissões
  const [file, setFile] = useState(null); // Estado para armazenar o arquivo selecionado
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchAvaliacao = async () => {
      try {
        const data = await getAvaliacaoById(location.state.id);
        setAvaliacao(data);
      } catch (error) {
        console.error('Erro ao buscar avaliação:', error);
      } finally {
        setIsLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchAvaliacao();
  }, [location.state.id]);

  const handleFileUpload = async () => {
    if (!file) return null;  // Retorna null se não houver arquivo
  
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`http://127.0.0.1:5000/upload`, {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (response.ok) {
        return result.filepath; // Retorna o caminho do arquivo enviado
      } else {
        console.error('Erro ao fazer upload do arquivo:', result.message);
        return null;
      }
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      return null;
    }
  };

  const salvarEmpresa = async () => {
    setIsSaving(true);
    try {
      await updateEmpresaAjusteAvaliacaoInicial(avaliacao.id_empresa, { nome: avaliacao.nome_empresa });
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
      alert('Erro ao salvar empresa.');
    } finally {
      setIsSaving(false);
    }
  };

  const salvarAvaliacao = async () => {
    setIsSaving(true);
    try {
      await updateAvaliacaoAjusteInicial(location.state.id, {
        descricao: avaliacao.descricao,
        cronograma_planejamento: avaliacao.cronograma_planejamento,
        atividade_planejamento: avaliacao.atividade_planejamento
      });
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      alert('Erro ao salvar avaliação.');
    } finally {
      setIsSaving(false);
    }
  };

  const salvarRelatorio = async (caminhoArquivo) => {
    setIsSaving(true);
    try {
      await atualizarRelatorioInicial({
        descricao: avaliacao.descricao_relatorio_ajuste_inicial,
        idAvaliacao: location.state.id,
        caminhoArquivo // Passa o caminho do arquivo, se houver
      });
      alert("Dados salvos com sucesso");
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      alert('Erro ao salvar relatório.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSalvar = async () => {
    setIsSaving(true);
    try {
      await salvarEmpresa();
      await salvarAvaliacao();
      let caminhoArquivo = avaliacao.caminho_arquivo_relatorio_ajuste_inicial;
      
      if (file) {
        const uploadedFilePath = await handleFileUpload(); // Faz o upload do arquivo
        if (uploadedFilePath) {
          caminhoArquivo = uploadedFilePath; // Atualiza o caminho do arquivo se houver upload
          setAvaliacao({ ...avaliacao, caminho_arquivo_relatorio_ajuste_inicial: uploadedFilePath }); // Atualiza o estado da avaliação
        }
      }
      await salvarRelatorio(caminhoArquivo); // Salva o relatório com o caminho do arquivo atualizado
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>; // Display loading indicator while data is being fetched
  }

  if (!avaliacao) {
    return <div>Erro ao carregar dados da avaliação.</div>; // Handle case where data is null
  }
  
  return (
    <div className='container-etapa'>
      <h1 className='title-form'>AJUSTE DA AVALIAÇÃO INICIAL</h1>
      <div className="lista-input">
        <table className='tabela-etapas'>
          <tbody>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Nome da empresa:</th>
              <td className='valor-etapas'>
                <input
                  type="text"
                  className='input-field'
                  value={avaliacao.nome_empresa}
                  onChange={(e) => setAvaliacao({ ...avaliacao, nome_empresa: e.target.value })}
                />
              </td>
            </tr>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Descrição:</th>
              <td className='valor-etapas'>
                <input
                  type="text"
                  className='input-field-etapas'
                  value={avaliacao.descricao}
                  onChange={(e) => setAvaliacao({ ...avaliacao, descricao: e.target.value })}
                  style={{ width: '100%' }}
                />
              </td>
            </tr>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Relatório de Ajuste:</th>
              <td className='valor-etapas'>
                <textarea className='input-textarea-avaliacao-tabela'
                  value={avaliacao.descricao_relatorio_ajuste_inicial}
                  onChange={(e) => setAvaliacao({ ...avaliacao, descricao_relatorio_ajuste_inicial: e.target.value })}
                />
              </td>
            </tr>
            <tr className='linha-etapas'>
              <th className='label-etapas'>Anexar Arquivo:</th>
              <td className='valor-etapas'>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ width: '100%' }}
                />
              </td>
            </tr>
            {avaliacao.caminho_arquivo_relatorio_ajuste_inicial && (
              <tr className='linha-etapas'>
                <th className='label-etapas'>Arquivo de Relatório de Ajuste:</th>
                <td className='valor-etapas'>
                  <button
                    className='button-mostrar-relatorio'
                    onClick={() => window.open(`http://127.0.0.1:5000/uploads/${avaliacao.caminho_arquivo_relatorio_ajuste_inicial}`, '_blank')}
                  >
                    MOSTRAR
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  
      <button onClick={handleSalvar} className='button-save' disabled={isSaving}>
        SALVAR
      </button>
      <button onClick={onBack} className='button-next'>
        PRÓXIMA ETAPA
      </button>
    </div>
  );
}

export default EtapaRealizarAjusteAvaliacaoInicial;