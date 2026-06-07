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
  useBaskets,
  useDeleteBasket,
} from "../../../src/hooks/useBaskets";

import { colors } from "../../../src/style/style";

export default function Cestas() {
  const { data: baskets, isLoading, error } = useBaskets();
  const deleteBasket = useDeleteBasket();

  const [search, setSearch] = useState("");

  function handleDelete(id: string) {
    Alert.alert(
      "Excluir Cesta",
      "Deseja realmente excluir esta cesta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteBasket.mutateAsync(id);
              Alert.alert("Sucesso", "Cesta excluída!");
            } catch {
              Alert.alert("Erro", "Falha ao excluir cesta");
            }
          },
        },
      ]
    );
  }

  const filteredBaskets = baskets?.filter((item) => {
    const nomeMatch = item.nome
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const descMatch = item.descricao
      ?.toLowerCase()
      .includes(search.toLowerCase());

    return nomeMatch || descMatch;
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
          Erro ao carregar cestas
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* BOTÃO NOVA */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/baskets/create")}
      >
        <Text style={styles.buttonText}>
          + Nova Cesta
        </Text>
      </TouchableOpacity>

      {/* SEARCH BAR */}
      <TextInput
        placeholder="Buscar cesta..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <FlatList
        data={filteredBaskets}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const hasDescription = !!item.descricao;

          return (
            <View style={styles.card}>
              <Text style={styles.name}>
                {item.nome}
              </Text>

              <Text style={styles.info}>
                {item.descricao || "Sem descrição"}
              </Text>

              {!hasDescription && (
                <Text style={styles.warning}>
                  ⚠ Sem detalhes
                </Text>
              )}

              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname:
                        "/baskets/details/[id]",
                      params: { id: item.id },
                    })
                  }
                >
                  <Text style={styles.edit}>
                    Ver Itens
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname:
                        "/baskets/edit/[id]",
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
              Nenhuma cesta encontrada
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