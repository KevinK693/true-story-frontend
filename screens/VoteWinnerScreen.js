import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { updateScene } from "../reducers/scene";
import useBackButtonHandler from "../hooks/useBackButtonHandler";
import GameHeader from "../components/GameHeader";

export default function VoteWinnerScreen({ navigation }) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value);
  const token = user.token;

  const game = useSelector((state) => state.game.value);
  const code = game.code;
  const nbScenes = game.nbScenes;
  const host = game.host;

  const scene = useSelector((state) => state.scene.value);
  const sceneNumber = scene.sceneNumber;
  const history = scene.fullstory;

  const remainingScenes = nbScenes - sceneNumber;

  const [gameImage, setGameImage] = useState(null);
  const [gameTitle, setGameTitle] = useState("");
  const [sceneWinner, setSceneWinner] = useState("");
  const [winningProposition, setWinningProposition] = useState("");
  const [winningVotes, setWinningVotes] = useState(0);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);

  const isHost = () => token === host;

  // Gestion du bouton retour Android
  useBackButtonHandler(navigation);

  // Fonction de récupération du gagnant
  const fetchWinner = async () => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/scenes/voteWinner/${code}/${sceneNumber}`
      );
      const data = await res.json();

      if (data.result && data.data?.nickname && data.data?.text) {
        setSceneWinner(data.data.nickname);
        setWinningProposition(data.data.text);
        setWinningVotes(data.data.votes);
        setAvatar(data.data.avatar);
        setLoading(false);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Failed to fetch winner :", error);
      return false;
    }
  };

  // Polling pour récupérer le gagnant (jusqu'à 30s)
  useEffect(() => {
    setLoading(true);
    let attempts = 0;
    const maxAttempts = 10;

    const interval = setInterval(async () => {
      const success = await fetchWinner();
      attempts++;

      if (success || attempts >= maxAttempts) {
        clearInterval(interval);
        setLoading(false); // au cas où on sort sans succès
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [code, sceneNumber]);

  // Reprendre la partie (host uniquement)
  const handleResumeGame = async () => {
    try {
      const statusResponse = await fetch(
        `${BACKEND_URL}/scenes/status/${code}/${sceneNumber}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      const statusData = await statusResponse.json();

      let sceneData;
      if (sceneNumber < nbScenes - 1) {
        const nextSceneRes = await fetch(`${BACKEND_URL}/scenes/nextScene`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            text: winningProposition,
            remainingScenes,
            history,
            sceneNumber: sceneNumber + 1,
          }),
        });
        sceneData = await nextSceneRes.json();
      } else {
        const lastSceneRes = await fetch(`${BACKEND_URL}/scenes/lastScene`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            text: winningProposition,
            history,
            sceneNumber: nbScenes,
          }),
        });
        sceneData = await lastSceneRes.json();
      }

      if (sceneData?.result) {
        dispatch(
          updateScene({
            text: sceneData.data.text,
            sceneNumber: sceneData.data.sceneNumber,
          })
        );
        navigation.navigate(
          sceneNumber < nbScenes - 1 ? "StartingGame" : "EndGame"
        );
      }
    } catch (error) {
      console.error("Error in handleResumeGame:", error);
    }
  };

  // Polling pour joueur non-hôte en attente de nouvelle scène
  useEffect(() => {
    if (!isHost()) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`${BACKEND_URL}/scenes/all/${code}`);
          const data = await response.json();

          if (!data.result) {
            console.error("Failed to fetch scenes :", data.error);
            return;
          }

          const scenes = data.scenes;
          const latestScene = scenes[scenes.length - 1];

          if (latestScene.sceneNumber === sceneNumber + 1) {
            dispatch(
              updateScene({
                text: latestScene.text,
                sceneNumber: latestScene.sceneNumber,
              })
            );
            clearInterval(interval);
            navigation.navigate(
              latestScene.sceneNumber < nbScenes ? "StartingGame" : "EndGame"
            );
          } else {
            console.log(
              `Ignore scène ${latestScene.sceneNumber}, attendu: ${
                sceneNumber + 1
              }`
            );
          }
        } catch (error) {
          console.error("Failed scenes polling :", error);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [code, sceneNumber, nbScenes, navigation]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#65558F" />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <GameHeader
        navigation={navigation}
        onGameDataLoaded={(data) => {
          setTitle(data.title);
          setImage(data.image);
          setTotalScenesNb(data.nbScenes);
          setPlayersNb(data.nbPlayers);
        }}
      />
      <Text style={styles.gameTitle}>{gameTitle}</Text>
      <Text style={styles.subtitle}>Vainqueur du vote</Text>
      <Text style={{ textAlign: "center" }}>
        En cas d'égalité, le/la plus rapide à répondre l'emporte !
      </Text>

      <View style={styles.propositionsContainer}>
        <Image style={styles.winnerAvatar} source={{ uri: avatar }} />
        <Text style={styles.winnerName}>{sceneWinner}</Text>
        <Text style={styles.voteNumber}>Votes : {winningVotes}</Text>
        <View style={styles.containerProposition}>
          <Text style={styles.proposition}>{winningProposition}</Text>
        </View>
      </View>

      {isHost() && (
        <TouchableOpacity
          onPress={() => handleResumeGame()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Continuer</Text>
        </TouchableOpacity>
      )}
      {!isHost() && (
        <Text style={{ textAlign: "center", color: "#335561" }}>
          En attente de l’hôte pour continer la partie...
        </Text>
      )}
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
