import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, initDB, getFirstAsync } from '../../db';
import styles from '../../../src/helpers/style-sigin-up';
import  User  from '../../models';
import { StatusBar } from 'react-native';

const SignUp: React.FC = () => {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  useEffect(() => {
    initDB(); // garante que a tabela existe antes de usar
  }, []);

  const handleSignUp = async () => {
    if (!nome || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }

    try {
      // Inserindo no banco
      await db.runAsync(
        `INSERT INTO users (nome, senha) VALUES (?, ?)`,
        [nome, senha]
      );

      // Recupera o usuário recém-criado
      const usuario: User | null = await getFirstAsync<User>(
        `SELECT * FROM users WHERE nome = ?`,
        [nome]
      );

      if (!usuario) {
        Alert.alert('Erro', 'Não foi possível recuperar o usuário cadastrado.');
        return;
      }

      // Salva no AsyncStorage para marcar como logado
      await AsyncStorage.setItem('usuarioLogado', usuario.nome);

      Alert.alert('Sucesso', 'Usuário cadastrado e logado!');
      router.replace('/(tabs)'); // vai direto para a home já logado
    } catch (error: any) {
      console.error('Erro ao salvar usuário', error);
      if (error.message.includes('UNIQUE constraint failed')) {
        Alert.alert('Erro', 'Nome já cadastrado!');
      } else {
        Alert.alert('Erro', 'Não foi possível cadastrar o usuário.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/images/ger2.png')} style={styles.logo} />
      <View style={styles.viewsignup}>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        placeholderTextColor="#fff"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        placeholderTextColor="#fff"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <TextInput
        style={styles.input}
        placeholder="Repita sua senha"
        placeholderTextColor="#fff"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      </View>
      <StatusBar backgroundColor="#4a484eff" barStyle="light-content" />
    </View>
  );
};

export default SignUp;
