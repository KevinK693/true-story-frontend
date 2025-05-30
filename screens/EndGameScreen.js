import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  BackHandler,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Audio } from "expo-av";
import * as Sharing from "expo-sharing";
import { ScrollView } from "react-native";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";

export default function EndGameScreen({ navigation }) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const game = useSelector((state) => state.game.value);
  const code = game.code;

  const scene = useSelector((state) => state.scene.value);
  const fullstory = useSelector((state) => state.scene.value.fullstory);
  console.log("FULLSTORY in EndGameScreen =>", fullstory);
  const lastScene = scene.scenes[scene.scenes.length - 1];

  const [gameImage, setGameImage] = useState(null);
  const [gameTitle, setGameTitle] = useState("");
  const [gameWinner, setGameWinner] = useState("");
  const [winnerVotes, setWinnerVotes] = useState(0);
  const [loading, setLoading] = useState(true);

  const [sound, setSound] = useState(null);
  const fileUri = FileSystem.documentDirectory + "elevenlabs_podcast.mp3";

  // Gestion du bouton retour Android
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Quitter la partie",
        "Êtes-vous sûr de vouloir quitter la partie en cours ?",
        [
          {
            text: "Annuler",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "Quitter",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]
      );
      return true; // Empêche le comportement par défaut
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Nettoyage du listener
    return () => backHandler.remove();
  }, [navigation, code]);

  const handleGenerateAudio = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/exports/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fullstory }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Erreur serveur : " + errorText);
      }

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
      console.error("Erreur génération audio :", error);
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleDownloadPDF = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/exports/pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text : fullstory }),
    });

    if (!response.ok) throw new Error("Erreur serveur PDF");

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
    console.error("Erreur PDF :", err.message);
    Alert.alert("Erreur PDF", err.message);
  }
};

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
              clearInterval(interval)
            }
          })
          .catch((err) => {
            console.error("Erreur de polling :", err);
          });
      }, 2000); 

      return () => clearInterval(interval); 
    }
  }, []);

  const handleHistorySubmit = () => {
    navigation.navigate("GameHistory");
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
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate("PlayersList")}>
          <Image
            source={{
              uri: gameImage,
            }}
            style={styles.gameImage}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconHistory}
          onPress={handleHistorySubmit}
        >
          <FontAwesome5 name="history" size={35} color="#335561" />
        </TouchableOpacity>
      </View>
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
      </View>
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
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    margin: 30,
  },
  text: {
    color: "#335561",
    marginTop: 5,
    fontFamily: "NotoSans_400Regular",
  },
});
