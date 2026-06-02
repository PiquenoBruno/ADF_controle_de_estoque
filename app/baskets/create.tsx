import { useState } from "react";

import {
    Alert,
    Button,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import { router } from "expo-router";

import { useCreateBasket } from "../../src/hooks/useBaskets";
import { useFamilies } from "../../src/hooks/useFamilies";

export default function CreateBasket() {
  const createBasket =
    useCreateBasket();

  const { data: families } =
    useFamilies();

  const [nome, setNome] =
    useState("");

  const [descricao, setDescricao] =
    useState("");

  const [familyId, setFamilyId] =
    useState("");

  async function handleSave() {
    if (!nome.trim()) {
      Alert.alert(
        "Atenção",
        "Informe o nome da cesta."
      );
      return;
    }

    if (!familyId) {
      Alert.alert(
        "Atenção",
        "Selecione uma família."
      );
      return;
    }

    try {
      await createBasket.mutateAsync({
        nome,
        descricao,
        family_id: familyId,
        status: "Pendente",
        entregue: false,
      });

      Alert.alert(
        "Sucesso",
        "Cesta cadastrada!"
      );

      router.back();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.message ||
          "Falha ao cadastrar cesta"
      );
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
      }}
    >
      <TextInput
        placeholder="Nome da cesta"
        value={nome}
        onChangeText={setNome}
        style={{
          borderWidth: 1,
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        style={{
          borderWidth: 1,
          padding: 12,
          borderRadius: 8,
          marginBottom: 20,
        }}
      />

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Selecione a família
      </Text>

      {families?.map((family) => (
        <View
          key={family.id}
          style={{
            marginBottom: 8,
          }}
        >
          <Button
            title={family.responsavel}
            onPress={() =>
              setFamilyId(family.id)
            }
          />
        </View>
      ))}

      <Text
        style={{
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        Família selecionada:
        {" "}
        {familyId || "Nenhuma"}
      </Text>

      <Button
        title="Salvar Cesta"
        onPress={handleSave}
      />
    </ScrollView>
  );
}