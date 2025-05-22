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

export default function StartingGameScreen() {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const [selectedPlayers, setSelectedPlayers] = useState(null);
  const [selectedScenes, setSelectedScenes] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [title, setTitle] = useState(null);
  const [image, setImage] = useState(null);

  const [modalPlayersVisible, setModalPlayersVisible] = useState(false);
  const [modalScenesVisible, setModalScenesVisible] = useState(false);
  const [modalImageVisible, setModalImageVisible] = useState(false);

  const scenesOptions = [4, 8, 12, 16, 20, 24].map((num) => ({
    label: `${num}`,
    value: num,
  }));

  const playersOptions = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => ({
    label: `${num}`,
    value: num,
  }));

  const genresOPtions = [
    "Action",
    "Aventure",
    "Comédie",
    "Comédie dramatique",
    "Drame",
    "Fantastique",
    "Guerre",
    "Horreur",
    "Policier",
    "Science-Fiction",
    "Thriller",
    "Western",
  ].map((text) => ({
    label: `${text}`,
    value: text,
  }));

  const pickImage = async () => {
    setModalImageVisible(true);
  };

  const handleSubmit = () => {
    if (!title || !selectedPlayers || !selectedScenes || !selectedGenre) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    const gameData = {
      title: title,
      nbPlayers: selectedPlayers,
      nbScenes: selectedScenes,
      genre: selectedGenre,
    };

    console.log("DATA GAME =>", gameData);

    fetch(`${BACKEND_URL}/games/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Réponse du backend :", data);
      })
      .catch((error) => {
        console.error("Erreur lors de la requête :", error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Titre */}
      <View style={styles.genreContainer}>
        <Text style={[styles.textTitle, { textAlign: "center" }]}>Titre</Text>
        <Text style={[styles.textScene, { textAlign: "center" }]}>
          Scène actuelle:
        </Text>
        <View style={styles.containerTexteIa}>
          <Text style={styles.texteIa}>
          
          </Text>
        </View>
      </View>
      {/* Bouton */}
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Proposer une suite</Text>
      </TouchableOpacity>
      <Text style={[styles.textNbPropositions, { textAlign: "center" }]}>
        Nombre de propositions:
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF1F1",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
  },

  textTitle: {
    fontSize: 40,
    fontFamily: "Noto Sans Gujarati",
    color: "#335561",
    fontWeight: "bold",
  },
  textScene: {
    fontFamily: "Noto Sans Gujarati",
    fontSize: 20,
    color: "#335561",
    marginTop: 10,
  },

  texteIa: {
    fontSize: 20,
   
  },
  containerTexteIa: {
    borderRadius: 10,
    backgroundColor: "white",
    height: 300,
    width: 350,
   marginTop: 50,
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
