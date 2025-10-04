import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Image, 
  TouchableOpacity, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, // Importante para o comportamento do teclado
  StatusBar,
  ScrollView // Importado para permitir a rolagem
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Assumindo que o 'db', 'initDB', e 'getFirstAsync' vêm desses caminhos
import { db, initDB, getFirstAsync } from '../../db'; 
// Assumindo que o 'styles' vem desse caminho
import styles from '../../../src/helpers/style-sigin-up'; 
import  User  from '../../models'; 

const SignUp: React.FC = () => {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  useEffect(() => {
    initDB(); // Garante que a tabela existe antes de usar
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
      router.replace('/(tabs)'); // Vai direto para a home já logado
    } catch (error) {
      console.error('Erro ao salvar usuário', error);
      
      if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
        Alert.alert('Erro', 'Nome já cadastrado!');
      } else {
        Alert.alert('Erro', 'Não foi possível cadastrar o usuário.');
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      // 'padding' para iOS, 'height' para Android.
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      keyboardVerticalOffset={0} 
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled" // Permite interagir com inputs sem fechar o teclado
        showsVerticalScrollIndicator={false} // Opcional: esconde a barra de rolagem
      >
        <View style={styles.container}>
            <Image 
              source={require('../../../assets/images/ger2.png')} 
              style={styles.logo} 
            />
            
            <View style={styles.viewsignup}>
              <TextInput
                style={styles.input}
                placeholder="Digite seu nome"
                placeholderTextColor="#fff"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="none"
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
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#4a484eff" barStyle="dark-content" translucent={false} />
      
    </KeyboardAvoidingView>
  );
};

export default SignUp;