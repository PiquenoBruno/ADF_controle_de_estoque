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
    useDeleteProduct,
    useProducts,
} from "../../src/hooks/useProducts";

export default function Produtos() {
  const {
    data: products,
    isLoading,
    error,
  } = useProducts();

  const deleteProduct =
    useDeleteProduct();

  function handleDelete(
    id: string
  ) {
    Alert.alert(
      "Excluir Produto",
      "Deseja realmente excluir este produto?",
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
              await deleteProduct.mutateAsync(
                id
              );

              Alert.alert(
                "Sucesso",
                "Produto excluído!"
              );
            } catch (error) {
              Alert.alert(
                "Erro",
                "Falha ao excluir produto"
              );
            }
          },
        },
      ]
    );
  }

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
          Erro ao carregar produtos
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
        title="Novo Produto"
        onPress={() =>
          router.push(
            "/products/create"
          )
        }
      />

      <FlatList
        data={products}
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
              {item.nome}
            </Text>

            <Text>
              Quantidade:{" "}
              {item.quantidade}
            </Text>

            <Text>
              Unidade:{" "}
              {item.unidade}
            </Text>

            <Text>
              Mínimo:{" "}
              {item.minimo}
            </Text>

            {item.quantidade <=
              item.minimo && (
              <Text
                style={{
                  marginTop: 5,
                }}
              >
                ⚠ Estoque Baixo
              </Text>
            )}

            <View
              style={{
                marginTop: 10,
                gap: 8,
              }}
            >
              <Button
                title="Editar"
                onPress={() =>
                  router.push({
                    pathname:
                      "/products/edit/[id]",
                    params: {
                      id: item.id,
                    },
                  })
                }
              />

              <Button
                title="Excluir"
                onPress={() =>
                  handleDelete(
                    item.id
                  )
                }
              />
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
              Nenhum produto cadastrado
            </Text>
          </View>
        }
      />
    </View>
  );
}