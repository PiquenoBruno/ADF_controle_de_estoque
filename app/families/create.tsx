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
import { useCreateFamily } from "../../src/hooks/useFamilies";
import { colors } from "../../src/style/style";

export default function CreateFamily() {
  const createFamily = useCreateFamily();

  const [responsavel, setResponsavel] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [quantidadePessoas, setQuantidadePessoas] = useState("");
  const [observacoes, setObservacoes] = useState("");

  async function handleSave() {
    const resp = responsavel.trim();
    const tel = telefone.trim();
    const end = endereco.trim();
    const qtd = Number(quantidadePessoas);

    if (!resp || !tel || !end || !quantidadePessoas) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    if (resp.length < 3) {
      Alert.alert("Erro", "Nome do responsável muito curto.");
      return;
    }

    if (isNaN(qtd) || qtd <= 0) {
      Alert.alert("Erro", "Quantidade de pessoas inválida.");
      return;
    }

    if (qtd > 50) {
      Alert.alert("Erro", "Quantidade de pessoas muito alta.");
      return;
    }

    if (tel.length < 8) {
      Alert.alert("Erro", "Telefone inválido.");
      return;
    }

    try {
      await createFamily.mutateAsync({
        responsavel: resp,
        telefone: tel,
        endereco: end,
        quantidade_pessoas: qtd,
        observacoes,
      });

      Alert.alert("Sucesso", "Família cadastrada!");
      router.back();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.message || "Falha ao cadastrar família"
      );
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nova Família</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Responsável"
          value={responsavel}
          onChangeText={setResponsavel}
        />

        <TextInput
          style={styles.input}
          placeholder="Telefone"
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={setTelefone}
        />

        <TextInput
          style={styles.input}
          placeholder="Endereço"
          value={endereco}
          onChangeText={setEndereco}
        />

        <TextInput
          style={styles.input}
          placeholder="Quantidade de pessoas"
          keyboardType="numeric"
          value={quantidadePessoas}
          onChangeText={setQuantidadePessoas}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Observações (opcional)"
          multiline
          value={observacoes}
          onChangeText={setObservacoes}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
        disabled={createFamily.isPending}
      >
        <Text style={styles.buttonText}>
          {createFamily.isPending ? "Salvando..." : "Salvar Família"}
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
    height: 100,
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