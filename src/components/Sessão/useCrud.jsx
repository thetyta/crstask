import { useState } from 'react';
import { api } from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';

export default function useCrud({ endpoint, fetchData, setOpen }) {
  const [loadingSave, setLoadingSave] = useState(false);

  const criarItem = async ({ input, setInput }) => {
    if (!input.dataInicio || !input.dataFim || !input.preco || !input.idSala || !input.idFilme) {
      toaster.create({ title: 'Preencha todos os campos obrigatórios', type: 'error', duration: 3000 });
      return false;
    }

    try {
      setLoadingSave(true);
      await api.post(endpoint, {
        dataInicio: input.dataInicio,
        dataFim: input.dataFim,
        preco: parseFloat(input.preco),
        idSala: parseInt(input.idSala, 10),
        idFilme: parseInt(input.idFilme, 10),
      });
      await fetchData();
      setInput({
        dataInicio: '',
        dataFim: '',
        preco: '',
        idSala: '',
        idFilme: '',
      });
      toaster.create({ title: 'Sessão criada com sucesso', type: 'success', duration: 3000 });
      return true;
    } catch (error) {
      toaster.create({ title: `Erro ao criar sessão: ${error}`, type: 'error', duration: 3000 });
      return false;
    } finally {
      setLoadingSave(false);
    }
  };

  const editarItem = async ({ id, inputEdit, setInputEdit, task }) => {
    const updatedData = {};

    if (inputEdit.dataInicio && inputEdit.dataInicio !== task.dataInicio) updatedData.dataInicio = inputEdit.dataInicio;
    if (inputEdit.dataFim && inputEdit.dataFim !== task.dataFim) updatedData.dataFim = inputEdit.dataFim;
    if (inputEdit.preco && inputEdit.preco !== task.preco) updatedData.preco = parseFloat(inputEdit.preco);
    if (inputEdit.idSala && inputEdit.idSala !== task.idSala) updatedData.idSala = parseInt(inputEdit.idSala, 10);
    if (inputEdit.idFilme && inputEdit.idFilme !== task.idFilme) updatedData.idFilme = parseInt(inputEdit.idFilme, 10);

    if (Object.keys(updatedData).length === 0) {
      toaster.create({ title: 'Nenhuma alteração detectada', type: 'info', duration: 3000 });
      return false;
    }

    try {
      setLoadingSave(true);
      await api.patch(`${endpoint}/${id}`, updatedData);
      await fetchData();
      setInputEdit({
        dataInicio: '',
        dataFim: '',
        preco: '',
        idSala: '',
        idFilme: '',
      });
      setOpen?.(false);
      toaster.create({ title: 'Sessão atualizada com sucesso', type: 'success', duration: 3000 });
      return true;
    } catch (error) {
      toaster.create({ title: `Erro ao atualizar sessão: ${error}`, type: 'error', duration: 3000 });
      return false;
    } finally {
      setLoadingSave(false);
    }
  };

  const excluirItem = async ({ id, items, setItems, currentPage, itemsPerPage, setCurrentPage }) => {
    try {
      if (confirm('Deseja excluir esta sessão?')) {
        await api.delete(`${endpoint}/${id}`);

        const novasItems = items.filter((item) => item.id !== id);
        setItems(novasItems);

        const totalPaginas = Math.ceil(novasItems.length / itemsPerPage);
        if (currentPage > totalPaginas) {
          setCurrentPage(Math.max(totalPaginas, 1));
        }

        toaster.create({ title: 'Sessão deletada com sucesso', type: 'success', duration: 3000 });
      }
    } catch (error) {
      toaster.create({ title: 'Erro ao deletar sessão', type: 'error', duration: 3000 });
    }
  };

  return {
    criarItem,
    editarItem,
    excluirItem,
    loadingSave,
  };
}