import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addFirstScene } from "../reducers/scene";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StartingGameScreen({ navigation }) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const dispatch = useDispatch();

  const [sceneText, setSceneText] = useState("");
  const [propositionsNb, setPropositionsNb] = useState([]);
  const [playersNb, setPlayersNb] = useState([]);
  const [totalScenesNb, setTotalScenesNb] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [userText, setUserText] = useState("");
  const [loading, setLoading] = useState(true);

  const game = useSelector((state) => state.game.value);
  const code = game.code;
  const nbScenes = game.nbScenes;

  const user = useSelector((state) => state.user.value);
  const token = user.token;

  const scene = useSelector((state) => state.scene.value);
  const sceneNumber = scene.sceneNumber;

  useEffect(() => {
    fetch(`${BACKEND_URL}/games/game/${code}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setPlayersNb(data.game.nbPlayers);
          setTitle(data.game.title);
          setTotalScenesNb(data.game.nbScenes);
          setImage(data.game.image);
        } else {
          console.error(
            "Erreur côté backend (game):",
            data.error || "Structure de données inattendue"
          );
        }
      });

    // Récupérer la scène
    const interval = setInterval(() => {
      fetch(`${BACKEND_URL}/scenes/code/${code}/scene/${sceneNumber}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            setLoading(false);
            setSceneText(data.data.text);
            setPropositionsNb(data.data.propositions.length);
            if (sceneNumber === 1) {
              dispatch(addFirstScene(data.data.text));
            }
          } else {
            console.error(
              "Erreur côté backend (scène):",
              data.error || "Structure de données inattendue"
            );
          }
        });
    }, 3000);
    return () => clearInterval(interval);
  }, [sceneNumber]);

  const handleHistorySubmit = () => {
    navigation.navigate("GameHistory");
  };
  const handleNextScreen = () => {
    fetch(`${BACKEND_URL}/scenes/proposition/${code}/${sceneNumber}/${token}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: userText,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setUserText("");
          navigation.replace("Voting");
        } else {
          console.error("Erreur lors de l'envoi du texte :", data.error);
        }
      });
  };

  const handlePlayersList = () => {
    navigation.navigate("PlayerList", { code: code });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handlePlayersList}>
            <Image
              source={{
                uri: image,
              }}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconHistory}
            onPress={handleHistorySubmit}
          >
            <FontAwesome5 name="history" size={35} color="#335561" />
          </TouchableOpacity>
        </View>
        <Text style={[styles.textTitle, { textAlign: "center" }]}>{title}</Text>
        <Text style={[styles.textScene, { textAlign: "center" }]}>
          Scène actuelle: {sceneNumber}/{totalScenesNb}
        </Text>
        <View style={styles.containerTexteIa}>
          <ScrollView style={{ flex: 1 }}>
            {loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#65558F" />
              </View>
            ) : (
              <Text style={styles.texteIa}>{sceneText}</Text>
            )}
          </ScrollView>
        </View>
        {clicked ? (
          <View style={{ width: "100%", alignItems: "center" }}>
            <View style={styles.containerUserInput}>
              <ScrollView>
                {sceneNumber === nbScenes - 1 ? (
                  <TextInput
                    multiline={true}
                    style={styles.texteUserInput}
                    placeholder="Écrivez la suite de l'histoire..."
                    value={userText}
                    onChangeText={setUserText}
                    maxLength={280}
                  />
                ) : (
                  <TextInput
                    multiline={true}
                    style={styles.texteUserInput}
                    placeholder="Écrivez la fin de l'histoire..."
                    value={userText}
                    onChangeText={setUserText}
                    maxLength={280}
                  />
                )}

                <Text style={styles.maxLength}>{userText.length}/280</Text>
              </ScrollView>
            </View>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={handleNextScreen}
            >
              <Text style={styles.buttonText}>Envoyer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ width: "100%", alignItems: "center" }}>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => setClicked(true)}
            >
              {sceneNumber === nbScenes - 1 ? (
                <Text style={styles.buttonText}>Proposer une fin</Text>
              ) : (
                <Text style={styles.buttonText}>Proposer une suite</Text>
              )}
            </TouchableOpacity>
            <Text style={[styles.textNbPropositions, { textAlign: "center" }]}>
              Nombre de propositions: {propositionsNb}/{playersNb}
            </Text>
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    // Ombre pour Android
    elevation: 6,
    flex: 1,
    maxHeight: "38%",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 8,
    width: "80%",
    marginTop: 30,
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
  texteUserInput: {
    fontSize: 15,
    margin: 12,
    fontFamily: "Montserrat",
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
  maxLength: {
    position: "absolute",
    bottom: "-15",
    right: 8,
    fontSize: 12,
    color: "#888",
    fontFamily: "Montserrat",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
