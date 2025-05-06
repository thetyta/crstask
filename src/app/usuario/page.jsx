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
import DrawerComp from '@/components/Usuario/DrawerComp';
import Dialogo from '@/components/Usuario/Dialogue';
import ItemsPorPag from '@/components/ItemsPorPag';
import api from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';
import useCrud from '@/components/Usuario/useCrud';

export default function Filme() {
  const [items, setItems] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [input, setInput] = useState({
    nome: '',
    descricao: '',
    autor: '',
    duracao: '',
  });
  const [inputEdit, setInputEdit] = useState({
    nome: '',
    descricao: '',
    autor: '',
    duracao: '',
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false); 
  const [idEdit, setIdEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [value, setValue] = useState([]);
  const [taskEditOriginal, setTaskEditOriginal] = useState(null);


  const buscarUsuario = async () => {
    try {
      const response = await api.get('/usuario');
      setItems(response.data.data);
    } catch (error) {
      toaster.create({ title: 'Erro ao buscar filmes', type: 'error' });
    }
  };

  useEffect(() => {
    buscarUsuario();
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
    endpoint: '/usuario',
    fetchData: buscarUsuario,
    setIsEditOpen,
  });

  const itemsFiltradas = items.filter(item =>
    item.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itemsAtuais = itemsFiltradas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box p={8}>
      <Heading mb={4}>Lista de Filmes</Heading>
      <Flex mb={4} justifyContent="center" alignItems="center" gap={420}>
        <Input
          placeholder="Pesquise Filmes"
          variant="subtle"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          width="300px"
        />
        <Dialogo
          input={input}
          setInput={setInput}
          submit={() => criarItem({ input, setInput })}
          open={isCreateOpen}
          setOpen={setIsCreateOpen}
          loadingSave={loadingSave}
        />
      </Flex>

      <Stack style={{ display: 'flex', alignItems: 'center' }}>
        <TaskTable
          tasks={itemsAtuais}
          onDelete={(id) =>
            excluirItem({
              id,
              items,
              setItems,
              currentPage,
              itemsPerPage,
              setCurrentPage,
            })
          }
          onEdit={(id, task) => {
            setIdEdit(id);
            setInputEdit(task);      
            setTaskEditOriginal(task);
            setIsEditOpen(true);
          }}
          
          headers={[
            { name: 'ID', value: 'id' },
            { name: 'Nome', value: 'nome' },
            { name: 'Email', value: 'email' },
            { name: 'CPF', value: 'cpf' },
            { name: 'Estudante', value: 'estudante' },
          ]}
        />

        <Flex mb={4} justifyContent="center" alignItems="center" gap={420}>
          <PaginationDoida
            items={itemsFiltradas}
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
            task: taskEditOriginal,
          })
        }
        inputEdit={inputEdit}
        setInputEdit={setInputEdit}
        open={isEditOpen}
        setOpen={setIsEditOpen}
        loadingSave={loadingSave}
        idEdit={idEdit}
      />
    </Box>
  );
}