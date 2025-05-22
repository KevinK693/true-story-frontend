import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { removeToken, updateAvatar } from "../reducers/user";
import React from "react";
import { Dropdown } from "react-native-element-dropdown";
import { useState } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WaitingForPlayers({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const token = user.token;
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
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
const players = [
  { pseudo: "Zuckerberg", avatar: avatarUrl },
  { pseudo: "Elon", avatar: avatarUrl },
  { pseudo: "Ada", avatar: avatarUrl },
  { pseudo: "Alan", avatar: avatarUrl },
  { pseudo: "Grace", avatar: avatarUrl },
  { pseudo: "Linus", avatar: avatarUrl },
  { pseudo: "Steve", avatar: avatarUrl },
  { pseudo: "Bill", avatar: avatarUrl },
];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.user} source={{ uri: avatarUrl }} />
      </View>
      <View style={styles.middle}>
        <TouchableOpacity onPress={() => navigation.navigate("StartingGame")}>
          <Text style={styles.code}>CODE DE PARTIE : BA7LX</Text>
        </TouchableOpacity>
        <Text style={styles.joueurs}>Nombre de Joueurs : 3/4</Text>
      </View>
      <View style={styles.players}>
     <ScrollView
  style={styles.scrollContainer}
  contentContainerStyle={styles.content}
  showsVerticalScrollIndicator={true}
  persistentScrollbar={true}
>
  {players.map((player, i) => (
    <View key={i} style={styles.player}>
      <Image style={styles.useronline} source={{ uri: player.avatar }} />
      <Text style={styles.item}>{player.pseudo}</Text>
      <View style={styles.rond} />
    </View>
  ))}
</ScrollView>
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => handleSubmit()}
        >
          <Text style={styles.buttonText}>Lancer la partie</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  user: {
    width: 150,
    height: 150,
    borderRadius: 50,
  },
  container: {
    flex: 1,
    backgroundColor: "#FBF1F1",
    alignItems: "center",
  },
  buttonText: {
    color: "#EADDFF",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 35,
  },
  middle: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  code: {
    fontSize: 20,
    fontFamily: "Noto Sans Gujarati",
    color: "#335561",
    fontWeight: "bold",
    marginVertical: 10,
  },
  joueurs: {
    fontSize: 17,
    color: "#335561",
  },
  scrollContainer: {
    maxHeight: 400,
    width: "100%",
    borderRadius: 10,
    marginTop: 25,
    padding: 10,

  },
  content: {
    padding: 10,
  },
 player: {
  flexDirection: "row",
  alignItems: "center",
  marginLeft: 20,
  marginBottom: 20, 
},
  item: {
    fontSize: 25,
    fontFamily: "Noto Sans Gujarati",
    color: "#335561",
    fontWeight: "bold",
    marginBottom: 10,
    marginVertical: 5,
    marginLeft: 10,
  },
  useronline: {
    width: 65,
    height: 65,
    borderRadius: 50,
  },
  rond: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "red",
    marginLeft: 50,
  },
  players: {
    height: 330,
  },
  button: {
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 8,
    width: 260,
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
