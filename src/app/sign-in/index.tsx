import React, { useState } from "react";
import { View,
   Text,
    TextInput,
     TouchableOpacity,
      Alert, Image ,ScrollView, KeyboardAvoidingView,
    Platform } from "react-native";
import { router } from "expo-router";
import { db } from "../../db";
import AsyncStorage from "@react-native-async-storage/async-storage";
import  User  from "../../models";
import styles from "../../../src/helpers/style-signin-in";

export default function Signin() {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    if (!nome || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (nome === "admin" && senha === "admin") {
      await AsyncStorage.setItem("usuarioLogado", "admin");
      router.replace("/(tabs)");
      return;
    }

    try {
      const user:User = await db.getFirstAsync(
        "SELECT * FROM users WHERE nome = ? AND senha = ?",
        [nome, senha]
      );

      if (user) {
        // Salva nome do usuário no AsyncStorage
        await AsyncStorage.setItem("usuarioLogado", user.nome);

        Alert.alert("Sucesso", `Bem-vindo, ${user.nome}!`);
        router.replace("/(tabs)");
      } else {
        Alert.alert("Erro", "Usuário ou senha inválidos.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      Alert.alert("Erro", "Ocorreu um problema ao tentar entrar.");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
    keyboardShouldPersistTaps="handled"
    >  
    <View style={styles.container}>
      <Image source={require("../../../assets/images/ger.png")} style={styles.logo} />
      <View style={styles.viewsignin}>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        placeholderTextColor="#fff"
        
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        placeholderTextColor="#fff"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/sign-up")}>
        <Text style={styles.linkText}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
      </View>
    </View>
    </ScrollView> 
    </KeyboardAvoidingView>
  );
}




