import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  useBasketItems,
  useCreateBasketItem,
  useDeleteBasketItem,
  useUpdateBasketItem,
} from "../../hooks/useBasketItems";
import { useBasket } from "../../hooks/useBaskets";
import { useProducts } from "../../hooks/useProducts";
import { colors } from "../../style/style";

import BasketItemCard from "./BasketItemCard";
import EmptyList from "./EmptyList";
import ProductSelector from "./ProductSelector";

export default function BasketDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: basket } = useBasket(id!);
  const { data: items } = useBasketItems(id!);
  const { data: products = [] } = useProducts();

  const createItem = useCreateBasketItem();
  const deleteItem = useDeleteBasketItem();
  const updateItem = useUpdateBasketItem();

  const [productId, setProductId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [openProducts, setOpenProducts] = useState(false);
  const [search, setSearch] = useState("");
  const [showActions, setShowActions] = useState(false); // ✅ controle geral

  async function handleAdd() {
    if (!id || !productId || !quantidade || Number(quantidade) <= 0) {
      Alert.alert("Erro", "Selecione um produto e informe quantidade válida");
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
      setOpenProducts(false);
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

  async function aumentarQuantidade(itemId: string, q: number) {
    try {
      await updateItem.mutateAsync({ id: itemId, quantidade: q + 1 });
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar");
    }
  }

  async function diminuirQuantidade(itemId: string, q: number) {
    if (q <= 1) {
      Alert.alert("Aviso", "Quantidade mínima é 1");
      return;
    }
    try {
      await updateItem.mutateAsync({ id: itemId, quantidade: q - 1 });
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", color: colors.colorAlivio }}>
          Itens da Cesta {basket?.nome ? `- ${basket.nome}` : ""}
        </Text>

        <ProductSelector
          products={products}
          productId={productId}
          setProductId={setProductId}
          search={search}
          setSearch={setSearch}
          openProducts={openProducts}
          setOpenProducts={setOpenProducts}
          quantidade={quantidade}
          setQuantidade={setQuantidade}
          onAdd={handleAdd}
        />

        {/* Botão geral agora logo abaixo do seletor */}
        <TouchableOpacity
          style={{
            backgroundColor: colors.color1,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 10,
            alignSelf: "flex-start",
            marginVertical: 12,
          }}
          onPress={() => setShowActions(!showActions)}
        >
          <Text style={{ color: "#FFF", fontWeight: "600" }}>
            {showActions ? "Ocultar ações" : "Mostrar ações"}
          </Text>
        </TouchableOpacity>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <BasketItemCard
              item={item}
              onIncrease={() => aumentarQuantidade(item.id, item.quantidade)}
              onDecrease={() => diminuirQuantidade(item.id, item.quantidade)}
              onDelete={() => handleDelete(item.id)}
              showActions={showActions} // ✅ passa controle geral
            />
          )}
          ListEmptyComponent={<EmptyList />}
        />
      </View>
    </SafeAreaView>
  );
}
