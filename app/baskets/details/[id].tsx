import { useState } from "react";

import {
  Alert,
  Button,
  FlatList,
  Text,
  TextInput,
  View,
} from "react-native";

import { useLocalSearchParams } from "expo-router";

import {
  useBasketItems,
  useCreateBasketItem,
  useDeleteBasketItem,
} from "../../../src/hooks/useBasketItems";

import { useProducts } from "../../../src/hooks/useProducts";

export default function BasketDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: items } = useBasketItems(id!);
  const { data: products } = useProducts();

  const createItem = useCreateBasketItem();
  const deleteItem = useDeleteBasketItem();

  const [productId, setProductId] = useState("");
  const [quantidade, setQuantidade] = useState("");

  async function handleAdd() {
    if (!id) return;

    if (!productId) {
      Alert.alert("Selecione um produto");
      return;
    }

    if (!quantidade || Number(quantidade) <= 0) {
      Alert.alert("Informe uma quantidade válida");
      return;
    }

    try {
      await createItem.mutateAsync({
        basket_id: id,
        product_id: productId,
        quantidade: Number(quantidade),
      });

      setQuantidade("");
      setProductId("");

      Alert.alert("Sucesso", "Produto adicionado");
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  }

  async function handleDelete(itemId: string) {
    try {
      await deleteItem.mutateAsync(itemId);

      Alert.alert("Sucesso", "Item removido");
    } catch {
      Alert.alert("Erro", "Falha ao remover item");
    }
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Itens da Cesta
      </Text>

      <Text>Escolha um produto:</Text>

      {products?.map((product) => (
        <View key={product.id} style={{ marginTop: 5 }}>
          <Button
            title={product.nome}
            onPress={() => setProductId(product.id)}
          />
        </View>
      ))}

      <Text style={{ marginTop: 10 }}>
        Produto selecionado: {productId || "Nenhum"}
      </Text>

      <TextInput
        placeholder="Quantidade"
        keyboardType="numeric"
        value={quantidade}
        onChangeText={setQuantidade}
        style={{
          borderWidth: 1,
          padding: 10,
          marginTop: 10,
          marginBottom: 10,
        }}
      />

      <Button title="Adicionar Produto" onPress={handleAdd} />

      <FlatList
        style={{ marginTop: 20 }}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              padding: 12,
              marginBottom: 10,
              borderRadius: 8,
            }}
          >
            <Text>Produto: {item.products?.nome}</Text>
            <Text>Quantidade: {item.quantidade}</Text>

            <Button
              title="Remover"
              onPress={() => handleDelete(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}