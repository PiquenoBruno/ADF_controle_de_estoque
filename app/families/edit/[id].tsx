import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  ScrollView,
  TextInput,
} from "react-native";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  useFamily,
  useUpdateFamily,
} from "../../../src/hooks/useFamilies";

export default function EditFamily() {
  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();

  const { data: family } =
    useFamily(id);

  const updateFamily =
    useUpdateFamily();

  const [responsavel, setResponsavel] =
    useState("");

  const [telefone, setTelefone] =
    useState("");

  const [endereco, setEndereco] =
    useState("");

  const [
    quantidadePessoas,
    setQuantidadePessoas,
  ] = useState("");

  const [observacoes, setObservacoes] =
    useState("");

  useEffect(() => {
    if (!family) return;

    setResponsavel(
      family.responsavel
    );

    setTelefone(
      family.telefone ?? ""
    );

    setEndereco(
      family.endereco ?? ""
    );

    setQuantidadePessoas(
      String(
        family.quantidade_pessoas
      )
    );

    setObservacoes(
      family.observacoes ?? ""
    );
  }, [family]);

  async function handleSave() {
    try {
      await updateFamily.mutateAsync({
        id,
        family: {
          responsavel,
          telefone,
          endereco,
          quantidade_pessoas:
            Number(
              quantidadePessoas
            ),
          observacoes,
        },
      });

      Alert.alert(
        "Sucesso",
        "Família atualizada!"
      );

      router.back();
    } catch (error) {
      Alert.alert(
        "Erro",
        "Falha ao atualizar família"
      );
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        gap: 12,
      }}
    >
      <TextInput
        placeholder="Responsável"
        value={responsavel}
        onChangeText={
          setResponsavel
        }
      />

      <TextInput
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
      />

      <TextInput
        placeholder="Endereço"
        value={endereco}
        onChangeText={setEndereco}
      />

      <TextInput
        placeholder="Quantidade de Pessoas"
        keyboardType="numeric"
        value={quantidadePessoas}
        onChangeText={
          setQuantidadePessoas
        }
      />

      <TextInput
        placeholder="Observações"
        multiline
        value={observacoes}
        onChangeText={
          setObservacoes
        }
      />

      <Button
        title="Salvar Alterações"
        onPress={handleSave}
      />
    </ScrollView>
  );
}
