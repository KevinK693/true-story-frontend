import { StyleSheet, Text, View, Image, TextInput } from "react-native";
import React from "react";

export default function ConnexionScreen() {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} />
      <Text>Se connecter</Text>
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