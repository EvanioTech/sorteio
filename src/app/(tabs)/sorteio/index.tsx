import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal, 
  Pressable, 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Importação das funções e interfaces do db.ts, incluindo clearHistorico
import { 
  db, 
  getAllAsync, 
  insertHistorico, 
  getHistorico, 
  HistoricoItem, 
  clearHistorico 
} from "../../../db"; 
import User from "../../../models";
import styles from "../../../helpers/stylesorteio";
import { StatusBar } from "react-native";
import { Image } from "expo-image";

interface Sorteio {
  id: number;
  tipo: "nome" | "numero";
  valor: string;
  userId: number;
}

const SorteioSimples: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [nomes, setNomes] = useState<Sorteio[]>([]);
  const [numeros, setNumeros] = useState<Sorteio[]>([]);
  const [resultado, setResultado] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tipoAtual, setTipoAtual] = useState<"nome" | "numero" | null>(null);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]); 
  const [modalVisible, setModalVisible] = useState(false);

  const TEMPO_SUSPENSE = 3000;

  const loadData = useCallback(async () => {
    try {
      let nome = await AsyncStorage.getItem("usuarioLogado");
      if (!nome) {
        nome = "admin";
      }

      const usuario = await db.getFirstAsync<User>(
        "SELECT * FROM users WHERE nome = ?",
        [nome]
      );

      if (usuario) {
        setUser(usuario);

        const dados = await getAllAsync<Sorteio>(
          "SELECT * FROM sorteios WHERE userId = ?",
          [usuario.id]
        );

        setNomes(dados.filter((d) => d.tipo === "nome"));
        setNumeros(dados.filter((d) => d.tipo === "numero"));
      }
    } catch (error) {
      console.error("Erro ao buscar sorteios:", error);
    }
  }, []);

  useEffect(() => {
    loadData();

    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleShowHistorico = async () => {
    if (!user) {
      Alert.alert("Atenção", "Usuário não carregado.");
      return;
    }
    try {
        const dadosHistorico = await getHistorico(user.id);
        setHistorico(dadosHistorico);
        setModalVisible(true);
    } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        Alert.alert("Erro", "Não foi possível carregar o histórico.");
    }
  };
  
  const handleClearHistorico = () => {
    if (!user) return;

    Alert.alert(
        "Confirmação",
        "Tem certeza que deseja limpar todo o histórico de sorteios?",
        [
            {
                text: "Cancelar",
                style: "cancel",
            },
            {
                text: "Limpar",
                onPress: async () => {
                    try {
                        await clearHistorico(user.id);
                        setHistorico([]); // Limpa a lista na tela
                        Alert.alert("Sucesso", "Histórico limpo!");
                    } catch (error) {
                        console.error("Erro ao limpar histórico:", error);
                        Alert.alert("Erro", "Não foi possível limpar o histórico.");
                    }
                },
                style: "destructive",
            },
        ]
    );
  };

  const sortear = (tipo: "nome" | "numero") => {
    if (loading) {
        Alert.alert("Atenção", "Aguarde o sorteio atual terminar.");
        return;
    }

    setResultado(null);
    setTipoAtual(tipo);
    setLoading(true);

    setTimeout(async () => {
      let resultadoFinal: string;
      const userId = user?.id ?? 0;

      if (tipo === "nome") {
        if (nomes.length === 0) {
          Alert.alert("Atenção", "Nenhum nome disponível!");
          setLoading(false);
          return;
        }
        const sorteado = nomes[Math.floor(Math.random() * nomes.length)];
        resultadoFinal = `Nome sorteado: ${sorteado.valor}`;
      } else {
        if (numeros.length === 0) {
          Alert.alert("Atenção", "Nenhum número disponível!");
          setLoading(false);
          return;
        }

        const max = Math.max(...numeros.map((n) => parseInt(n.valor, 10)));
        const sorteado = Math.floor(Math.random() * max) + 1;
        resultadoFinal = `Número sorteado: ${sorteado}`;
      }
      
      if (userId > 0) {
        try {
            await insertHistorico(tipo, resultadoFinal, userId);
        } catch (error) {
            console.error("Erro ao salvar histórico:", error);
        }
      }

      setResultado(resultadoFinal);
      setLoading(false);
    }, TEMPO_SUSPENSE);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor="#4a484eff" barStyle="light-content" />
      
      {user && <Text style={styles.title}>Sorteio de {user.nome}</Text>}

      <TouchableOpacity
        style={styles.historyButton}
        onPress={handleShowHistorico}
      >
        <Text style={styles.historyButtonText}>Ver Histórico</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Opções disponíveis:</Text>

      {/* Seção Nomes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nomes</Text>
        <View style={styles.scrollBox}>
          <ScrollView>
            {nomes.map((n) => (
              <Text key={n.id} style={styles.item}>
                • {n.valor}
              </Text>
            ))}
          </ScrollView>
        </View>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={() => sortear("nome")}
          disabled={loading} 
        >
          <Text style={styles.buttonText}>Sortear Nome</Text>
        </TouchableOpacity>
      </View>

      {/* Seção Números */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Números</Text>
        <View style={styles.scrollBox}>
          <ScrollView>
            {numeros.map((n) => (
              <Text key={n.id} style={styles.item}>
                • até {n.valor}
              </Text>
            ))}
          </ScrollView>
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#28a745" }, loading && styles.buttonDisabled]}
          onPress={() => sortear("numero")}
          disabled={loading} 
        >
          <Text style={styles.buttonText}>Sortear Número</Text>
        </TouchableOpacity>
      </View>

      {/* Suspense GIF */}
      {loading && tipoAtual === "nome" && (
        <Image
          source={require("../../../../assets/images/x.gif")}
          style={{
            width: 180,
            height: 180,
            alignSelf: "center",
            marginTop: 10,
          }}
          contentFit="contain"
          autoplay
        />
      )}

      {loading && tipoAtual === "numero" && (
        <Image
          source={require("../../../../assets/images/y.gif")}
          style={{
            width: 180,
            height: 180,
            alignSelf: "center",
            marginTop: 10,
          }}
          contentFit="contain"
          autoplay
        />
      )}

      {/* Resultado */}
      {resultado && !loading && (
        <Text style={styles.resultado}>{resultado}</Text>
      )}

      {/* --- MODAL DE HISTÓRICO --- */}
      <Modal 
        animationType="slide" 
        transparent={true} 
        visible={modalVisible} 
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Últimos Sorteios</Text>
            <ScrollView style={styles.historyScroll}>
                {historico.length > 0 ? (
                    historico.map((item) => (
                        <View key={item.id} style={styles.historyItem}>
                            <Text style={styles.historyText}>
                                <Text style={{fontWeight: 'bold', textTransform: 'capitalize'}}>{item.tipo}:</Text> {item.resultado}
                            </Text>
                            <Text style={styles.historyDate}>
                                {/* MODIFICAÇÃO CHAVE: Especifica o locale 'pt-BR' */}
                                {new Date(item.dataSorteio).toLocaleString('pt-BR')}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.historyText}>Nenhum sorteio registrado.</Text>
                )}
            </ScrollView>
            
            {/* Botão de Excluir Histórico */}
            <TouchableOpacity 
                onPress={handleClearHistorico} 
                style={styles.clearButton} 
            >
                <Text style={styles.clearButtonText}>Excluir Histórico</Text>
            </TouchableOpacity>

            <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* --------------------------- */}
    </ScrollView>
  );
};

export default SorteioSimples;