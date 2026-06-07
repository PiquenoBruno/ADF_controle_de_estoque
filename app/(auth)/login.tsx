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
import { supabase } from "../../src/services/supabase";
import { colors } from "../../src/style/style";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!email.trim()) {
      Alert.alert("Atenção", "Digite seu email");
      return false;
    }

    if (!email.includes("@")) {
      Alert.alert("Atenção", "Digite um email válido");
      return false;
    }

    if (!password.trim()) {
      Alert.alert("Atenção", "Digite sua senha");
      return false;
    }

    if (password.length < 6) {
      Alert.alert(
        "Atenção",
        "A senha deve ter pelo menos 6 caracteres"
      );
      return false;
    }

    return true;
  }

  async function handleLogin() {
    if (!validate()) return;

    try {
      setLoading(true);

      const { error } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

      if (error) {
        Alert.alert("Erro", "Email ou senha inválidos");
        return;
      }

      Alert.alert("Sucesso", "Login realizado!");
      router.replace("/");
    } catch (err) {
      Alert.alert("Erro", "Falha ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            loading && styles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Entrando..." : "Entrar"}
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
    justifyContent: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.colorAlivio,
    marginBottom: 16,
    textAlign: "center",
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
    fontSize: 16,
  },

  button: {
    backgroundColor: colors.color1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});