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

export default function Dialogo({
  input,
  setInput,
  submit,
  loadingSave,
  open,
  setOpen,
}) {
    const [idPadraoValido, setIdPadraoValido] = useState(true);
    
      const handleSubmit = async () => {
        const sucesso = await submit();
        if (!sucesso) {
            setIdPadraoValido(false);
            setTimeout(() => {
                setIdPadraoValido(true);
            }, 3000)
        } else {
            setIdPadraoValido(true);
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
                <Dialog.Title>Criar Usuário</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body display="flex" flexDirection="column" gap={4}>
                Descrição
                <Input
                  placeholder="Descrição"
                  value={input.observacao}
                  onChange={(e) => setInput({ ...input, observacao: e.target.value })}
                />
                Id Padrão
                <Input
                  placeholder="Id Padrao"
                  value={input.idPadrao}
                  onChange={(e) => setInput({ ...input, idPadrao: e.target.value })}
                />
                {!idPadraoValido && (
                  <span style={{ color: "red" }}>
                    ID do padrão não encontrado
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