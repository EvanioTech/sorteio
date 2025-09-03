import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router, Router } from 'expo-router';

const SignUp: React.FC = () => {
   

    return (
        <View style={styles.container}>
            <Image source={require('../../../assets/images/ger.png')} style={styles.logo} />
            <TextInput style={styles.input} placeholder="Digite seu nome" />
            <TextInput style={styles.input} placeholder="Digite sua senha" secureTextEntry/>
            <TextInput style={styles.input} placeholder="Repita sua senha" secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={() => router.replace('/(tabs)')}>
                <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        height: 48,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 24,
        alignSelf: 'center',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SignUp;