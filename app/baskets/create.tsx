import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { useCreateBasket } from "../../src/hooks/useBaskets";
import { colors } from "../../src/style/style";

export default function CreateBasket() {
  const createBasket = useCreateBasket();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  async function handleSave() {
    const basketName = nome.trim();

    if (!basketName) {
      Alert.alert("Atenção", "Informe o nome da cesta.");
      return;
    }

    try {
      await createBasket.mutateAsync({
        nome: basketName,
        descricao,
      });

      Alert.alert("Sucesso", "Cesta cadastrada!");
      router.back();
    } catch (error: any) {
      Alert.alert("Erro", error?.message || "Falha ao cadastrar cesta");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nova Cesta</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Nome da cesta"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />

        <TextInput
          placeholder="Descrição (opcional)"
          value={descricao}
          onChangeText={setDescricao}
          multiline
          style={[styles.input, styles.textArea]}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
        disabled={createBasket.isPending}
      >
        <Text style={styles.buttonText}>
          {createBasket.isPending ? "Salvando..." : "Salvar Cesta"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
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

  textArea: {
    height: 90,
    textAlignVertical: "top",
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