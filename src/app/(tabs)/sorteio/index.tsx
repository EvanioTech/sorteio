import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal, 
  Pressable, 
  Switch,
  Platform, 
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { 
  db, 
  getAllAsync, 
  insertHistorico, 
  getHistorico, 
  HistoricoItem, 
  clearHistorico,
  getUserByNome 
} from "../../../db"; 
import User from "../../../models";
import styles from "../../../helpers/stylesorteio";
import { StatusBar } from "react-native";

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

  // NOVOS ESTADOS PARA CONTROLE DE REPETIÇÃO
  const [naoRepetir, setNaoRepetir] = useState(false);
  const [nomesDisponiveis, setNomesDisponiveis] = useState<Sorteio[]>([]);
  const [numerosDisponiveis, setNumerosDisponiveis] = useState<number[]>([]); 

  // Estados para Contagem Regressiva
  const [countdownVisible, setCountdownVisible] = useState(false);
  const [countdown, setCountdown] = useState(3);
  
  const TEMPO_CONTAGEM = 3000; 
  const [dadosCarregados, setDadosCarregados] = useState(false); // NOVO: Controle de carga inicial

  const loadData = useCallback(async () => {
    try {
      let nome = await AsyncStorage.getItem("usuarioLogado");
      if (!nome) {
        nome = "admin";
      }

      const usuario = await getUserByNome(nome);

      if (usuario) {
        setUser(usuario);

        const dados = await getAllAsync<Sorteio>(
          "SELECT * FROM sorteios WHERE userId = ?",
          [usuario.id]
        );

        const nomesFiltrados = dados.filter((d) => d.tipo === "nome");
        const numerosFiltrados = dados.filter((d) => d.tipo === "numero");

        setNomes(nomesFiltrados);
        setNumeros(numerosFiltrados);
        
        // 🚩 CORREÇÃO: Inicializa listas disponíveis APENAS se ainda não carregadas
        if (!dadosCarregados) {
            setNomesDisponiveis(nomesFiltrados);
            
            if (numerosFiltrados.length > 0) {
                const max = Math.max(...numerosFiltrados.map((n) => parseInt(n.valor, 10)));
                setNumerosDisponiveis(Array.from({ length: max }, (_, i) => i + 1));
            } else {
                setNumerosDisponiveis([]);
            }
            setDadosCarregados(true);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar sorteios:", error);
    }
  }, [dadosCarregados]);

  // 🚩 CORREÇÃO: Chamado apenas na montagem. Sem setInterval para evitar reset.
  useEffect(() => {
    loadData();
    // Se precisar atualizar dados após um CRUD, chame loadData() manualmente
  }, [loadData]);

  // Efeito para resetar os itens disponíveis quando a regra de repetição é DESLIGADA
  useEffect(() => {
    if (!naoRepetir && dadosCarregados) {
        setNomesDisponiveis(nomes);
        if (numeros.length > 0) {
            const max = Math.max(...numeros.map((n) => parseInt(n.valor, 10)));
            setNumerosDisponiveis(Array.from({ length: max }, (_, i) => i + 1));
        }
    }
    // Reajusta a lista disponível se os itens de sorteio mudarem (ex: após um CRUD)
    // Se o modo 'Não Repetir' estiver ativo, esta função **NÃO DEVE** ser chamada.
    // O ajuste é feito dentro da função loadData.
  }, [naoRepetir, nomes, numeros, dadosCarregados]);

  // Lógica da Contagem Regressiva
  useEffect(() => {
      let timer: NodeJS.Timeout;

      if (countdownVisible && countdown > 0) {
          timer = setTimeout(() => {
              setCountdown(prev => prev - 1);
          }, 1000);
      } else if (countdown === 0) {
          setCountdownVisible(false);
          setCountdown(3); 
      }

      return () => clearTimeout(timer);
  }, [countdownVisible, countdown]);
  
  const resetDisponiveis = useCallback(() => {
      setNomesDisponiveis(nomes);
      if (numeros.length > 0) {
          const max = Math.max(...numeros.map((n) => parseInt(n.valor, 10)));
          setNumerosDisponiveis(Array.from({ length: max }, (_, i) => i + 1));
      }
      Alert.alert("Sessão Reiniciada", "Todos os itens foram sorteados. A lista foi resetada.");
  }, [nomes, numeros]);


  const handleShowHistorico = async () => { /* ... (código mantido) ... */
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
  
  const handleClearHistorico = () => { /* ... (código mantido) ... */
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
                        setHistorico([]); 
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
    setCountdownVisible(true); // INICIA O MODAL DE CONTAGEM

    // O resultado real é processado depois da contagem
    setTimeout(async () => {
      let resultadoFinal: string;
      const userId = user?.id ?? 0;
      let sorteado: Sorteio | number | undefined;

      if (tipo === "nome") {
        const listaAtual = naoRepetir ? nomesDisponiveis : nomes;
        
        if (listaAtual.length === 0) {
          Alert.alert("Atenção", naoRepetir ? "Não há mais nomes disponíveis para sorteio! A sessão será reiniciada." : "Nenhum nome disponível!");
          setLoading(false);
          setCountdownVisible(false);
          if (naoRepetir) resetDisponiveis(); // Reinicia lista após aviso
          return;
        }
        
        const randomIndex = Math.floor(Math.random() * listaAtual.length);
        sorteado = listaAtual[randomIndex];
        resultadoFinal = `Nome sorteado: ${sorteado.valor}`;

        if (naoRepetir && sorteado) {
            setNomesDisponiveis(prev => prev.filter(n => n.id !== (sorteado as Sorteio).id));
        }

      } else { // Sorteio de número
        const maxEntrada = numeros.length > 0 ? Math.max(...numeros.map((n) => parseInt(n.valor, 10))) : 0;
        
        if (maxEntrada === 0) {
            Alert.alert("Atenção", "Nenhuma faixa de número definida!");
            setLoading(false);
            setCountdownVisible(false);
            return;
        }

        const listaAtual = naoRepetir ? numerosDisponiveis : Array.from({ length: maxEntrada }, (_, i) => i + 1);

        if (listaAtual.length === 0) {
            Alert.alert("Atenção", "Não há mais números disponíveis para sorteio! A sessão será reiniciada.");
            setLoading(false);
            setCountdownVisible(false);
            if (naoRepetir) resetDisponiveis(); // Reinicia lista após aviso
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * listaAtual.length);
        sorteado = listaAtual[randomIndex];
        resultadoFinal = `Número sorteado: ${sorteado}`;

        if (naoRepetir && sorteado) {
            setNumerosDisponiveis(prev => prev.filter(n => n !== (sorteado as number)));
        }
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
    }, TEMPO_CONTAGEM);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor="#4a484eff" barStyle="light-content" />
      
      {user && <Text style={styles.title}>Sorteio de {user.nome}</Text>}

      {/* Opção de Não Repetir */}
      <View style={styles.repetitionControl}>
        <Text style={styles.repetitionText}>Não Repetir Itens na Sessão</Text>
        <Switch
            onValueChange={setNaoRepetir}
            value={naoRepetir}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={naoRepetir ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>
      
      {naoRepetir && (
          <Text style={styles.infoText}>
              Nomes disponíveis: {nomesDisponiveis.length} | 
              Números disponíveis: {numerosDisponiveis.length}
          </Text>
      )}

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

      {/* Resultado */}
      {resultado && !loading && (
        <Text style={styles.resultadoFinal}>{resultado}</Text>
      )}

      {/* --- MODAL DE CONTAGEM REGRESSIVA --- */}
      <Modal 
        animationType="fade" 
        transparent={true} 
        visible={countdownVisible}
      >
        <View style={styles.countdownOverlay}>
          <View style={styles.countdownBox}>
            <Text style={styles.countdownText}>{countdown}</Text>
            {/* Opcional: Adicionar um loading visual */}
            {countdown > 0 && <ActivityIndicator size="large" color="#fff" />} 
          </View>
        </View>
      </Modal>
      {/* ------------------------------------- */}
      
      {/* --- MODAL DE HISTÓRICO --- (Mantido) */}
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