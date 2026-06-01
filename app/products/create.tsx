import { useState } from "react";

import {
    Alert,
    Button,
    TextInput,
    View,
} from "react-native";

import { router } from "expo-router";

import {
    useCreateProduct,
} from "../../src/hooks/useProducts";

export default function CreateProduct() {
  const [nome, setNome] =
    useState("");

  const [quantidade, setQuantidade] =
    useState("");

  const [unidade, setUnidade] =
    useState("");

  const [minimo, setMinimo] =
    useState("");

  const createProduct =
    useCreateProduct();

  async function handleSave() {
    try {
      await createProduct.mutateAsync({
        nome,
        quantidade:
          Number(quantidade),
        unidade,
        minimo:
          Number(minimo),
      });

      Alert.alert(
        "Sucesso",
        "Produto criado!"
      );

      router.back();
    } catch (error) {
      Alert.alert(
        "Erro",
        "Falha ao criar produto"
      );
    }
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        gap: 12,
      }}
    >
      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        placeholder="Quantidade"
        keyboardType="numeric"
        value={quantidade}
        onChangeText={
          setQuantidade
        }
      />

      <TextInput
        placeholder="Unidade"
        value={unidade}
        onChangeText={setUnidade}
      />

      <TextInput
        placeholder="Mínimo"
        keyboardType="numeric"
        value={minimo}
        onChangeText={setMinimo}
      />

      <Button
        title="Salvar"
        onPress={handleSave}
      />
    </View>
  );
}