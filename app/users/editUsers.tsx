import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useUpdateUser,
  useUser,
} from "../../src/hooks/useUsers";

import { colors } from "../../src/style/style";

export default function EditUser() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data } = useUser(id);
  const { mutateAsync, isPending } = useUpdateUser();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!data) return;

    setNome(data.nome);
    setEmail(data.email);
  }, [data]);

  async function handleSave() {
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();

    if (!nomeLimpo || !emailLimpo) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (nomeLimpo.length < 3) {
      Alert.alert("Erro", "Nome muito curto.");
      return;
    }

    if (!emailLimpo.includes("@")) {
      Alert.alert("Erro", "Email inválido.");
      return;
    }

    try {
      await mutateAsync({
        id,
        data: {
          nome: nomeLimpo,
          email: emailLimpo,
        },
      });

      Alert.alert("Sucesso", "Usuário atualizado!");
      router.back();
    } catch (err: any) {
      Alert.alert("Erro", err?.message || "Falha ao atualizar usuário");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Editar Usuário</Text>

        <View style={styles.card}>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Nome"
          />

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          disabled={isPending}
        >
          <Text style={styles.buttonText}>
            {isPending ? "Atualizando..." : "Salvar Alterações"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.colorAlivio,
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.color8,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  button: {
    backgroundColor: colors.color1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});