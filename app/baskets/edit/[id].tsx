import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  ScrollView,
  TextInput,
} from "react-native";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  useBasket,
  useUpdateBasket,
} from "../../../src/hooks/useBaskets";

export default function EditBasket() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: basket } = useBasket(id);

  const updateBasket = useUpdateBasket();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (!basket) return;

    setNome(basket.nome);
    setDescricao(basket.descricao ?? "");
  }, [basket]);

  async function handleSave() {
    try {
      await updateBasket.mutateAsync({
        id,
        basket: {
          nome,
          descricao,
        },
      });

      Alert.alert("Sucesso", "Cesta atualizada!");
      router.back();
    } catch {
      Alert.alert("Erro", "Falha ao atualizar cesta");
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={{ borderWidth: 1, padding: 10 }}
      />

      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        style={{ borderWidth: 1, padding: 10 }}
      />

      <Button title="Salvar Alterações" onPress={handleSave} />
    </ScrollView>
  );
}