'use client';
import {
  Box,
  Heading,
  Flex,
  Input,
  Stack,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import TaskTable from '@/components/TaskTable'
import PaginationDoida from '@/components/PaginationDoida';
import DrawerComp from '@/components/DrawerComp';
import Dialogo from '@/components/Dialogue';
import ItemsPorPag from '@/components/ItemsPorPag';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [input, setInput] = useState('');
  const [inputEdit, setInputEdit] = useState('');
  const [open, setOpen] = useState(false);
  const [idEdit, setIdEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [value, setValue] = useState([])

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const tasksFiltradas = useMemo(() => {
    if (!searchTerm.trim()) return tasks;
    return tasks.filter(task =>
      task.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, tasks]);

  const indexUltimoItem = currentPage * itemsPerPage;
  const indexPrimeiroItem = indexUltimoItem - itemsPerPage;
  const taskAtuais = tasksFiltradas.slice(indexPrimeiroItem, indexUltimoItem);

  const criarTask = () => {
    if (!input.trim()) return;
    setTasks([...tasks, input]);
    setInput('');
  };

  const excluirTask = (realIndex) => {
    const taskExcluido = tasks.filter((_, i) => i !== realIndex);
    setTasks(taskExcluido);
    const totalPaginas = Math.ceil(taskExcluido.length / itemsPerPage);
    if (currentPage > totalPaginas) {
      setCurrentPage(Math.max(totalPaginas, 1));
    }
  };

  const editarTask = () => {
    if (!inputEdit.trim()) return;
    const taskEditada = tasks.map((task, i) => (i === idEdit ? inputEdit : task));
    setTasks(taskEditada);
    setInputEdit('');
    setIdEdit(null);
    setOpen(false);
  };

  return (
    <Box p={8}>
      <Heading mb={4}>Lista de Tarefas</Heading>
      <Flex
        mb={4}
        justifyContent="center"
        alignItems="center"
        gap={420}
      >
        <Input
          placeholder="Pesquise uma tarefa"
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
        />
      </Flex>
      <Stack style={{ display: 'flex', alignItems: 'center' }}>
        <TaskTable
          tasks={taskAtuais}
          onDelete={excluirTask}
          onEdit={(index, task) => {
            setIdEdit(index);
            setInputEdit(task);
            setOpen(true);
          }}
          indexPrimeiroItem={indexPrimeiroItem}
        />
        <Flex
          mb={4}
          justifyContent="center"
          alignItems="center"
          gap={420}
        >
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
      />
    </Box>
  );
}