import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";

import { useUpdateUser, useUser } from "../../src/hooks/useUsers";

export default function EditUser() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data } = useUser(id);
  const { mutateAsync } = useUpdateUser();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (data) {
      setNome(data.nome);
      setEmail(data.email);
    }
  }, [data]);

  async function handleUpdate() {
    try {
      await mutateAsync({
        id,
        data: { nome, email },
      });

      Alert.alert("Atualizado");
      router.back();
    } catch {
      Alert.alert("Erro ao atualizar");
    }
  }

  return (
    <View style={{ padding: 20, gap: 10 }}>
      <TextInput value={nome} onChangeText={setNome} />
      <TextInput value={email} onChangeText={setEmail} />

      <Button title="Atualizar" onPress={handleUpdate} />
    </View>
  );
}