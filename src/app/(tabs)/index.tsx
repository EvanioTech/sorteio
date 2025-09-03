import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User } from '../models';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from '../../db';

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
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
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      {user ? (
        <Text style={styles.title}>Bem-vindo, {user.nome}!</Text>
      ) : (
        <Text style={styles.title}>Carregando...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Home;
