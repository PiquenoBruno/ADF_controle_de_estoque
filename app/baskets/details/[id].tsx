import { useState } from "react";

import { useLocalSearchParams } from "expo-router";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  useBasketItems,
  useCreateBasketItem,
  useDeleteBasketItem,
  useUpdateBasketItem,
} from "../../../src/hooks/useBasketItems";

import { useProducts } from "../../../src/hooks/useProducts";

import { colors } from "../../../src/style/style";

export default function BasketDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: items } = useBasketItems(id!);
  const { data: products = [] } = useProducts();

  const createItem = useCreateBasketItem();
  const deleteItem = useDeleteBasketItem();
  const updateItem = useUpdateBasketItem();

  const [productId, setProductId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [openProducts, setOpenProducts] = useState(false);
  const [search, setSearch] = useState("");

  const selectedProduct = products?.find(
    (p) => p.id === productId
  );

  async function handleAdd() {
    if (!id) return;

    if (!productId) {
      Alert.alert("Erro", "Selecione um produto");
      return;
    }

    if (!quantidade || Number(quantidade) <= 0) {
      Alert.alert("Erro", "Informe uma quantidade válida");
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

  async function aumentarQuantidade(
    itemId: string,
    quantidadeAtual: number
  ) {
    try {
      await updateItem.mutateAsync({
        id: itemId,
        quantidade: quantidadeAtual + 1,
      });
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar");
    }
  }

  async function diminuirQuantidade(
    itemId: string,
    quantidadeAtual: number
  ) {
    if (quantidadeAtual <= 1) {
      Alert.alert(
        "Aviso",
        "Quantidade mínima é 1"
      );
      return;
    }

    try {
      await updateItem.mutateAsync({
        id: itemId,
        quantidade: quantidadeAtual - 1,
      });
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={styles.container}>
        {/* TITLE */}
        <Text style={styles.title}>Itens da Cesta</Text>

        {/* SELECTOR */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() =>
              setOpenProducts(!openProducts)
            }
          >
            <Text style={styles.dropdownHeaderText}>
              {productId
                ? selectedProduct?.nome
                : "Selecionar produto"}
            </Text>

            <Text style={styles.dropdownArrow}>
              {openProducts ? "▲" : "▼"}
            </Text>
          </TouchableOpacity>

          {openProducts && (
            <View style={styles.dropdownBox}>
              <TextInput
                placeholder="Buscar produto..."
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
              />

              <FlatList
                data={products?.filter((p) =>
                  p.nome
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ gap: 10 }}
                contentContainerStyle={{ gap: 10 }}
                renderItem={({ item }) => {
                  const selected =
                    productId === item.id;

                  const lowStock =
                    item.quantidade <= item.minimo;

                  return (
                    <TouchableOpacity
                      style={[
                        styles.productCard,
                        selected &&
                          styles.productSelected,
                      ]}
                      onPress={() =>
                        setProductId(item.id)
                      }
                    >
                      <Text
                        style={[
                          styles.productName,
                          selected &&
                            styles.productNameSelected,
                        ]}
                      >
                        {item.nome}
                      </Text>

                      <Text
                        style={[
                          styles.productStock,
                          selected &&
                            styles.productNameSelected,
                        ]}
                      >
                        {item.quantidade} un.
                      </Text>

                      {lowStock && (
                        <Text style={styles.warning}>
                          ⚠ baixo estoque
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}

          <Text style={styles.info}>
            Selecionado:{" "}
            {selectedProduct?.nome || "Nenhum"}
          </Text>

          <TextInput
            placeholder="Quantidade"
            keyboardType="numeric"
            value={quantidade}
            onChangeText={setQuantidade}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAdd}
          >
            <Text style={styles.addButtonText}>
              + Adicionar Produto
            </Text>
          </TouchableOpacity>
        </View>

        {/* ITEMS LIST */}
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 40,
          }}
          renderItem={({ item }) => {
            const lowStock =
              item.quantidade <= 1;

            return (
              <View style={styles.card}>
                <Text style={styles.name}>
                  {(item as any).products?.nome}
                </Text>

                {/* QUANTIDADE COM + E − */}
                <View style={styles.quantityRow}>
                  <TouchableOpacity
                    style={styles.minusButton}
                    onPress={() =>
                      diminuirQuantidade(
                        item.id,
                        item.quantidade
                      )
                    }
                  >
                    <Text style={styles.minusText}>
                      −
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.quantityText}>
                    {item.quantidade}
                  </Text>

                  <TouchableOpacity
                    style={styles.plusButton}
                    onPress={() =>
                      aumentarQuantidade(
                        item.id,
                        item.quantidade
                      )
                    }
                  >
                    <Text style={styles.plusText}>
                      +
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    handleDelete(item.id)
                  }
                >
                  <Text style={styles.delete}>
                    Remover
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                Nenhum item na cesta
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 30,
    backgroundColor: "#FFF",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.colorAlivio,
    marginBottom: 12,
  },

  // ===== CARD PRINCIPAL (form + lista container) =====
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  // ===== DROPDOWN =====
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginBottom: 10,
  },

  dropdownHeaderText: {
    fontWeight: "bold",
    color: colors.colorAlivio,
  },

  dropdownArrow: {
    fontSize: 16,
    color: colors.color8,
  },

  dropdownBox: {
    marginBottom: 12,
  },

  searchInput: {
    borderWidth: 1,
    borderColor: colors.color8,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },

  productCard: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#FFF",
  },

  productSelected: {
    backgroundColor: colors.color1,
    borderColor: colors.color1,
  },

  productName: {
    fontWeight: "bold",
    color: "#000",
  },

  productNameSelected: {
    color: "#FFF",
  },

  productStock: {
    fontSize: 12,
    color: colors.color8,
    marginTop: 4,
  },

  info: {
    marginTop: 8,
    color: colors.color8,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.color8,
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },

  addButton: {
    backgroundColor: colors.color1,
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    alignItems: "center",
  },

  addButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },

  // ===== ITEM DA LISTA (MELHORADO) =====
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.colorAlivio,
    marginBottom: 6,
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 14,
    marginTop: 12,
    paddingVertical: 6,
  },

  quantityText: {
    fontSize: 16,
    fontWeight: "700",
    minWidth: 30,
    textAlign: "center",
    color: colors.colorAlivio,
  },

  plusButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.color1,
    justifyContent: "center",
    alignItems: "center",
  },

  minusButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.color1,
    justifyContent: "center",
    alignItems: "center",
  },

  plusText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },

  minusText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },

  warning: {
    marginTop: 8,
    color: colors.colorDe,
    fontWeight: "600",
    fontSize: 12,
    backgroundColor: "#FFF7E6",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
  },

  delete: {
    color: colors.colorAle,
    fontWeight: "600",
    marginTop: 12,
    fontSize: 13,
  },

  empty: {
    marginTop: 40,
    alignItems: "center",
  },

  emptyText: {
    color: colors.color8,
  },
});