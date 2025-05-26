import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StartingGameScreen({ navigation }) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const game = useSelector((state) => state.game.value);
  const code = game.code;
  const [sceneText, setSceneText] = useState("");
  const [sceneNb, setSceneNb] = useState("");
  const [propositionsNb, setPropositionsNb] = useState([]);
  const [playersNb, setPlayersNb] = useState([]);
  const [totalScenesNb, setTotalScenesNb] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/games/game/${code}`)
      .then((response) => {
        if (!response.ok) {
          console.error(
            `Erreur HTTP: ${response.status} ${response.statusText}`
          );
          return response.text().then((text) => {
            console.log("Réponse reçue :", text);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          });
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("La réponse n'est pas du JSON:", contentType);
          return response.text().then((text) => {
            console.log("Contenu reçu :", text);
            throw new Error("Réponse non-JSON reçue");
          });
        }

        return response.json();
      })
      .then((data) => {
        if (data.result) {
          console.log("Données de la partie :", data);
          setPlayersNb(data.game.nbPlayers);
          setTitle(data.game.title);
          setTotalScenesNb(data.game.nbScenes);
          setImage(data.game.image);
        } else {
          console.error(
            "Erreur côté backend (game):",
            data.error || "Structure de données inattendue"
          );
          console.log("Structure reçue :", data);
        }
      })
      .catch((error) => {
        console.error("Erreur lors du fetch du jeu :", error);
        console.log("Type d'erreur :", error.constructor.name);
      });

    // Récupérer la scène
    fetch(`${BACKEND_URL}/scenes/code/${code}/scene/1`)
      .then((response) => response.json())
      .then((data) => {
        console.log("DATA DU FETCH (scène):", data);
        if (data.result) {
          setSceneText(data.data.text);
          setSceneNb(data.data.sceneNumber);
          setPropositionsNb(data.data.propositions.length);
        } else {
          console.error(
            "Erreur côté backend (scène):",
            data.error || "Structure de données inattendue"
          );
          console.log("Structure reçue :", data);
        }
      })
      .catch((error) => {
        console.error("Erreur lors du fetch de la scène :", error);
      });
  }, []);

  const handleHistorySubmit = () => {
    navigation.navigate("GameHistory");
  };
  const handleNextScreen = () => {
    navigation.navigate("UserInput");
  };

  return (
      <SafeAreaView style={styles.container}>
        {/* topBar = La barre du haut qui contient le logo et l'icone d'historique */}
        <View style={styles.topBar}>
          <Image
            source={{
              uri: image,
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
        <Text style={[styles.textTitle, { textAlign: "center" }]}>{title}</Text>
        <Text style={[styles.textScene, { textAlign: "center" }]}>
          Scène actuelle: {sceneNb}/{totalScenesNb}
        </Text>
        {/* Le prompt IA avec son container */}
        <View style={styles.containerTexteIa}>
          <ScrollView style={{flex: 1}}>
            <Text style={styles.texteIa}>{sceneText}</Text>
          </ScrollView>
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
          Nombre de propositions: {propositionsNb}/{playersNb}
        </Text>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF1F1",
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
    fontSize: 18,
    margin: 30,
    flexWrap: "wrap",
    fontFamily: "Montserrat",
  },
  containerTexteIa: {
    borderRadius: 10,
    backgroundColor: "white",
    width: "90%",
    marginTop: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    // Ombre pour Android
    elevation: 6,
    flex: 1,
    maxHeight: 300,
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
