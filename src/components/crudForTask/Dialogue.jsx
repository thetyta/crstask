import {
    Button,
    CloseButton,
    Dialog,
    HStack,
    Portal,
    Flex,
    Input
  } from "@chakra-ui/react"
import { IoAddCircleOutline } from 'react-icons/io5';

export default function Dialogo ({
    input,
    setInput,
    submit,
    loadingSave
}) {
    return (
      <HStack wrap="wrap" gap="4">
            <Dialog.Root
              placement='center'
              motionPreset="slide-in-bottom"
            >
              <Dialog.Trigger asChild>
                <Button 
                    background="green" 
                    color="white" 
                    rounded='100px'>
                    <IoAddCircleOutline />
                </Button>
              </Dialog.Trigger>
              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title>Criar Cargo</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                      <Flex mb={4}>
                            <Input
                            placeholder="Descrição do cargo"
                            variant="subtle"
                            mr={3}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                          />
                        </Flex>
                        {/* <Flex mb={4}>
                            <Input
                            placeholder="Descrição da Tarefa"
                            variant="subtle"
                            mr={3}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                          />
                        </Flex> */}
                    </Dialog.Body>
                    <Dialog.Footer>
                      <Dialog.ActionTrigger asChild>
                        <Button background="red" color="white"> Cancelar</Button>
                      </Dialog.ActionTrigger>
                      <Dialog.ActionTrigger asChild>
                        <Button 
                        onClick={submit} 
                        background="green" 
                        color="white"
                        loading={loadingSave}
                        loadingText="Salvando"
                        >
                          Salvar
                        </Button>
                      </Dialog.ActionTrigger>
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>
      </HStack>
    )
  }
  