import { supabase } from "@/src/services/supabase";
import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Family = {
  id: string;
  responsavel: string;
  telefone: string;
  endereco: string;
  quantidade_pessoas: number;
  observacoes: string;
};

export default function FamiliesScreen() {
  const [families, setFamilies] = useState<Family[]>([]);

  const [responsavel, setResponsavel] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [quantidadePessoas, setQuantidadePessoas] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  async function fetchFamilies() {
    const { data, error } = await supabase
      .from("families")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      Alert.alert("Erro ao buscar famílias");
      return;
    }

    setFamilies(data || []);
  }

  async function handleSave() {
    if (!responsavel) {
      Alert.alert("Digite o nome do responsável");
      return;
    }

    const payload = {
      responsavel,
      telefone,
      endereco,
      quantidade_pessoas: Number(quantidadePessoas) || 1,
      observacoes,
    };

    // EDITAR
    if (editingId) {
      const { error } = await supabase
        .from("families")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        console.log(error);
        Alert.alert("Erro ao editar");
        return;
      }

      Alert.alert("Família atualizada com sucesso");
      clearFields();
      fetchFamilies();
      return;
    }

    // CRIAR
    const { error } = await supabase
      .from("families")
      .insert(payload);

    if (error) {
      console.log(error);
      Alert.alert("Erro ao cadastrar");
      return;
    }

    Alert.alert("Família cadastrada com sucesso");

    clearFields();
    fetchFamilies();
  }

  async function handleDelete(id: string) {
    const { error } = await supabase
      .from("families")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
      Alert.alert("Erro ao excluir");
      return;
    }

    fetchFamilies();
  }

  function handleEdit(family: Family) {
    setEditingId(family.id);

    setResponsavel(family.responsavel);
    setTelefone(family.telefone || "");
    setEndereco(family.endereco || "");
    setQuantidadePessoas(String(family.quantidade_pessoas || 1));
    setObservacoes(family.observacoes || "");
  }

  function clearFields() {
    setEditingId(null);

    setResponsavel("");
    setTelefone("");
    setEndereco("");
    setQuantidadePessoas("");
    setObservacoes("");
  }

  useEffect(() => {
    fetchFamilies();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editingId ? "Editar Família" : "Famílias Atendidas"}
      </Text>

      <TextInput
        placeholder="Responsável"
        style={styles.input}
        value={responsavel}
        onChangeText={setResponsavel}
      />

      <TextInput
        placeholder="Telefone"
        style={styles.input}
        value={telefone}
        onChangeText={setTelefone}
      />

      <TextInput
        placeholder="Endereço"
        style={styles.input}
        value={endereco}
        onChangeText={setEndereco}
      />

      <TextInput
        placeholder="Quantidade de pessoas"
        style={styles.input}
        keyboardType="numeric"
        value={quantidadePessoas}
        onChangeText={setQuantidadePessoas}
      />

      <TextInput
        placeholder="Observações"
        style={styles.input}
        value={observacoes}
        onChangeText={setObservacoes}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {editingId ? "Salvar Alterações" : "Cadastrar Família"}
        </Text>
      </TouchableOpacity>

      {/* botão cancelar edição */}
      {editingId && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#6b7280" }]}
          onPress={clearFields}
        >
          <Text style={styles.buttonText}>Cancelar Edição</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={families}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.responsavel}</Text>

            {item.telefone ? <Text>📞 {item.telefone}</Text> : null}
            {item.endereco ? <Text>📍 {item.endereco}</Text> : null}

            <Text>👨‍👩‍👧 Pessoas: {item.quantidade_pessoas}</Text>

            {item.observacoes ? <Text>📝 {item.observacoes}</Text> : null}

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.actionText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },

  actions: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },

  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  editButton: {
    backgroundColor: "#f59e0b",
  },

  deleteButton: {
    backgroundColor: "#dc2626",
  },

  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
