'use client';
import {
  Portal,
  Drawer,
  Input,
  Button,
  Stack,
} from "@chakra-ui/react";

export default function DrawerComp({
  setInputEdit,
  editarTask,
  inputEdit,
  open,
  setOpen,
  loadingSave,
}) {
  const handleChangeLugar = (index, field, value) => {
    const novosLugares = inputEdit.lugares.map((lugar, i) =>
      i === index ? { ...lugar, [field]: value } : lugar
    );
    setInputEdit({ ...inputEdit, lugares: novosLugares });
  };

  const handleAddLugar = () => {
    setInputEdit({
      ...inputEdit,
      lugares: [
        ...inputEdit.lugares,
        { linha: "", coluna: "", vendido: false, idUsuario: "" },
      ],
    });
  };

  const handleRemoveLugar = (index) => {
    const novosLugares = inputEdit.lugares.filter((_, i) => i !== index);
    setInputEdit({ ...inputEdit, lugares: novosLugares });
  };

  return (
    <Portal>
      <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              Editar Padrão
            </Drawer.Header>
            <Drawer.Body display="flex" flexDirection="column" gap={4}>
              {inputEdit.lugares.map((lugar, index) => (
                <Stack key={index} direction="row" alignItems="center" gap={2}>
                  <Input
                    placeholder="Linha"
                    value={lugar.linha}
                    onChange={(e) =>
                      handleChangeLugar(index, "linha", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Coluna"
                    value={lugar.coluna}
                    onChange={(e) =>
                      handleChangeLugar(index, "coluna", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Vendido (true ou false)"
                    value={lugar.vendido}
                    onChange={(e) =>
                      handleChangeLugar(index, "vendido", e.target.value)
                    }
                  />
                  <Input
                    placeholder="ID do Usuário (opcional)"
                    value={lugar.idUsuario || ""} // Garante que o valor seja uma string
                    onChange={(e) =>
                      handleChangeLugar(index, "idUsuario", e.target.value)
                    }
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
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="outline" mr={3} onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={editarTask}
                isLoading={loadingSave}
                loadingText="Salvando"
                background="green"
                color="white"
              >
                Salvar
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </Portal>
  );
}