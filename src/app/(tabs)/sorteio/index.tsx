import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db, getAllAsync } from "../../../db";
import  User  from "../../models";
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

  // Função para carregar dados do banco
  const loadData = useCallback(async () => {
    try {
      const nome = await AsyncStorage.getItem("usuarioLogado");
      if (!nome) return;

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

    // Atualiza a cada 2 segundos para refletir mudanças externas (opcional)
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, [loadData]);

  const sortear = (tipo: "nome" | "numero") => {
    if (tipo === "nome") {
      if (nomes.length === 0) {
        Alert.alert("Atenção", "Nenhum nome disponível!");
        return;
      }
      const sorteado = nomes[Math.floor(Math.random() * nomes.length)];
      setResultado(`Nome sorteado: ${sorteado.valor}`);
    } else {
      if (numeros.length === 0) {
        Alert.alert("Atenção", "Nenhum número disponível!");
        return;
      }

      const max = Math.max(...numeros.map((n) => parseInt(n.valor, 10)));
      const sorteado = Math.floor(Math.random() * max) + 1;
      setResultado(`Número sorteado: ${sorteado}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user && <Text style={styles.title}>Sorteio de {user.nome}</Text>}

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
          style={styles.button}
          onPress={() => sortear("nome")}
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
          style={[styles.button, { backgroundColor: "#28a745" }]}
          onPress={() => sortear("numero")}
        >
          <Text style={styles.buttonText}>Sortear Número</Text>
        </TouchableOpacity>
      </View>

      {resultado && <Text style={styles.resultado}>{resultado}</Text>}
      <StatusBar backgroundColor="#4a484eff" barStyle="light-content" />
    </ScrollView>
    
  );
};

export default SorteioSimples;