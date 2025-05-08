import { useState } from 'react';
import { api, verificarIdUsuario } from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';

export default function useCrud({ endpoint, fetchData, setOpen }) {
  const [loadingSave, setLoadingSave] = useState(false);

  const criarItem = async ({ input, setInput }) => {
    const { lugares } = input;

    // Valida os campos obrigatórios para cada lugar
    for (const lugar of lugares) {
      if (!lugar.linha || !lugar.coluna) {
        toaster.create({ title: 'Preencha todos os campos obrigatórios', type: 'error' });
        return false;
      }

      // Valida o ID do usuário apenas se ele for fornecido
      if (lugar.idUsuario && String(lugar.idUsuario).trim() !== "") {
        const valido = await verificarIdUsuario(lugar.idUsuario);
        if (!valido) {
          toaster.create({ title: `ID do usuário ${lugar.idUsuario} não encontrado`, type: 'error' });
          return false;
        }
      }
    }

    try {
      setLoadingSave(true);
      await api.post(endpoint, {
        lugares: lugares.map((lugar) => ({
          linha: lugar.linha,
          coluna: lugar.coluna,
          vendido: lugar.vendido === 'true'? true : false,
          idUsuario: lugar.idUsuario ? parseInt(lugar.idUsuario, 10) : null,
        })),
      });
      await fetchData();
      setInput({ lugares: [] });
      toaster.create({ title: 'Padrão criado com sucesso', type: 'success' });
      return true;
    } catch (error) {
      toaster.create({ title: `Erro ao criar padrão: ${error}`, type: 'error' });
      return false;
    } finally {
      setLoadingSave(false);
    }
  };

  const editarItem = async ({ id, inputEdit, setInputEdit }) => {
    const { lugares } = inputEdit;
  
    // Valida os campos obrigatórios para cada lugar
    for (const lugar of lugares) {
      if (!lugar.linha || !lugar.coluna) {
        toaster.create({ title: 'Preencha todos os campos obrigatórios', type: 'error' });
        return false;
      }
  
      // Valida o ID do usuário apenas se ele for fornecido
      if (lugar.idUsuario && String(lugar.idUsuario).trim() !== "") {
        const valido = await verificarIdUsuario(lugar.idUsuario);
        if (!valido) {
          toaster.create({ title: `ID do usuário ${lugar.idUsuario} não encontrado`, type: 'error' });
          return false;
        }
      }
    }
  
    try {
      setLoadingSave(true);
      await api.patch(`${endpoint}/${id}`, {
        lugares: lugares.map((lugar) => ({
          linha: lugar.linha,
          coluna: lugar.coluna,
          vendido: lugar.vendido === 'true'? true : false,
          idUsuario: lugar.idUsuario ? parseInt(lugar.idUsuario, 10) : null,
        })),
      });
      await fetchData();
      setInputEdit({ lugares: [] });
      setOpen?.(false);
      toaster.create({ title: 'Padrão atualizado com sucesso', type: 'success' });
      return true;
    } catch (error) {
      toaster.create({ title: `Erro ao atualizar padrão: ${error}`, type: 'error' });
      return false;
    } finally {
      setLoadingSave(false);
    }
  };
  const excluirItem = async ({ id, items, setItems, currentPage, itemsPerPage, setCurrentPage }) => {
    try {
      if (confirm('Deseja excluir este item?')) {
        await api.delete(`${endpoint}/${id}`);

        const novasItems = items.filter((item) => item.id !== id);
        setItems(novasItems);

        const totalPaginas = Math.ceil(novasItems.length / itemsPerPage);
        if (currentPage > totalPaginas) {
          setCurrentPage(Math.max(totalPaginas, 1));
        }

        toaster.create({ title: 'Item deletado com sucesso', type: 'success' });
      }
    } catch (error) {
      toaster.create({ title: 'Erro ao deletar item', type: 'error' });
    }
  };

  return {
    criarItem,
    editarItem,
    excluirItem,
    loadingSave,
  };
}