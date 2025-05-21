import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JoinGame({ navigation }) {
  const [code, setCode] = useState("");

  return (
    <SafeAreaView style={styles.container}>
    
      <Image style={styles.user} source={require("../assets/avatar.png")} />
      
      <Text style={styles.textJoin}>Rejoindre une partie</Text>
      <Text style={styles.textEnter}>Entrez un code</Text>
      <TextInput
        style={styles.input}
        placeholder="Code de la partie"
        placeholderTextColor="#000"
        onChangeText={(text) => setCode(text)}
        value={code}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate()}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Rejoindre</Text>
      </TouchableOpacity>
    </SafeAreaView>  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FBF1F1",
    padding: 20,
  },
  user: {
    width: 65,
    height: 65,
    borderRadius: 50,
    marginBottom: 20,
    position: "absolute",
    top: 70,
    left:40,
  },
  textJoin: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#65558F",
    marginBottom: 10,
  },
  textEnter: {
    fontSize: 20,
    color: "#65558F",
    marginBottom: 20,
    fontFamily: "Noto Sans Gujarati",
  },
  input: {
    borderWidth: 1,
    borderColor: "#263238",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
    fontFamily: "Noto Sans Gujarati",
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: "white",
    width: "80%",
  },
  button: {
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 8,
    width: "80%",
    marginTop: 50,
    marginBottom: 10,
    height: 50,
  },
  buttonText: {
    color: "#EADDFF",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
});