import React from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../../src/style/style";

interface ProductSelectorProps {
  products: any[];
  productId: string;
  setProductId: (id: string) => void;
  search: string;
  setSearch: (value: string) => void;
  openProducts: boolean;
  setOpenProducts: (value: boolean) => void;
  quantidade: string;
  setQuantidade: (value: string) => void;
  onAdd: () => void; 
}

export default function ProductSelector({
  products,
  productId,
  setProductId,
  search,
  setSearch,
  openProducts,
  setOpenProducts,
  quantidade,
  setQuantidade,
  onAdd,
}: ProductSelectorProps) {
  const selectedProduct = products?.find((p) => p.id === productId);

  return (
    <View style={{ marginVertical: 12 }}>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 14,
          borderWidth: 1,
          borderColor: "#E5E7EB",
          borderRadius: 12,
        }}
        onPress={() => setOpenProducts(!openProducts)}
      >
        <Text style={{ fontWeight: "bold", color: colors.colorAlivio }}>
          {productId ? selectedProduct?.nome : "Selecionar produto"}
        </Text>
        <Text>{openProducts ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {openProducts && (
        <View style={{ marginTop: 10 }}>
          {/* Campo de busca */}
          <TextInput
            placeholder="Buscar produto..."
            value={search}
            onChangeText={setSearch}
            style={{
              borderWidth: 1,
              borderColor: colors.color8,
              borderRadius: 12,
              padding: 10,
              marginBottom: 10,
            }}
          />

          {/* Campo de quantidade */}
          <TextInput
            placeholder="Quantidade"
            keyboardType="numeric"
            value={quantidade}
            onChangeText={setQuantidade}
            style={{
              borderWidth: 1,
              borderColor: colors.color8,
              borderRadius: 12,
              padding: 10,
              marginBottom: 10,
            }}
          />

          {/* Botão de adicionar produto */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.color1,
              padding: 12,
              borderRadius: 12,
              alignItems: "center",
              marginBottom: 12,
            }}
            onPress={onAdd}
          >
            <Text style={{ color: "#FFF", fontWeight: "bold" }}>
              + Adicionar Produto
            </Text>
          </TouchableOpacity>

          {/* Lista de produtos */}
          <FlatList
            data={products.filter((p) =>
              p.nome.toLowerCase().includes(search.toLowerCase())
            )}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ gap: 10 }}
            contentContainerStyle={{ gap: 10 }}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const selected = productId === item.id;
              return (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: selected ? colors.color1 : "#E5E7EB",
                    borderRadius: 12,
                    backgroundColor: selected ? colors.color1 : "#FFF",
                  }}
                  onPress={() => setProductId(item.id)}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: selected ? "#FFF" : "#000",
                    }}
                  >
                    {item.nome}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.color8,
                      marginTop: 4,
                    }}
                  >
                    {item.unidade || item.products?.unidade || "un"}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </View>
  );
}
