import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, TextInput } from 'react-native';
import { User } from '../models';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from '../../db';

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [participantName, setParticipantName] = useState('');
  const [maxNumber, setMaxNumber] = useState('');

  const handleAddParticipant = () => {
    // Lógica para adicionar participante
  };

  const handleAddMaxNumber = () => {
    // Lógica para adicionar número máximo
  };

  const openModal1 = () => {
    setModalVisible1(true);
  };

  const openModal2 = () => {
    setModalVisible2(true);
  };

  const closeModal2 = () => {
    setModalVisible2(false);
  };

  const closeModal1 = () => {
    setModalVisible1(false);
  };

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
      <Text style={styles.subtitle}>Crie seu sorteio</Text>
      
      <TouchableOpacity onPress={openModal1} style={styles.button1}>
        <Text style={styles.buttonText1}>Sorteio de nomes</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={openModal2} style={styles.button2}>
        <Text style={styles.buttonText2}>Sorteio de números</Text>
      </TouchableOpacity>

      {/* MODAL AQUI */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible1}
        onRequestClose={closeModal1}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Digite o nome do participante"
              style={styles.input}
            ></TextInput>
            <TouchableOpacity onPress={handleAddParticipant} style={styles.addButton}>
              <Text style={styles.addButtonText}>Adicionar</Text>
            </TouchableOpacity>
            <Pressable onPress={closeModal1} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={closeModal2}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Digite o número máximo"
              style={styles.input}
            ></TextInput>
            <TouchableOpacity onPress={handleAddParticipant} style={styles.addButton}>
              <Text style={styles.addButtonText}>Adicionar</Text>
            </TouchableOpacity>
            <Pressable onPress={closeModal2} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    position: 'absolute',
    top: 70,
  },
  subtitle: {
    fontSize: 24,
    color: '#666',
    marginBottom: 100,
  },
  button1: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
  },
  button2: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: "60%",
  },
  buttonText1: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  
  buttonText2: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 6,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});



export default Home;
