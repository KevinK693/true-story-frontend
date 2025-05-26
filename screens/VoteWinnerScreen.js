import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { updateScene } from "../reducers/scene";

export default function VoteWinnerScreen({ navigation }) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
  const dispatch = useDispatch()
  const game = useSelector((state) => state.game.value);
  const code = game.code;
  const user = useSelector((state) => state.user.value);
  const token = user.token
  const scene = useSelector((state) => state.scene.value)
  const sceneNumber = scene.sceneNumber
  const [gameImage, setGameImage] = useState(null);
  const [gameTitle, setGameTitle] = useState("");
  const [sceneWinner, setSceneWinner] = useState("");

  //Récupération de l'image de la partie
  useEffect(() => {
    fetch(`${BACKEND_URL}/games/game/${code}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setGameImage(data.game.image);
          setGameTitle(data.game.title);
        } else {
          console.log("Erreur de récupération des données utilisateur");
        }
      });

      fetch(`${BACKEND_URL}/scenes/code/${code}/scene/${sceneNumber}`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.result) {
          console.log(data.data.propositions)
        }
      })
  }, []);

  const handleResumeGame = () => {
    navigation.navigate("StartingGame")
    dispatch(updateScene())
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Image
          source={{
            uri: gameImage,
          }}
          style={styles.gameImage}
        />
        <TouchableOpacity
          style={styles.iconHistory}
          onPress={() => navigation.navigate("GameHistory")}
        >
          <FontAwesome5 name="clock" size={35} color="#335561" />
        </TouchableOpacity>
      </View>
      <Text style={styles.gameTitle}>{gameTitle}</Text>
      <Text style={styles.subtitle}>Vainqueur du vote</Text>

      <View style={styles.propositionsContainer}>
        <Image style={styles.winnerAvatar} source={{ uri: user.avatar }} />
        <Text style={styles.winnerName}>Winner</Text>
        <Text style={styles.propositionNumber}>Proposition #2</Text>
        <Text style={styles.voteNumber}>Votes : 3</Text>
        <View style={styles.containerProposition}>
          <Text style={styles.proposition}>Proposition choisie</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => handleResumeGame()}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Continuer</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF1F1",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    padding: 20,
  },
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gameImage: {
    width: 60,
    height: 60,
  },
  iconHistory: {
    padding: 5,
  },
  gameTitle: {
    fontSize: 30,
    fontFamily: "NotoSans_700Bold",
    color: "#335561",
    paddingTop: 10,
    textAlign: "center",
  },
  gameScene: {
    fontFamily: "Noto Sans Gujarati",
    fontSize: 20,
    color: "#335561",
    marginTop: 10,
    textAlign: "center",
  },
  proposition: {
    fontSize: 16,
    fontFamily: "Montserrat",
    color: "#335561",
    padding: 15,
  },
  containerProposition: {
    borderRadius: 10,
    backgroundColor: "white",
    height: 150,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    marginVertical: 10,
  },
  propositionsContainer: {
    marginVertical: 40,
    width: "100%",
    alignItems: "center",
    position: "relative",
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "NotoSans_700Bold",
    color: "#335561",
  },
  winnerAvatar: {
    height: 50,
    width: 50,
    borderRadius: 50,
    position: "absolute",
    zIndex: 2,
    left: -5,
    top: -25,
  },
  winnerName: {
    position: "absolute",
    zIndex: 2,
    left: 50,
    top: -10,
    fontFamily: "NotoSans_700Bold",
    color: "#335561",
  },
  propositionNumber: {
    position: "absolute",
    zIndex: 2,
    right: 20,
    top: -10,
    fontFamily: "NotoSans_700Bold",
    color: "#335561",
  },
  voteNumber: {
    position: "absolute",
    zIndex: 2,
    right: 20,
    bottom: -15,
    fontFamily: "NotoSans_700Bold",
    color: "#335561",
  },
  button: {
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    height: 50,
    justifyContent: "center",
  },
  buttonText: {
    color: "#EADDFF",
    fontSize: 20,
    fontFamily: "NotoSans_700Bold",
    textAlign: "center",
  },
});
