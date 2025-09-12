import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
     flex: 1,
     
      
       backgroundColor: "#fff", 
      
        
         
    },
  title: { 
    
     
      marginBottom: 20,
       textAlign: "center",
        
    },
  header: { 
  backgroundColor: "#fff",
  position: "absolute",
  top: 80,     // controla a distância do topo
  left: "50%",  // centralizar horizontalmente
  transform: [{ translateX: -150 }], // metade da largura p/ centralizar
  width: 300,
  height: 200,
  justifyContent: "center",
  alignItems: "center",
  zIndex: 10,   // garante que fica acima das outras views
  borderRadius: '50%',
  borderBottomLeftRadius: 10,
  borderBottomRightRadius: 10,
  
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 2,
  shadowRadius: 2,
  elevation: 15,
},
  divider1: { 
    backgroundColor: '#5f5a5aff',
    flex: 1,
    
    
  },
  divider2: {
    backgroundColor: '#fff',
    flex: 2,
    paddingTop: 50,
    
  },
  info: { 
    fontSize: 22,
     marginBottom: 10,
      textAlign: "center",
       fontWeight: "500" 
    },
  buttonContainer1: { 
    
    
    
     width: "60%",
      alignSelf: "center", 
      //marginBottom: 200
      marginTop: 70
    },
  buttonContainer2: { 
    marginTop: 60,
     
     width: "60%",
      alignSelf: "center" 
    },
  logoutButton: { 
    
    justifyContent: "center",
     alignSelf: "center",
      marginTop: 80,
   
    width: "60%",
    
  },
  button: { 
    backgroundColor: "red",
     padding: 10,
     borderRadius: 5,
     alignItems: "center",
      
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  }

});

export default styles;