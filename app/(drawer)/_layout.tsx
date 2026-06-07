import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../src/services/supabase";
import { colors } from "../../src/style/style";

function CustomDrawerContent(props: any) {
  async function logout() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.container}
      >
        <View style={styles.list}>
          <DrawerItemList {...props} />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

export default function Layout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.color7,
        },
        headerTintColor: "#fff",

        headerTitle: () => (
          <View style={styles.headerTitle}>
            <Image
              source={require("../../assets/images/logoWhite.jpeg")}
              style={styles.headerLogo}
            />

            <Text style={styles.headerText}>
              ADF Cesta
            </Text>
          </View>
        ),

        drawerStyle: styles.drawer,
        drawerActiveBackgroundColor: colors.color1,
        drawerActiveTintColor: colors.color7,
        drawerInactiveTintColor: colors.color8,

        drawerLabelStyle: styles.label,
        drawerItemStyle: styles.item,
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Início",
        }}
      />

      <Drawer.Screen
        name="menu/users"
        options={{
          drawerLabel: "Usuários",
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  drawer: {
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    paddingTop: 10,
  },

  list: {
    flex: 1,
  },

  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.color8,
  },

  logoutBtn: {
    backgroundColor: colors.colorAle,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    letterSpacing: 0.8,
    fontFamily: "Bebas Neue",
  },

  label: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.color7,
    letterSpacing: 0.6,
    fontFamily: "Bebas Neue",
  },

  item: {
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    paddingVertical: 6,
  },

  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerLogo: {
    width: 35,
    height: 35,
    resizeMode: "contain",
    marginRight: 8,
  },

  headerText: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "Bebas Neue",
    letterSpacing: 1,
  },
});