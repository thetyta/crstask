'use client';
import {
  Portal,
  Drawer,
  Input,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { api } from "@/utils/axios";

export default function DrawerComp({
  setInputEdit,
  editarTask,
  inputEdit,
  open,
  setOpen,
  loadingSave,
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
    const salaValida = await verificarId(inputEdit.idSala, "salas");
    const filmeValido = await verificarId(inputEdit.idFilme, "filme");

    if (!salaValida) {
      setIdSalaValido(false);
      setTimeout(() => {
        setIdSalaValido(true);
      }, 3000);
      return;
    }

    if (!filmeValido) {
      setIdFilmeValido(false);
      setTimeout(() => {
        setIdFilmeValido(true);
      }, 3000);
      return;
    }

    const sucesso = await editarTask();
    if (sucesso) {
      setIdSalaValido(true);
      setIdFilmeValido(true);
    }
  };

  return (
    <Portal>
      <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              Editar Sessão
            </Drawer.Header>
            <Drawer.Body display="flex" flexDirection="column" gap={4}>
              Data Início
              <Input
                type="date"
                value={inputEdit.dataInicio}
                onChange={(e) =>
                  setInputEdit({ ...inputEdit, dataInicio: e.target.value })
                }
              />
              Data Fim
              <Input
                type="date"
                value={inputEdit.dataFim}
                onChange={(e) =>
                  setInputEdit({ ...inputEdit, dataFim: e.target.value })
                }
              />
              Preço
              <Input
                type="number"
                placeholder="Preço"
                value={inputEdit.preco}
                onChange={(e) =>
                  setInputEdit({ ...inputEdit, preco: e.target.value })
                }
              />
              Id Sala
              <Input
                placeholder="Id Sala"
                value={inputEdit.idSala}
                onChange={(e) =>
                  setInputEdit({ ...inputEdit, idSala: e.target.value })
                }
              />
              {!idSalaValido && (
                <span style={{ color: "red" }}>
                  ID da sala não encontrado
                </span>
              )}
              Id Filme
              <Input
                placeholder="Id Filme"
                value={inputEdit.idFilme}
                onChange={(e) =>
                  setInputEdit({ ...inputEdit, idFilme: e.target.value })
                }
              />
              {!idFilmeValido && (
                <span style={{ color: "red" }}>
                  ID do filme não encontrado
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