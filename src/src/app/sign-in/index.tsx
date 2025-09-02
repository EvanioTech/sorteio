import { Link, router } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native"


export default function Signin() {
  return (
    <View style={styles.container}>
      <Text>Login</Text>
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
