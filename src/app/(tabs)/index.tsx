import React, { useEffect, useState } from "react";
import {
  View, Text, TouchableOpacity, Modal, Pressable, TextInput, Alert, StatusBar
} from "react-native";
import User from "../../models";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db, getAllAsync } from "../../db";
import styles from "../../../src/helpers/stylehometab";

interface Sorteio {
  id: number;
  tipo: "nome" | "numero";
  valor: string;
  userId: number;
}

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [participantName, setParticipantName] = useState("");
  const [maxNumber, setMaxNumber] = useState("");
  const [nomes, setNomes] = useState<Sorteio[]>([]);
  const [numeros, setNumeros] = useState<Sorteio[]>([]);

  // Buscar usuário logado
  const fetchUser = async () => {
    try {
      const nome = await AsyncStorage.getItem("usuarioLogado");
      if (!nome) return;

      const result = await db.getFirstAsync<User>(
        "SELECT * FROM users WHERE nome = ?",
        [nome]
      );

      if (result) {
        setUser(result);
        fetchSorteios(result.id);
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  };

  // Buscar sorteios do usuário
  const fetchSorteios = async (userId: number) => {
    try {
      const dados = await getAllAsync<Sorteio>(
        "SELECT * FROM sorteios WHERE userId = ?",
        [userId]
      );
      setNomes(dados.filter((d) => d.tipo === "nome"));
      setNumeros(dados.filter((d) => d.tipo === "numero"));
    } catch (error) {
      console.error("Erro ao buscar sorteios:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Adicionar participante (nome)
  const handleAddParticipant = async () => {
    if (!participantName.trim()) {
      Alert.alert("Atenção", "Digite um nome válido!");
      return;
    }

    try {
      await db.runAsync(
        "INSERT INTO sorteios (tipo, valor, userId) VALUES (?, ?, ?)",
        ["nome", participantName, user?.id ?? null]
      );

      Alert.alert("Sucesso", "Participante adicionado!");
      setParticipantName("");
      setModalVisible1(false);

      // Atualiza a lista de nomes
      if (user) fetchSorteios(user.id);
    } catch (error) {
      console.error("Erro ao adicionar participante:", error);
      Alert.alert("Erro", "Não foi possível salvar o participante.");
    }
  };

  // Adicionar número máximo
  const handleAddMaxNumber = async () => {
    if (!maxNumber.trim() || isNaN(Number(maxNumber))) {
      Alert.alert("Atenção", "Digite um número válido!");
      return;
    }

    try {
      await db.runAsync(
        "INSERT INTO sorteios (tipo, valor, userId) VALUES (?, ?, ?)",
        ["numero", maxNumber, user?.id ?? null]
      );

      Alert.alert("Sucesso", "Número salvo!");
      setMaxNumber("");
      setModalVisible2(false);

      // Atualiza a lista de números
      if (user) fetchSorteios(user.id);
    } catch (error) {
      console.error("Erro ao salvar número:", error);
      Alert.alert("Erro", "Não foi possível salvar o número.");
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <Text style={styles.title}>Bem-vindo, {user.nome}!</Text>
      ) : (
        <Text style={styles.title}>Carregando...</Text>
      )}
      <Text style={styles.subtitle}>Crie seu sorteio</Text>

      <TouchableOpacity onPress={() => setModalVisible1(true)} style={styles.button1}>
        <Text style={styles.buttonText1}>Sorteio de nomes</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setModalVisible2(true)} style={styles.button2}>
        <Text style={styles.buttonText2}>Sorteio de números</Text>
      </TouchableOpacity>

      {/* MODAL PARA NOMES */}
      <Modal animationType="slide" transparent visible={modalVisible1} onRequestClose={() => setModalVisible1(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Digite o nome do participante"
              style={styles.input}
              value={participantName}
              onChangeText={setParticipantName}
            />
            <TouchableOpacity onPress={handleAddParticipant} style={styles.addButton}>
              <Text style={styles.addButtonText}>Adicionar</Text>
            </TouchableOpacity>
            <Pressable onPress={() => setModalVisible1(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* MODAL PARA NÚMEROS */}
      <Modal animationType="slide" transparent visible={modalVisible2} onRequestClose={() => setModalVisible2(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Digite o número máximo"
              style={styles.input}
              value={maxNumber}
              onChangeText={setMaxNumber}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={handleAddMaxNumber} style={styles.addButton}>
              <Text style={styles.addButtonText}>Adicionar</Text>
            </TouchableOpacity>
            <Pressable onPress={() => setModalVisible2(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      
    </View>
  );
};

export default Home;
