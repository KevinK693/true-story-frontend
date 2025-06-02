import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { updateAvatar } from "../reducers/user";
import { updateGame } from "../reducers/game";
import { SafeAreaView } from "react-native-safe-area-context";
import useBackButtonHandler from "../hooks/useBackButtonHandler";

export default function WaitingForPlayers({ navigation, route }) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value);
  const token = user.token;

  const game = useSelector((state) => state.game.value);
  const host = game.host;

  const isHost = () => {
    if (token === host) {
      return true;
    } else {
      return false;
    }
  };

  const { code } = route.params;

  const [gameImage, setGameImage] = useState(null);
  const [title, setTitle] = useState("");
  const [scenesNumber, setScenesNumber] = useState(0);
  const [genre, setGenre] = useState("");
  const [players, setPlayers] = useState([]);
  const [playersNumber, setPlayersNumber] = useState(0);
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [waitingForPlayers, setWaitingForPlayers] = useState(false);

  // Gestion du bouton retour Android
  useBackButtonHandler(navigation);

  // Récupération de l'avatar de l'hôte
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
            console.log("Failed to fetch user image");
          }
        });
    }
  }, [token]);

  // Récupération des informations de la partie et envoi au reducer 
  useEffect(() => {
    const interval = setInterval(() => {
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
            if (data.game.started) {
              dispatch(
                updateGame({
                  image: data.game.image,
                  title: data.game.title,
                  code: code,
                  genre: data.game.genre,
                  nbPlayers: data.game.nbPlayers,
                  nbScenes: data.game.nbScenes,
                  status: data.game.status,
                })
              );
              navigation.replace("StartingGame");
            }
          } else {
            console.log("Failed to fetch user info");
          }
        });
    }, 3000);

    return () => clearInterval(interval);
  }, [code, navigation]);

  // Récupération des joueurs qui ont entré le code
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${BACKEND_URL}/games/players/${code}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            setPlayers(data.players);
            setLoading(false);
          }
        });
    }, 3000);

    return () => clearInterval(interval);
  }, [code]);

  // Envoi de la 1ère scène à la base de données
  useEffect(() => {
    fetch(`${BACKEND_URL}/scenes/firstScene`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log("Scene successfully sent");
        }
      });
  }, []);

  // Démarrage du jeu par l'hôte lorsque tous les joueurs sont présents
  const handleSubmit = () => {
    fetch(`${BACKEND_URL}/games/start/${code}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          if (players.length === playersNumber) {
            setWaitingForPlayers(false);
          } else {
            setWaitingForPlayers(true);
          }
        }
      });
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
          <Text style={styles.code}>CODE DE PARTIE : {code}</Text>
        </TouchableOpacity>
        <Text style={styles.joueurs}>Nombre de Joueurs : {playersNumber}</Text>
      </View>
      <View style={styles.players}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#65558F" />
          </View>
        ) : (
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
        )}
      </View>
      <Text style={styles.joueursAttente}>
        En attente des joueurs : {players.length}/{playersNumber}
      </Text>
      {isHost() && (
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Lancer la partie</Text>
        </TouchableOpacity>
      )}
      {waitingForPlayers && (
        <Text style={{ textAlign: "center", color: "red" }}>
          Nombre de joueurs insuffisant
        </Text>
      )}
      {!isHost() && (
        <Text style={{ textAlign: "center", color: "#335561" }}>
          En attente de l'hôte pour démarrer la partie...
        </Text>
      )}
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
    padding: 20,
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
    height: "45%",
    width: "90%",
  },
  button: {
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 8,
    width: "80%",
    marginVertical: 20,
    height: 50,
  },
  joueursAttente: {
    fontSize: 17,
    color: "#335561",
    fontFamily: "NotoSans_700Bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
