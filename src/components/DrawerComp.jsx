import { Portal, Drawer, Input, Button, CloseButton } from "@chakra-ui/react"

export default function DrawerComp ({
    setInputEdit,
    editarTask,
    inputEdit,
    open,
    setOpen
}) {
    return (

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
    )
}