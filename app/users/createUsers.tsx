import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCreateUser } from "../../src/hooks/useUsers";
import { colors } from "../../src/style/style";

export default function CreateUser() {
  const { mutateAsync, isPending } = useCreateUser();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSave() {
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();

    if (!nomeLimpo || !emailLimpo || !password) {
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

    if (password.length < 6) {
      Alert.alert("Erro", "Senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      await mutateAsync({
        nome: nomeLimpo,
        email: emailLimpo,
        password,
      });

      Alert.alert("Sucesso", "Usuário criado!");
      router.back();
    } catch (err: any) {
      Alert.alert("Erro", err?.message || "Falha ao criar usuário");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Novo Usuário</Text>

        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          disabled={isPending}
        >
          <Text style={styles.buttonText}>
            {isPending ? "Criando..." : "Criar Usuário"}
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