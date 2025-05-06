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
import DrawerComp from '@/components/Filmes/DrawerComp';
import Dialogo from '@/components/Filmes/Dialogue';
import ItemsPorPag from '@/components/ItemsPorPag';
import api from '@/utils/axios';
import { toaster } from '@/components/ui/toaster';
import useCrud from '@/components/Filmes/useCrud';

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


  const buscarFilme = async () => {
    try {
      const response = await api.get('/filme');
      setItems(response.data.data);
    } catch (error) {
      toaster.create({ title: 'Erro ao buscar filmes', type: 'error' });
    }
  };

  const uploadFile = async (files25, files26) => {
    const allFiles = [...files25, ...files26];
    const uploadedData = [];

    const uploadPromises = allFiles.map(async (fileData) => {
      const { file } = fileData;

      if (!file) {
        return;
      }

      const formData = new FormData();
      const fileBuffer = await file.arrayBuffer();
      const cleanFile = new File([fileBuffer], file.name.replace(/\s/g, '_'), {
        type: file.type,
        lastModified: file.lastModified,
      });

      formData.append('file', cleanFile, cleanFile.name);

      try {
        const response = await axios.post("/predict/predict", formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          transformRequest: (data) => data,
        });

        const { file: _, ...fileDataWithoutFile } = fileData;
        uploadedData.push({
          ...fileDataWithoutFile,
          fileName: cleanFile.name,
          fileType: cleanFile.type,
          fileSize: cleanFile.size,
          url: response.data.path,
        });

      } catch (error) {
        console.error("Upload failed:", error);
        toaster.create({
          title: `Failed to upload ${file.name}`,
          type: "error"
        });
      }
    });

    await Promise.all(uploadPromises);

    sessionStorage.setItem('uploadedFotos', JSON.stringify(uploadedData));
  };

  useEffect(() => {
    buscarFilme();
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
    endpoint: '/filme',
    fetchData: buscarFilme,
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
          { name: 'Descrição', value: 'descricao' },
          { name: 'Autor', value: 'autor' },
          { name: 'Duração', value: 'duracao' },
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
        uploadFile={uploadFile}
      />
    </Box>
  );
}