import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";
import { useDeliveries } from "../../../src/hooks/useDeliveries";
import { colors } from "../../../src/style/style";

export default function Entregas() {
  const { data: deliveries, isLoading, error } = useDeliveries();

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
          Erro ao carregar entregas
        </Text>
      </View>
    );
  }

  function getStatusText(status?: string) {
    switch (status) {
      case "Pendente":
        return "⏳ Aguardando confirmação";
      case "Entregue":
        return "✅ Entregue";
      case "Cancelada":
        return "❌ Cancelada";
      default:
        return "Status desconhecido";
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/deliveries/create")}
      >
        <Text style={styles.buttonText}>
          + Nova Entrega
        </Text>
      </TouchableOpacity>

      <FlatList
        data={deliveries ?? []}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <View style={styles.card}>
              <Text style={styles.name}>
                {item.basket_name}
              </Text>

              <Text style={styles.info}>
                Família: (item as any).family?.responsavel ?? "Sem família"
              </Text>

              <Text style={styles.info}>
                Data:{" "}
                {item.delivered_at
                  ? new Date(item.delivered_at).toLocaleDateString()
                  : "Sem data"}
              </Text>

              <Text style={styles.status}>
                {getStatusText(item.status)}
              </Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/deliveries/details/[id]",
                      params: { id: item.id },
                    })
                  }
                >
                  <Text style={styles.edit}>
                    Detalhes
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Nenhuma entrega cadastrada
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

  status: {
    marginTop: 8,
    fontWeight: "600",
    color: colors.colorAlivio,
  },

  actions: {
    marginTop: 12,
  },

  edit: {
    color: colors.color1,
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
    fontWeight: "600",
  },
});