import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { Dropdown } from "react-native-element-dropdown";
import { useState } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WaitingForPlayers({navigation}) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
  return (
    <SafeAreaView style={styles.container}>
    <Text>
        Waiting
    </Text>
    <TouchableOpacity onPress={() => navigation.navigate("StartingGame")}>
        <Text>Start Game</Text>
    </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});
