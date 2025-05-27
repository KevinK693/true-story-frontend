import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { updateScene } from "../reducers/scene";

export default function VoteWinnerScreen({ navigation, route }) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
  const dispatch = useDispatch();
  const game = useSelector((state) => state.game.value);
  const code = game.code;
  const nbPlayers = game.nbPlayers;
  const scene = useSelector((state) => state.scene.value);
  const sceneNumber = scene.sceneNumber;
  const [gameImage, setGameImage] = useState(null);
  const [gameTitle, setGameTitle] = useState("");
  const [sceneWinner, setSceneWinner] = useState("");
  const [winningProposition, setWinningProposition] = useState("");
  const [winningVotes, setWinningVotes] = useState(0);
  const [avatar, setAvatar] = useState(null);
  // const { nbVotes } = route.params

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
  }, []);

  //Récupération du gagnant du vote
  useEffect(() => {
    fetch(`${BACKEND_URL}/scenes/voteWinner/${code}/${sceneNumber}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setSceneWinner(data.data.nickname);
          setWinningProposition(data.data.text);
          setWinningVotes(data.data.votes);
          setAvatar(data.data.avatar);
        } else {
          console.log("Erreur de récupération du gagnant du vote");
        }
      });
  }, []);

  const handleResumeGame = () => {
    navigation.navigate("StartingGame");
    dispatch(updateScene());
  };

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

      {nbPlayers === propositionsNumber ? (
        <View style={styles.propositionsContainer}>
          <Image style={styles.winnerAvatar} source={{ uri: avatar }} />
          <Text style={styles.winnerName}>{sceneWinner}</Text>
          <Text style={styles.propositionNumber}>Proposition #X</Text>
          <Text style={styles.voteNumber}>Votes : {winningVotes}</Text>
          <View style={styles.containerProposition}>
            <Text style={styles.proposition}>{winningProposition}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.waitingText}>
          En attente que tous les joueurs aient soumis leur vote : {nbVotes}/{nbPlayers}
        </Text>
      )}

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
    fontSize: 22,
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
  waitingText: {
    fontSize: 20,
    fontFamily: "NotoSans_400Regular",
    textAlign: "center",
    color: "#335561",
    marginVertical: 50,
  },
});
