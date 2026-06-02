import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  Text,
  View,
} from "react-native";

import { supabase } from "../../../src/services/supabase";

import { useLocalSearchParams } from "expo-router";
import {
  useDelivery,
  useUpdateDelivery,
} from "../../../src/hooks/useDeliveries";

import {
  decreaseStock,
  increaseStock,
} from "../../../src/services/stock.service";

export default function DeliveryDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: delivery,
    isLoading,
    error,
  } = useDelivery(id);

  const updateDelivery = useUpdateDelivery();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !delivery) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Entrega não encontrada</Text>
      </View>
    );
  }

  const d = delivery;

  async function handleConfirm() {
    try {
      if (d.status !== "Pendente") return;

      if (!d.items || d.items.length === 0) {
        throw new Error("Entrega sem itens");
      }

      // 1. baixa estoque
      for (const item of d.items) {
        await decreaseStock(item.product_id, item.quantidade);
      }

      // 2. atualiza delivery
      await updateDelivery.mutateAsync({
        id: d.id,
        delivery: {
          status: "Entregue",
        },
      });

      // 3. atualiza cesta (ESSENCIAL)
      await supabase
        .from("baskets")
        .update({
          entregue: true,
          status: "Entregue",
        })
        .eq("id", d.basket_id);

      Alert.alert("Sucesso", "Entrega confirmada!");
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  }

  async function handleCancel() {
    try {
      if (d.status !== "Pendente") return;

      if (!d.items || d.items.length === 0) {
        throw new Error("Entrega sem itens");
      }

      // devolve estoque
      for (const item of d.items) {
        await increaseStock(item.product_id, item.quantidade);
      }

      // atualiza delivery
      await updateDelivery.mutateAsync({
        id: d.id,
        delivery: {
          status: "Cancelada",
        },
      });

      Alert.alert("Sucesso", "Entrega cancelada!");
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Detalhes da Entrega
      </Text>

      <Text>Cesta:</Text>
      <Text style={{ marginBottom: 15 }}>{d.basket_name}</Text>

      <Text>Família:</Text>
      <Text style={{ marginBottom: 15 }}>{d.family_id}</Text>

      <Text>Observação:</Text>
      <Text style={{ marginBottom: 15 }}>
        {d.observacao || "Nenhuma"}
      </Text>

      <Text>Data:</Text>
      <Text style={{ marginBottom: 20 }}>
        {new Date(d.delivered_at).toLocaleString()}
      </Text>

      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Itens Entregues
      </Text>

      {d.items?.length > 0 ? (
        d.items.map((item: any, index: number) => (
          <View
            key={index}
            style={{
              borderWidth: 1,
              padding: 10,
              marginBottom: 8,
              borderRadius: 8,
            }}
          >
            <Text>Produto: {item.produto}</Text>
            <Text>Quantidade: {item.quantidade}</Text>
          </View>
        ))
      ) : (
        <Text>Nenhum item registrado</Text>
      )}

      <View style={{ marginTop: 30, gap: 10 }}>
        <Text>Status atual: {d.status}</Text>

        {d.status === "Pendente" && (
          <>
            <Button title="Confirmar Entrega" onPress={handleConfirm} />
            <Button title="Cancelar Entrega" onPress={handleCancel} color="red" />
          </>
        )}

        {d.status === "Entregue" && (
          <Text>Entrega finalizada</Text>
        )}

        {d.status === "Cancelada" && (
          <Text>Entrega cancelada</Text>
        )}
      </View>
    </ScrollView>
  );
}