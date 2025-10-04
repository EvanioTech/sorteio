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

  // FUNÇÃO ATUALIZADA: Adicionar múltiplos participantes (nome) + Verificação de Repetição
  const handleAddParticipant = async () => {
    if (!participantName.trim()) {
      Alert.alert("Atenção", "Cole ou digite um ou mais nomes válidos!");
      return;
    }
    
    // Processa a lista de nomes do TextInput
    const nomesDoInput = participantName
        .split('\n')
        .map(nome => nome.trim())
        .filter(nome => nome.length > 0);

    if (nomesDoInput.length === 0) {
        Alert.alert("Atenção", "Nenhum nome válido encontrado na lista.");
        return;
    }

    // Nomes já existentes no DB
    const nomesExistentes = nomes.map(n => n.valor.toLowerCase());
    
    const nomesParaSalvar: string[] = [];
    const nomesRepetidos: string[] = [];

    // VERIFICAÇÃO DE REPETIÇÃO
    nomesDoInput.forEach(nome => {
        if (!nomesExistentes.includes(nome.toLowerCase())) {
            nomesParaSalvar.push(nome);
        } else {
            nomesRepetidos.push(nome);
        }
    });

    if (nomesParaSalvar.length === 0) {
        // 💡 CORREÇÃO APLICADA AQUI: Concatenando as strings no segundo argumento
        Alert.alert(
            "Atenção", 
            `Nenhum novo nome para adicionar. Os seguintes nomes já estão na lista: ${nomesRepetidos.join(', ')}.`
        );
        return;
    }

    try {
      // PREPARA MÚLTIPLAS INSERÇÕES
      const insertPromises = nomesParaSalvar.map(nome => 
        runAsync(
          "INSERT INTO sorteios (tipo, valor, userId) VALUES (?, ?, ?)",
          ["nome", nome, user?.id ?? null]
        )
      );
      
      await Promise.all(insertPromises);
      
      let mensagemSucesso = `${nomesParaSalvar.length} participante(s) adicionado(s)!`;
      if (nomesRepetidos.length > 0) {
          mensagemSucesso += `\n⚠️ Ignorados ${nomesRepetidos.length} nomes já existentes.`;
      }

      Alert.alert("Sucesso", mensagemSucesso);
      setParticipantName("");
      setModalVisible1(false);

      if (user) fetchSorteios(user.id);
    } catch (error) {
      console.error("Erro ao adicionar participante:", error);
      Alert.alert("Erro", "Não foi possível salvar os participantes.");
    }
  };

  // FUNÇÃO ATUALIZADA: Adicionar Intervalo de Número + Verificação de Existência
  const handleAddNumberInterval = async () => {
    // VERIFICAÇÃO DE EXISTÊNCIA:
    if (numeros.length > 0) {
        Alert.alert(
            "Atenção", 
            "Um intervalo de número já existe. Você precisa removê-lo antes de adicionar um novo.",
            [
                { text: "OK" }
            ]
        );
        return;
    }

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
      <StatusBar backgroundColor="#030008" barStyle="light-content" />
      
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
            <Text style={styles.modalTitle}>Adicionar Participante(s)</Text>
            
            <TextInput
              placeholder="Cole ou digite uma lista de nomes (um por linha)"
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]} 
              placeholderTextColor="#666"
              value={participantName}
              onChangeText={setParticipantName}
              multiline={true} 
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

      {/* MODAL PARA NÚMEROS */}
      <Modal animationType="slide" transparent visible={modalVisible2} onRequestClose={() => setModalVisible2(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Definir Intervalo de Sorteio</Text>
            
            {/* Mensagem de aviso se já houver um intervalo */}
            {numeros.length > 0 && (
                <Text style={{ color: 'red', marginBottom: 15, textAlign: 'center' }}>
                    Um intervalo já está salvo. Você deve removê-lo na tela Perfil para adicionar um novo.
                </Text>
            )}

            <TextInput
              placeholder="Número Mínimo (ex: 1)"
              style={styles.input}
              placeholderTextColor="#666"
              value={minNumber}
              onChangeText={setMinNumber}
              keyboardType="numeric"
              editable={numeros.length === 0} // Desabilita se já houver intervalo
            />
            <TextInput
              placeholder={`Número Máximo (limite ${MAX_LIMIT})`}
              style={styles.input}
              placeholderTextColor="#666"
              value={maxNumber}
              onChangeText={setMaxNumber}
              keyboardType="numeric"
              editable={numeros.length === 0} // Desabilita se já houver intervalo
            />
            
            <TouchableOpacity 
                onPress={handleAddNumberInterval} 
                style={[styles.addButton, numeros.length > 0 && { opacity: 0.5 }]}
                disabled={numeros.length > 0} // Desabilita o botão
            >
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