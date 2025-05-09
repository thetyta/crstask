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
import DrawerComp from '@/components/Padrao/DrawerComp';
import Dialogo from '@/components/Padrao/Dialogue';
import ItemsPorPag from '@/components/ItemsPorPag';
import { api } from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';
import useCrud from '@/components/Padrao/useCrud';

export default function Padrao() {
  const [items, setItems] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [input, setInput] = useState({
    lugares: [],
  });
  const [inputEdit, setInputEdit] = useState({
    lugares: []
});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false); 
  const [idEdit, setIdEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [value, setValue] = useState([]);
  const [taskEditOriginal, setTaskEditOriginal] = useState(null);


  const buscarPadrao = async () => {
    try {
      const response = await api.get('/padrao');
      setItems(response.data.data);
    } catch (error) {
      toaster.create({ title: 'Erro ao buscar padrões', type: 'error' });
    }
  };

  useEffect(() => {
    buscarPadrao();
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
    endpoint: '/padrao',
    fetchData: buscarPadrao,
    setIsEditOpen,
  });

  const itemsFiltradas = items.filter(item =>
    JSON.stringify(item.lugares).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itemsAtuais = itemsFiltradas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box p={8}>
      <Heading mb={4}>Lista de Padrões</Heading>
      <Flex mb={4} justifyContent="center" alignItems="center" gap={420}>
        <Input
          placeholder="Pesquise Padrões"
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
          { name: 'Padrao', value: 'lugares' },
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