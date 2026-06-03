import {
    ActivityIndicator,
    ScrollView,
    Text,
    View,
} from "react-native";

import { useDashboard } from "../../../src/hooks/useDashboard";

export default function Dashboard() {
  const {
    data,
    isLoading,
    error,
  } = useDashboard();

  if (isLoading) {
    return (
      <ActivityIndicator />
    );
  }

  if (error || !data) {
    return (
      <Text>
        Erro ao carregar dashboard
      </Text>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Dashboard
      </Text>

      <Card
        title="Produtos"
        value={data.totalProducts}
      />

      <Card
        title="Famílias"
        value={data.totalFamilies}
      />

      <Card
        title="Cestas"
        value={data.totalBaskets}
      />

      <Card
        title="Entregas"
        value={data.totalDeliveries}
      />

      <Card
        title="Entregues"
        value={data.deliveredCount}
      />

      <Card
        title="Pendentes"
        value={
          data.pendingDeliveries
        }
      />

      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 25,
          marginBottom: 10,
        }}
      >
        Estoque Baixo
      </Text>

      {data.lowStock.length >
      0 ? (
        data.lowStock.map(
          (product: any) => (
            <View
              key={product.id}
              style={{
                borderWidth: 1,
                padding: 10,
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <Text>
                {product.nome}
              </Text>

              <Text>
                Atual:{" "}
                {
                  product.quantidade
                }
              </Text>

              <Text>
                Mínimo:{" "}
                {product.minimo}
              </Text>
            </View>
          )
        )
      ) : (
        <Text>
          Nenhum produto com
          estoque baixo
        </Text>
      )}

      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 25,
          marginBottom: 10,
        }}
      >
        Últimas Entregas
      </Text>

      {data.recentDeliveries
        .length > 0 ? (
        data.recentDeliveries.map(
          (
            delivery: any
          ) => (
            <View
              key={
                delivery.id
              }
              style={{
                borderWidth: 1,
                padding: 10,
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <Text>
                {
                  delivery.basket_name
                }
              </Text>

              <Text>
                Status:{" "}
                {
                  delivery.status
                }
              </Text>

              <Text>
                {new Date(
                  delivery.delivered_at
                ).toLocaleDateString()}
              </Text>
            </View>
          )
        )
      ) : (
        <Text>
          Nenhuma entrega
        </Text>
      )}
    </ScrollView>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderRadius: 10,
        padding: 20,
        marginBottom: 12,
      }}
    >
      <Text>
        {title}
      </Text>

      <Text
        style={{
          fontSize: 26,
          fontWeight: "bold",
        }}
      >
        {value}
      </Text>
    </View>
  );
}