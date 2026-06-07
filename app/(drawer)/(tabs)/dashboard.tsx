import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useDashboard } from "../../../src/hooks/useDashboard";
import { colors } from "../../../src/style/style";

export default function Dashboard() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.color1} />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Erro ao carregar dashboard
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* RESUMO */}
      <Text style={styles.sectionTitle}>
        Resumo Geral
      </Text>

      <View style={styles.grid}>
        <Card title="Produtos" value={data.totalProducts} />
        <Card title="Famílias" value={data.totalFamilies} />
        <Card title="Cestas" value={data.totalBaskets} />
        <Card title="Entregas" value={data.totalDeliveries} />
        <Card title="Entregues" value={data.deliveredCount} />
        <Card title="Pendentes" value={data.pendingDeliveries} />
      </View>

      {/* ESTOQUE BAIXO */}
      <Text style={styles.sectionTitle}>
        Estoque Baixo
      </Text>

      {data.lowStock?.length > 0 ? (
        data.lowStock.map((product: any) => (
          <View key={product.id} style={styles.alertCard}>
            <Text style={styles.cardTitle}>
              {product.nome}
            </Text>

            <Text style={styles.text}>
              Atual: {product.quantidade}
            </Text>

            <Text style={styles.text}>
              Mínimo: {product.minimo}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.empty}>
          Nenhum produto com estoque baixo
        </Text>
      )}

      {/* ENTREGAS PENDENTES */}
      <Text style={styles.sectionTitle}>
        Entregas Pendentes ({data.pendingDeliveries})
      </Text>

      {data.pendingList?.length > 0 ? (
        data.pendingList.slice(0, 5).map((delivery: any) => (
          <View key={delivery.id} style={styles.pendingCard}>
            <Text style={styles.cardTitle}>
              {delivery.basket_name}
            </Text>

            <Text style={styles.text}>
              Família: {delivery.family_name}
            </Text>

            <Text style={styles.text}>
              Status: {delivery.status}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.empty}>
          Nenhuma entrega pendente
        </Text>
      )}

      {/* ÚLTIMAS ENTREGAS */}
      <Text style={styles.sectionTitle}>
        Últimas Entregas
      </Text>

      {data.recentDeliveries?.length > 0 ? (
        data.recentDeliveries.slice(0, 5).map((delivery: any) => (
          <View key={delivery.id} style={styles.card}>
            <Text style={styles.cardTitle}>
              {delivery.basket_name}
            </Text>

            <Text style={styles.text}>
              Status: {delivery.status}
            </Text>

            <Text style={styles.text}>
              {delivery.delivered_at
                ? new Date(delivery.delivered_at).toLocaleDateString()
                : "Sem data"}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.empty}>
          Nenhuma entrega encontrada
        </Text>
      )}

    </ScrollView>
  );
}

/* CARD KPI */
function Card({ title, value }: { title: string; value: number }) {
  return (
    <View style={styles.kpiCard}>
      <Text style={styles.kpiTitle}>{title}</Text>
      <Text style={styles.kpiValue}>{value}</Text>
    </View>
  );
}
/* STYLES */
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
    fontSize: 26,
    fontWeight: "bold",
    color: colors.colorAlivio,
    marginBottom: 16,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  kpiCard: {
    width: "48%",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },

  kpiTitle: {
    color: colors.color8,
    fontSize: 13,
  },

  kpiValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.color1,
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: colors.colorAlivio,
  },

  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },

  cardTitle: {
    fontWeight: "bold",
    color: colors.colorAlivio,
  },

  text: {
    color: colors.color8,
  },

  alertCard: {
    borderWidth: 1,
    borderColor: colors.colorAle,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#FFF5F5",
  },

  productName: {
    fontWeight: "bold",
    color: colors.colorAlivio,
  },

  empty: {
    color: colors.color8,
    marginBottom: 10,
  },

  errorText: {
    color: colors.colorAle,
    fontWeight: "600",
  },

  pendingCard: {
    borderWidth: 1,
    borderColor: "#F59E0B",
    backgroundColor: "#FFFBEB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
});