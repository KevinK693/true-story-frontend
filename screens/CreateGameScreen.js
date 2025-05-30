import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useState } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { addHost } from "../reducers/game";

export default function CreateGameScreen({ navigation }) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const dispatch = useDispatch();

  const [selectedPlayers, setSelectedPlayers] = useState(null);
  const [selectedScenes, setSelectedScenes] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedPublic, setSelectedPublic] = useState(null);
  const [title, setTitle] = useState(null);
  const [image, setImage] = useState(null);
  const [modalPlayersVisible, setModalPlayersVisible] = useState(false);
  const [modalScenesVisible, setModalScenesVisible] = useState(false);
  const [modalImageVisible, setModalImageVisible] = useState(false);

  const user = useSelector((state) => state.user.value);
  const token = user.token;

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
    "https://res.cloudinary.com/dxgix5q4e/image/upload/v1748441445/ramen_yad3oi.png",
    "https://res.cloudinary.com/dxgix5q4e/image/upload/v1748441445/robot_rpdqwe.png",
    "https://res.cloudinary.com/dxgix5q4e/image/upload/v1748441445/fleur-de-lotus_oy0umi.png",
    "https://res.cloudinary.com/dxgix5q4e/image/upload/v1748441445/manette-de-jeu_v8rxnq.png",
    "https://res.cloudinary.com/dxgix5q4e/image/upload/v1748441445/le-football_ylfmnh.png",
    "https://res.cloudinary.com/dxgix5q4e/image/upload/v1748441446/astronaute_oaasse.png",
  ];

  const scenesOptions = [4, 8, 12, 16, 20, 24].map((num) => ({
    label: `${num}`,
    value: num,
  }));

  const playersOptions = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => ({
    label: `${num}`,
    value: num,
  }));

  // Genres disponibles
  const genresOptions = [
    "Action",
    "Aventure",
    "Comédie",
    "Drame",
    "Romance",
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

  const publicOptions = ["Adultes", "Enfants"].map((text) => ({
    label: `${text}`,
    value: text,
  }));

  const pickImage = async () => {
    setModalImageVisible(true);
  };

  // Gestion du changement de public
  const handlePublicChange = (item) => {
    setSelectedPublic(item.value);
    // Si le genre sélectionné n'est plus disponible pour le nouveau public, on le reset
    if (
      selectedGenre &&
      item.value === "Enfants" &&
      !childrenGenres.includes(selectedGenre)
    ) {
      setSelectedGenre(null);
    }
  };

  const handleSubmit = () => {
    if (
      !title ||
      !selectedPlayers ||
      !selectedScenes ||
      !selectedGenre ||
      !image ||
      !selectedPublic
    ) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    // Vérification des genres interdits pour les enfants
    if (selectedPublic === "Enfants") {
      const forbiddenGenres = [
        "Action",
        "Drame",
        "Guerre",
        "Horreur",
        "Science-Fiction",
        "Thriller",
      ];
      if (forbiddenGenres.includes(selectedGenre)) {
        alert(
          "Seuls les genres Aventure, Comédie, Fantastique, Policier et Western sont autorisés pour les enfants"
        );
        return;
      }
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("genre", selectedGenre);
    formData.append("nbPlayers", selectedPlayers);
    formData.append("nbScenes", selectedScenes);

    fetch(`${BACKEND_URL}/games/create/${token}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log("Partie créée avec succès");
          dispatch(addHost(token));
          setTitle(null);
          setImage(null);
          setSelectedPlayers(null);
          setSelectedScenes(null);
          setSelectedGenre(null);
          setSelectedPublic(null);
          navigation.navigate("WaitingForPlayers", { code: data.code });
        } else {
          console.log("Erreur lors de la création du profil :", data.error);
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
          <TouchableOpacity
            onPress={pickImage}
            style={{ position: "relative" }}
          >
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
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Titre de l'histoire"
            placeholderTextColor="#335561"
            onChangeText={(text) => setTitle(text)}
            value={title}
          />
          <Text style={styles.inputLabel}>Titre</Text>
        </View>

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

        {/* Public */}
        <View style={styles.optionContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.text}>Public</Text>
            <TouchableOpacity onPress={() => setModalScenesVisible(true)}>
              <FontAwesome5 name="info-circle" size={22} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <Dropdown
            style={styles.dropdownPublic}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={publicOptions}
            maxHeight={200}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={selectedPublic}
            onChange={(item) => setSelectedPublic(item.value)}
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
            data={genresOptions}
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
          <TouchableWithoutFeedback
            onPress={() => setModalPlayersVisible(false)}
          >
            <View style={styles.modal}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalText}>
                  Le nombre de joueurs détermine combien de participants seront
                  impliqués dans le jeu. Cela influe sur le nombre de
                  propositions à votre disposition.
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
          <TouchableWithoutFeedback
            onPress={() => setModalScenesVisible(false)}
          >
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

        {/* Modal Public */}
        <Modal
          transparent
          visible={modalScenesVisible}
          animationType="fade"
          onRequestClose={() => setModalScenesVisible(false)}
        >
          <TouchableWithoutFeedback
            onPress={() => setModalScenesVisible(false)}
          >
            <View style={styles.modal}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalText}>
                  Le choix du public détermine le ton et le contenu du scénario.
                  Un scénario pour enfants privilégiera des thèmes ludiques,
                  simples et bienveillants. Un scénario pour adultes peut
                  inclure des intrigues plus complexes, des enjeux matures et un
                  ton plus réaliste.
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF1F1",
    alignItems: "center",
    padding: "5%",
    marginTop: "5%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#65558F",
    borderRadius: 10,
    paddingHorizontal: "4%",
    height: 50,
    fontSize: 16,
    fontFamily: "NotoSans_400Regular",
    marginTop: "5%",
    marginBottom: "5%",
    backgroundColor: "white",
    color: "#335561",
  },
  inputContainer: {
    width: "80%",
    position: "relative",
    marginTop: "2%",
  },
  inputLabel: {
    position: "absolute",
    top: -5,
    left: "3%",
    color: "#335561",
    fontSize: 16,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    marginBottom: "4%",
    marginTop: "2%",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginLeft: "9%",
    marginRight: "5%",
    color: "#335561",
  },
  text: {
    fontSize: 18.5,
    color: "#335561",
    fontFamily: "NotoSans_700Bold",
  },
  title: {
    fontSize: 22,
    fontFamily: "NotoSans_700Bold",
    color: "#335561",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: "5%",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: "3%",
    height: 45,
    backgroundColor: "#fff",
    width: "30%",
    justifyContent: "center",
    marginLeft: "10%",
  },
  dropdownPublic: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: "3%",
    height: 45,
    backgroundColor: "#fff",
    width: "50%",
    justifyContent: "center",
    marginLeft: "10%",
  },
  genreContainer: {
    width: "80%",
    marginVertical: "5%",
    alignItems: "center",
  },
  dropdownGenre: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: "3%",
    height: 45,
    marginTop: "2%",
    backgroundColor: "#fff",
    width: "80%",
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
    paddingVertical: "3%",
    borderRadius: 8,
    width: "80%",
    marginTop: "5%",
    height: 50,
    justifyContent: "center",
  },
  buttonText: {
    color: "#EADDFF",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "NotoSans_700Bold",
  },
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: "5%",
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    fontFamily: "NotoSans_400Regular",
    textAlign: "center",
  },
  image: {
    marginVertical: "5%",
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  editIcon: {
    position: "absolute",
    bottom: 10,
    right: 0,
    backgroundColor: "#65558F",
    borderRadius: 5,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  modalImage: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: "5%",
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 40,
  },
});
