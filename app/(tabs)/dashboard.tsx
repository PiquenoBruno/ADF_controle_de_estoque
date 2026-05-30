import {
  Button,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import { supabase } from "../../src/services/supabase";

export default function Dashboard() {
  const router = useRouter();

  async function handleLogout() {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.log(
        "❌ Logout erro:",
        error.message
      );
      return;
    }

    console.log("✅ Logout realizado");

    // 🔥 FORÇA navegação imediata
    router.replace("/(auth)/login");
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 20 }}>
        Dashboard
      </Text>

      <Button
        title="Sair"
        onPress={handleLogout}
      />
    </View>
  );
}