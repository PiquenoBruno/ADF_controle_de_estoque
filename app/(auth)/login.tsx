import { useState } from "react";
import {
  Alert,
  Button,
  TextInput,
  View,
} from "react-native";

import { router } from "expo-router";
import { supabase } from "../../src/services/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      Alert.alert("Erro", error.message);
      return;
    }

    console.log(
      "✅ Login realizado:",
      data.user?.email
    );

    Alert.alert(
      "Sucesso",
      "Login realizado!"
    );

    // 🔥 AQUI É A CORREÇÃO IMPORTANTE
    router.replace("/(tabs)/dashboard");
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
      }}
    >
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title="Entrar"
        onPress={handleLogin}
      />

      <Button
        title="Criar Conta"
        onPress={() =>
          router.push("/(auth)/register")
        }
      />
    </View>
  );
}