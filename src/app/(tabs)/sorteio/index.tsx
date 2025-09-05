import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { initDB, getAllAsync, getFirstAsync } from "../../../db";
import { User } from "../../models";

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

  // Buscar usuário e dados salvos sempre que a tela for focada
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          await initDB(); // garante tabelas criadas

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

            setNomes(dados.filter((d) => d.tipo === "nome"));
            setNumeros(dados.filter((d) => d.tipo === "numero"));
          }
        } catch (error) {
          console.error("Erro ao buscar sorteios:", error);
        }
      };

      fetchData();
    }, [])
  );

  // Função de sorteio
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

      // pega o maior número salvo pelo usuário
      const max = Math.max(...numeros.map((n) => parseInt(n.valor, 10)));
      const sorteado = Math.floor(Math.random() * max) + 1;
      setResultado(`Número sorteado: ${sorteado}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user && <Text style={styles.title}>Sorteio de {user.nome}</Text>}

      <Text style={styles.subtitle}>Opções disponíveis:</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nomes</Text>
        {nomes.map((n) => (
          <Text key={n.id} style={styles.item}>
            • {n.valor}
          </Text>
        ))}
        <TouchableOpacity
          style={styles.button}
          onPress={() => sortear("nome")}
        >
          <Text style={styles.buttonText}>Sortear Nome</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Números</Text>
        {numeros.map((n) => (
          <Text key={n.id} style={styles.item}>
            • até {n.valor}
          </Text>
        ))}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#28a745" }]}
          onPress={() => sortear("numero")}
        >
          <Text style={styles.buttonText}>Sortear Número</Text>
        </TouchableOpacity>
      </View>

      {resultado && <Text style={styles.resultado}>{resultado}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: "#444",
  },
  section: {
    marginVertical: 20,
    alignItems: "center",
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    width: "70%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  resultado: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    color: "#d63384",
  },
});

export default SorteioSimples;
