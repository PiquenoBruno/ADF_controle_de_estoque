import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors } from "../../../src/style/style";

interface QuantityInputProps {
  quantidade: string;
  setQuantidade: (value: string) => void;
  onAdd: () => void;
}

export default function QuantityInput({
  quantidade,
  setQuantidade,
  onAdd,
}: QuantityInputProps) {
  return (
    <View style={{ marginVertical: 12 }}>
      <TextInput
        placeholder="Quantidade"
        keyboardType="numeric"
        value={quantidade}
        onChangeText={setQuantidade}
        style={{
          borderWidth: 1,
          borderColor: colors.color8,
          borderRadius: 12,
          padding: 12,
          marginBottom: 10,
        }}
      />
      <TouchableOpacity
        style={{
          backgroundColor: colors.color1,
          padding: 12,
          borderRadius: 12,
          alignItems: "center",
        }}
        onPress={onAdd}
      >
        <Text style={{ color: "#FFF", fontWeight: "bold" }}>+ Adicionar Produto</Text>
      </TouchableOpacity>
    </View>
  );
}
