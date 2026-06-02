import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";

import {
  useBaskets,
  useDeleteBasket,
} from "../../src/hooks/useBaskets";

export default function Cestas() {
  const {
    data: baskets,
    isLoading,
    error,
  } = useBaskets();

  const deleteBasket = useDeleteBasket();

  function handleDelete(id: string) {
    Alert.alert(
      "Excluir Cesta",
      "Deseja realmente excluir esta cesta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
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

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Erro ao carregar cestas</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button
        title="Nova Cesta"
        onPress={() => router.push("/baskets/create")}
      />

      <FlatList
        data={baskets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              padding: 12,
              marginTop: 10,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {item.nome}
            </Text>

            <Text>{item.descricao}</Text>

            {/* ❌ REMOVIDO STATUS E ENTREGUE */}

            <View style={{ marginTop: 10, gap: 8 }}>
              <Button
                title="Ver Itens"
                onPress={() =>
                  router.push({
                    pathname: "/baskets/details/[id]",
                    params: { id: item.id },
                  })
                }
              />

              <Button
                title="Editar"
                onPress={() =>
                  router.push({
                    pathname: "/baskets/edit/[id]",
                    params: { id: item.id },
                  })
                }
              />

              <Button
                title="Excluir"
                onPress={() => handleDelete(item.id)}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ marginTop: 30, alignItems: "center" }}>
            <Text>Nenhuma cesta cadastrada</Text>
          </View>
        }
      />
    </View>
  );
}