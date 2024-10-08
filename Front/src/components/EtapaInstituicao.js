import React, { useState, useEffect } from 'react';
import { getAvaliacaoById, getInstituicoes, addInstituicao, instituicaoAvaliacaoInsert } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';

function EtapaInstituicaoAvaliadora({ onNext, avaliacaoId }) {
  const [instituicoes, setInstituicoes] = useState([]);
  const [instituicaoSelecionada, setInstituicaoSelecionada] = useState('');
  const [novaInstituicao, setNovaInstituicao] = useState('');
  const [novoCnpj, setNovoCnpj] = useState('');
  const [instituicaoCadastrada, setInstituicaoCadastrada] = useState(false);

  useEffect(() => {
    carregarInstituicoes();
  }, []);

  const carregarInstituicoes = async () => {
    try {
      const instituicoesData = await getInstituicoes();
      const instituicoesFormatadas = instituicoesData.map(item => ({
        id: item['ID'],
        nome: item['Nome'],
        cnpj: item[2],
      }));
      setInstituicoes(instituicoesFormatadas);

      const avaliacaoData = await getAvaliacaoById(avaliacaoId);
      if (avaliacaoData && avaliacaoData.id_instituicao) {  // Verifica se já há uma instituição associada
        setInstituicaoSelecionada(avaliacaoData.id_instituicao);
        setInstituicaoCadastrada(true);
      } else {
        setInstituicaoSelecionada('');
        setInstituicaoCadastrada(false);
      }
    } catch (error) {
      console.error('Erro ao carregar instituições ou avaliação:', error);
    }
  };

  const salvarDados = async () => {
    try {
      if (!instituicaoCadastrada) {
        if (novaInstituicao && novoCnpj) {
          const novaInstituicaoResponse = await addInstituicao({ nome: novaInstituicao, cnpj: novoCnpj });
          await carregarInstituicoes();
          const novaInstituicaoId = novaInstituicaoResponse.id;
          await instituicaoAvaliacaoInsert(avaliacaoId, { idInstituicao: novaInstituicaoId });
          alert('Instituição salva com sucesso!');
          setInstituicaoSelecionada(novaInstituicaoId);
          setNovaInstituicao('');
          setNovoCnpj('');
          setInstituicaoCadastrada(true);
        } else {
          alert('Por favor, preencha todos os campos da nova instituição.');
          return;
        }
      } else if (instituicaoSelecionada) {
        await instituicaoAvaliacaoInsert(avaliacaoId, { idInstituicao: instituicaoSelecionada });
      }
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      alert('Erro ao salvar os dados. Tente novamente.');
    }
  };

  const handleCheckboxChange = (value) => {
    setInstituicaoCadastrada(value);
    if (value) {
      setNovaInstituicao('');
      setNovoCnpj('');
    }
  };

  return (
    <div className='container-etapa'>
      <div className='title-container'>
        <h1 className='title-form'>CADASTRO DA INSTITUIÇÃO AVALIADORA</h1>
      </div>
      <label className="label">Instituição já cadastrada?</label>
      <div className='checkbox-wrapper'>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={instituicaoCadastrada === true}
            onChange={() => handleCheckboxChange(true)}
          />
          Sim
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={instituicaoCadastrada === false}
            onChange={() => handleCheckboxChange(false)}
          />
          Não
        </label>
      </div>
      {instituicaoCadastrada && (
        <>
          <div className="input-wrapper">
          <label className="label">Instituições cadastradas:</label>
          <select
            className="input-field"
            value={instituicaoSelecionada}
            onChange={(e) => setInstituicaoSelecionada(e.target.value)}
            disabled={!instituicaoCadastrada}
          >
            <option value="">Selecione a Instituição</option>
            {instituicoes.map(i => (
              <option key={i.id} value={i.id}>{i.nome}</option>
            ))}
          </select>
        </div>
        </>
      )}
      {!instituicaoCadastrada && (
        <>
          <div className="input-wrapper">
            <label className="label">Nome da nova instituição:</label>
            <input
              type="text"
              className="input-field"
              value={novaInstituicao}
              onChange={(e) => setNovaInstituicao(e.target.value)}
              placeholder="Digite o nome da instituição"
            />
          </div>
          
          <div className="input-wrapper">
            <label className="label">CNPJ da nova instituição:</label>
            <input
              type="text"
              className="input-field"
              value={novoCnpj}
              onChange={(e) => setNovoCnpj(e.target.value)}
              placeholder="Digite o CNPJ da instituição"
            />
          </div>
        </>
      )}

      <button className='button-save' onClick={salvarDados}>SALVAR</button>
      <button className='button-next' onClick={() => onNext(avaliacaoId)}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default EtapaInstituicaoAvaliadora;