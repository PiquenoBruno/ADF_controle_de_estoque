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
    useDeleteFamily,
    useFamilies,
} from "../../../src/hooks/useFamilies";

export default function Familias() {
  const {
    data: families,
    isLoading,
    error,
  } = useFamilies();

  const deleteFamily =
    useDeleteFamily();

  function handleDelete(
    id: string
  ) {
    Alert.alert(
      "Excluir Família",
      "Deseja realmente excluir esta família?",
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
              await deleteFamily.mutateAsync(
                id
              );

              Alert.alert(
                "Sucesso",
                "Família excluída!"
              );
            } catch {
              Alert.alert(
                "Erro",
                "Falha ao excluir família"
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
          Erro ao carregar famílias
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
        title="Nova Família"
        onPress={() =>
          router.push(
            "../families/create"
          )
        }
      />

      <FlatList
        data={families}
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
              {item.responsavel}
            </Text>

            <Text>
              Telefone:{" "}
              {item.telefone}
            </Text>

            <Text>
              Pessoas:{" "}
              {item.quantidade_pessoas}
            </Text>

            <Text>
              Endereço:{" "}
              {item.endereco}
            </Text>

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
                      "/families/edit/[id]",
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
              Nenhuma família cadastrada
            </Text>
          </View>
        }
      />
    </View>
  );
}