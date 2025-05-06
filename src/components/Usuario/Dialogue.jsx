'use client';
import {
  Button,
  CloseButton,
  Dialog,
  HStack,
  Portal,
  Input,
} from "@chakra-ui/react";
import { IoAddCircleOutline } from "react-icons/io5";

export default function Dialogo({
  input,
  setInput,
  submit,
  loadingSave,
  open,
  setOpen,
}) {
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
                <Dialog.Title>Criar Usuário</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body display="flex" flexDirection="column" gap={4}>
                Nome
                <Input
                  placeholder="Nome"
                  value={input.nome}
                  onChange={(e) =>
                    setInput({ ...input, nome: e.target.value })
                  }
                />
                Email
                <Input
                  placeholder="Email"
                  value={input.email}
                  onChange={(e) =>
                    setInput({ ...input, email: e.target.value })
                  }
                />
                CPF
                <Input
                  placeholder="CPF"
                  value={input.cpf}
                  onChange={(e) =>
                    setInput({ ...input, cpf: e.target.value })
                  }
                />
                Estudante
                <Input
                  placeholder="Estudante"
                  value={input.estudante}
                  onChange={(e) =>
                    setInput({ ...input, estudante: e.target.value })
                  }
                />
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button background="red" color="white">
                    Cancelar
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  onClick={submit}
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
