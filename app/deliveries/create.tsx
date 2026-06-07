import { useMemo, useState } from "react";

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
import { useBaskets } from "../../src/hooks/useBaskets";
import { useCreateDelivery } from "../../src/hooks/useDeliveries";
import { useFamilies } from "../../src/hooks/useFamilies";

import { getBasketItems } from "../../src/services/basketItems.service";
import { colors } from "../../src/style/style";

export default function CreateDelivery() {
  const createDelivery = useCreateDelivery();

  const { data: families } = useFamilies();
  const { data: baskets } = useBaskets();

  const [familyId, setFamilyId] = useState("");
  const [basketId, setBasketId] = useState("");
  const [search, setSearch] = useState("");

  const filteredFamilies = useMemo(() => {
    if (!families) return [];

    return families.filter((f) =>
      f.responsavel.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, families]);

  async function handleSave() {
    const basket = baskets?.find((b) => b.id === basketId);

    if (!basket) {
      Alert.alert("Erro", "Selecione uma cesta");
      return;
    }

    if (!familyId) {
      Alert.alert("Erro", "Selecione uma família");
      return;
    }

    try {
      const basketItems = await getBasketItems(basket.id);

      const items = basketItems.map((item: any) => ({
        product_id: item.product_id,
        produto: item.products?.nome,
        quantidade: item.quantidade,
      }));

      await createDelivery.mutateAsync({
        family_id: familyId,
        basket_id: basket.id,
        basket_name: basket.nome,
        observacao: "",
        items,
        status: "Pendente",
        delivered_at: new Date().toISOString(),
      });

      Alert.alert("Sucesso", "Entrega registrada!");
      router.back();
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Nova Entrega</Text>

        <View style={styles.card}>
          {/* 🔎 BUSCA */}
          <TextInput
            style={styles.search}
            placeholder="Buscar família..."
            value={search}
            onChangeText={setSearch}
          />

          <Text style={styles.label}>Famílias</Text>

          <View style={styles.list}>
            {filteredFamilies?.map((family) => (
              <TouchableOpacity
                key={family.id}
                onPress={() => setFamilyId(family.id)}
                style={[
                  styles.itemButton,
                  familyId === family.id && styles.itemButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.itemText,
                    familyId === family.id && styles.itemTextActive,
                  ]}
                >
                  {family.responsavel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { marginTop: 16 }]}>
            Cestas
          </Text>

          <View style={styles.list}>
            {baskets?.map((basket) => (
              <TouchableOpacity
                key={basket.id}
                onPress={() => setBasketId(basket.id)}
                style={[
                  styles.itemButton,
                  basketId === basket.id && styles.itemButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.itemText,
                    basketId === basket.id && styles.itemTextActive,
                  ]}
                >
                  {basket.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>
            Registrar Entrega
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 16,
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

  search: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  label: {
    marginBottom: 8,
    color: colors.colorAlivio,
    fontWeight: "600",
  },

  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  itemButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
  },

  itemButtonActive: {
    backgroundColor: colors.color1,
    borderColor: colors.color1,
  },

  itemText: {
    color: colors.colorAlivio,
    fontWeight: "500",
  },

  itemTextActive: {
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