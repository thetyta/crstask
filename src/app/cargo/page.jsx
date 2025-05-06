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
import DrawerComp from '@/components/crudForTask/DrawerComp';
import Dialogo from '@/components/crudForTask/Dialogue';
import ItemsPorPag from '@/components/ItemsPorPag';
import api from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';
import useCrud from '@/components/crudForTask/useCrud';

export default function Cargo() {
  const [tasks, setTasks] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [input, setInput] = useState('');
  const [inputEdit, setInputEdit] = useState('');
  const [open, setOpen] = useState(false);
  const [idEdit, setIdEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [value, setValue] = useState([]);

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

  const {
    criarItem,
    editarItem,
    excluirItem,
    loadingSave,
  } = useCrud({
    endpoint: '/cargo',
    fetchData: buscarCargo,
    setOpen,
  });

  const tasksFiltradas = tasks.filter(task =>
    task.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const taskAtuais = tasksFiltradas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          submit={() => criarItem({ input, setInput })}
          open={open}
          setOpen={setOpen}
          loadingSave={loadingSave}
        />
      </Flex>

      <Stack style={{ display: 'flex', alignItems: 'center' }}>
        <TaskTable
          tasks={taskAtuais}
          onDelete={(id) =>
            excluirItem({
              id,
              tasks,
              setTasks,
              currentPage,
              itemsPerPage,
              setCurrentPage,
            })
          }
          onEdit={(id, desc) => {
            setIdEdit(id);
            setInputEdit(desc);
            setOpen(true);
          }}
          headers={[
            { name: 'ID', value: 'id' },
            { name: 'Descrição', value: 'descricao' },
          ]}
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
        editarTask={() =>
          editarItem({
            id: idEdit,
            inputEdit,
            setInputEdit,
          })
        }
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