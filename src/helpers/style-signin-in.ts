import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20,backgroundColor: "white" },
  input: {
    height: 48,
    width: "100%",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#fff"
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  linkText: { color: "#fff", marginTop: 16, textAlign: "center" },
  viewsignin: { backgroundColor: '#2aabd3ff',
  padding: 20,
   borderRadius: 40,
   width: '95%',
   height: '50%',
   alignSelf: 'center',
   justifyContent: 'center'
  },
});

export default styles;