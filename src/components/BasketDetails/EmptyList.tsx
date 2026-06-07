import React from "react";
import { Text, View } from "react-native";
import { colors } from "../../../src/style/style";

export default function EmptyList() {
  return (
    <View style={{ marginTop: 40, alignItems: "center" }}>
      <Text style={{ color: colors.color8 }}>Nenhum item na cesta</Text>
    </View>
  );
}
