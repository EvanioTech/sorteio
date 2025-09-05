import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundImage: "url('../../assets/images/ger2.png')",
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  image: {
    width: 350,
    height: 300,
  },
    buttonCad: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        width: 300,
        alignItems: 'center',
        marginTop: 20,
        
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 19,
    },
    buttontextdirect: { color: "#007bff", fontSize: 16,},
    imageBackground: { 
      flex: 1,
      resizeMode: 'cover',
      position: 'absolute',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
    },

});


export default styles;