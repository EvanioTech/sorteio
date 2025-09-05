import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
     flex: 1,
      padding: 20,
       backgroundColor: "#fff" 
    },
  title: { 
    fontSize: 24,
     fontWeight: "bold",
      marginBottom: 20,
       textAlign: "center",
        marginTop: 170 
    },
  info: { 
    fontSize: 22,
     marginBottom: 10,
      textAlign: "center",
       fontWeight: "500" 
    },
  buttonContainer: { 
    marginVertical: 10,
     width: "60%",
      alignSelf: "center" 
    },
  logoutButton: { 
    marginTop: 20,
     width: "60%",
      alignSelf: "center" 
    },
  button: { 
    backgroundColor: "red",
     padding: 10,
     borderRadius: 5,
     alignItems: "center",
     marginVertical: 5
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  }

});

export default styles;