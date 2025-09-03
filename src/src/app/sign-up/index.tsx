import { Link, router } from "expo-router";
import { View, Text, StyleSheet, Pressable, TextInput, Image } from "react-native"
import style from "./style";


export default function Signup() {
  return (
    <View style={style.container}>
      <Image style={style.image} source={require('../../../assets/images/ger.png')} />
      <TextInput style={style.input} placeholder="Nome" />
      <TextInput style={style.input} placeholder="Senha"  secureTextEntry/>
      <TextInput style={style.input} placeholder="Repita sua Senha" secureTextEntry />
      <Pressable style={style.button}>
        <Text style={style.buttonText}>Cadastrar</Text>
      </Pressable>
      
      
     
      <Pressable onPress={() => router.push("/")}>
        <Text>Voltar para Home</Text>
      </Pressable>
    </View>
  );
}

