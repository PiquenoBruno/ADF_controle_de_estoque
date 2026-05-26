import { useRouter } from 'expo-router';
import { Button, Dimensions, StyleSheet, View } from "react-native";

export default function App() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Controle de Estoque" onPress={() => router.push("/stock")} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Cestas básicas" onPress={() => router.push("/cesta")} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Familias e pessoas" onPress={() => router.push("/families")} />
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", 
    backgroundColor: "#f5f5f5",
  },
  buttonContainer: {
    marginVertical: 10,
    width: width * 0.8,
  },
});
