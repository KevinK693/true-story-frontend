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
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { removeToken, updateAvatar } from "../reducers/user";

export default function JoinGame({ navigation }) {
  const [code, setCode] = useState("");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const token = user.token;
  const BACKEND_URL = process.env.BACKEND_URL;

  useEffect(() => {
    if (token) {
      fetch(`${BACKEND_URL}/users/${token}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.result && data.user.avatar) {
            // Si l'avatar du serveur est différent de celui dans Redux, mettre à jour Redux
            if (data.user.avatar !== user.avatar) {
              dispatch(updateAvatar(data.user.avatar));
            }
          } else {
            console.log("Erreur de récupération de l'image");
          }
        });
    }
  }, [token]);

  const avatarUrl = user.avatar;


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image style={styles.user} source={{ uri: avatarUrl }} />
        </TouchableOpacity>
        
      </View>
      <View style={{ alignItems: "center", marginTop: 100 }}>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF1F1",
    padding: 20,
  },
  user: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
