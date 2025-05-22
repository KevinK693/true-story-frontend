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
import { useDispatch } from "react-redux";
import { updateGame } from "../reducers/game";

export default function CreateGameScreen({ navigation }) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const dispatch = useDispatch();
  const [selectedPlayers, setSelectedPlayers] = useState(null);
  const [selectedScenes, setSelectedScenes] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const [title, setTitle] = useState(null);
  const [image, setImage] = useState(null);

  const [modalPlayersVisible, setModalPlayersVisible] = useState(false);
  const [modalScenesVisible, setModalScenesVisible] = useState(false);
  const [modalImageVisible, setModalImageVisible] = useState(false);

  const images = [
    "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747834158/science-fiction_gniu4v.png",
    "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747834158/fantome_adnq8j.png",
    "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747834158/chapeau-de-cowboy_d1bafb.png",
    "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747834157/dragon_xabusn.png",
    "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747834157/reaction-chimique_ghl9fu.png",
    "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747834382/ovni_qla2gb.png",
    "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747834381/chalet_sa1x2p.png",
    "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747834382/comme_qtwh8d.png",
    "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747834381/molecule_zjn0wj.png",
  ];

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
    console.log(selectedPlayers);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("genre", selectedGenre);
    formData.append("nbPlayers", selectedPlayers);
    formData.append("nbScenes", selectedScenes);

    fetch(`${BACKEND_URL}/games/create`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log('Partie créée avec succès', data.result);
          dispatch(updateGame(data));
          setTitle(null);
          setImage(null);
          setSelectedPlayers(null);
          setSelectedScenes(null);
          setSelectedGenre(null);
          console.log(data.code)
          navigation.navigate("WaitingForPlayers", { code: data.code });
        } else {
          console.log("Erreur lors de la création du profil :", data.error);
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* User */}
      <Text style={styles.title}>Choisissez une image pour votre partie</Text>
      {image ? (
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={styles.editIcon}>
            <FontAwesome5 name="edit" size={16} color="#EADDFF" />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={pickImage} style={{ position: "relative" }}>
          <Image
            source={require("../assets/emptyAvatar.png")}
            style={styles.image}
          />
          <View style={styles.editIcon}>
            <FontAwesome5 name="edit" size={16} color="#EADDFF" />
          </View>
        </TouchableOpacity>
      )}

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
            <FontAwesome5 name="info-circle" size={22} style={styles.icon} />
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
            <FontAwesome5 name="info-circle" size={22} style={styles.icon} />
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
        <Text style={[styles.text, { textAlign: "center" }]}>
          Choisir un genre
        </Text>
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
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => handleSubmit()}
      >
        <Text style={styles.buttonText}>Suivant</Text>
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
                impliqués dans le jeu. Cela influe sur le nombre de propositions
                à votre disposition.
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

      {/* Modal Image */}
      <Modal
        transparent
        visible={modalImageVisible}
        animationType="fade"
        onRequestClose={() => setModalImageVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalImageVisible(false)}>
          <View style={styles.modal}>
            <View style={styles.modalImage}>
              {images.map((imgUri, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setImage(imgUri);
                    setModalImageVisible(false);
                  }}
                >
                  <Image
                    source={{ uri: imgUri }}
                    style={{
                      width: 70,
                      height: 70,
                      margin: 10,
                    }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "95%",
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
  title: {
    fontSize: 22,
    fontFamily: "Noto Sans Gujarati",
    color: "#335561",
    fontWeight: "bold",
    textAlign: "center",
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
    width: "50%",
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
  image: {
    marginVertical: 20,
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  editIcon: {
    position: "absolute",
    bottom: 20,
    right: 0,
    backgroundColor: "#65558F",
    borderRadius: 5,
    paddingRight: 2,
    paddingTop: 2,
    paddingLeft: 4,
    paddingBottom: 4,
  },
  modalImage: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 20,
  },
});
