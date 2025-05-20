import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
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
      {/* Logo */}
      <View>
        <Image style={styles.user} source={require("../assets/avatar.png")} />
        <Image source={require("../assets/tag_square.png")} />
      </View>

      {/* Titre */}
      <TextInput
        placeholder="Ecrivez un titre..."
        onChangeText={(value) => setTitle(value)}
        style={styles.input}
      />

      {/* Nombre de joueurs */}
      <View style={styles.nbr}>
        <View style={styles.nbrWithicon}>
          <Text style={styles.text}>Nombre de joueurs</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
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
      <View style={styles.nbr}>
        <View style={styles.nbrWithicon}>
          <Text style={styles.text}>Nombre de scènes</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
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
      <View>
        <Text style={styles.text}>Choisir un genre</Text>
        <Dropdown
          style={styles.dropdowngenre}
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
                impliqués dans le jeu. Cela peut influencer la durée et la
                complexité.
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
  user: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  nbr: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 280,
    marginBottom: 15,
    marginEnd: 30,
  },
  nbrWithicon: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 5,
    marginRight: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#263238",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "Noto Sans Gujarati",
    marginBottom: 20,
    backgroundColor: "white",
    width: 280,
  },
  text: {
    fontSize: 20,
    fontFamily: "Noto Sans Gujarati",
    color: "335561",
    fontWeight: "bold",
    marginBottom: 5,
    alignSelf: "flex-start",
    marginRight: 15,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 20,
    backgroundColor: "#fff",
    width: 100,
    justifyContent: "center",
  },
  dropdowngenre: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 20,
    backgroundColor: "#fff",
    width: 160,
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
    marginTop: 20,
    width: 280,
    alignItems: "center",
  },
  textbutton: {
    fontFamily: "Noto Sans Gujarati",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalView: {
    alignItems: "flex-end",
    marginBottom: 5,
    width: 20,
  },
  textButton: {
    fontSize: 12,
    color: "#6A4C93",
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
