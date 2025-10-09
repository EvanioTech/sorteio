import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  Alert,
  StatusBar
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initDB, runAsync, getUserByNome, getSorteiosByUser, Sorteio } from "../db";
import styles from "../../src/helpers/stylehometab";
import BannerAdComponent from "../components/banner";

// Interstitial Ads
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-8876851532405512/8520392619'; // substitua pelo seu ID real

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

const MAX_LIMIT = 10000;

const Home: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [participantName, setParticipantName] = useState("");
  const [minNumber, setMinNumber] = useState("");
  const [maxNumber, setMaxNumber] = useState("");
  const [nomes, setNomes] = useState<Sorteio[]>([]);
  const [numeros, setNumeros] = useState<Sorteio[]>([]);
  const [adShown, setAdShown] = useState(false);

  // Buscar usuário e sorteios
  const fetchUser = async () => {
    try {
      let nome = await AsyncStorage.getItem("usuarioLogado") || "admin";
      const result = await getUserByNome(nome);
      if (result) {
        setUser(result);
        fetchSorteios(result.id);

        // Mostrar interstitial apenas uma vez após login
        if (!adShown) {
          interstitial.addAdEventListener(AdEventType.LOADED, () => {
            interstitial.show();
            setAdShown(true);
          });
          interstitial.addAdEventListener(AdEventType.ERROR, (err) => {
            console.warn("Erro ao carregar interstitial:", err);
          });
          interstitial.load();
        }
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  };

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

  const handleAddParticipant = async () => {
    if (!participantName.trim()) {
      Alert.alert("Atenção", "Cole ou digite um ou mais nomes válidos!");
      return;
    }
    const nomesDoInput = participantName
      .split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 0);
    const nomesExistentes = nomes.map(n => n.valor.toLowerCase());
    const nomesParaSalvar: string[] = [];
    const nomesRepetidos: string[] = [];
    nomesDoInput.forEach(n => {
      if (!nomesExistentes.includes(n.toLowerCase())) nomesParaSalvar.push(n);
      else nomesRepetidos.push(n);
    });
    if (nomesParaSalvar.length === 0) {
      Alert.alert("Atenção", `Nenhum novo nome para adicionar. Já existem: ${nomesRepetidos.join(', ')}`);
      return;
    }
    try {
      const insertPromises = nomesParaSalvar.map(nome =>
        runAsync("INSERT INTO sorteios (tipo, valor, userId) VALUES (?, ?, ?)", ["nome", nome, user?.id ?? null])
      );
      await Promise.all(insertPromises);
      let msg = `${nomesParaSalvar.length} participante(s) adicionado(s)!`;
      if (nomesRepetidos.length > 0) msg += `\n⚠️ Ignorados ${nomesRepetidos.length} nomes já existentes.`;
      Alert.alert("Sucesso", msg);
      setParticipantName("");
      setModalVisible1(false);
      if (user) fetchSorteios(user.id);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar os participantes.");
    }
  };

  const handleAddNumberInterval = async () => {
    if (numeros.length > 0) {
      Alert.alert("Atenção", "Um intervalo de número já existe. Remova antes de adicionar outro.");
      return;
    }
    const min = Number(minNumber.trim());
    const max = Number(maxNumber.trim());
    if (!minNumber || !maxNumber || isNaN(min) || isNaN(max)) {
      Alert.alert("Atenção", "Preencha números válidos!");
      return;
    }
    if (min >= max) {
      Alert.alert("Atenção", "Número mínimo deve ser menor que máximo!");
      return;
    }
    if (max > MAX_LIMIT) {
      Alert.alert("Atenção", `Número máximo não pode exceder ${MAX_LIMIT}!`);
      return;
    }
    const valorSorteio = `${min}-${max}`;
    try {
      await runAsync("INSERT INTO sorteios (tipo, valor, userId) VALUES (?, ?, ?)", ["numero", valorSorteio, user?.id ?? null]);
      Alert.alert("Sucesso", `Intervalo ${valorSorteio} salvo!`);
      setMinNumber("");
      setMaxNumber("");
      setModalVisible2(false);
      if (user) fetchSorteios(user.id);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar o intervalo.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {user ? <Text style={styles.title}>Bem-vindo, {user.nome}!</Text> : <Text style={styles.title}>Carregando...</Text>}
      <Text style={styles.subtitle}>Crie seu sorteio</Text>

      <TouchableOpacity onPress={() => setModalVisible1(true)} style={styles.button1}>
        <Text style={styles.buttonText1}>Sorteio de nomes</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setModalVisible2(true)} style={styles.button2}>
        <Text style={styles.buttonText2}>Sorteio de números</Text>
      </TouchableOpacity>

      {/* MODAL NOMES */}
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
              multiline
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

      {/* MODAL NÚMEROS */}
      <Modal animationType="slide" transparent visible={modalVisible2} onRequestClose={() => setModalVisible2(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Definir Intervalo de Sorteio</Text>
            {numeros.length > 0 && (
              <Text style={{ color: 'red', marginBottom: 15, textAlign: 'center' }}>
                Um intervalo já está salvo. Remova antes de adicionar outro.
              </Text>
            )}
            <TextInput
              placeholder="Número Mínimo (ex: 1)"
              style={styles.input}
              placeholderTextColor="#666"
              value={minNumber}
              onChangeText={setMinNumber}
              keyboardType="numeric"
              editable={numeros.length === 0}
            />
            <TextInput
              placeholder={`Número Máximo (limite ${MAX_LIMIT})`}
              style={styles.input}
              placeholderTextColor="#666"
              value={maxNumber}
              onChangeText={setMaxNumber}
              keyboardType="numeric"
              editable={numeros.length === 0}
            />
            <TouchableOpacity
              onPress={handleAddNumberInterval}
              style={[styles.addButton, numeros.length > 0 && { opacity: 0.5 }]}
              disabled={numeros.length > 0}
            >
              <Text style={styles.addButtonText}>Salvar Intervalo</Text>
            </TouchableOpacity>
            <Pressable onPress={() => setModalVisible2(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Banner */}
      <BannerAdComponent />
    </View>
  );
};

export default Home;
