import { supabase } from "@/src/services/supabase";
import { Picker } from "@react-native-picker/picker";
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

type Product = {
  id: string;
  nome: string;
  quantidade: number;
  unidade: string;
  minimo: number;
};

// DADOS TEMPORÁRIOS (MOCK)
const mockProducts: Product[] = [
  {
    id: "1",
    nome: "Arroz",
    quantidade: 20,
    unidade: "kg",
    minimo: 5,
  },
  {
    id: "2",
    nome: "Feijão",
    quantidade: 10,
    unidade: "kg",
    minimo: 3,
  },
  {
    id: "3",
    nome: "Óleo",
    quantidade: 15,
    unidade: "un",
    minimo: 5,
  },
  {
    id: "4",
    nome: "Macarrão",
    quantidade: 8,
    unidade: "pacote",
    minimo: 10,
  },
];

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidade, setUnidade] = useState("kg");
  const [minimo, setMinimo] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Supabase error:", error);
      return;
    }

    // se tiver dados reais, usa eles
    if (data && data.length > 0) {
      setProducts(data);
    }
  }

  async function handleSave() {
    if (!nome || !quantidade || !minimo) {
      Alert.alert("Preencha todos os campos");
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from("products")
        .update({
          nome,
          quantidade: Number(quantidade),
          unidade,
          minimo: Number(minimo),
        })
        .eq("id", editingId);

      if (error) {
        console.log(error);
        Alert.alert("Erro ao editar");
        return;
      }

      Alert.alert("Produto editado");
    } else {
      const { error } = await supabase.from("products").insert({
        nome,
        quantidade: Number(quantidade),
        unidade,
        minimo: Number(minimo),
      });

      if (error) {
        console.log(error);
        Alert.alert("Erro ao cadastrar");
        return;
      }

      Alert.alert("Produto cadastrado");
    }

    clearFields();
    fetchProducts();
  }

  async function handleDelete(id: string) {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
      Alert.alert("Erro ao excluir");
      return;
    }

    fetchProducts();
  }

  function handleEdit(product: Product) {
    setEditingId(product.id);

    setNome(product.nome);
    setQuantidade(String(product.quantidade));
    setUnidade(product.unidade);
    setMinimo(String(product.minimo));
  }

  function clearFields() {
    setEditingId(null);

    setNome("");
    setQuantidade("");
    setUnidade("kg");
    setMinimo("");
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle de Estoque</Text>

      <TextInput
        placeholder="Nome"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        placeholder="Quantidade"
        style={styles.input}
        keyboardType="numeric"
        value={quantidade}
        onChangeText={setQuantidade}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={unidade}
          onValueChange={(itemValue) => setUnidade(itemValue)}
        >
          <Picker.Item label="Quilograma (kg)" value="kg" />
          <Picker.Item label="Litro (L)" value="L" />
          <Picker.Item label="Unidade (un)" value="un" />
          <Picker.Item label="Pacote" value="pacote" />
          <Picker.Item label="Caixa" value="caixa" />
          <Picker.Item label="Fardo" value="fardo" />
        </Picker>
      </View>

      <TextInput
        placeholder="Estoque mínimo"
        style={styles.input}
        keyboardType="numeric"
        value={minimo}
        onChangeText={setMinimo}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {editingId ? "Editar Produto" : "Cadastrar Produto"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              item.quantidade <= item.minimo && styles.lowStock,
            ]}
          >
            <Text style={styles.productName}>{item.nome}</Text>

            <Text>
              Estoque: {item.quantidade} {item.unidade}
            </Text>

            <Text>Mínimo: {item.minimo}</Text>

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

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
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

  lowStock: {
    borderColor: "red",
  },

  productName: {
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