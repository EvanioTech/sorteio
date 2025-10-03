import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // ✅ 1. Estilo para o conteúdo que vai ser rolado
  scrollContent: {
      flexGrow: 1, // Permite que o conteúdo se expanda e o ScrollView funcione corretamente
      justifyContent: 'center', // Centraliza o formulário verticalmente no centro da tela
  },

  // ✅ 2. O estilo do contêiner deve ser aplicado dentro do ScrollView
  container: { 
      flex: 1, 
      paddingHorizontal: 20,
      // Se você centralizou o scrollContent, não precisa mais centralizar aqui,
      // mas mantemos o flex: 1 para ocupar o espaço.
  },
  
  viewsignup: { 
      backgroundColor: '#2aabd3ff',
      padding: 30,
      borderRadius: 40,
      width: '95%',
      alignSelf: 'center',
      justifyContent: 'flex-start',
  },
  logo: { 
      width: 220, 
      height: 220, 
      alignSelf: 'center', 
      marginBottom: "5%",
      marginTop: "10%",
  },
  input: { 
      borderWidth: 1, 
      borderColor: '#fff', 
      borderRadius: 8, 
      padding: 10, 
      marginVertical: 8,
      color: '#fff',
      height: 45
  },
  button: { 
      backgroundColor: '#007bff', 
      padding: 15, 
      borderRadius: 8, 
      alignItems: 'center', 
      marginTop: 15 
  },
  buttonText: { 
      color: '#fff', 
      fontSize: 16, 
      fontWeight: 'bold' 
  },
});

export default styles;