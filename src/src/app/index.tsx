import { View, Text,TouchableOpacity, Image } from "react-native"
import { Link, router } from "expo-router";
import styles from "./styles";


export default function Home() {
  return (
    <View style={styles.container}>
      <View>
        <Image style={styles.image} source={require('../../assets/images/ger.png')} />
      </View>
      
      <TouchableOpacity 
        onPress={() => router.push('/sign-up')}
        style={styles.buttonCad}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
      onPress={() => router.push('/sign-in')}
      style={{ marginTop: 10 }}>
        
        <Text style={{ color: 'black' }}>Já tem cadastro? Faça login</Text>
      </TouchableOpacity>
      
    </View>
  );
}



