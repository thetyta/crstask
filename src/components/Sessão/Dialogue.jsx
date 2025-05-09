"use client";
import {
  Button,
  CloseButton,
  Dialog,
  HStack,
  Input,
  Portal,
} from "@chakra-ui/react";
import { useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { api } from "@/utils/axios";

export default function Dialogo({
  input,
  setInput,
  submit,
  loadingSave,
  open,
  setOpen,
}) {
  const [idSalaValido, setIdSalaValido] = useState(true);
  const [idFilmeValido, setIdFilmeValido] = useState(true);
  
  const verificarId = async (id, tipo) => {
    try {
      const response = await api.get(`/${tipo}/:${id}`);
      if (!response) {
        return false; // Retorna true ou false
      } return true
    } catch (error) {
      return false; // Retorna false se houver erro
    }
  };
  
  const handleSubmit = async () => {
    const salaValida = await verificarId(input.idSala, "salas");
    const filmeValido = await verificarId(input.idFilme, "filme");
  
    if (!salaValida) {
      setIdSalaValido(false);
      setTimeout(() => {
        setIdSalaValido(true);
      }, 3000);
      return; // Interrompe o processo se o ID da sala for inválido
    }
  
    if (!filmeValido) {
      setIdFilmeValido(false);
      setTimeout(() => {
        setIdFilmeValido(true);
      }, 3000);
      return; // Interrompe o processo se o ID do filme for inválido
    }
  
    const sucesso = await submit();
    if (sucesso) {
      setIdSalaValido(true);
      setIdFilmeValido(true);
    }
  };
  return (
    <HStack wrap="wrap" gap="4">
      <Dialog.Root
        placement="center"
        motionPreset="slide-in-bottom"
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
      >
        <Dialog.Trigger asChild>
          <Button background="green" color="white" rounded="100px">
            <IoAddCircleOutline />
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Criar Sessão</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body display="flex" flexDirection="column" gap={4}>
                Data Inicio
                <Input
                  placeholder="Data Inicio"
                  type="date"
                  value={input.dataInicio}
                  onChange={(e) => setInput({ ...input, dataInicio: e.target.value })}
                />
                Data Fim
                <Input
                  placeholder="Data Fim"
                  type="date"
                  value={input.dataFim}
                  onChange={(e) =>
                    setInput({ ...input, dataFim: e.target.value })
                  }
                />
                Preço
                <Input
                  type="number"
                  placeholder="Preço"
                  value={input.preco}
                  onChange={(e) =>
                    setInput({ ...input, preco: e.target.value })
                  }
                />
                Id Sala
                <Input
                  placeholder="Id Sala"
                  value={input.idSala}
                  onChange={(e) => setInput({ ...input, idSala: e.target.value })}
                />
                {!idSalaValido && (
                  <span style={{ color: "red" }}>
                    ID sala não encontrado
                  </span>
                )}
                Id Filme
                <Input
                  placeholder="Id Filme"
                  value={input.idFilme}
                  onChange={(e) =>
                    setInput({ ...input, idFilme: e.target.value })
                  }
                />
                {!idFilmeValido && (
                  <span style={{ color: "red" }}>
                    ID filme não encontrado
                  </span>
                )}
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button background="red" color="white">
                    Cancelar
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  onClick={handleSubmit}
                  background="green"
                  color="white"
                  isLoading={loadingSave}
                  loadingText="Salvando"
                >
                  Salvar
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </HStack>
  );
}