'use client';
import {
  Box,
  Heading,
  Flex,
  Input,
  Button,
  CloseButton,
  Drawer,
  Portal,
  Stack,
  Pagination,
  IconButton,
  ButtonGroup
} from '@chakra-ui/react';
import { IoAddCircleOutline } from 'react-icons/io5';
import { Table } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdDelete, MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [input, setInput] = useState('');
    const [inputEdit, setInputEdit] = useState('');
    const [open, setOpen] = useState(false);
    const [idEdit, setIdEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);


  const indexUltimoItem = currentPage * itemsPerPage;
  const indexPrimeiroItem = indexUltimoItem - itemsPerPage;
  const taskAtuais = tasks.slice(indexPrimeiroItem, indexUltimoItem);

  const pesquisarTarefa = () => {
    if (!searchTerm.trim()) return
    const o = tasks.filter((item, _) => item.value !== searchTerm);
    console.log(o);
    
  }

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
      <Flex mb={4}>
      <Input
          placeholder="Pesquise uma tarefa"
          variant="subtle"
          value={searchTerm}
          mr={3}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Flex>
      <Flex mb={8}>
        <Input
          placeholder="Digite uma tarefa"
          variant="subtle"
          mr={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={criarTask} background="green" color="white">
          <IoAddCircleOutline />
        </Button>
      </Flex>
      <Stack style={{ display: 'flex', alignItems: 'center' }}>
        <Table.Root width="50%" size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Tarefas</Table.ColumnHeader>
              <Table.ColumnHeader>Descrição</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Ações</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {taskAtuais.map((task, i) => {
              const realIndex = indexPrimeiroItem + i;
              return (
                <Table.Row key={realIndex}>
                  <Table.Cell>{task}</Table.Cell>
                  <Table.Cell>coisalegal</Table.Cell>
                  <Table.Cell textAlign="end">
                    <Stack direction="row" justify="end">
                      <Button
                        background="red"
                        variant="subtle"
                        color="white"
                        size="xs"
                        onClick={() => excluirTask(realIndex)}
                      >
                        <MdDelete />
                      </Button>
                      <Button
                        background="grey"
                        variant="subtle"
                        color="white"
                        size="xs"
                        onClick={() => {
                          setIdEdit(realIndex);
                          setInputEdit(task);
                          setOpen(true);
                        }}
                      >
                        <FaEdit />
                      </Button>
                    </Stack>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
        <Stack gap="8">
          <Pagination.Root
            count={tasks.length}
            pageSize={itemsPerPage}
            defaultPage={1}
            page={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          >
            <ButtonGroup variant="ghost" size="xs">
              <Pagination.PrevTrigger asChild>
                <IconButton
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                >
                  <MdKeyboardArrowLeft />
                </IconButton>
              </Pagination.PrevTrigger>
              <Pagination.Items
                render={(page) => (
                  <IconButton
                    onClick={() => setCurrentPage(page.value)}
                    variant={{ base: 'ghost', _selected: 'outline' }}
                  >
                    {page.value}
                  </IconButton>
                )}
              />
              <Pagination.NextTrigger asChild>
                <IconButton
                  onClick={() =>
                    setCurrentPage(
                      Math.min(
                        currentPage + 1,
                        Math.ceil(tasks.length / itemsPerPage)
                      )
                    )
                  }
                >
                  <MdKeyboardArrowRight />
                </IconButton>
              </Pagination.NextTrigger>
            </ButtonGroup>
          </Pagination.Root>
        </Stack>
      </Stack>
      <Portal>
        <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Editar Tarefa</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Input
                  placeholder="Edite a tarefa"
                  variant="subtle"
                  mr={3}
                  value={inputEdit}
                  onChange={(e) => setInputEdit(e.target.value)}
                />
              </Drawer.Body>
              <Drawer.Footer>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={editarTask} background="green" color="white">
                  Save
                </Button>
              </Drawer.Footer>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Drawer.Root>
      </Portal>
    </Box>
  );
}
