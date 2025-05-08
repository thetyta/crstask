"use client";
import { useState } from "react";
import {
  Button,
  CloseButton,
  Dialog,
  HStack,
  Input,
  Portal,
  Stack,
  Text,
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
  const [idUsuarioValido, setIdUsuarioValido] = useState(true);

  const handleAddLugar = () => {
    setInput({
      ...input,
      lugares: [
        ...input.lugares,
        { linha: "", coluna: "", vendido: false, idUsuario: "" },
      ],
    });
  };

  const handleRemoveLugar = (index) => {
    const novosLugares = input.lugares.filter((_, i) => i !== index);
    setInput({ ...input, lugares: novosLugares });
  };

  const handleChangeLugar = (index, field, value) => {
    const novosLugares = input.lugares.map((lugar, i) =>
      i === index ? { ...lugar, [field]: value } : lugar
    );
    setInput({ ...input, lugares: novosLugares });
  };

  const handleSubmit = async () => {
    const sucesso = await submit();
    if (!sucesso) {
      setIdUsuarioValido(false);
    } else {
      setIdUsuarioValido(true);
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
                <Dialog.Title>Criar Padrão</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body display="flex" flexDirection="column" gap={4}>
                {/* Cabeçalho para indicar os campos */}
                <Stack direction="row" alignItems="center" gap={2}>
                  <Text fontWeight="bold" width="100px">
                    Linha
                  </Text>
                  <Text fontWeight="bold" width="100px">
                    Coluna
                  </Text>
                  <Text fontWeight="bold" width="150px">
                    Vendido
                  </Text>
                  <Text fontWeight="bold" width="150px">
                    ID do Usuário
                  </Text>
                </Stack>

                {Array.isArray(input.lugares) &&
                  input.lugares.map((lugar, index) => (
                    <Stack key={index} direction="row" alignItems="center" gap={2}>
                      <Input
                        placeholder="Linha"
                        value={lugar.linha}
                        onChange={(e) =>
                          handleChangeLugar(index, "linha", e.target.value)
                        }
                        width="100px"
                      />
                      <Input
                        placeholder="Coluna"
                        value={lugar.coluna}
                        onChange={(e) =>
                          handleChangeLugar(index, "coluna", e.target.value)
                        }
                        width="100px"
                      />
                      <Input
                        placeholder="Vendido (true ou false)"
                        value={lugar.vendido}
                        onChange={(e) =>
                          handleChangeLugar(index, "vendido", e.target.value)
                        }
                        width="150px"
                      />
                      <Input
                        placeholder="ID do Usuário (opcional)"
                        value={lugar.idUsuario}
                        onChange={(e) =>
                          handleChangeLugar(index, "idUsuario", e.target.value)
                        }
                        width="150px"
                      />
                      <Button
                        variant="outline"
                        colorScheme="red"
                        onClick={() => handleRemoveLugar(index)}
                      >
                        Remover
                      </Button>
                    </Stack>
                  ))}
                <Button
                  variant="outline"
                  colorScheme="blue"
                  onClick={handleAddLugar}
                >
                  Adicionar Lugar
                </Button>
                {!idUsuarioValido && (
                  <span style={{ color: "red" }}>
                    ID do usuário não encontrado
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