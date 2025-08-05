import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <View >
        <Image style={styles.image} source={require('../../assets/ger.png')} />
      </View>
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
});
