import { router } from "expo-router";
import { useState } from "react";
import { useDeleteUser, useUsers } from "../../../src/hooks/useUsers";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "../../../src/style/style";

export default function UsersList() {
  const { data, isLoading } = useUsers();
  const { mutate: deleteUser, isPending } = useDeleteUser();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [search, setSearch] = useState("");

  function handleDelete(id: string, nome: string) {
    Alert.alert(
      "Excluir usuário",
      `Tem certeza que deseja excluir ${nome}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Continuar",
          style: "destructive",
          onPress: () => {
            setSelectedUser(id);
            setModalVisible(true);
          },
        },
      ]
    );
  }

  function confirmDelete() {
    if (confirmText === "EXCLUIR" && selectedUser) {
      deleteUser(selectedUser);

      setModalVisible(false);
      setSelectedUser(null);
      setConfirmText("");
    } else {
      Alert.alert(
        "Erro",
        "Digite EXCLUIR corretamente."
      );
    }
  }

  const filteredUsers =
    data?.filter(
      (user) =>
        user.nome
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        user.email
          .toLowerCase()
          .includes(search.toLowerCase())
    ) ?? [];

  if (isLoading) {
    return (
      <ActivityIndicator
        style={{ flex: 1 }}
        size="large"
        color={colors.color1}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* BUSCA */}

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar usuário..."
        value={search}
        onChangeText={setSearch}
      />

      {/* BOTÃO NOVO */}

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.push("/users/createUsers")
        }
      >
        <Text style={styles.buttonText}>
          + Novo Usuário
        </Text>
      </TouchableOpacity>

      {/* LISTA VAZIA */}

      {filteredUsers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhum usuário encontrado.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>
                {item.nome}
              </Text>

              <Text style={styles.email}>
                {item.email}
              </Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname:
                        "/users/editUsers",
                      params: {
                        id: item.id,
                      },
                    })
                  }
                >
                  <Text style={styles.editText}>
                    Editar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={isPending}
                  onPress={() =>
                    handleDelete(
                      item.id,
                      item.nome
                    )
                  }
                >
                  <Text
                    style={[
                      styles.deleteText,
                      {
                        opacity: isPending
                          ? 0.5
                          : 1,
                      },
                    ]}
                  >
                    {isPending
                      ? "Excluindo..."
                      : "Excluir"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* MODAL */}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              Digite EXCLUIR para confirmar
            </Text>

            <TextInput
              value={confirmText}
              onChangeText={setConfirmText}
              placeholder="EXCLUIR"
              autoCapitalize="characters"
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSelectedUser(null);
                  setConfirmText("");
                }}
              >
                <Text style={styles.cancelText}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmDelete}
              >
                <Text style={styles.deleteText}>
                  Excluir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },

  searchInput: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: colors.color8,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },

  button: {
    backgroundColor: colors.color1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
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

  email: {
    color: colors.color8,
    marginTop: 4,
  },

  actions: {
    flexDirection: "row",
    gap: 20,
    marginTop: 12,
  },

  editText: {
    color: colors.color1,
    fontWeight: "600",
  },

  deleteText: {
    color: colors.colorAle,
    fontWeight: "600",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    color: colors.color8,
    fontSize: 16,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },

  modal: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.colorAlivio,
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.color8,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cancelText: {
    color: colors.color8,
    fontWeight: "600",
  },
});