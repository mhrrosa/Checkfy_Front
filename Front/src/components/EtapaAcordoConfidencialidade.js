import React, { useState, useEffect } from 'react';
import '../components/styles/Body.css';
import '../components/styles/Container.css';
import '../components/styles/Form.css';
import '../components/styles/Button.css';
import '../components/styles/Etapas.css';
import '../components/styles/EtapaAcordoConfidencialidade.css';
import { uploadAcordoConfidencialidade, getAcordoConfidencialidade } from '../services/Api.js';

function EtapaAcordoConfidencialidade({ onNext, avaliacaoId, idAtividade }) {
    const [acordoConfidencialidade, setAcordoConfidencialidade] = useState(null);
    const [existingAcordo, setExistingAcordo] = useState(null);
    const [canEdit, setCanEdit] = useState(idAtividade === 5);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const fetchAcordoConfidencialidade = async () => {
            try {
                const data = await getAcordoConfidencialidade(avaliacaoId);
                setExistingAcordo(data.filepath);
                console.log('Acordo existente:', data.filepath);
                // Se o usuário já passou da atividade 6, não permitir edição
                if (idAtividade >= 6) {
                    setCanEdit(false);
                }
                console.log('CanEdit:', canEdit);
            } catch (error) {
                console.error('Erro ao buscar acordo de confidencialidade:', error);
            }
        };
    
        fetchAcordoConfidencialidade();
        console.log('ID da Atividade:', idAtividade);
    }, [avaliacaoId, idAtividade]);

    const handleAcordoConfidencialidadeChange = (event) => {
        if (canEdit) {
            setAcordoConfidencialidade(event.target.files[0]);
        }
    };

    const removerAcordoConfidencialidade = () => {
        if (canEdit) {
            setAcordoConfidencialidade(null);
            document.getElementById('file').value = null; // Limpa o input file
        }
    };

    const salvarAcordoConfidencialidade = async () => {
        if (!acordoConfidencialidade) {
            alert('Por favor, anexe o acordo de confidencialidade.');
            return;
        }
        try {
            const response = await uploadAcordoConfidencialidade(avaliacaoId, acordoConfidencialidade);
            alert('Acordo de confidencialidade salvo com sucesso!');
            setExistingAcordo(response.filepath);
            setIsSaved(true);  // Marcar que o arquivo foi salvo
        } catch (error) {
            console.error('Erro ao salvar o acordo de confidencialidade:', error);
            alert('Erro ao salvar o acordo de confidencialidade. Tente novamente.');
        }
    };

    const handleNextStepClick = () => {
        if (isSaved && canEdit) {
            const proceed = window.confirm('Ao clicar em "Próxima Etapa", não será mais possível alterar o acordo de confidencialidade. Deseja continuar?');
            if (!proceed) return;
            setCanEdit(false); // Desabilitar edições futuras
        }
        onNext();
    };

    return (
        <div className="container-etapa">
            <div>
                <h1 className="title-form">ACORDO DE CONFIDENCIALIDADE</h1>
            </div>
            <div className='div-input-acordo-confidencialidade'>
                <label className="label-etapas">Acordo de Confidencialidade:</label>
                {canEdit && (
                    <>
                        <input
                            className="input-campo-acordo-confidencialidade"
                            type="file"
                            id="file"
                            onChange={handleAcordoConfidencialidadeChange}
                        />
                        <label htmlFor="file">Escolha um arquivo</label>
                    </>
                )}
                {acordoConfidencialidade && <p className='acordo-adicionado'>Arquivo adicionado</p>}
                {existingAcordo && (
                    <div>
                        <p className='acordo-adicionado'>Acordo de confidencialidade existente: <a className='link-baixar-arquivo' href={`http://127.0.0.1:5000/uploads/${existingAcordo}`} target="_blank" rel="noopener noreferrer">Baixar</a></p>
                    </div>
                )}
            </div>
            {canEdit && acordoConfidencialidade && (
                <button className='button-remove-avaliacao' onClick={removerAcordoConfidencialidade}>REMOVER</button>
            )}

            {canEdit && (
                <button className='button-save' onClick={salvarAcordoConfidencialidade}>SALVAR</button>
            )}
            <button className='button-next' onClick={handleNextStepClick}>PRÓXIMA ETAPA</button>
        </div>
    );
}

export default EtapaAcordoConfidencialidade;