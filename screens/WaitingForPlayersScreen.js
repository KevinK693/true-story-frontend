import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";;
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      <Text>Waiting</Text>
        <Image style={styles.user} source={{ uri: avatarUrl }} />
        <TouchableOpacity onPress={() => navigation.navigate("StartingGame")}>
          <Text>Start Game</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  user: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },
  container: {
    flex: 1,
    backgroundColor: "#FBF1F1",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
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
    justifyContent: "space-between",
  },
});
