import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
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

      {/* LISTA */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const estoqueBaixo = item.quantidade <= item.minimo;

          return (
            <View style={styles.card}>
              <Text style={styles.name}>
                {item.nome}
              </Text>

              <Text style={styles.info}>
                Quantidade: {item.quantidade}
              </Text>

              <Text style={styles.info}>
                Unidade: {item.unidade}
              </Text>

              <Text style={styles.info}>
                Mínimo: {item.minimo}
              </Text>

              {estoqueBaixo && (
                <Text style={styles.warning}>
                  ⚠ Estoque baixo
                </Text>
              )}

              {/* AÇÕES */}
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/products/edit/[id]",
                      params: { id: item.id },
                    })
                  }
                >
                  <Text style={styles.edit}>
                    Editar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
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
              Nenhum produto cadastrado
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
    marginBottom: 16,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
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