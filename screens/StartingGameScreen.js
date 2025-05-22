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
} from "react-native";
import React from "react";
import { Dropdown } from "react-native-element-dropdown";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StartingGameScreen({ navigation }) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const user = useSelector((state) => state.user.value);

  const handleHistorySubmit = () => {
    navigation.navigate("Profile");
  };
  const handleNextScreen = () => {
    navigation.navigate("UserInput");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* topBar = La barre du haut qui contient le logo et l'icone d'historique */}
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
        {/* fin de la topBar */}
        <Text style={[styles.textTitle, { textAlign: "center" }]}>
          The Walking Fetch
        </Text>
        <Text style={[styles.textScene, { textAlign: "center" }]}>
          Scène actuelle: 1/24
        </Text>
        {/* Le prompt IA avec son container */}
        <View style={styles.containerTexteIa}>
          <TextInput
            style={styles.texteIa}
            multiline={true} // Permet de faire un texte sur plusieurs lignes
            editable={false} // Pour qu'aucune modification ne soit possible
            placeholder="Story goes here..."
            value="Ce matin, Kevin a décidé de faire du sport. Il a commencé par s’étirer... en tombant du lit. Premier succès. Ensuite, il a couru... après son chien qui avait volé sa chaussette. Puis, motivé, il a tenté une séance de yoga avec une vidéo YouTube. Tout allait bien jusqu’à ce que sa grand-mère entre et lui demande pourquoi il faisait une offrande au canapé. Après 10 minutes en position chien tête en bas, il s’est rendu compte qu’il avait coincé son short dans le ventilateur. Résultat : le chat traumatisé, la plante verte décapitée, et Kevin jurant solennellement de ne plus jamais écouter son corps, parce que visiblement, le sien veut juste des chips et une sieste."
          />
        </View>
        {/* Bouton */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleNextScreen}
        >
          <Text style={styles.buttonText}>Proposer une suite</Text>
        </TouchableOpacity>
        <Text style={[styles.textNbPropositions, { textAlign: "center" }]}>
          Nombre de propositions: 2/4
        </Text>
      </SafeAreaView>
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

  // La barre du haut qui contient le logo et l'icone d'historique
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
  // Le nom de l'histoire
  textTitle: {
    fontSize: 30,
    fontFamily: "Noto Sans Gujarati",
    color: "#335561",
    fontWeight: "bold",
    paddingTop: 10,
  },

  // Compteur de scènes
  textScene: {
    fontFamily: "Noto Sans Gujarati",
    fontSize: 20,
    color: "#335561",
    marginTop: 10,
  },
  // Prompt de l'IA
  texteIa: {
    fontSize: 18,
    margin: 30,
    flexWrap: "wrap",
    fontFamily: "Montserrat",
  },
  containerTexteIa: {
    borderRadius: 10,
    backgroundColor: "white",
    height: 300,
    width: "90%",
    marginTop: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    // Ombre pour Android
    elevation: 6,
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
  textNbPropositions: {
    fontFamily: "Noto Sans Gujarati",
    fontSize: 20,
    color: "#335561",
    paddingTop: 20,
  },
});
