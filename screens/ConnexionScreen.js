import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { useState } from "react";
import InscriptionScreen from "./InscriptionScreen";

export default function ConnexionScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} />
      <Text>Se connecter</Text>
      <View style={styles.inputContainer}>
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
      <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
      <TouchableOpacity onPress={() => navigation.navigate("TabNavigator")} style={styles.button} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Connexion</Text>
      </TouchableOpacity>
      <Text>Ou connectez-vous via un autre compte</Text>
      <View style={styles.accountsContainer}></View>
      <TouchableOpacity onPress={() => navigation.navigate("InscriptionScreen")} style={styles.button} activeOpacity={0.8}>
        <Text>Pas encore de compte ? Inscrivez-vous</Text>
      </TouchableOpacity> 
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF1F1",
    alignItems: "center",
    justifyContent: "center",
  },
});