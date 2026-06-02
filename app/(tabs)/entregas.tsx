import {
    ActivityIndicator,
    Button,
    FlatList,
    Text,
    View,
} from "react-native";

import { router } from "expo-router";

import {
    useDeliveries,
} from "../../src/hooks/useDeliveries";

export default function Entregas() {
  const {
    data: deliveries,
    isLoading,
    error,
  } = useDeliveries();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>
          Erro ao carregar entregas
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      <Button
        title="Nova Entrega"
        onPress={() =>
          router.push(
            "/deliveries/create"
          )
        }
      />

      <FlatList
        data={deliveries}
        keyExtractor={(item) =>
          item.id
        }
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              padding: 12,
              marginTop: 10,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {item.basket_name}
            </Text>

            <Text>
              Família: {item.family_id}
            </Text>

            <Text>
              Data:{" "}
              {new Date(
                item.delivered_at
              ).toLocaleDateString()}
            </Text>

            <Text>
              Status: {item.status}
            </Text>

            <View
              style={{
                marginTop: 10,
                gap: 8,
              }}
            >
              <Button
                title="Detalhes"
                onPress={() =>
                  router.push({
                    pathname:
                      "/deliveries/details/[id]",
                    params: {
                      id: item.id,
                    },
                  })
                }
              />

              {item.status ===
                "Pendente" && (
                <Text>
                  ⏳ Aguardando
                  confirmação
                </Text>
              )}

              {item.status ===
                "Entregue" && (
                <Text>
                  ✅ Entrega
                  confirmada
                </Text>
              )}

              {item.status ===
                "Cancelada" && (
                <Text>
                  ❌ Entrega
                  cancelada
                </Text>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View
            style={{
              marginTop: 30,
              alignItems: "center",
            }}
          >
            <Text>
              Nenhuma entrega
              cadastrada
            </Text>
          </View>
        }
      />
    </View>
  );
}