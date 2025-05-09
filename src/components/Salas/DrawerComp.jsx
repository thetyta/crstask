'use client';
import {
  Portal,
  Drawer,
  Input,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
export default function DrawerComp({
  setInputEdit,
  editarTask,
  inputEdit,
  open,
  setOpen,
  loadingSave,
}) {
    const [idPadraoValido, setIdPadraoValido] = useState(true);
    
    const handleSubmit = async () => {
        const sucesso = await editarTask();
        if (!sucesso) {
          setIdPadraoValido(false);
          setTimeout(() => {
            setIdPadraoValido(true);
          }, 3000);
        } else {
          setIdPadraoValido(true);
        }
      };
    
  return (
    <Portal>
      <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              Editar Sala
            </Drawer.Header>
            <Drawer.Body display="flex" flexDirection="column" gap={4}>
              Observação
              <Input
                value={inputEdit.observacao}
                onChange={(e) =>
                  setInputEdit({ ...inputEdit, observacao: e.target.value })
                }
              />
              Id Padrão
              <Input
                value={inputEdit.idPadrao}
                onChange={(e) =>
                  setInputEdit({ ...inputEdit, idPadrao: e.target.value })
                }
              />
              {!idPadraoValido && (
                  <span style={{ color: "red" }}>
                    ID do padrão não encontrado
                  </span>
                )}
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="outline" mr={3} onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
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
