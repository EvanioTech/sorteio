import { Link, router } from "expo-router";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native"


export default function Signin() {
  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Digite seu nome" />
      <TextInput style={styles.input} placeholder="Digite sua senha" secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)")}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
