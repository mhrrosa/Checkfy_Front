import React, { useState, useEffect } from 'react';
import { inserirRelatorioInicial, atualizarRelatorioInicial, getRelatorioInicial, enviarEmailRelatorioAjusteInicial } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaRelatorioAjusteInicial.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';

function EtapaRelatorioAjusteInicial({ onNext, avaliacaoId }) {
  const [relatorioAjuste, setRelatorioAjuste] = useState('');
  const [relatorioExiste, setRelatorioExiste] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // Estado para o arquivo selecionado
  const [existingFilePath, setExistingFilePath] = useState(''); // Caminho do arquivo existente
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    async function fetchRelatorio() {
      try {
        const response = await getRelatorioInicial(avaliacaoId);
        if (response.descricao) {
          setRelatorioAjuste(response.descricao);
          setRelatorioExiste(true);  // Marca que o relatório já existe
          setExistingFilePath(response.caminhoArquivo || '');  // Salva o caminho do arquivo se existir
        } else if (response.message === "Relatório não encontrado, ainda não foi criado") {
          console.log(response.message);
          setRelatorioExiste(false);  // Marca que o relatório não existe ainda
        }
      } catch (error) {
        console.error('Erro ao buscar o relatório:', error);
      } finally {
        setIsLoading(false); // Set loading to false after data is fetched
      }
    }

    fetchRelatorio();
  }, [avaliacaoId]);

  const salvarDados = async () => {
    if (!relatorioAjuste && !selectedFile) {
      alert('Por favor, preencha o relatório de ajuste ou anexe um arquivo.');
      return;
    }

    try {
      let caminhoArquivo = existingFilePath;

      // Se um novo arquivo foi selecionado, faça o upload
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadResponse = await fetch(`http://127.0.0.1:5000/upload`, {
          method: 'POST',
          body: formData
        });

        const result = await uploadResponse.json();
        caminhoArquivo = result.filepath;

        // Atualiza o estado para exibir o arquivo recém-uploadado como "arquivo atual"
        setExistingFilePath(caminhoArquivo);
        setSelectedFile(null); // Limpa o arquivo selecionado após o upload
      }

      const data = { descricao: relatorioAjuste, idAvaliacao: avaliacaoId, caminhoArquivo };

      if (relatorioExiste) {
        await atualizarRelatorioInicial(data);
        alert('Relatório atualizado com sucesso!');
      } else {
        await inserirRelatorioInicial(data);
        alert('Relatório inserido com sucesso!');
        setRelatorioExiste(true);
      }
    } catch (error) {
      console.error('Erro ao salvar o relatório:', error);
    }
  };

  const proximaEtapa = async () => {
    if (!relatorioAjuste) {
      alert('Por favor, preencha o relatório de ajuste antes de continuar.');
      return;
    }

    if (window.confirm('Ao confirmar, será enviado um e-mail para o auditor realizar a auditoria. Deseja continuar?')) {
      try {
        await enviarEmailRelatorioAjusteInicial(avaliacaoId);
        alert('E-mail enviado com sucesso!');
        onNext();  // Chama a próxima etapa após o envio do e-mail
      } catch (error) {
        console.error('Erro ao enviar o e-mail:', error);
        alert('Ocorreu um erro ao enviar o e-mail.');
      }
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>; // Display loading indicator while data is being fetched
  }

  return (
    <div className='container-etapa'>
      <h1 className='title-form'>RELATÓRIO DE AJUSTE</h1>
      <div className='dica-div'>
        <strong className='dica-titulo'>Observação: </strong>
        <p className='dica-texto'>
          O relatório detalha todos os pontos que precisam ser ajustados antes da avaliação final. 
        </p>
      </div>
      <div className="input-wrapper">
        <label className="label-etapas">Relatório de Ajuste:</label>
        <textarea
          className='input-textarea-avaliacao'
          value={relatorioAjuste}
          onChange={(e) => setRelatorioAjuste(e.target.value)}
          placeholder="Descreva os ajustes necessários"
        />
      </div>

      <div className="div-input-relatorio-ajuste-inicial">
        <label className="label-etapas">Anexar Arquivo:</label>
        <input 
          type="file" 
          className='input-campo-relatorio-ajuste-inicial'
          onChange={(e) => setSelectedFile(e.target.files[0])} 
        />
        {existingFilePath && (
          <div>
            <p className='relatorio-adicionado'>Arquivo atual:</p>
            <button className="button-mostrar-relatorio" onClick={() => window.open(`http://127.0.0.1:5000/uploads/${existingFilePath}`, '_blank')}>MOSTRAR</button>
          </div>
        )}
      </div>

      <button className='button-save' onClick={salvarDados}>SALVAR</button>
      <button className='button-next' onClick={proximaEtapa}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default EtapaRelatorioAjusteInicial;