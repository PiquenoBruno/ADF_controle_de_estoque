import { useState } from "react";

import {
    Alert,
    Button,
    TextInput,
    View,
} from "react-native";

import { supabase } from "../../src/services/supabase";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  async function handleRegister() {
  console.log("🚀 Tentando cadastrar...");

  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome,
        },
      },
    });

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    Alert.alert(
      "Erro",
      error.message
    );
    return;
  }

  Alert.alert(
    "Sucesso",
    "Usuário cadastrado!"
  );
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
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title="Cadastrar"
        onPress={handleRegister}
      />
    </View>
  );
}