import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { updateAvatar } from "../reducers/user";
import { updateGame } from "../reducers/game";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlayersList({ navigation, route }) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const token = user.token;
  const code = route.params.code;

  const [gameImage, setGameImage] = useState(null);
  const [title, setTitle] = useState("");
  const [scenesNumber, setScenesNumber] = useState(0);
  const [genre, setGenre] = useState("");
  const [players, setPlayers] = useState([]);
  const [playersNumber, setPlayersNumber] = useState(0);
  const [status, setStatus] = useState(false);

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
          setPlayersNumber(data.game.nbPlayers);
          setTitle(data.game.title);
          setScenesNumber(data.game.nbScenes);
          setGenre(data.game.genre);
          setStatus(data.game.status);
        } else {
          console.log("Erreur de récupération des données utilisateur");
        }
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${BACKEND_URL}/games/players/${code}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            setPlayers(data.players);
          }
        });
    }, 3000);

    return () => clearInterval(interval);
  }, [code]);

  useEffect(() => {
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
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("SartingGame")}>
          <Image source={{ uri: gameImage }} style={styles.user} />
        </TouchableOpacity>
      </View>
      <Text style={styles.textTitle}>{title}</Text>
      <View>
        <Text style={styles.genre}>{genre}</Text>
      </View>
      <View style={styles.middle}>
        <Text style={styles.joueurs}>Nombre de Joueurs : {players.length}</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF1F1",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  textTitle: {
    fontSize: 30,
    fontFamily: "Noto Sans Gujarati",
    color: "#335561",
    fontWeight: "bold",
    paddingTop: 15,
  },
  genre: {
    paddingTop: 10,
    fontFamily: "Noto Sans Gujarati",
    color: "#335561",
  },
  user: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  middle: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  joueurs: {
    fontSize: 17,
    color: "#335561",
  },
  players: {
    height: "45%",
    width: "90%",
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
    marginBottom: 20,
    position: "relative",
  },
  item: {
    fontSize: 22,
    fontFamily: "NotoSans_700Bold",
    color: "#335561",
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
});
