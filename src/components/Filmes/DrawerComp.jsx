'use client';
import {
  Portal,
  Drawer,
  Input,
  Button,
  FileUpload,
  Icon,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuUpload } from "react-icons/lu";

export default function DrawerComp({
  setInputEdit,
  editarTask,
  inputEdit,
  open,
  setOpen,
  loadingSave,
  uploadFile, // Passa a função de upload como prop
}) {
  const [files, setFiles] = useState([]); // Estado para armazenar os arquivos selecionados

  const handleFilesChange = async (newFiles) => {
    setFiles(newFiles); // Atualiza o estado com os arquivos selecionados
    await uploadFile(newFiles, []); // Chama a função de upload
  };

  return (
    <Portal>
      <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              Editar Filme
            </Drawer.Header>
            <Drawer.Body display="flex" flexDirection="column" gap={4}>
              Nome
              <Input
                value={inputEdit.nome}
                onChange={(e) =>
                  setInputEdit({ ...inputEdit, nome: e.target.value })
                }
              />
              Descrição
              <Input
                value={inputEdit.descricao}
                onChange={(e) =>
                  setInputEdit({ ...inputEdit, descricao: e.target.value })
                }
              />
              Autor
              <Input
                value={inputEdit.autor}
                onChange={(e) =>
                  setInputEdit({ ...inputEdit, autor: e.target.value })
                }
              />
              Duração
              <Input
                type="time"
                value={inputEdit.duracao}
                onChange={(e) =>
                  setInputEdit({
                    ...inputEdit,
                    duracao: e.target.value,
                  })
                }
              />
              <FileUpload.Root
                maxW="xl"
                alignItems="stretch"
                maxFiles={10}
                onFilesChange={handleFilesChange} // Chama a função ao selecionar arquivos
              >
                <FileUpload.HiddenInput />
                <FileUpload.Dropzone>
                  <Icon size="md" color="fg.muted">
                    <LuUpload />
                  </Icon>
                  <FileUpload.DropzoneContent>
                    <Box>Drag and drop files here</Box>
                    <Box color="fg.muted">.png, .jpg up to 5MB</Box>
                  </FileUpload.DropzoneContent>
                </FileUpload.Dropzone>
                <FileUpload.List />
              </FileUpload.Root>
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