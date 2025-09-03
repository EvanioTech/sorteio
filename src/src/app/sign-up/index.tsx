import { Link, router } from "expo-router";
import { View, Text, StyleSheet, Pressable, TextInput, Image, TouchableOpacity } from "react-native"
import style from "./style";


export default function Signup() {
  return (
    <View style={style.container}>
      <Image style={style.image} source={require('../../../assets/images/ger.png')} />
      <TextInput style={style.input} placeholder="Nome" />
      <TextInput style={style.input} placeholder="Senha"  secureTextEntry/>
      <TextInput style={style.input} placeholder="Repita sua Senha" secureTextEntry />
      <TouchableOpacity style={style.button}>
        <Text onPress={() => router.replace('/(tabs)/home')} style={style.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      
      
     
      <Pressable onPress={() => router.push("/")}>
        <Text>Voltar para Home</Text>
      </Pressable>
    </View>
  );
}