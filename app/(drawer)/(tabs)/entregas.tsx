import { useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";
import { useDeliveries } from "../../../src/hooks/useDeliveries";
import { colors } from "../../../src/style/style";

export default function Entregas() {
  const { data: deliveries, isLoading, error } = useDeliveries();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "entregue" | "nao_entregue"
  >("all");

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

  const filteredDeliveries = deliveries?.filter((item) => {
    const matchesSearch =
      item.basket_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      (item as any).family?.responsavel
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "entregue"
        ? item.status === "Entregue"
        : item.status !== "Entregue";

    return matchesSearch && matchesStatus;
  });

  return (
    <View style={styles.container}>
      {/* BOTÃO NOVA ENTREGA */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/deliveries/create")}
      >
        <Text style={styles.buttonText}>
          + Nova Entrega
        </Text>
      </TouchableOpacity>

      {/* BARRA DE PESQUISA */}
      <TextInput
        placeholder="Buscar entrega..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {/* FILTRO STATUS */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          onPress={() => setStatusFilter("all")}
          style={[
            styles.filterButton,
            statusFilter === "all" && styles.filterActive,
          ]}
        >
          <Text style={styles.filterText}>Todas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setStatusFilter("entregue")}
          style={[
            styles.filterButton,
            statusFilter === "entregue" &&
              styles.filterActive,
          ]}
        >
          <Text style={styles.filterText}>Entregues</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setStatusFilter("nao_entregue")}
          style={[
            styles.filterButton,
            statusFilter === "nao_entregue" &&
              styles.filterActive,
          ]}
        >
          <Text style={styles.filterText}>
            Não entregues
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredDeliveries ?? []}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <View style={styles.card}>
              <Text style={styles.name}>
                {item.basket_name}
              </Text>

              <Text style={styles.info}>
                Família:{" "}
                {(item as any).family?.responsavel ??
                  "Sem família"}
              </Text>

              <Text style={styles.info}>
                Data:{" "}
                {item.delivered_at
                  ? new Date(
                      item.delivered_at
                    ).toLocaleDateString()
                  : "Sem data"}
              </Text>

              <Text style={styles.status}>
                {getStatusText(item.status)}
              </Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname:
                        "/deliveries/details/[id]",
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
              Nenhuma entrega encontrada
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
    marginBottom: 10,
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