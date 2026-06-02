import {
    useEffect,
    useState,
} from "react";

import {
    Alert,
    Button,
    ScrollView,
    Text,
    TextInput,
} from "react-native";

import {
    router,
    useLocalSearchParams,
} from "expo-router";

import {
    useBasket,
    useUpdateBasket,
} from "../../../src/hooks/useBaskets";

import {
    useFamilies,
} from "../../../src/hooks/useFamilies";

export default function EditBasket() {
  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();

  const { data: basket } =
    useBasket(id);

  const { data: families } =
    useFamilies();

  const updateBasket =
    useUpdateBasket();

  const [nome, setNome] =
    useState("");

  const [descricao, setDescricao] =
    useState("");

  const [familyId, setFamilyId] =
    useState("");

  useEffect(() => {
    if (!basket) return;

    setNome(
      basket.nome
    );

    setDescricao(
      basket.descricao ?? ""
    );

    setFamilyId(
      basket.family_id
    );
  }, [basket]);

  async function handleSave() {
    try {
      await updateBasket.mutateAsync({
        id,
        basket: {
          nome,
          descricao,
          family_id: familyId,
        },
      });

      Alert.alert(
        "Sucesso",
        "Cesta atualizada!"
      );

      router.back();
    } catch {
      Alert.alert(
        "Erro",
        "Falha ao atualizar cesta"
      );
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        gap: 12,
      }}
    >
      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={
          setDescricao
        }
      />

      <Text>
        Família:
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

      <Text>
        Família selecionada:
      </Text>

      <Text>
        {familyId}
      </Text>

      <Button
        title="Salvar Alterações"
        onPress={handleSave}
      />
    </ScrollView>
  );
}