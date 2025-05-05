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
  indexPrimeiroItem,
  headers
}) {
  return (
    <Table.Root width="50%" size="sm" variant="outline">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>{headers.id}</Table.ColumnHeader>
          <Table.ColumnHeader>{headers.desc}</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="end">Ações</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {tasks.map((cargo, i) => {
          const realIndex = indexPrimeiroItem + i;
          return (
            <Table.Row key={realIndex}>
               <Table.Cell>{cargo.id}</Table.Cell>
               <Table.Cell>{cargo.descricao}</Table.Cell>
              <Table.Cell textAlign="end">
                <Stack direction="row" justify="end">
                  <Button
                    background="red"
                    variant="subtle"
                    color="white"
                    size="xs"
                    onClick={() => onDelete(cargo.id)}
                  >
                    <MdDelete />
                  </Button>
                  <Button
                    background="grey"
                    variant="subtle"
                    color="white"
                    size="xs"
                    onClick={() => onEdit(cargo.id, cargo.des)}
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
