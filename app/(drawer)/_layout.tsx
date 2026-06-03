import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Button, View } from "react-native";
import { supabase } from "../../src/services/supabase";

function CustomDrawerContent(props: any) {
  async function logout() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View style={{ marginTop: 20, padding: 20 }}>
        <Button title="Sair" color="red" onPress={logout} />
      </View>
    </DrawerContentScrollView>
  );
}

export default function Layout() {
  return (
    <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>

      <Drawer.Screen
        name="(tabs)"
        options={{ drawerLabel: "Início", title: "Início" }}
      />

      <Drawer.Screen
        name="menu/users"
        options={{ drawerLabel: "Usuários", title: "Usuários" }}
      />
    </Drawer>
  );
}
