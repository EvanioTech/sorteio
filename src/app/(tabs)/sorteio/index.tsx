import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const SorteioSimples: React.FC = () => {
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sorteio Simples</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
    title: { fontSize: 24, marginBottom: 16 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, width: 120, marginBottom: 8, textAlign: 'center' },
    result: { fontSize: 20, marginTop: 16, fontWeight: 'bold' },
});

export default SorteioSimples;