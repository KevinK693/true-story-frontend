import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

export default function JoinGame() {
  <View>
    <Image style={styles.user} source={require("../assets/avatar.png")} />
    <Image
      style={styles.tagSquare}
      source={require("../assets/tag_square.png")}
    />
    <Text style={styles.textbutton}>REJOINDRE UNE PARTIE</Text>
    <Text style={styles.textbutton}>ENTREZ LE CODE</Text>
    <TextInput
      style={styles.input}
      placeholder="Code de la partie"
      placeholderTextColor="#000"
      onChangeText={(text) => setCode(text)}
    />
    <TouchableOpacity
      onPress={() => navigation.navigate("Games")}
      style={styles.button}
      activeOpacity={0.8}
    >
      <Text style={styles.textbutton}>VALIDER</Text>
    </TouchableOpacity>
  </View>;
}

StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  user: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  tagSquare: {
    width: 50,
    height: 50,
    position: "absolute",
    top: 20,
    left: 20,
  },
  textbutton: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
})
