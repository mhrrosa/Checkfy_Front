import React, { useState, useEffect } from 'react';
import { getAvaliacaoById, getEmpresas, addEmpresa, empresaAvaliacaoInsert } from '../services/Api';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';

function EtapaEmpresa({ onNext, avaliacaoId }) {
  const [empresas, setEmpresas] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [novaEmpresa, setNovaEmpresa] = useState('');
  const [novoCnpj, setNovoCnpj] = useState('');
  const [empresaCadastrada, setEmpresaCadastrada] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento adicionado

  useEffect(() => {
    carregarEmpresas();
  }, []);

  const carregarEmpresas = async () => {
    try {
      const empresasData = await getEmpresas();
      const empresasFormatadas = empresasData.map(item => ({
        id: item['ID'],
        nome: item['Nome'],
        cnpj: item[2],
      }));
      setEmpresas(empresasFormatadas);
      const avaliacaoData = await getAvaliacaoById(avaliacaoId);
      if (avaliacaoData && avaliacaoData.id_empresa) {
        setEmpresaSelecionada(avaliacaoData.id_empresa);
        setEmpresaCadastrada(true);
      } else {
        setEmpresaSelecionada('');
        setEmpresaCadastrada(false);
      }
    } catch (error) {
      console.error('Erro ao carregar empresas ou avaliação:', error);
    } finally {
      setIsLoading(false); // Definir isLoading como false após a busca
    }
  };

  const salvarDados = async () => {
    try {
      if (!empresaCadastrada) {
        if (novaEmpresa && novoCnpj) {
          const novaEmpresaResponse = await addEmpresa({ nome: novaEmpresa, cnpj: novoCnpj });
          await carregarEmpresas();
          const novaEmpresaId = novaEmpresaResponse.id;
          await empresaAvaliacaoInsert(avaliacaoId, { idEmpresa: novaEmpresaId });
          alert('Empresa salva com sucesso!');
          setEmpresaSelecionada(novaEmpresaId);
          setNovaEmpresa('');
          setNovoCnpj('');
          setEmpresaCadastrada(true);
        } else {
          alert('Por favor, preencha todos os campos da nova empresa.');
          return;
        }
      } else if (empresaSelecionada) {
        await empresaAvaliacaoInsert(avaliacaoId, { idEmpresa: empresaSelecionada });
      }
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      alert('Erro ao salvar os dados. Tente novamente.');
    }
  };  

  const handleCheckboxChange = (value) => {
    setEmpresaCadastrada(value);
    if (value) {
      setNovaEmpresa('');
      setNovoCnpj('');
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>; // Exibe um indicador de carregamento enquanto os dados são buscados
  }

  return (
    <div className='container-etapa'>
      <div className='title-container'>
        <h1 className='title-form'>CADASTRO DE EMPRESA</h1>
      </div>
      <label className="label">Empresa já cadastrada?</label>
      <div className='checkbox-wrapper'>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={empresaCadastrada === true}
            onChange={() => handleCheckboxChange(true)}
          />
          Sim
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={empresaCadastrada === false}
            onChange={() => handleCheckboxChange(false)}
          />
          Não
        </label>
      </div>
      {empresaCadastrada && (
        <>
          <div className="input-wrapper">
            <label className="label">Empresas cadastradas:</label>
            <select
              className="input-field"
              value={empresaSelecionada}
              onChange={(e) => setEmpresaSelecionada(e.target.value)}
              disabled={!empresaCadastrada}
            >
              <option value="">Selecione a Empresa</option>
              {empresas.map(e => (
                <option key={e.id} value={e.id}>{e.nome}</option>
              ))}
            </select>
          </div>
        </>
      )}
      {!empresaCadastrada && (
        <>
          <div className="input-wrapper">
            <label className="label">Nome da nova empresa:</label>
            <input
              type="text"
              className="input-field"
              value={novaEmpresa}
              onChange={(e) => setNovaEmpresa(e.target.value)}
              placeholder="Digite o nome da empresa"
            />
          </div>
          
          <div className="input-wrapper">
            <label className="label">CNPJ da nova empresa:</label>
            <input
              type="text"
              className="input-field"
              value={novoCnpj}
              onChange={(e) => setNovoCnpj(e.target.value)}
              placeholder="Digite o CNPJ da empresa"
            />
          </div>
        </>
      )}

      <button className='button-save' onClick={salvarDados}>SALVAR</button>
      <button className='button-next' onClick={() => onNext(avaliacaoId)}>PRÓXIMA ETAPA</button>
    </div>
  );
}

export default EtapaEmpresa;