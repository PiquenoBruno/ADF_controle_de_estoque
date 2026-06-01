import {
    router,
    useLocalSearchParams,
} from "expo-router";

import {
    Alert,
    Button,
    TextInput,
    View,
} from "react-native";

import {
    useEffect,
    useState,
} from "react";

import {
    useProduct,
    useUpdateProduct,
} from "../../../src/hooks/useProducts";

export default function EditProduct() {
  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();

  const { data } =
    useProduct(id);

  const updateProduct =
    useUpdateProduct();

  const [nome, setNome] =
    useState("");

  const [quantidade, setQuantidade] =
    useState("");

  const [unidade, setUnidade] =
    useState("");

  const [minimo, setMinimo] =
    useState("");

  useEffect(() => {
    if (!data) return;

    setNome(data.nome);
    setQuantidade(
      String(data.quantidade)
    );
    setUnidade(data.unidade);
    setMinimo(
      String(data.minimo)
    );
  }, [data]);

  async function handleSave() {
    try {
      await updateProduct.mutateAsync({
        id,
        product: {
          nome,
          quantidade:
            Number(quantidade),
          unidade,
          minimo:
            Number(minimo),
        },
      });

      Alert.alert(
        "Sucesso",
        "Produto atualizado!"
      );

      router.back();
    } catch {
      Alert.alert(
        "Erro",
        "Falha ao atualizar"
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
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        value={quantidade}
        onChangeText={
          setQuantidade
        }
      />

      <TextInput
        value={unidade}
        onChangeText={setUnidade}
      />

      <TextInput
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
