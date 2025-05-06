import { useState } from 'react';
import api from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';

export default function useCrud({ endpoint, fetchData, setOpen }) {
    const [loadingSave, setLoadingSave] = useState(false);

const criarItem = async ({ input, setInput }) => {
    if (!input.nome || !input.descricao || !input.autor || !input.duracao)
      return
    try {
      setLoadingSave(true);
      await api.post(endpoint, {
        nome: input.nome,
        descricao: input.descricao,
        autor: input.autor,
        duracao: input.duracao,
      })
      await fetchData();
      setInput({
        nome: '',
        descricao: '',
        autor: '',
        duracao: ''
      })
      toaster.create({ title: 'Criado com sucesso', type: 'success' });
    } catch (error) {
      toaster.create({ title: `Erro ao criar ${error}`, type: 'error' });
    } finally {
      setLoadingSave(false);
    }
  };

  const editarItem = async ({ id, inputEdit, setInputEdit, task }) => {
    const updatedData = {};
  
    if (inputEdit.nome && inputEdit.nome !== task.nome) updatedData.nome = inputEdit.nome;
    if (inputEdit.descricao && inputEdit.descricao !== task.descricao) updatedData.descricao = inputEdit.descricao;
    if (inputEdit.autor && inputEdit.autor !== task.autor) updatedData.autor = inputEdit.autor;
    if (inputEdit.duracao && inputEdit.duracao !== task.duracao) updatedData.duracao = inputEdit.duracao;
  
    if (Object.keys(updatedData).length === 0) {
      toaster.create({ title: 'Nenhuma alteração detectada', type: 'info' });
      return;
    }
  
    try {
      setLoadingSave(true);
      await api.patch(`${endpoint}/${id}`, updatedData);
      await fetchData();
      setInputEdit({
        nome: '',
        descricao: '',
        autor: '',
        duracao: '',
      });
      setOpen?.(false);
      toaster.create({ title: 'Atualizado com sucesso', type: 'success' });
    } catch (error) {
      toaster.create({ title: `Erro ao atualizar: ${error}`, type: 'error' });
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