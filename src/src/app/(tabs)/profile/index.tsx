import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Profile: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Perfil</Text>
            <Text>Nome: Usuário Exemplo</Text>
            <Text>Email: exemplo@email.com</Text>
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
        marginBottom: 16,
    },
});

export default Profile;