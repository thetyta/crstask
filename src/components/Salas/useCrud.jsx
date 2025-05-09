import { useState } from 'react';
import { api } from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';

export default function useCrud({ endpoint, fetchData, setOpen }) {
    const [loadingSave, setLoadingSave] = useState(false);

const criarItem = async ({ input, setInput }) => {
    if (!input.idPadrao){
        toaster.create({ title: 'Preencha pelo menos idPadrao', type: 'error', duration: 3000 });
        return
    }
    try {
      setLoadingSave(true);
      await api.post(endpoint, {
        observacao: input.observacao? input.observacao : null,
        idPadrao: parseInt(input.idPadrao)
      })
      await fetchData();
      setInput({
        observacao: '',
        idPadrao: ''
      })
      toaster.create({ title: 'Criado com sucesso', type: 'success', duration: 3000 });
      return true
    } catch (error) {
        toaster.create({ title: `Erro ao criar ${error}`, type: 'error', duration: 3000 });
        return false
    } finally {
      setLoadingSave(false);
    }
  };

  const editarItem = async ({ id, inputEdit, setInputEdit, task }) => {
    const updatedData = {};
  
    if (inputEdit.observacao && inputEdit.observacao !== task.observacao) updatedData.observacao = inputEdit.observacao;
    if (inputEdit.idPadrao && inputEdit.idPadrao !== task.idPadrao) updatedData.idPadrao = parseInt(inputEdit.idPadrao);
  
    if (Object.keys(updatedData).length === 0) {
      toaster.create({ title: 'Nenhuma alteração detectada', type: 'info', duration: 3000 });
      return;
    }
  
    try {
      setLoadingSave(true);
      await api.patch(`${endpoint}/${id}`, updatedData);
      await fetchData();
      setInputEdit({
        observacao: '',
        idPadrao: ''
      });
      setOpen?.(false);
      toaster.create({ title: 'Atualizado com sucesso', type: 'success', duration: 3000 });
      return true
    } catch (error) {
      toaster.create({ title: `Erro ao atualizar: ${error}`, type: 'error', duration: 3000 });
      return false
    } finally {
      setLoadingSave(false);
    }
  };
  

  const excluirItem = async ({ id, items, setItems, currentPage, itemsPerPage, setCurrentPage }) => {
    try {
      if (confirm('Deseja excluir este item?')) {
        await api.delete(`${endpoint}/${id}`);
        
        const novasItems = items.filter(item => item.id !== id);
        setItems(novasItems);
  
        const totalPaginas = Math.ceil(novasItems.length / itemsPerPage);
        if (currentPage > totalPaginas) {
          setCurrentPage(Math.max(totalPaginas, 1));
        }
  
        toaster.create({ title: 'Deletado com sucesso', type: 'success', duration: 3000 });
      }
    } catch (error) {
      toaster.create({ title: 'Erro ao deletar', type: 'error', duration: 3000 });
    }
  };
  return {
    criarItem,
    editarItem,
    excluirItem,
    loadingSave,
  };
}