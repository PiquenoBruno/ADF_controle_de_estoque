import { useState } from "react";

import {
    Alert,
    Button,
    ScrollView,
    Text,
} from "react-native";

import { router } from "expo-router";

import {
    useFamilies,
} from "../../src/hooks/useFamilies";

import {
    useBaskets,
} from "../../src/hooks/useBaskets";

import {
    useCreateDelivery,
} from "../../src/hooks/useDeliveries";

export default function CreateDelivery() {
  const createDelivery =
    useCreateDelivery();

  const { data: families } =
    useFamilies();

  const { data: baskets } =
    useBaskets();

  const [familyId, setFamilyId] =
    useState("");

  const [basketId, setBasketId] =
    useState("");

  async function handleSave() {
    const basket =
      baskets?.find(
        (b) => b.id === basketId
      );

    if (!basket) {
      Alert.alert(
        "Selecione uma cesta"
      );
      return;
    }

    try {
        await createDelivery.mutateAsync({
            family_id: familyId,
            basket_id: basket.id,
            basket_name: basket.nome,
            observacao: "",
            items: [],
            status: "Pendente",
            delivered_at:
                new Date().toISOString(),
        });

      Alert.alert(
        "Sucesso",
        "Entrega registrada!"
      );

      router.back();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message
      );
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
      }}
    >
      <Text>
        Selecione a Família
      </Text>

      {families?.map(
        (family) => (
          <Button
            key={family.id}
            title={
              family.responsavel
            }
            onPress={() =>
              setFamilyId(
                family.id
              )
            }
          />
        )
      )}

      <Text
        style={{
          marginTop: 20,
        }}
      >
        Selecione a Cesta
      </Text>

      {baskets?.map(
        (basket) => (
          <Button
            key={basket.id}
            title={
              basket.nome
            }
            onPress={() =>
              setBasketId(
                basket.id
              )
            }
          />
        )
      )}

      <Button
        title="Registrar Entrega"
        onPress={handleSave}
      />
    </ScrollView>
  );
}