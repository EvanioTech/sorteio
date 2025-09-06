import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20,  },
  viewsignup: { backgroundColor: '#2aabd3ff',
     padding: 20,
      borderRadius: 40,
      width: '95%',
      height: '50%',
      alignSelf: 'center',
      justifyContent: 'center',
      
  },
  logo: { width: 220, height: 220, alignSelf: 'center', marginBottom: 20, marginTop: 70 },
  input: { borderWidth: 1, borderColor: '#fff', borderRadius: 8, padding: 10, marginVertical: 8,color: '#fff' },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default styles;