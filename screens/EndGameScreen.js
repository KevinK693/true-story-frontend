import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Audio } from "expo-av";
import * as Sharing from "expo-sharing";
import { ScrollView } from "react-native";
import * as FileSystem from "expo-file-system";
import useBackButtonHandler from "../hooks/useBackButtonHandler";
import GameHeader from "../components/GameHeader";

export default function EndGameScreen({ navigation }) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const game = useSelector((state) => state.game.value);
  const code = game.code;

  const scene = useSelector((state) => state.scene.value);
  const fullstory = useSelector((state) => state.scene.value.fullstory);
  const lastScene = scene.scenes[scene.scenes.length - 1];

  const [gameImage, setGameImage] = useState(null);
  const [gameTitle, setGameTitle] = useState("");
  const [gameWinner, setGameWinner] = useState("");
  const [winnerVotes, setWinnerVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [storyModalVisible, setStoryModalVisible] = useState(false);

  const [sound, setSound] = useState(null);
  const fileUri = FileSystem.documentDirectory + "elevenlabs_podcast.mp3";

  // Gestion du bouton retour Android
  useBackButtonHandler(navigation);

  const handleGenerateAudio = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/exports/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fullstory }),
      });

      const blob = await response.blob();
      const fileUri = FileSystem.documentDirectory + "podcast.mp3";

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result.split(",")[1];

        await FileSystem.writeAsStringAsync(fileUri, base64data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const { sound: playbackObj } = await Audio.Sound.createAsync({
          uri: fileUri,
        });
        setSound(playbackObj);
        await playbackObj.playAsync();

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
          setLoading(false);
        } else {
          Alert.alert("Partage non dispo sur cet appareil.");
        }
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Generating audio error :", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/exports/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fullstory }),
      });

      if (!response.ok) throw new Error("PDF server error");

      const blob = await response.blob();

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result.split(",")[1];
        const fileUri = FileSystem.documentDirectory + "story.pdf";

        await FileSystem.writeAsStringAsync(fileUri, base64data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        } else {
          Alert.alert("Partage non dispo");
        }
      };

      reader.readAsDataURL(blob);
    } catch (err) {
      console.error("PDF error :", err.message);
      Alert.alert("PDF error", err.message);
    }
  };

  // Finir la partie
  useEffect(() => {
    fetch(`${BACKEND_URL}/games/end/${code}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullstory: fullstory,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log("Game successfully ended");
          setGameWinner(data.winner);
          setWinnerVotes(data.totalVotes);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  //Polling pour les joueurs non-hôtes
  useEffect(() => {
    if (!game.isHost) {
      const interval = setInterval(() => {
        fetch(`${BACKEND_URL}/games/game/${code}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.game.status === false) {
              setGameWinner(data.game.winner);
              setWinnerVotes(data.game.totalVotes);
              setLoading(false);
              clearInterval(interval);
            }
          })
          .catch((err) => {
            console.error("Polling error :", err);
          });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, []);

  const handleHistorySubmit = () => {
    navigation.navigate("GameHistory");
  };
  const openModal = (scene) => {
    setSelectedScene(scene);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedScene(null);
  };

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
          setGameTitle(data.title);
          setGameImage(data.image);
          setTotalScenesNb(data.nbScenes);
          setPlayersNb(data.nbPlayers);
        }}
      />
      <Text style={styles.gameTitle}>{gameTitle}</Text>
      <Text style={styles.subtitle}>Fin de la partie | Scène finale</Text>
      <View style={styles.containerProposition}>
        <ScrollView>
          <Text style={styles.proposition}>{lastScene}</Text>
        </ScrollView>
      </View>
      <View>
        <Text style={styles.winnerText}>Félicitations, {gameWinner} !</Text>
        <Text style={styles.winnerText}>
          Tu as gagné avec {winnerVotes} votes.
        </Text>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleDownloadPDF}>
            <FontAwesome5 size={30} name="pen-nib" color="#FBF1F1" />
          </TouchableOpacity>
          <Text style={styles.text}>Exporter à l'écrit</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleGenerateAudio} style={styles.button}>
            <FontAwesome5 size={30} name="podcast" color="#FBF1F1" />
          </TouchableOpacity>
          <Text style={styles.text}>Exporter en podcast</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => setStoryModalVisible(true)}
            style={styles.button}
          >
            <FontAwesome5 size={30} name="book" color="#FBF1F1" />
          </TouchableOpacity>
          <Text style={styles.text}>Voir toute l'histoire</Text>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={storyModalVisible}
        onRequestClose={() => setStoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setStoryModalVisible(false)}
            >
              <FontAwesome5 name="times" size={24} color="#335561" />
            </TouchableOpacity>
            <ScrollView style={{ maxHeight: 400 }}>
              <Text style={styles.modalTitle}>Toute l'histoire</Text>
              <Text style={styles.modalText}>{fullstory}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    height: "40%",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    marginVertical: 20,
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
  },
  button: {
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 20,
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#EADDFF",
    fontSize: 20,
    fontFamily: "NotoSans_700Bold",
    textAlign: "center",
  },
  winnerText: {
    fontFamily: "NotoSans_700Bold",
    textAlign: "center",
    color: "#335561",
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 25,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  text: {
    color: "#335561",
    marginTop: 5,
    fontFamily: "NotoSans_400Regular",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    margin: 20,
    maxHeight: "80%",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "NotoSans_700Bold",
    color: "#335561",
    marginBottom: 20,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    fontFamily: "Montserrat",
    color: "#335561",
    lineHeight: 22,
  },
});
