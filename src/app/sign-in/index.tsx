import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from "react-native";
import { router } from "expo-router";
import { db } from "../../db"; // importa seu banco

export default function Signin() {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    if (!nome || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      // Busca usuário no banco
      const user = await db.getFirstAsync(
        "SELECT * FROM users WHERE nome = ? AND senha = ?",
        [nome, senha]
      );

      if (user) {
        console.log("Login bem-sucedido:", user);
        Alert.alert("Sucesso", `Bem-vindo, ${user.nome}!`);
        router.replace("/(tabs)"); // vai para a home
      } else {
        Alert.alert("Erro", "Usuário ou senha inválidos.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      Alert.alert("Erro", "Ocorreu um problema ao tentar entrar.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/images/ger.png')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  input: {
    height: 48,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  logo: { width: 120, height: 120, alignSelf: 'center', marginBottom: 20 },
});
