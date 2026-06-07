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
import { SafeAreaView } from "react-native-safe-area-context";
import { useCreateFamily } from "../../src/hooks/useFamilies";
import { colors } from "../../src/style/style";

export default function CreateFamily() {
  const createFamily = useCreateFamily();

  const [responsavel, setResponsavel] = useState("");
  const [telefone, setTelefone] = useState(""); // 👈 cru (só números)
  const [telefoneFormatado, setTelefoneFormatado] = useState(""); // 👈 visual
  const [endereco, setEndereco] = useState("");
  const [quantidadePessoas, setQuantidadePessoas] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // 📱 FORMATAÇÃO VISUAL
  function formatPhone(value: string) {
    const cleaned = value.replace(/\D/g, "");

    if (cleaned.length <= 2) return cleaned;

    if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    }

    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(
      2,
      7
    )}-${cleaned.slice(7, 11)}`;
  }

  async function handleSave() {
    const resp = responsavel.trim();
    const tel = telefone; // 👈 cru, já limitado
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
        telefone: tel, // 👈 cru, correto
        endereco: end,
        quantidade_pessoas: qtd,
        observacoes,
      });

      Alert.alert("Sucesso", "Família cadastrada!");
      router.back();
    } catch (error: any) {
      Alert.alert("Erro", error?.message || "Falha ao cadastrar família");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Nova Família</Text>

        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Responsável"
            value={responsavel}
            onChangeText={setResponsavel}
          />

          {/* 📱 TELEFONE CORRIGIDO */}
          <TextInput
            style={styles.input}
            placeholder="Telefone"
            keyboardType="phone-pad"
            value={telefoneFormatado || telefone}
            onChangeText={(text) => {
              const onlyNumbers = text.replace(/\D/g, "");
              const limited = onlyNumbers.slice(0, 11); // 👈 limita a 11 dígitos
              setTelefone(limited);
              setTelefoneFormatado(text);
            }}
            onBlur={() => {
              setTelefoneFormatado(formatPhone(telefone)); // aplica máscara só ao sair
            }}
            maxLength={15} // limite visual
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
    </SafeAreaView>
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
