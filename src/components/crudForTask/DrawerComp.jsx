'use client';
import { Portal, Drawer, Input, Button, CloseButton } from "@chakra-ui/react";

export default function DrawerComp({
  setInputEdit,
  editarTask,
  inputEdit,
  open,
  setOpen,
  loadingSave,
}) {
  return (
    <Portal>
      <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Editar Cargo</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Input
                placeholder="Edite a descrição"
                variant="subtle"
                value={inputEdit}
                onChange={(e) => setInputEdit(e.target.value)}
              />
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="outline" onClick={() => setOpen(false)}>
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
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </Portal>
  );
}
