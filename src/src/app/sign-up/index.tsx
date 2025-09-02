import { Link, router } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native"


export default function Signup() {
  return (
    <View style={styles.container}>
      <Text>Cadastro</Text>
      <Pressable onPress={() => router.push("/")}>
        <Text>Voltar para Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
