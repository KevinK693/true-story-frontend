import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { updateAvatar } from "../reducers/user";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WaitingForPlayers({ navigation }) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
  const game = useSelector((state) => state.game.value);
  const code = game.code;
  const user = useSelector((state) => state.user.value);
  const token = user.token;

  const [gameImage, setGameImage] = useState(null);
  const [gameCode, setGameCode] = useState("");
  const [players, setPlayers] = useState([])
  const [playersNumber, setPlayersNumber] = useState(0)

  useEffect(() => {
    if (token) {
      fetch(`${BACKEND_URL}/users/${token}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.result && data.user?.avatar) {
            if (data.user.avatar !== user.avatar) {
              dispatch(updateAvatar(data.user.avatar));
            }
          } else {
            console.log("Erreur de récupération de l'image utilisateur");
          }
        });
    }
  }, [token]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/games/game/${code}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setGameImage(data.game.image);
          setGameCode(data.game.code);
          setPlayersNumber(data.game.nbPlayers)
        } else {
          console.log("Erreur de récupération des données utilisateur");
        }
      });
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/games/players/${code}`)
    .then(response => response.json())
    .then(data => {
      if (data.result) {
        setPlayers(data.players)
      }
    })

    fetch(`${BACKEND_URL}/scenes/firstScene`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log("Scène envoyée");
          
        }
      });
  }, [])

  const handleSubmit = () => {
    navigation.navigate('StartingGame')
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: gameImage,
          }}
          style={styles.user}
        />
      </View>
      <View style={styles.middle}>
        <TouchableOpacity onPress={() => navigation.navigate("StartingGame")}>
          <Text style={styles.code}>CODE DE PARTIE : {gameCode}</Text>
        </TouchableOpacity>
        <Text style={styles.joueurs}>
          Nombre de Joueurs : {playersNumber}
        </Text>
      </View>
      <View style={styles.players}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={true}
          persistentScrollbar={true}
        >
          {players.map((player, i) => (
            <View key={i} style={styles.player}>
              <Image
                style={styles.useronline}
                source={{ uri: player.avatar }}
              />
              <Text style={styles.item}>{player.nickname}</Text>
              <View style={styles.rond} />
            </View>
          ))}
        </ScrollView>
      </View>
      <Text style={styles.joueursAttente}>
          En attente des joueurs : {players.length}/{playersNumber}
        </Text>
      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Lancer la partie</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  user: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  container: {
    flex: 1,
    backgroundColor: "#FBF1F1",
    alignItems: "center",
    padding: 20
  },
  buttonText: {
    color: "#EADDFF",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  middle: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  code: {
    fontSize: 20,
    fontFamily: "NotoSans_700Bold",
    color: "#335561",
    marginVertical: 10,
  },
  joueurs: {
    fontSize: 17,
    color: "#335561",
  },
  scrollContainer: {
    maxHeight: 500,
    width: "100%",
    borderRadius: 10,
    marginTop: 20,
  },
  content: {
    padding: 10,
  },
  player: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 0,
    marginBottom: 20,
    position: "relative",
  },
  item: {
    fontSize: 22,
    fontFamily: "NotoSans_700Bold",
    color: "#335561",
    marginBottom: 10,
    marginVertical: 5,
    marginLeft: 10,
  },
  useronline: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  rond: {
    position: "absolute",
    right: 0,
    top: "50%",
    transform: [{ translateY: -6 }],
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "green",
  },
  players: {
    height: '45%',
    width: '90%',
  },
  button: {
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 8,
    width: 260,
    marginTop: 20,
    height: 50,
  },
  joueursAttente: {
    fontSize: 17,
    color: "#335561",
    fontFamily: "NotoSans_700Bold",
  },
});
