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

import {
  useProduct,
  useUpdateProduct,
} from "../../../src/hooks/useProducts";

import { colors } from "../../../src/style/style";

export default function EditProduct() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data } = useProduct(id);
  const updateProduct = useUpdateProduct();

  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [minimo, setMinimo] = useState("");
  const [unidade, setUnidade] = useState("");

  const unidades = ["kg", "unidade", "pacote", "litro", "g"];

  useEffect(() => {
    if (!data) return;

    setNome(data.nome);
    setQuantidade(String(data.quantidade));
    setMinimo(String(data.minimo));
    setUnidade(data.unidade);
  }, [data]);

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
      await updateProduct.mutateAsync({
        id,
        product: {
          nome: nomeLimpo,
          quantidade: qtd,
          unidade,
          minimo: min,
        },
      });

      Alert.alert("Sucesso", "Produto atualizado!");
      router.back();
    } catch (err: any) {
      Alert.alert("Erro", err?.message || "Falha ao atualizar produto");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Produto</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Nome do produto"
        />

        <TextInput
          style={styles.input}
          value={quantidade}
          onChangeText={setQuantidade}
          placeholder="Quantidade"
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          value={minimo}
          onChangeText={setMinimo}
          placeholder="Quantidade mínima"
          keyboardType="numeric"
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
        disabled={updateProduct.isPending}
      >
        <Text style={styles.buttonText}>
          {updateProduct.isPending ? "Atualizando..." : "Salvar Alterações"}
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