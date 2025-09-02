import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import styles from './styles';

export default function Home() {
  return (
    <View style={styles.container}>
      <View >
        <Image style={styles.image} source={require('../../assets/ger.png')} />
      </View>
      <TouchableOpacity style={styles.buttonCad}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{marginTop: 10}}>
        <Text style={{color: 'black'}}>Já tem cadastro? Faça login</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}


