import { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import {
  useDeleteProduct,
  useProducts,
} from "../../../src/hooks/useProducts";

import { colors } from "../../../src/style/style";

export default function Produtos() {
  const { data: products, isLoading, error } = useProducts();
  const deleteProduct = useDeleteProduct();

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<
    "all" | "low" | "ok"
  >("all");

  function handleDelete(id: string) {
    Alert.alert(
      "Excluir Produto",
      "Deseja realmente excluir este produto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct.mutateAsync(id);
              Alert.alert("Sucesso", "Produto excluído!");
            } catch {
              Alert.alert("Erro", "Falha ao excluir produto");
            }
          },
        },
      ]
    );
  }

  const filteredProducts = products?.filter((item) => {
    const estoqueBaixo =
      item.quantidade <= item.minimo;

    const matchesSearch = item.nome
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesStock =
      stockFilter === "all"
        ? true
        : stockFilter === "low"
        ? estoqueBaixo
        : !estoqueBaixo;

    return matchesSearch && matchesStock;
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.color1} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Erro ao carregar produtos
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* BOTÃO NOVO */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/products/create")}
      >
        <Text style={styles.buttonText}>
          + Novo Produto
        </Text>
      </TouchableOpacity>

      {/* SEARCH */}
      <TextInput
        placeholder="Buscar produto..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {/* FILTRO ESTOQUE */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          onPress={() => setStockFilter("all")}
          style={[
            styles.filterButton,
            stockFilter === "all" &&
              styles.filterActive,
          ]}
        >
          <Text style={styles.filterText}>Todos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setStockFilter("ok")}
          style={[
            styles.filterButton,
            stockFilter === "ok" &&
              styles.filterActive,
          ]}
        >
          <Text style={styles.filterText}>
            Estoque OK
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setStockFilter("low")}
          style={[
            styles.filterButton,
            stockFilter === "low" &&
              styles.filterActive,
          ]}
        >
          <Text style={styles.filterText}>
            Estoque baixo
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const estoqueBaixo =
            item.quantidade <= item.minimo;

          return (
            <View style={styles.card}>
              <Text style={styles.name}>
                {item.nome}
              </Text>

              <Text style={styles.info}>
                Quantidade: {item.quantidade}
              </Text>

              <Text style={styles.info}>
                Medida: {item.unidade}
              </Text>

              <Text style={styles.info}>
                Mínimo: {item.minimo}
              </Text>

              {estoqueBaixo && (
                <Text style={styles.warning}>
                  ⚠ Estoque baixo
                </Text>
              )}

              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname:
                        "/products/edit/[id]",
                      params: { id: item.id },
                    })
                  }
                >
                  <Text style={styles.edit}>
                    Editar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    handleDelete(item.id)
                  }
                >
                  <Text style={styles.delete}>
                    Excluir
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Nenhum produto encontrado
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    backgroundColor: colors.color1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },

  search: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#F9FAFB",
  },

  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  filterButton: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },

  filterActive: {
    backgroundColor: colors.color1,
    borderColor: colors.color1,
  },

  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111",
  },

  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
    elevation: 3,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.colorAlivio,
  },

  info: {
    color: colors.color8,
    marginTop: 4,
  },

  warning: {
    marginTop: 8,
    color: colors.colorDe,
    fontWeight: "bold",
  },

  actions: {
    flexDirection: "row",
    gap: 20,
    marginTop: 12,
  },

  edit: {
    color: colors.color1,
    fontWeight: "600",
  },

  delete: {
    color: colors.colorAle,
    fontWeight: "600",
  },

  empty: {
    marginTop: 40,
    alignItems: "center",
  },

  emptyText: {
    color: colors.color8,
    fontSize: 16,
  },

  errorText: {
    color: colors.colorAle,
  },
});