import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";
import { useCreateProduct } from "../../src/hooks/useProducts";
import { colors } from "../../src/style/style";

export default function CreateProduct() {
  const createProduct = useCreateProduct();

  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [minimo, setMinimo] = useState("");
  const [unidade, setUnidade] = useState("");

  const unidades = ["kg", "unidade", "pacote", "litro", "g"];

  async function handleSave() {
    const nomeLimpo = nome.trim();
    const qtd = Number(quantidade);
    const min = Number(minimo);

    if (!nomeLimpo || !quantidade || !minimo || !unidade) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (nomeLimpo.length < 3) {
      Alert.alert("Erro", "Nome muito curto.");
      return;
    }

    if (isNaN(qtd) || isNaN(min)) {
      Alert.alert("Erro", "Valores inválidos.");
      return;
    }

    if (qtd < 0 || min < 0) {
      Alert.alert("Erro", "Valores não podem ser negativos.");
      return;
    }

    if (min > qtd) {
      Alert.alert("Erro", "Mínimo não pode ser maior que estoque.");
      return;
    }

    try {
      await createProduct.mutateAsync({
        nome: nomeLimpo,
        quantidade: qtd,
        unidade,
        minimo: min,
      });

      Alert.alert("Sucesso", "Produto criado!");
      router.back();
    } catch (err: any) {
      Alert.alert("Erro", err?.message || "Falha ao criar produto");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Produto</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Nome do produto"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="Quantidade"
          keyboardType="numeric"
          value={quantidade}
          onChangeText={setQuantidade}
        />

        <TextInput
          style={styles.input}
          placeholder="Quantidade mínima"
          keyboardType="numeric"
          value={minimo}
          onChangeText={setMinimo}
        />

        <Text style={styles.label}>
          Unidade de medida
        </Text>

        <View style={styles.unitContainer}>
          {unidades.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setUnidade(item)}
              style={[
                styles.unitButton,
                unidade === item && styles.unitButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.unitText,
                  unidade === item && styles.unitTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
        disabled={createProduct.isPending}
      >
        <Text style={styles.buttonText}>
          {createProduct.isPending ? "Salvando..." : "Salvar Produto"}
        </Text>
      </TouchableOpacity>
    </View>
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

  label: {
    marginBottom: 8,
    color: colors.colorAlivio,
    fontWeight: "600",
  },

  unitContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },

  unitButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
  },

  unitButtonActive: {
    backgroundColor: colors.color1,
    borderColor: colors.color1,
  },

  unitText: {
    color: colors.colorAlivio,
    fontWeight: "500",
  },

  unitTextActive: {
    color: "#FFF",
    fontWeight: "bold",
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