import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function VotingScreen({ navigation }) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const game = useSelector((state) => state.game.value);
  const code = game.code;

  const user = useSelector((state) => state.user.value);

  const scene = useSelector((state) => state.scene.value);
  const sceneNumber = scene.sceneNumber;

  const [gameImage, setGameImage] = useState(null);
  const [gameTitle, setGameTitle] = useState("");
  const [selectedButton, setSelectedButton] = useState(null);
  const [propositions, setPropositions] = useState([]);
  const [allPlayersReady, setAllPlayersReady] = useState(false);
  const [userId, setUserId] = useState(null);
  const [sceneId, setSceneId] = useState(null);
  const [loading, setLoading] = useState(true);

  //Récupération de l'utilisateur actif
  useEffect(() => {
    fetch(`${BACKEND_URL}/users/${user.token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setUserId(data.user._id);
        }
      });
  }, []);

  //Récupération de l'image de la partie
  useEffect(() => {
    fetch(`${BACKEND_URL}/games/game/${code}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setGameImage(data.game.image);
          setGameTitle(data.game.title);
        } else {
          console.log("Erreur de récupération des données du jeu");
        }
      });
  }, []);

  // Récupération des propositions de la scène active depuis la base de données
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${BACKEND_URL}/scenes/code/${code}/scene/${sceneNumber}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            setSceneId(data.data._id);
            setPropositions(data.data.propositions);
            checkAllPlayersReady(data.data.propositions);
            setLoading(false);
          } else {
            console.log("Erreur de récupération des propositions");
          }
        });
    }, 3000);

    return () => clearInterval(interval);
  }, [sceneNumber]);

  const checkAllPlayersReady = (propositions) => {
    fetch(`${BACKEND_URL}/games/players/${code}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          const propositionsCount = propositions.length;
          if (propositionsCount === game.nbPlayers) {
            setAllPlayersReady(true);
          }
        } else {
          console.log("Erreur de récupérération des joueurs");
        }
      });
  };

  const handleHistorySubmit = () => {
    navigation.navigate("GameHistory");
  };

  const handleButtonPress = (buttonIndex) => {
    setSelectedButton(buttonIndex);
  };

  const handleVote = () => {
    if (selectedButton !== null && allPlayersReady) {
      const selectedProposition = propositions[selectedButton];

      // Envoyer le vote à la base de données
      fetch(
        `${BACKEND_URL}/scenes/vote/${sceneId}/${selectedProposition._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            navigation.replace("WaitingForVoteResult");
          } else {
            console.log("Erreur lors de l'enregistrement du vote");
          }
        });
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate('PlayersList')}>
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
      <Text style={styles.subtitle}>
        {allPlayersReady
          ? "Votez pour l'une des propositions"
          : "En attente que tous les joueurs fassent leur proposition..."}
      </Text>
      {!allPlayersReady && (
        <Text style={styles.waitingText}>
          {propositions.length} proposition(s) reçue(s)
        </Text>
      )}
      <ScrollView style={{ width: "100%" }}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#65558F" />
          </View>
        ) : (
          <View style={styles.propositionsContainer}>
            {propositions.map((proposition, index) => {
              const isOwnProposition = proposition.userId === userId;
              return (
                <View
                  key={proposition._id || `proposition-${index}`}
                  style={styles.voteContainer}
                >
                  <View
                    style={[
                      styles.containerProposition,
                      isOwnProposition && styles.ownProposition,
                    ]}
                  >
                    <Text style={styles.proposition}>{proposition.text}</Text>
                    {isOwnProposition && (
                      <Text style={styles.ownPropositionLabel}>
                        Votre proposition
                      </Text>
                    )}
                    <TouchableOpacity
                      style={[
                        styles.checkIcon,
                        selectedButton === index && styles.checkIconSelected,
                        isOwnProposition && styles.checkIconDisabled,
                      ]}
                      onPress={() => handleButtonPress(index)}
                      disabled={isOwnProposition}
                    >
                      <FontAwesome5
                        name={isOwnProposition ? "times" : "check"}
                        size={24}
                        color="#FBF1F1"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
        <TouchableOpacity style={styles.voteButton} onPress={handleVote}>
          <Text style={styles.voteButtonText}>Voter</Text>
        </TouchableOpacity>
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
  iconHistoryContainer: {
    width: "100%",
    alignItems: "flex-end",
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
    fontFamily: "NotoSans_400Regular",
    fontSize: 20,
    color: "#335561",
    marginTop: 10,
    textAlign: "center",
  },
  proposition: {
    fontSize: 16,
    margin: 30,
    flexWrap: "wrap",
    fontFamily: "NotoSans_400Regular",
  },
  containerProposition: {
    borderRadius: 10,
    backgroundColor: "white",
    minHeight: 150,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    marginHorizontal: 5,
    marginVertical: 10,
  },
  ownProposition: {
    backgroundColor: "#f0f0f0",
    opacity: 0.7,
  },
  ownPropositionLabel: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 12,
    fontFamily: "NotoSans_400Regular",
    color: "#65558F",
    fontStyle: "italic",
  },
  voteContainer: {
    width: "100%",
    position: "relative",
  },
  checkIcon: {
    position: "absolute",
    right: -25,
    bottom: '30%',
    backgroundColor: "#65558F",
    padding: 15,
    borderRadius: "50%",
  },
  checkIconSelected: {
    backgroundColor: "#E089FF",
  },
  checkIconDisabled: {
    display: "none",
  },
  propositionsContainer: {
    width: "100%",
    marginVertical: 20,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "NotoSans_400Regular",
    color: "#335561",
  },
  voteButton: {
    backgroundColor: "#65558F",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 50,
  },
  voteButtonText: {
    color: "#FBF1F1",
    fontSize: 18,
    fontFamily: "NotoSans_700Bold",
    textAlign: "center",
  },
  waitingText: {
    fontSize: 16,
    fontFamily: "NotoSans_400Regular",
    color: "#335561",
    marginTop: 10,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "NotoSans_400Regular",
    color: "#335561",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
