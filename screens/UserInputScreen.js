import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Keyboard,
  Image,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React from "react";
import { Dropdown } from "react-native-element-dropdown";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserInputScreen({ navigation }) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const user = useSelector((state) => state.user.value);

  const handleHistorySubmit = () => {
    navigation.navigate("Profile");
  };
  const handleNextScreen = () => {
    navigation.navigate("Profile");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
  >
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <SafeAreaView style={styles.container}>
        {/* Titre */}
        <View style={styles.topBar}>
          <Image
            source={{
              uri: "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747834382/ovni_qla2gb.png",
            }}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.iconHistory}
            onPress={handleHistorySubmit}
          >
            <FontAwesome5 name="history" size={35} color="#335561" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.textTitle, { textAlign: "center" }]}>
          User Input
        </Text>
        <Text style={[styles.textScene, { textAlign: "center" }]}>
          Scène actuelle: 1/24
        </Text>
        <View style={styles.containerTexteIa}>
          <TextInput
            style={styles.texteIa}
            multiline={true}
            placeholder="Story goes here..."
            value=""
          />
        </View>
        <View style={styles.containerUserInput}>
          <TextInput
           multiline={true}
            style={styles.texteUserInput}
            placeholder="Ecrivez votre histoire..."
          />
        </View>
        {/* Bouton */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleNextScreen}
        >
          <Text style={styles.buttonText}>Envoyer</Text>
        </TouchableOpacity>
      </SafeAreaView>
      </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF1F1",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  logoImage: {
    width: 60,
    height: 60,
  },

  iconHistoryContainer: {
    width: "100%",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  iconHistory: {
    padding: 5,
  },

  textTitle: {
    fontSize: 30,
    fontFamily: "Noto Sans Gujarati",
    color: "#335561",
    fontWeight: "bold",
    paddingTop: 10,
  },
  textScene: {
    fontFamily: "Noto Sans Gujarati",
    fontSize: 20,
    color: "#335561",
    marginTop: 10,
  },

  texteIa: {
    fontSize: 20,
    margin: 30,
    flexWrap: "wrap",
    fontFamily: "Montserrat",
  },
  containerTexteIa: {
    borderRadius: 10,
    backgroundColor: "white",
    height: 300,
    width: "90%",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    // Ombre pour Android
    elevation: 6,
  },

  containerUserInput: {
    borderRadius: 3,
    backgroundColor: "white",
    height: 100,
    marginTop: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Ombre pour Android
    elevation: 6,
  },
  texteUserInput: {
    margin: 12,
    flexWrap: "wrap",
    fontFamily: "Montserrat",
  },
  button: {
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 8,
    width: "50%",
    marginTop: 20,
    marginBottom: 10,
    height: 50,
  },

  buttonText: {
    color: "#EADDFF",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  textNbPropositions: {
    fontFamily: "Noto Sans Gujarati",
    fontSize: 20,
    color: "#335561",
    paddingTop: 20,
  },
});
