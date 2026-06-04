import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";

import { useCreateUser } from "../../src/hooks/useUsers";

export default function CreateUser() {
  const { mutateAsync, isPending } = useCreateUser();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSave() {
    if (!nome || !email || !password) {
      Alert.alert("Preencha todos os campos");
      return;
    }

    try {
      await mutateAsync({
        nome,
        email,
        password, // 👈 senha nasce aqui
      });

      Alert.alert("Sucesso", "Usuário criado com senha!");
      router.back();
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    }
  }

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title={isPending ? "Criando..." : "Criar usuário"}
        onPress={handleSave}
      />
    </View>
  );
}