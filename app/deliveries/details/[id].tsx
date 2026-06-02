import {
    ActivityIndicator,
    ScrollView,
    Text,
    View,
} from "react-native";

import {
    useLocalSearchParams,
} from "expo-router";

import {
    useDelivery,
} from "../../../src/hooks/useDeliveries";

export default function DeliveryDetails() {
  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();

  const {
    data: delivery,
    isLoading,
    error,
  } = useDelivery(id);

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

  if (error || !delivery) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>
          Entrega não encontrada
        </Text>
      </View>
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
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Detalhes da Entrega
      </Text>

      <Text>
        Cesta:
      </Text>

      <Text
        style={{
          marginBottom: 15,
        }}
      >
        {delivery.basket_name}
      </Text>

      <Text>
        Família:
      </Text>

      <Text
        style={{
          marginBottom: 15,
        }}
      >
        {delivery.family_id}
      </Text>

      <Text>
        Observação:
      </Text>

      <Text
        style={{
          marginBottom: 15,
        }}
      >
        {delivery.observacao ||
          "Nenhuma"}
      </Text>

      <Text>
        Data:
      </Text>

      <Text
        style={{
          marginBottom: 20,
        }}
      >
        {new Date(
          delivery.delivered_at
        ).toLocaleString()}
      </Text>

      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Itens Entregues
      </Text>

      {Array.isArray(
        delivery.items
      ) &&
      delivery.items.length >
        0 ? (
        delivery.items.map(
          (
            item: any,
            index: number
          ) => (
            <View
              key={index}
              style={{
                borderWidth: 1,
                padding: 10,
                marginBottom: 8,
                borderRadius: 8,
              }}
            >
              <Text>
                Produto:
                {" "}
                {item.produto}
              </Text>

              <Text>
                Quantidade:
                {" "}
                {
                  item.quantidade
                }
              </Text>
            </View>
          )
        )
      ) : (
        <Text>
          Nenhum item
          registrado
        </Text>
      )}
    </ScrollView>
  );
}
