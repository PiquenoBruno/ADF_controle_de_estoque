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

export default function UsersList() {
  const { data, isLoading } = useUsers();
  const { mutate: deleteUser, isPending } = useDeleteUser();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");

  function handleDelete(id: string, nome: string) {
    Alert.alert(
      "⚠️ Excluir usuário",
      `Tem certeza que deseja excluir ${nome}?`,
      [
        { text: "Cancelar", style: "cancel" },
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
      Alert.alert("Erro", "Digite EXCLUIR corretamente");
    }
  }

  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      {/* BOTÃO NOVO USUÁRIO */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/users/createUsers")}
      >
        <Text style={{ color: "#fff" }}>Novo usuário</Text>
      </TouchableOpacity>

      {/* LISTA */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nome}</Text>
            <Text>{item.email}</Text>

            <View style={styles.actions}>
              {/* EDITAR */}
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/users/editUsers",
                    params: { id: item.id },
                  })
                }
              >
                <Text>Editar</Text>
              </TouchableOpacity>

              {/* EXCLUIR */}
              <TouchableOpacity
                disabled={isPending}
                onPress={() => handleDelete(item.id, item.nome)}
              >
                <Text
                  style={{
                    color: "red",
                    opacity: isPending ? 0.5 : 1,
                  }}
                >
                  {isPending ? "Excluindo..." : "Excluir"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* MODAL DE CONFIRMAÇÃO */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>
              Digite EXCLUIR para confirmar
            </Text>

            <TextInput
              value={confirmText}
              onChangeText={setConfirmText}
              placeholder="EXCLUIR"
              style={styles.input}
              autoCapitalize="characters"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSelectedUser(null);
                  setConfirmText("");
                }}
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={confirmDelete}>
                <Text style={{ color: "red", fontWeight: "bold" }}>
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

/**
 * STYLES
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },

  name: {
    fontWeight: "bold",
    fontSize: 16,
  },

  actions: {
    flexDirection: "row",
    gap: 15,
    marginTop: 10,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },

  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },

  title: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});