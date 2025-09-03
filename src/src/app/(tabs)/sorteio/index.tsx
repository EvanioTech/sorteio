import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const SorteioSimples: React.FC = () => {
    const [min, setMin] = useState('1');
    const [max, setMax] = useState('10');
    const [resultado, setResultado] = useState<number | null>(null);

    const sortear = () => {
        const minNum = parseInt(min, 10);
        const maxNum = parseInt(max, 10);
        if (isNaN(minNum) || isNaN(maxNum) || minNum > maxNum) {
            setResultado(null);
            return;
        }
        const sorteado = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
        setResultado(sorteado);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sorteio Simples</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={min}
                onChangeText={setMin}
                placeholder="Mínimo"
            />
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={max}
                onChangeText={setMax}
                placeholder="Máximo"
            />
            <Button title="Sortear" onPress={sortear} />
            {resultado !== null && (
                <Text style={styles.result}>Resultado: {resultado}</Text>
            )}
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