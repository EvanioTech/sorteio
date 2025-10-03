import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // --- ESTILOS GERAIS ---
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
  
  // ✅ ATUALIZADO: Nome do resultado final para ser único no código TS
  resultadoFinal: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginTop: 30,
    padding: 15,
    backgroundColor: "#fffbe6", // Fundo de destaque
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ffd700",
  },
  
  // --- NOVOS ESTILOS PARA CONTROLE DE REPETIÇÃO ---
  repetitionControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 10,
    backgroundColor: '#f0f0f0', 
    borderRadius: 8,
    width: '100%',
  },
  repetitionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  infoText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#007bff',
    marginBottom: 15,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#e6f2ff',
    width: '100%',
    fontWeight: 'bold',
  },

  // --- ESTILOS DE HISTÓRICO E TRAVA ---
  historyButton: {
    backgroundColor: "#4a484eff", 
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
  buttonDisabled: {
    opacity: 0.6,
  },

  // --- ESTILOS DO MODAL DE HISTÓRICO ---
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
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
    maxHeight: 300, 
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
  clearButton: {
    backgroundColor: "#ffc107", 
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 5, 
    alignItems: "center",
  },
  clearButtonText: {
    color: "#343a40", 
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#dc3545", 
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  
  // --- ESTILOS DO NOVO MODAL DE CONTAGEM REGRESSIVA ---
  countdownOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)', // Fundo bem escuro
  },
  countdownBox: {
    padding: 50,
    backgroundColor: '#333',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 180,
    minHeight: 180,
  },
  countdownText: {
    fontSize: 72,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 10,
  },
});

export default styles;