import { Button, Dimensions, StyleSheet, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Controle de Estoque" onPress={() => alert("Botão 1")} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Cestas básicas" onPress={() => alert("Botão 2")} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Familias e pessoas" onPress={() => alert("Botão 3")} />
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
