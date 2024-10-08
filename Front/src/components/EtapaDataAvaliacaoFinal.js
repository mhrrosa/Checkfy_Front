import React, { useState, useEffect } from 'react';
import { addData, getData, updateData, enviarEmailDataAvaliacao } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Etapas.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/EtapaDataAvaliacaoFinal.css';
import '../components/styles/Button.css';

function CadastroDataAvaliacao({ onNext, avaliacaoId }) {
  const [dataAvaliacaoFinal, setDataAvaliacaoFinal] = useState(''); // Estado para controlar a data de avaliação
  const [dataExiste, setDataExiste] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);  // Controle de múltiplas submissões

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);  // Ativa o estado de carregamento
      try {
        const response = await getData(avaliacaoId);
        if (response && response.dataAvaliacaoFinal) {
          // Converte a data para o formato 'YYYY-MM-DD' aceito pelo input de data
          const dataFormatada = new Date(response.dataAvaliacaoFinal).toISOString().split('T')[0];
          setDataAvaliacaoFinal(dataFormatada);  // Atualiza o estado da data
          setDataExiste(true);  // Data já cadastrada
        } else {
          setDataExiste(false);  // Data não cadastrada
        }
      } catch (error) {
        console.error('Erro ao buscar a data da avaliação final:', error);
      } finally {
        setIsLoading(false);  // Desativa o estado de carregamento
      }
    }
  
    fetchData();
  }, [avaliacaoId]);

  const salvarDados = async () => {
    if (!dataAvaliacaoFinal) {
      alert('Por favor, selecione a data da avaliação final.');
      return;
    }

    if (isSaving) return;  // Impede múltiplas submissões enquanto está salvando

    setIsSaving(true);  // Bloqueia múltiplas submissões
    try {
      setIsLoading(true);  // Ativa o estado de carregamento ao salvar os dados

      if (dataExiste) {
        // Atualiza a data da avaliação final existente
        await updateData(avaliacaoId, { dataAvaliacaoFinal });
        alert('Data da avaliação final atualizada com sucesso!');
      } else {
        // Cadastra uma nova data de avaliação final
        await addData({ idAvaliacao: avaliacaoId, dataAvaliacaoFinal });
        alert('Data da avaliação final cadastrada com sucesso!');
        setDataExiste(true);  // Marca que a data foi cadastrada
      }
    } catch (error) {
      console.error('Erro ao salvar a data da avaliação final:', error);
      alert('Erro ao salvar a data da avaliação final.');
    } finally {
      setIsSaving(false);  // Libera para novas submissões
      setIsLoading(false);  // Desativa o estado de carregamento após salvar os dados
    }
  };

  const proximaEtapa = async () => {
    if (!dataAvaliacaoFinal) {
      alert('Por favor, selecione a data da avaliação final antes de continuar.');
      return;
    }
  
    // Alerta com opções de confirmação
    const confirmacao = window.confirm('Um e-mail será enviado aos participantes informando a data da avaliação final. Deseja continuar?');
  
    if (confirmacao) {
      try {
        // Chama a função para enviar o e-mail
        await enviarEmailDataAvaliacao(avaliacaoId);
        alert('E-mail enviado com sucesso!');
        
        // Navega para a próxima etapa após o envio do e-mail
        onNext();
      } catch (error) {
        console.error('Erro ao enviar o e-mail:', error);
        alert('Houve um erro ao enviar o e-mail. Tente novamente.');
      }
    }
  };

  return (
    <div className='container-etapa'>
      <h1 className='title-form'>DEFINIÇÃO DA DATA DE AVALIAÇÃO FINAL</h1>
      <div className='dica-div'>
        <strong className='div-titulo'>Observação: </strong>
        <p className='dica-texto'>
          A data da avaliação final deve ser confirmada para garantir a conformidade com o cronograma,
          participantes da avaliação serão notificados caso houver atualização da data.
        </p>
      </div>
      <br></br>
      <div className="input-container">
          <label
          className="label-etapas"
          >
          Data da Avaliação Final:
          </label>
          <input
            type="date"
            className="input-date"
            value={dataAvaliacaoFinal}
            onChange={(e) => setDataAvaliacaoFinal(e.target.value)}
            disabled={isLoading}
          />
      </div>
      <br></br>
      <button className='button-save' onClick={salvarDados} disabled={isLoading || isSaving}>
          {isLoading ? 'SALVANDO...' : 'SALVAR'}
      </button>
      <button 
        className='button-next' 
        onClick={proximaEtapa} 
        disabled={isLoading || !dataAvaliacaoFinal}
      >
        PRÓXIMA ETAPA
      </button>
    </div>
  );
}

export default CadastroDataAvaliacao;
