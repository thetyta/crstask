import { useState } from 'react';
import api from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';

export default function useCrud({ endpoint, fetchData, setOpen }) {
  const [loadingSave, setLoadingSave] = useState(false);

  const criarItem = async ({ input, setInput }) => {
    if (!input.nome || !input.email || !input.cpf || typeof input.estudante !== 'boolean') {
      toaster.create({ title: 'Preencha todos os campos corretamente', type: 'error' });
      return;
    }
    try {
      setLoadingSave(true);
      await api.post(endpoint, {
        nome: input.nome,
        email: input.email,
        cpf: input.cpf,
        estudante: input.estudante,
      });
      await fetchData();
      setInput({
        nome: '',
        email: '',
        cpf: '',
        estudante: false,
      });
      toaster.create({ title: 'Usuário criado com sucesso', type: 'success' });
    } catch (error) {
      toaster.create({ title: `Erro ao criar usuário: ${error}`, type: 'error' });
    } finally {
      setLoadingSave(false);
    }
  };

  const editarItem = async ({ id, inputEdit, setInputEdit, task }) => {
    const updatedData = {};

    if (inputEdit.nome && inputEdit.nome !== task.nome) updatedData.nome = inputEdit.nome;
    if (inputEdit.email && inputEdit.email !== task.email) updatedData.email = inputEdit.email;
    if (inputEdit.cpf && inputEdit.cpf !== task.cpf) updatedData.cpf = inputEdit.cpf;
    if (typeof inputEdit.estudante === 'boolean' && inputEdit.estudante !== task.estudante) {
      updatedData.estudante = inputEdit.estudante;
    }

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
        email: '',
        cpf: '',
        estudante: false,
      });
      setOpen?.(false);
      toaster.create({ title: 'Usuário atualizado com sucesso', type: 'success' });
    } catch (error) {
      toaster.create({ title: `Erro ao atualizar usuário: ${error}`, type: 'error' });
    } finally {
      setLoadingSave(false);
    }
  };

  const excluirItem = async ({ id, currentPage, itemsPerPage, setCurrentPage }) => {
    try {
      if (confirm('Deseja excluir este usuário?')) {
        await api.delete(`${endpoint}/${id}`);

        const novasItems = items.filter(item => item.id !== id);
        setItems(novasItems);

        const totalPaginas = Math.ceil(novasItems.length / itemsPerPage);
        if (currentPage > totalPaginas) {
          setCurrentPage(Math.max(totalPaginas, 1));
        }

        toaster.create({ title: 'Usuário deletado com sucesso', type: 'success' });
      }
    } catch (error) {
      toaster.create({ title: 'Erro ao deletar usuário', type: 'error' });
    }
  };

  return {
    criarItem,
    editarItem,
    excluirItem,
    loadingSave,
  };
}