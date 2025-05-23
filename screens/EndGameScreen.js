import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function EndGameScreen({ navigation }) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
  const game = useSelector((state) => state.game.value);
  const code = game.code;
  const user = useSelector((state) => state.user.value);
  const [gameImage, setGameImage] = useState(null);
  const [gameTitle, setGameTitle] = useState("");
  const [gameWinner, setGameWinner] = useState("");

  //Récupération de l'image de la partie
  useEffect(() => {
    fetch(`${BACKEND_URL}/games/game/${code}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setGameImage(data.game.image);
          setGameTitle(data.game.title);
          setGameWinner(data.game.winner);
        } else {
          console.log("Erreur de récupération des données utilisateur");
        }
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Image
          source={{
            uri: gameImage,
          }}
          style={styles.gameImage}
        />
      </View>
      <Text style={styles.gameTitle}>{gameTitle}</Text>
      <Text style={styles.subtitle}>Fin de la partie | Scène finale</Text>
      <View style={styles.containerProposition}>
        <Text style={styles.proposition}>Fin de l'histoire</Text>
      </View>
      <View>
        <Text style={styles.winnerText}>Félicitations, [winner name] !</Text>
        <Text style={styles.winnerText}>Tu as gagné avec 8 votes.</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <FontAwesome5 size={30} name="pen-nib" color="#FBF1F1" />
          </TouchableOpacity>
          <Text style={styles.text}>Exporter à l'écrit</Text>
        </View>
         <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
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
    alignItems: 'center',
    justifyContent: 'center',
    margin: 30,
  },
  text: {
    color: "#335561",
    marginTop: 5,
    fontFamily: "NotoSans_400Regular",
  }
});
