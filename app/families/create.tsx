import { useState } from "react";

import {
    Alert,
    Button,
    ScrollView,
    TextInput,
} from "react-native";

import { router } from "expo-router";

import {
    useCreateFamily,
} from "../../src/hooks/useFamilies";

export default function CreateFamily() {
  const createFamily =
    useCreateFamily();

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

  async function handleSave() {
    try {
      await createFamily.mutateAsync({
        responsavel,
        telefone,
        endereco,
        quantidade_pessoas:
          Number(quantidadePessoas),
        observacoes,
      });

      Alert.alert(
        "Sucesso",
        "Família cadastrada!"
      );

      router.back();
    } catch (error) {
      Alert.alert(
        "Erro",
        "Falha ao cadastrar família"
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
        title="Salvar"
        onPress={handleSave}
      />
    </ScrollView>
  );
}