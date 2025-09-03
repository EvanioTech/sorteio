import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { router } from "expo-router";
import { db } from "../../../db";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  id: number;
  nome: string;
  senha: string;
};

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Recupera usuário logado do AsyncStorage
        const nome = await AsyncStorage.getItem("usuarioLogado");

        if (!nome) return;

        const result = await db.getFirstAsync<User>(
          "SELECT * FROM users WHERE nome = ?",
          [nome]
        );

        if (result) {
          setUser(result);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("usuarioLogado"); // limpa o login
    router.replace("/sign-in");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      {user ? (
        <>
          <Text>Nome: {user.nome}</Text>
          <Text>Email: exemplo@email.com</Text>
        </>
      ) : (
        <Text>Carregando...</Text>
      )}

      <Button title="Editar Perfil" onPress={() => alert("Funcionalidade de edição de perfil")} />
      <Button title="Sair" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
});

export default Profile;
