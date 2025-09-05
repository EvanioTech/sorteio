import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
     flex: 1,
      
       backgroundColor: "#fff" 
    },
  title: { 
    
     
      marginBottom: 20,
       textAlign: "center",
        
    },
  header: { 
    
     backgroundColor: "#fff",
      padding: 20,
      marginTop: 70,
      borderRadius: '50%',
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      height: 180,
      position: "relative",
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
  },
  divider1: { 
    backgroundColor: '#5f5a5aff',
    flex: 1,
    padding: 20,
    marginBottom: 350,
  },
  divider2: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flex: 1,
    
  },
  info: { 
    fontSize: 22,
     marginBottom: 10,
      textAlign: "center",
       fontWeight: "500" 
    },
  buttonContainer1: { 
    
    position: "absolute",
     bottom: 350,
      left: 80,
     width: "60%",
      alignSelf: "center" 
    },
  buttonContainer2: { 
    position: "absolute",
     bottom: 300,
      left: 80,
     width: "60%",
      alignSelf: "center" 
    },
  logoutButton: { 
    position: "absolute",
     bottom: 240,
      left: 80,
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