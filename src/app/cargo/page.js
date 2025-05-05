'use client';
import {
  Box,
  Heading,
  Flex,
  Input,
  Stack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import TaskTable from '@/components/TaskTable';
import PaginationDoida from '@/components/PaginationDoida';
import DrawerComp from '@/components/DrawerComp';
import Dialogo from '@/components/Dialogue';
import ItemsPorPag from '@/components/ItemsPorPag';
import api from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [input, setInput] = useState('');
  const [inputEdit, setInputEdit] = useState('');
  const [open, setOpen] = useState(false);
  const [idEdit, setIdEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [value, setValue] = useState([]);
  const [loadingSave, setLoadingSave] = useState(false);

  const buscarCargo = async () => {
    try {
      const response = await api.get('/cargo');
      setTasks(response.data.data);
    } catch (error) {
      toaster.create({ title: 'Erro ao buscar cargos', type: 'error' });
    }
  };

  useEffect(() => {
    buscarCargo();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const tasksFiltradas = tasks.filter(task =>
    task.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexUltimoItem = currentPage * itemsPerPage;
  const indexPrimeiroItem = indexUltimoItem - itemsPerPage;
  const taskAtuais = tasksFiltradas.slice(indexPrimeiroItem, indexUltimoItem);

  const criarTask = async () => {
    if (!input.trim()) return;
    try {
      setLoadingSave(true);
      await api.post('/cargo', { descricao: input });
      await buscarCargo();
      setInput('');
      toaster.create({ title: 'Cargo criado com sucesso', type: 'success' });
    } catch (error) {
      toaster.create({ title: 'Erro ao criar cargo', type: 'error' });
    } finally {
      setLoadingSave(false);
    }
  };

  const excluirTask = async (id) => {
    try {
      if(confirm("Deseja excluir o cargo?")){
      await api.delete(`/cargo/${id}`);
      const novasTasks = tasks.filter(task => task.id !== id);
      setTasks(novasTasks);
      const totalPaginas = Math.ceil(novasTasks.length / itemsPerPage);
      if (currentPage > totalPaginas) {
        setCurrentPage(Math.max(totalPaginas, 1));
      }
      toaster.create({ title: 'Cargo deletado com sucesso', type: 'success' });
    }
    } catch (error) {
      toaster.create({ title: 'Erro ao deletar cargo', type: 'error' });
    }
  };

  const editarTask = async (id) => {
    if (!inputEdit.trim()) return;
    try {
      setLoadingSave(true);
      await api.patch(`/cargo/${id}`, { descricao: inputEdit });
      await buscarCargo();
      setInputEdit('');
      setOpen(false);
      toaster.create({ title: 'Cargo atualizado com sucesso', type: 'success' });
    } catch (error) {
      toaster.create({ title: `Erro ao atualizar cargo ${error}`, type: 'error' });
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <Box p={8}>
      <Heading mb={4}>Lista de Cargos</Heading>
      <Flex mb={4} justifyContent="center" alignItems="center" gap={420}>
        <Input
          placeholder="Pesquise um cargo"
          variant="subtle"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          width="300px"
        />
        <Dialogo
          input={input}
          setInput={setInput}
          submit={criarTask}
          open={open}
          setOpen={setOpen}
          loadingSave={loadingSave}
        />
      </Flex>

      <Stack style={{ display: 'flex', alignItems: 'center' }}>
        <TaskTable
          tasks={taskAtuais}
          onDelete={(id) => excluirTask(id)}
          onEdit={(id, desc) => {
            setIdEdit(id);           
            setInputEdit(desc);       
            setOpen(true);
          }}
          indexPrimeiroItem={indexPrimeiroItem}
          headers={{ id: 'ID', desc: 'Descrição' }}
        />

        <Flex mb={4} justifyContent="center" alignItems="center" gap={420}>
          <PaginationDoida
            items={tasksFiltradas}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
          />
          <ItemsPorPag
            value={value}
            setValue={setValue}
            setItemsPerPage={setItemsPerPage}
            setCurrentPage={setCurrentPage}
          />
        </Flex>
      </Stack>
      <DrawerComp
        editarTask={editarTask}
        inputEdit={inputEdit}
        setInputEdit={setInputEdit}
        open={open}
        setOpen={setOpen}
        loadingSave={loadingSave}
        idEdit={idEdit}
      />
    </Box>
  );
}
