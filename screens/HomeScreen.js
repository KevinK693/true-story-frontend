import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({ navigation }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const user = useSelector((state) => state.user.value);
  const token = user.token;
  const BACKEND_URL = "http:///10.0.3.229:3000";

  useEffect(() => {
    fetch(`${BACKEND_URL}/users/${token}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setAvatarUrl(data.user.avatar);
        } else {
          console.log("Erreur de récupération de l'image");
        }
      })
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image style={styles.user} source={{uri: avatarUrl}} />
      </View>
      <View>
        <Image style={styles.image} source={require("../assets/logo.png")} />
      </View>
      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Games")}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textbutton}>NOUVELLE PARTIE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          // onPress={() => handleSubmit()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textbutton}>REJOINDRE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          // onPress={() => handleSubmit()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textbutton}>CONTINUER</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF1F1",
  },
  user: {
    width: 55,
    height: 55,
    borderRadius: 50,
    alignSelf: "left",
    marginTop: 40,
    marginLeft: 30,
  },
  image: {
    width: 300,
    height: 150,
    resizeMode: "contain",
    alignSelf: "center",
    marginVertical: 20,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#65558F",
    paddingHorizontal: 20,
    borderRadius: 6,
    marginVertical: 20,
    marginHorizontal: 45,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
  },
  textbutton: {
    color: "#EADDFF",
    fontFamily: "inter",
    fontSize: 25,
    fontWeight: "bold",
  },
});
