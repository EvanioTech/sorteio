import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  image: {
    width: 350,
    height: 300,
  },
    buttonCad: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        width: 300,
        alignItems: 'center',
        marginTop: 20,
        
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 19,
    },
    buttonLog: {
        color: '#fff',
        fontSize: 16,
    },
});
