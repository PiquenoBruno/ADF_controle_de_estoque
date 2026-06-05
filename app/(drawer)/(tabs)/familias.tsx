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
  useDeleteFamily,
  useFamilies,
} from "../../../src/hooks/useFamilies";

import { colors } from "../../../src/style/style";

export default function Familias() {
  const { data: families, isLoading, error } = useFamilies();
  const deleteFamily = useDeleteFamily();

  function handleDelete(id: string) {
    Alert.alert(
      "Excluir Família",
      "Deseja realmente excluir esta família?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFamily.mutateAsync(id);
              Alert.alert("Sucesso", "Família excluída!");
            } catch {
              Alert.alert("Erro", "Falha ao excluir família");
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
          Erro ao carregar famílias
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* BOTÃO NOVA */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/families/create")}
      >
        <Text style={styles.buttonText}>
          + Nova Família
        </Text>
      </TouchableOpacity>

      <FlatList
        data={families}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const familiaGrande = item.quantidade_pessoas >= 6;

          return (
            <View style={styles.card}>
              <Text style={styles.name}>
                {item.responsavel}
              </Text>

              <Text style={styles.info}>
                📞 {item.telefone}
              </Text>

              <Text style={styles.info}>
                👨‍👩‍👧 Pessoas: {item.quantidade_pessoas}
              </Text>

              <Text style={styles.info}>
                📍 {item.endereco}
              </Text>

              {familiaGrande && (
                <Text style={styles.warning}>
                  ⚠ Família grande
                </Text>
              )}

              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/families/edit/[id]",
                      params: { id: item.id },
                    })
                  }
                >
                  <Text style={styles.edit}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.delete}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Nenhuma família cadastrada
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