import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../../src/style/style";

interface BasketItemCardProps {
  item: any;
  onIncrease: () => void;
  onDecrease: () => void;
  onDelete: () => void;
  showActions: boolean;
}

export default function BasketItemCard({
  item,
  onIncrease,
  onDecrease,
  onDelete,
  showActions,
}: BasketItemCardProps) {
  function confirmDelete() {
    Alert.alert(
      "Remover item",
      `Tem certeza que deseja remover "${item.products?.nome}" da cesta?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Remover", style: "destructive", onPress: onDelete },
      ]
    );
  }

  const unidade = item.products?.unidade || "un";
  const quantidade = item.quantidade || 0;

  return (
    <View
      style={{
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* Linha superior */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            flex: 1,
            fontSize: 16,
            fontWeight: "700",
            color: colors.colorAlivio,
            marginRight: 12,
          }}
        >
          {item.products?.nome}
        </Text>

        <View
          style={{
            backgroundColor: `${colors.color1}15`,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 999,
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              color: colors.color1,
            }}
          >
            {quantidade} {unidade}
          </Text>
        </View>
      </View>

      {/* Linha de ações */}
      {showActions && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 14,
          }}
        >
          <TouchableOpacity onPress={confirmDelete}>
            <Text
              style={{
                color: colors.colorAle,
                fontWeight: "600",
              }}
            >
              Remover
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <TouchableOpacity
              onPress={onDecrease}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: colors.colorAle,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 20,
                  fontWeight: "700",
                }}
              >
                −
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                minWidth: 30,
                textAlign: "center",
                color: colors.colorAlivio,
              }}
            >
              {quantidade}
            </Text>

            <TouchableOpacity
              onPress={onIncrease}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: colors.color1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 20,
                  fontWeight: "700",
                }}
              >
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}