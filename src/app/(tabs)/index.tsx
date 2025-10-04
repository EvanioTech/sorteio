import React, { useEffect, useState } from "react";
import {
  View, Text, TouchableOpacity, Modal, Pressable, TextInput, Alert, StatusBar
} from "react-native";
import User from "../../models";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { 
  initDB, 
  runAsync, 
  getUserByNome, 
  getSorteiosByUser, 
  Sorteio 
} from "../../db"; 
import styles from "../../../src/helpers/stylehometab";

const MAX_LIMIT = 10000; // Constante para o limite máximo

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  // 💡 ATUALIZADO: participantName agora pode conter múltiplos nomes/linhas.
  const [participantName, setParticipantName] = useState(""); 
  
  // NOVOS ESTADOS PARA O INTERVALO
  const [minNumber, setMinNumber] = useState(""); 
  const [maxNumber, setMaxNumber] = useState("");
  
  const [nomes, setNomes] = useState<Sorteio[]>([]);
  const [numeros, setNumeros] = useState<Sorteio[]>([]);

  // Buscar usuário logado
  const fetchUser = async () => {
    try {
      let nome = await AsyncStorage.getItem("usuarioLogado");
      
      if (!nome) {
          nome = "admin";
      }

      const result = await getUserByNome<User>(nome);

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
      const dados = await getSorteiosByUser(userId);
      setNomes(dados.filter((d) => d.tipo === "nome"));
      setNumeros(dados.filter((d) => d.tipo === "numero"));
    } catch (error) {
      console.error("Erro ao buscar sorteios:", error);
    }
  };

  useEffect(() => {
    const setupDB = async () => {
        await initDB(); 
        fetchUser();    
    };
    setupDB();
  }, []);

  // 💡 FUNÇÃO ATUALIZADA: Adicionar múltiplos participantes (nome)
  const handleAddParticipant = async () => {
    if (!participantName.trim()) {
      Alert.alert("Atenção", "Cole ou digite um ou mais nomes válidos!");
      return;
    }
    
    // Processa a lista de nomes:
    // 1. Divide o texto por quebra de linha (se o usuário colou uma lista).
    // 2. Filtra strings vazias.
    // 3. Mapeia para remover espaços em branco no início/fim de cada nome.
    const nomesParaSalvar = participantName
        .split('\n')
        .map(nome => nome.trim())
        .filter(nome => nome.length > 0);

    if (nomesParaSalvar.length === 0) {
        Alert.alert("Atenção", "Nenhum nome válido encontrado na lista.");
        return;
    }

    try {
      // 💡 PREPARA MÚLTIPLAS INSERÇÕES
      const insertPromises = nomesParaSalvar.map(nome => 
        runAsync(
          "INSERT INTO sorteios (tipo, valor, userId) VALUES (?, ?, ?)",
          ["nome", nome, user?.id ?? null]
        )
      );
      
      await Promise.all(insertPromises);

      Alert.alert("Sucesso", `${nomesParaSalvar.length} participante(s) adicionado(s)!`);
      setParticipantName("");
      setModalVisible1(false);

      if (user) fetchSorteios(user.id);
    } catch (error) {
      console.error("Erro ao adicionar participante:", error);
      Alert.alert("Erro", "Não foi possível salvar os participantes.");
    }
  };

  // Adicionar Intervalo de Número (Mantido)
  const handleAddNumberInterval = async () => {
    const min = Number(minNumber.trim());
    const max = Number(maxNumber.trim());

    // 1. Validação de formato e preenchimento
    if (!minNumber.trim() || !maxNumber.trim() || isNaN(min) || isNaN(max)) {
      Alert.alert("Atenção", "Preencha o Mínimo e o Máximo com números válidos!");
      return;
    }

    // 2. Validação de ordem
    if (min >= max) {
        Alert.alert("Atenção", "O número mínimo deve ser menor que o número máximo!");
        return;
    }

    // 3. Validação de limite máximo
    if (max > MAX_LIMIT) {
        Alert.alert("Atenção", `O número máximo não pode exceder ${MAX_LIMIT}!`);
        return;
    }
    
    // 4. Concatena os valores para salvar no DB (ex: "1-100")
    const valorSorteio = `${min}-${max}`;

    try {
      await runAsync(
        "INSERT INTO sorteios (tipo, valor, userId) VALUES (?, ?, ?)",
        ["numero", valorSorteio, user?.id ?? null]
      );

      Alert.alert("Sucesso", `Intervalo ${valorSorteio} salvo!`);
      setMinNumber("");
      setMaxNumber("");
      setModalVisible2(false);

      if (user) fetchSorteios(user.id);
    } catch (error) {
      console.error("Erro ao salvar intervalo de número:", error);
      Alert.alert("Erro", "Não foi possível salvar o intervalo de número.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
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

      {/* 💡 MODAL PARA NOMES (ATUALIZADO PARA MÚLTIPLAS LINHAS) */}
      <Modal animationType="slide" transparent visible={modalVisible1} onRequestClose={() => setModalVisible1(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Participante(s)</Text>
            
            {/* 💡 TextInput MULTILINE */}
            <TextInput
              placeholder="Cole ou digite uma lista de nomes (um por linha)"
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]} // Aumenta a altura e alinha o texto ao topo
              placeholderTextColor="#666"
              value={participantName}
              onChangeText={setParticipantName}
              multiline={true} // Habilita múltiplas linhas
            />
            
            <TouchableOpacity onPress={handleAddParticipant} style={styles.addButton}>
              <Text style={styles.addButtonText}>Adicionar Lista</Text>
            </TouchableOpacity>
            <Pressable onPress={() => setModalVisible1(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* MODAL PARA NÚMEROS (Mantido) */}
      <Modal animationType="slide" transparent visible={modalVisible2} onRequestClose={() => setModalVisible2(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Definir Intervalo de Sorteio</Text>

            <TextInput
              placeholder="Número Mínimo (ex: 1)"
              style={styles.input}
              placeholderTextColor="#666"
              value={minNumber}
              onChangeText={setMinNumber}
              keyboardType="numeric"
            />
            <TextInput
              placeholder={`Número Máximo (limite ${MAX_LIMIT})`}
              style={styles.input}
              placeholderTextColor="#666"
              value={maxNumber}
              onChangeText={setMaxNumber}
              keyboardType="numeric"
            />
            
            <TouchableOpacity onPress={handleAddNumberInterval} style={styles.addButton}>
              <Text style={styles.addButtonText}>Salvar Intervalo</Text>
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