import React, { useCallback, useState } from "react";
import { View, Text, Button, Alert, TouchableOpacity, StatusBar } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { initDB, getAllAsync, getFirstAsync, runAsync } from "../../../db";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../../helpers/styleprofile";
import { FontAwesome } from "@expo/vector-icons";

type User = {
  id: number;
  nome: string;
  senha: string;
};

type Sorteio = {
  id: number;
  tipo: "nome" | "numero";
  valor: string;
  userId: number;
};

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [temNomes, setTemNomes] = useState(false);
  const [temNumeros, setTemNumeros] = useState(false);


  useFocusEffect(
        useCallback(() => {
            // 🚩 QUANDO A TELA É FOCADA (entramos na tela)
            // Define o conteúdo da barra de status como claro (light-content)
            StatusBar.setBarStyle('light-content'); 

            // 💡 Função de limpeza: QUANDO A TELA PERDE O FOCO (saímos da tela)
            // Define o conteúdo da barra de status de volta para escuro (dark-content)
            return () => StatusBar.setBarStyle('dark-content');
        }, [])
    );

  const fetchData = async () => {
    try {
      await initDB();
      const nome = await AsyncStorage.getItem("usuarioLogado");
      if (!nome) return;

      const usuario = await getFirstAsync<User>(
        "SELECT * FROM users WHERE nome = ?",
        [nome]
      );

      if (usuario) {
        setUser(usuario);

        const dados = await getAllAsync<Sorteio>(
          "SELECT * FROM sorteios WHERE userId = ?",
          [usuario.id]
        );

        setTemNomes(dados.some((d) => d.tipo === "nome"));
        setTemNumeros(dados.some((d) => d.tipo === "numero"));
      }
    } catch (error) {
      console.error("Erro ao buscar usuário/sorteios:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem("usuarioLogado");
    router.replace("/sign-in");
  };

  const handleLimparSorteio = async (tipo: "nome" | "numero") => {
    try {
      await runAsync("DELETE FROM sorteios WHERE tipo = ? AND userId = ?", [
        tipo,
        user?.id,
      ]);
      fetchData(); // Atualiza os botões
    } catch (error) {
      Alert.alert("Erro", "Não foi possível limpar o sorteio.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header} >
      <FontAwesome style={styles.title} name="user-circle" size={100} color="#070707ff" />

      {user && <Text style={styles.info}>{user.nome}</Text>}
      </View>
      <View style={styles.divider1}>
      
      </View>
      <View style={styles.divider2}>


      {/* Botão para limpar nomes */}
      {temNomes && (
        <View style={styles.buttonContainer1}>
          <Button
            title="Limpar Sorteio de Nomes"
            onPress={() => Alert.alert(
              "Confirmação",
              "Tem certeza que deseja limpar todos os nomes?",
              [
                { text: "Cancelar", style: "cancel" },
                { text: "Confirmar", onPress: () => handleLimparSorteio("nome") }
              ]
            )}
            color="#d63384"
          />
        </View>
      )}

      {/* Botão para limpar números */}
      {temNumeros && (
        <View style={styles.buttonContainer2}>
          <Button
            title="Limpar Sorteio de Números"
            onPress={() => Alert.alert(
              "Confirmação",
              "Tem certeza que deseja limpar todos os números?",
              [
                { text: "Cancelar", style: "cancel" },
                { text: "Confirmar", onPress: () => handleLimparSorteio("numero") }
              ]
            )}
            color="#28a745"
          />
        </View>
      )}

      {/* Logout */}
      <View style={styles.logoutButton}>
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>
      </View>

      
    </View>
  );
};

export default Profile;
