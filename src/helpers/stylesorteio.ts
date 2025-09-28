import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: "#444",
  },
  section: {
    marginVertical: 20,
    alignItems: "center",
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scrollBox: {
    maxHeight: 150, // altura limitada (cabe ~5 itens)
    width: "100%",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 10,
  },
  item: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    width: "70%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  resultado: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    color: "#d63384",
  },

  // --- NOVOS ESTILOS PARA HISTÓRICO E TRAVA ---

  // Estilo para o botão de histórico
  historyButton: {
    backgroundColor: "#4a484eff", // Cor escura para destaque
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 25,
    alignSelf: "center",
    minWidth: 150,
  },
  historyButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },

  // Estilo para botão desabilitado (trava de execução)
  buttonDisabled: {
    opacity: 0.6,
  },

  // --- ESTILOS DO MODAL ---
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo escuro transparente
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  historyScroll: {
    maxHeight: 300, // Limita a altura do scroll
    marginBottom: 10,
    paddingRight: 5,
  },
  historyItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  historyText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
  
  // --- NOVO ESTILO: BOTÃO EXCLUIR HISTÓRICO ---
  clearButton: {
    backgroundColor: "#ffc107", // Cor amarela/alerta
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 5, 
    alignItems: "center",
  },
  clearButtonText: {
    color: "#343a40", // Texto escuro
    fontWeight: "bold",
  },

  closeButton: {
    backgroundColor: "#dc3545", // Cor para fechar (vermelho)
    padding: 10,
    borderRadius: 5,
    // Removido o marginTop para que o clearButton fique mais perto
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default styles;