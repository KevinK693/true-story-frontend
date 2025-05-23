import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

export default function VotingScreen() {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
  const navigation = useNavigation()
  const game = useSelector((state) => state.game.value);
  const code = game.code;
  const [gameImage, setGameImage] = useState(null);
   const [gameTitle, setGameTitle] = useState('')

  //Récupération de l'image de la partie
  useEffect(() => {
    fetch(`${BACKEND_URL}/games/game/${code}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setGameImage(data.game.image);
          setGameTitle(data.game.title)
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
        <TouchableOpacity
          style={styles.iconHistory}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="arrow-left" size={35} color="#335561" />
        </TouchableOpacity>
      </View>
      <Text style={styles.gameTitle}>{gameTitle}</Text>
      <Text style={styles.subtitle}>Résumé de la partie</Text>
      <ScrollView style={{width: "100%"}}>
        <View  style={styles.propositionsContainer}>
        <View style={styles.containerProposition}>
          <Text style={styles.proposition}></Text>
        </View>
        <View style={styles.containerProposition}>
          <Text style={styles.proposition}></Text>
        </View>
        <View style={styles.containerProposition}>
          <Text style={styles.proposition}></Text>
        </View>
        <View style={styles.containerProposition}>
          <Text style={styles.proposition}></Text>
        </View>
        </View>
      </ScrollView>
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
    fontSize: 18,
    fontFamily: "Montserrat",
  },
  containerProposition: {
    borderRadius: 10,
    backgroundColor: "white",
    height: 150,
    width: "97%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    marginVertical: 10,
  },
  propositionsContainer: {
    marginTop: 20,
    marginBottom: 40,
    width: '100%',
    alignItems: 'center'
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "NotoSans_400Regular",
    color: "#335561",
  },
});
