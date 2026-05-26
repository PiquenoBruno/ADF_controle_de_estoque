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
  unidade: string;
};

type BasketItem = {
  product_id: string;
  product_nome: string;
  unidade: string;
  quantidade: number;
};

type Basket = {
  id: string;
  nome: string;
  descricao?: string;
};

export default function BasketsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [baskets, setBaskets] = useState<Basket[]>([]);

  const [basketName, setBasketName] = useState("");
  const [descricao, setDescricao] = useState("");

  const [selectedProduct, setSelectedProduct] = useState("");
  const [itemQuantidade, setItemQuantidade] = useState("");

  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("nome");

    if (error) {
      console.log(error);
      Alert.alert("Erro ao buscar produtos");
      return;
    }

    setProducts(data || []);

    if (data && data.length > 0) {
      setSelectedProduct(data[0].id);
    }
  }

  async function fetchBaskets() {
    const { data, error } = await supabase
      .from("baskets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setBaskets(data || []);
  }

  function handleAddItem() {
    if (!selectedProduct || !itemQuantidade) {
      Alert.alert("Selecione produto e quantidade");
      return;
    }

    const product = products.find((item) => item.id === selectedProduct);
    if (!product) return;

    setBasketItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product_id === product.id
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantidade += Number(itemQuantidade);
        return updated;
      }
      return [
        ...prev,
        {
          product_id: product.id,
          product_nome: product.nome,
          unidade: product.unidade,
          quantidade: Number(itemQuantidade),
        },
      ];
    });

    setItemQuantidade("");
  }

  async function handleCreateBasket() {
    if (!basketName) {
      Alert.alert("Digite o nome da cesta");
      return;
    }

    if (basketItems.length === 0 && !editingId) {
      Alert.alert("Adicione itens na cesta");
      return;
    }

    // EDITAR
    if (editingId) {
      const { error } = await supabase
        .from("baskets")
        .update({
          nome: basketName,
          descricao,
        })
        .eq("id", editingId);

      if (error) {
        console.log(error);
        Alert.alert("Erro ao editar cesta");
        return;
      }

      Alert.alert("Cesta editada com sucesso");

      clearFields();
      fetchBaskets();

      return;
    }

    // CRIAR
    const { data: basketData, error: basketError } = await supabase
      .from("baskets")
      .insert({
        nome: basketName,
        descricao,
      })
      .select()
      .single();

    if (basketError) {
      console.log(basketError);
      Alert.alert("Erro ao criar cesta");
      return;
    }

    const itemsToInsert = basketItems.map((item) => ({
      basket_id: basketData.id,
      product_id: item.product_id,
      quantidade: item.quantidade,
    }));

    const { error: itemsError } = await supabase
      .from("basket_items")
      .insert(itemsToInsert);

    if (itemsError) {
      console.log(itemsError);
      Alert.alert("Erro ao salvar itens");
      return;
    }

    Alert.alert("Cesta criada com sucesso");

    clearFields();
    fetchBaskets();
  }

  async function handleDeleteBasket(id: string) {
    const { error } = await supabase.from("baskets").delete().eq("id", id);

    if (error) {
      console.log(error);
      Alert.alert("Erro ao excluir cesta");
      return;
    }

    fetchBaskets();
  }

  function handleEditBasket(basket: Basket) {
    setEditingId(basket.id);
    setBasketName(basket.nome);
    setDescricao(basket.descricao || "");
  }

  function handleRemoveItem(index: number) {
    const updatedItems = basketItems.filter((_, i) => i !== index);
    setBasketItems(updatedItems);
  }

  function clearFields() {
    setEditingId(null);
    setBasketName("");
    setDescricao("");
    setBasketItems([]);
    setItemQuantidade("");
  }

  useEffect(() => {
    fetchProducts();
    fetchBaskets();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editingId ? "Editar Cesta" : "Montagem de Cestas"}
      </Text>

      <TextInput
        placeholder="Nome da cesta"
        style={styles.input}
        value={basketName}
        onChangeText={setBasketName}
      />

      <TextInput
        placeholder="Descrição da cesta"
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedProduct}
          onValueChange={(itemValue) => setSelectedProduct(itemValue)}
        >
          {products.map((product) => (
            <Picker.Item
              key={product.id}
              label={product.nome}
              value={product.id}
            />
          ))}
        </Picker>
      </View>

      <TextInput
        placeholder="Quantidade"
        style={styles.input}
        keyboardType="numeric"
        value={itemQuantidade}
        onChangeText={setItemQuantidade}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
        <Text style={styles.buttonText}>Adicionar Item</Text>
      </TouchableOpacity>

      <FlatList
        data={basketItems}
        keyExtractor={(_, index) => index.toString()}
        style={{ maxHeight: 250 }}
        renderItem={({ item, index }) => (
          <View style={styles.itemCard}>
            <View>
              <Text style={styles.itemTitle}>{item.product_nome}</Text>
              <Text>
                {item.quantidade} {item.unidade}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveItem(index)}
            >
              <Text style={styles.removeText}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.createButton} onPress={handleCreateBasket}>
        <Text style={styles.buttonText}>
          {editingId ? "Salvar Alterações" : "Criar Cesta"}
        </Text>
      </TouchableOpacity>

      {editingId && (
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: "#6b7280" }]}
          onPress={clearFields}
        >
          <Text style={styles.buttonText}>Cancelar Edição</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.subtitle}>Cestas Criadas</Text>

      <FlatList
        data={baskets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.basketCard}>
            <Text style={styles.basketTitle}>{item.nome}</Text>
            {item.descricao ? <Text>{item.descricao}</Text> : null}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => handleEditBasket(item)}
              >
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeleteBasket(item.id)}
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
    backgroundColor: "#fff" 
  },

  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20 
  },

  subtitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginTop: 30, 
    marginBottom: 10 
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

  addButton: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },

  createButton: {
    backgroundColor: "#16a34a",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },

  cancelButton: {
    backgroundColor: "#6b7280", // cinza para diferenciar
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  itemCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  itemTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },

  removeButton: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },

  removeText: {
    color: "#fff",
    fontWeight: "bold",
  },

  basketCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },

  basketTitle: {
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
