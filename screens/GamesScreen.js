import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  TouchableWithoutFeedback
  
} from "react-native";
import React from "react";
import { Dropdown } from "react-native-element-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useState, useEffect } from "react";

export default function GamesScreen() {
  const [selectedPlayers, setSelectedPlayers] = useState(null);
  const [selectedScenes, setSelectedScenes] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [title, setTitle] = useState(null);
 
  const [modalPlayersVisible, setModalPlayersVisible] = useState(false);
  const [modalScenesVisible, setModalScenesVisible] = useState(false);

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

  return (
    <View style={styles.container}>
      {/* User */}
      <View style={styles.avatarContainer}>
        <Image style={styles.user} source={require("../assets/avatar.png")} />
        <Image style={styles.tagSquare} source={require("../assets/tag_square.png")} />
      </View>

      {/* Titre */}
      <TextInput
        placeholder="Ecrivez un titre..."
        onChangeText={(value) => setTitle(value)}
        style={styles.input}
      />

      {/* Nombre de joueurs */}
      <View style={styles.optionContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.text}>Nombre de joueurs</Text>
          <TouchableOpacity onPress={() => setModalPlayersVisible(true)}>
            <FontAwesome name="info-circle" size={18} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={playersOptions}
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder="Select"
          value={selectedPlayers}
          onChange={(item) => setSelectedPlayers(item.value)}
        />
      </View>

      {/* Nombre de scènes */}
      <View style={styles.optionContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.text}>Nombre de scènes</Text>
          <TouchableOpacity onPress={() => setModalScenesVisible(true)}>
            <FontAwesome name="info-circle" size={18} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={scenesOptions}
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder="Select"
          value={selectedScenes}
          onChange={(item) => setSelectedScenes(item.value)}
        />
      </View>

      {/* Genre */}
      <View style={styles.genreContainer}>
        <Text style={[styles.text, { textAlign: 'center' }]}>Choisir un genre</Text>
        <Dropdown
          style={styles.dropdownGenre}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={genresOPtions}
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder="Select"
          value={selectedGenre}
          onChange={(item) => setSelectedGenre(item.value)}
        />
      </View>

      {/* Bouton */}
      <TouchableOpacity style={styles.button} activeOpacity={0.8}>
        <Text style={styles.textbutton}>SUIVANT</Text>
      </TouchableOpacity>

      {/* Modal Joueurs */}
      <Modal
        transparent
        visible={modalPlayersVisible}
        animationType="fade"
        onRequestClose={() => setModalPlayersVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalPlayersVisible(false)}>
          <View style={styles.modal}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>
                Le nombre de joueurs détermine combien de participants seront
                impliqués dans le jeu. Cela influe sur le nombre de proposition à votre disposition.
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal Scènes */}
      <Modal
        transparent
        visible={modalScenesVisible}
        animationType="fade"
        onRequestClose={() => setModalScenesVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalScenesVisible(false)}>
          <View style={styles.modal}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>
                Le nombre de scènes correspond aux étapes ou moments clés du
                scénario. Plus il y a de scènes, plus le jeu est long.
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF1F1",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarContainer: {
    position: "absolute",
    top: 90, 
    marginBottom: 50,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  user: {
    width: 70,
    height: 70,
  },
  tagSquare: {
    position: "absolute",
    width: 25,
    height: 25,
    marginLeft: 30,
    marginTop: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#263238",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "Noto Sans Gujarati",
    marginTop: 150, 
    marginBottom: 40,
    backgroundColor: "white",
    width: 280,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 280,
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, 
  },
  icon: {
    marginLeft: 5,
    marginRight: 10, 
    color: "#335561",
  },
  text: {
    fontSize: 20,
    fontFamily: "Noto Sans Gujarati",
    color: "#335561",
    fontWeight: "bold",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
    backgroundColor: "#fff",
    width: 100,
    justifyContent: "center",
    marginLeft: 40, 
  },
  genreContainer: {
    width: 280,
    marginBottom: 20,
    alignItems: "center",
  },
  dropdownGenre: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
    marginTop: 10,
    backgroundColor: "#fff",
    width: 200,
    justifyContent: "center",
  },
  placeholderStyle: {
    color: "#999",
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#6A4C93",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 80,
    width: 280,
    height: 70,
    alignItems: "center",
    justifyContent: "center", 
  },
  textbutton: {
    fontFamily: "Noto Sans Gujarati",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    fontFamily: "Noto Sans Gujarati",
    textAlign: "center",
  },
});