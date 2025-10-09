import React, { useEffect, useState } from "react";

import { View, Text, TouchableOpacity, Image, ActivityIndicator, StatusBar } from "react-native";


import { router, useFocusEffect } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from "./styles";





export default function Home() {

  const [loading, setLoading] = useState(true);




  useFocusEffect(


    React.useCallback(() => {


      StatusBar.setBarStyle("dark-content");


      


    }, [])


  );




  useEffect(() => {

    const checkLogin = async () => {

      try {

        const usuario = await AsyncStorage.getItem("usuarioLogado");



        if (usuario) {

          // Se já tem usuário salvo, pula a tela inicial e vai para o app

          router.replace("/(tabs)");

        }

      } catch (error) {

        console.error("Erro ao verificar login:", error);

      } finally {

        setLoading(false);

      }

    };



    checkLogin();

  }, []);



  if (loading) {

    return (

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

        <ActivityIndicator size="large" color="#007bff" />

      </View>

    );

  }



  return (

    <View style={styles.container}>

        <View>

          <Image style={styles.image} source={require("../../assets/images/ger2.png")} />

        </View>



      <TouchableOpacity 

        onPress={() => router.push("/sign-up")}

        style={styles.buttonCad}

      >

        <Text style={styles.buttonText}>Cadastrar</Text>

      </TouchableOpacity>



      <TouchableOpacity 

        onPress={() => router.push("/sign-in")}

        style={{ marginTop: 10 }}

      >

        <Text style={ styles.buttontextdirect}>Já tem cadastro? Faça login</Text>

      </TouchableOpacity>



    </View>

  );

}