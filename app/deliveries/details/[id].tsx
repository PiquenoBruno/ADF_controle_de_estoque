import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useLocalSearchParams } from "expo-router";
import {
  useDelivery,
  useUpdateDelivery,
} from "../../../src/hooks/useDeliveries";

import {
  decreaseStock,
  increaseStock,
} from "../../../src/services/stock.service";
import { supabase } from "../../../src/services/supabase";

import { colors } from "../../../src/style/style";

export default function DeliveryDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: delivery, isLoading, error } = useDelivery(id);
  const updateDelivery = useUpdateDelivery();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.color1} />
      </View>
    );
  }

  if (error || !delivery) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Entrega não encontrada
        </Text>
      </View>
    );
  }

  const d = delivery;

  function isPending() {
    return d.status === "Pendente";
  }

  function getStatusColor(status?: string) {
    switch (status) {
      case "Pendente":
        return colors.colorDe;
      case "Entregue":
        return "#22C55E";
      case "Cancelada":
        return colors.colorAle;
      default:
        return colors.color8;
    }
  }

  async function handleConfirm() {
    try {
      if (!isPending()) {
        Alert.alert("Aviso", "Essa entrega não pode ser confirmada");
        return;
      }

      if (!d.items?.length) {
        Alert.alert("Erro", "Entrega sem itens");
        return;
      }

      for (const item of d.items) {
        if (!item?.product_id) continue;
        await decreaseStock(item.product_id, item.quantidade ?? 0);
      }

      await updateDelivery.mutateAsync({
        id: d.id,
        delivery: {
          status: "Entregue",
        },
      });

      await supabase
        .from("baskets")
        .update({
          entregue: true,
          status: "Entregue",
        })
        .eq("id", d.basket_id);

      Alert.alert("Sucesso", "Entrega confirmada!");
    } catch (err: any) {
      Alert.alert("Erro", err?.message || "Falha ao confirmar entrega");
    }
  }

  async function handleCancel() {
    try {
      if (!isPending()) {
        Alert.alert("Aviso", "Essa entrega não pode ser cancelada");
        return;
      }

      if (!d.items?.length) {
        Alert.alert("Erro", "Entrega sem itens");
        return;
      }

      for (const item of d.items) {
        if (!item?.product_id) continue;
        await increaseStock(item.product_id, item.quantidade ?? 0);
      }

      await updateDelivery.mutateAsync({
        id: d.id,
        delivery: {
          status: "Cancelada",
        },
      });

      Alert.alert("Sucesso", "Entrega cancelada!");
    } catch (err: any) {
      Alert.alert("Erro", err?.message || "Falha ao cancelar entrega");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Detalhes da Entrega
      </Text>

      {/* CARD PRINCIPAL */}
      <View style={styles.card}>
        <Text style={styles.label}>Cesta</Text>
        <Text style={styles.text}>
          {d.basket_name || "N/A"}
        </Text>

        <Text style={styles.label}>Família</Text>
        <Text style={styles.text}>
          {d.families?.nome || d.family_id || "N/A"}
        </Text>

        <Text style={styles.label}>Observação</Text>
        <Text style={styles.text}>
          {d.observacao || "Nenhuma"}
        </Text>

        <Text style={styles.label}>Data</Text>
        <Text style={styles.text}>
          {d.delivered_at
            ? new Date(d.delivered_at).toLocaleString()
            : "Sem data"}
        </Text>

        <Text
          style={[
            styles.status,
            { color: getStatusColor(d.status) },
          ]}
        >
          Status: {d.status}
        </Text>
      </View>

      {/* ITENS */}
      <Text style={styles.subtitle}>Itens</Text>

      {d.items?.length ? (
        d.items.map((item: any, index: number) => (
          <View key={index} style={styles.itemCard}>
            <Text style={styles.text}>
              Produto: {item.produto || "N/A"}
            </Text>
            <Text style={styles.text}>
              Quantidade: {item.quantidade ?? 0}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.text}>
          Nenhum item registrado
        </Text>
      )}

      {/* AÇÕES */}
      <View style={styles.actions}>
        {isPending() ? (
          <>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleConfirm}
            >
              <Text style={styles.btnText}>
                Confirmar Entrega
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCancel}
            >
              <Text style={styles.btnText}>
                Cancelar Entrega
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.finalText}>
            Entrega já processada
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFF",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.colorAlivio,
    marginBottom: 16,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: colors.colorAlivio,
  },

  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    borderRadius: 12,
  },

  itemCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },

  label: {
    fontWeight: "700",
    marginTop: 10,
    color: colors.colorAlivio,
  },

  text: {
    color: colors.color8,
  },

  status: {
    marginTop: 12,
    fontWeight: "700",
  },

  actions: {
    marginTop: 20,
    gap: 10,
  },

  confirmBtn: {
    backgroundColor: colors.color1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  cancelBtn: {
    backgroundColor: colors.colorAle,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: {
    color: "#FFF",
    fontWeight: "bold",
  },

  errorText: {
    color: colors.colorAle,
    fontWeight: "600",
  },

  finalText: {
    fontWeight: "600",
    color: colors.color8,
  },
});