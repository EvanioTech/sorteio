import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { db, initDB } from '../../db';
import styles from '../../../src/helpers/style-sigin-up';

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
      const result = await db.runAsync(
        `INSERT INTO users (nome, senha) VALUES (?, ?)`,
        [nome, senha]
      );

      if (result.changes > 0) {
        console.log('Usuário criado com sucesso!');
        Alert.alert('Sucesso', 'Usuário cadastrado!');
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      console.error("Erro ao salvar usuário", error);
      Alert.alert('Erro', 'Não foi possível cadastrar o usuário.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/images/ger.png')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <TextInput
        style={styles.input}
        placeholder="Repita sua senha"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUp;


