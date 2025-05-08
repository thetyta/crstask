import { useState } from 'react';
import { api, verificarIdUsuario } from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';

export default function useCrud({ endpoint, fetchData, setOpen }) {
  const [loadingSave, setLoadingSave] = useState(false);

  const criarItem = async ({ input, setInput }) => {
    if (!input.trim()) return;
    try {
      setLoadingSave(true);
      await api.post(endpoint, { descricao: input });
      await fetchData();
      setInput('');
      toaster.create({ title: 'Criado com sucesso', type: 'success' });
    } catch (error) {
      toaster.create({ title: 'Erro ao criar', type: 'error' });
    } finally {
      setLoadingSave(false);
    }
  };

  const editarItem = async ({ id, inputEdit, setInputEdit }) => {
    if (!inputEdit.trim()) return;
    try {
      setLoadingSave(true);
      await api.patch(`${endpoint}/${id}`, { descricao: inputEdit });
      await fetchData();
      setInputEdit('');
      setOpen?.(false);
      toaster.create({ title: 'Atualizado com sucesso', type: 'success' });
    } catch (error) {
      toaster.create({ title: `Erro ao atualizar: ${error}`, type: 'error' });
    } finally {
      setLoadingSave(false);
    }
  };

  const excluirItem = async ({ id, tasks, setTasks, currentPage, itemsPerPage, setCurrentPage }) => {
    try {
      if (confirm('Deseja excluir este item?')) {
        await api.delete(`${endpoint}/${id}`);
        const novasTasks = tasks.filter(task => task.id !== id);
        setTasks(novasTasks);

        const totalPaginas = Math.ceil(novasTasks.length / itemsPerPage);
        if (currentPage > totalPaginas) {
          setCurrentPage(Math.max(totalPaginas, 1));
        }

        toaster.create({ title: 'Deletado com sucesso', type: 'success' });
      }
    } catch (error) {
      toaster.create({ title: 'Erro ao deletar', type: 'error' });
    }
  };

  return {
    criarItem,
    editarItem,
    excluirItem,
    loadingSave,
  };
}
