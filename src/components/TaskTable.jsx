'use client';
import {
  Table,
  Button,
  Stack
} from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';

export default function TaskTable({
  tasks,
  onDelete,
  onEdit,
  indexPrimeiroItem
}) {
  return (
    <Table.Root width="50%" size="sm" variant="outline">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Tarefas</Table.ColumnHeader>
          <Table.ColumnHeader>Descrição</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="end">Ações</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {tasks.map((task, i) => {
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
                    onClick={() => onDelete(realIndex)}
                  >
                    <MdDelete />
                  </Button>
                  <Button
                    background="grey"
                    variant="subtle"
                    color="white"
                    size="xs"
                    onClick={() => onEdit(realIndex, task)}
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
  );
}
