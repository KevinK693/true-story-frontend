import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConnexionScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("../assets/logo.png")} />
      <Text style={styles.title}>S'inscrire</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nom d'utilisateur"
          placeholderTextColor="#A0A0A0"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#A0A0A0"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#A0A0A0"
          secureTextEntry
        />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("TabNavigator")}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Connexion</Text>
      </TouchableOpacity>
      <Text style={styles.text}>Ou connectez-vous via un autre compte</Text>
      <View style={styles.accountsContainer}></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF1F1",
    alignItems: "center",
    marginTop: 40,
    padding: 20
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginTop: 40,
    color: "#335561",
  },
  button: {
    backgroundColor: '#65558F',
    padding: 10,
    borderRadius: 8,
    width: '100%', 
    marginTop: 40,
    marginBottom: 20,
    height: 50
  }, 
  buttonText: {
    color: '#EADDFF',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center'
  },
  text: {
    fontSize: 16,
    color: "#335561",
  }, 
  inputContainer: {
    width: '80%',
    marginVertical: 20
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
    fontSize: 16,
    color: "#335561",
    height: 50
  },
  link: {
    fontSize: 16,
    color: "#335561",
    textDecorationLine: "underline",
  }, 
  accountsContainer: {
    flexDirection: "row",
    height: 100
  }
});
