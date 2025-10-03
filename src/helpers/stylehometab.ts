import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // --- ESTILOS PRINCIPAIS DA TELA ---
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    position: "absolute",
    top: 70,
  },
  subtitle: {
    fontSize: 24,
    color: "#666",
    marginBottom: 100,
  },
  
  // --- ESTILOS DOS BOTÕES PRINCIPAIS ---
  button1: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
  },
  button2: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: "60%",
  },
  buttonText1: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonText2: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  
  // --- ESTILOS DO MODAL ---
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  
  // ✅ NOVO ESTILO: Título do Modal
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15, // Adicionado espaço
    textAlign: "center",
    color: "#333",
  },
  
  // ✅ AJUSTADO: Adicionada margem inferior para separar inputs no modal de números
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10, 
    paddingHorizontal: 10,
  },
  
  // --- BOTÕES DENTRO DO MODAL ---
  addButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    width: "100%", // Ocupa a largura total do modalContent
    marginTop: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 6,
    width: "100%", // Ocupa a largura total do modalContent
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default styles;