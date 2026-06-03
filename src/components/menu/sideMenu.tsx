import {
    Alert,
    Button,
    View,
} from "react-native";

import { router } from "expo-router";

import { supabase } from "../../services/supabase";

export function SideMenu() {
  async function handleLogout() {
    Alert.alert(
      "Sair",
      "Deseja realmente sair?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          onPress: async () => {
            await supabase.auth.signOut();

            router.replace("/");
          },
        },
      ]
    );
  }

  return (
    <View
      style={{
        padding: 20,
        gap: 10,
      }}
    >
      <Button
        title="Usuários"
        onPress={() =>
          router.push("/menu/users")
        }
      />

      <Button
        title="Relatórios"
        onPress={() =>
          router.push("/menu/reports")
        }
      />

      <Button
        title="Configurações"
        onPress={() =>
          router.push("/menu/settings")
        }
      />

      <Button
        title="Sair"
        color="red"
        onPress={handleLogout}
      />
    </View>
  );
}
