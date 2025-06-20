import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function UserPastGamesScreen({ navigation }) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const user = useSelector((state) => state.user.value);
  const token = user.token;

  const [games, setGames] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  //Récupération des parties terminées du joueur
  useEffect(() => {
    fetch(`${BACKEND_URL}/games/user/${token}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          for (const game of data.games) {
            if (game.status === false) {
              setGames((prevGames) => [...prevGames, game]);
            }
          }
        }
      });
  }, []);

  //Mapping des parties 
  const gamesList = games.map((game, index) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.button}
        onPress={() => handleShowGame(game)}
      >
        <Text style={styles.buttonText}>{game.title}</Text>
      </TouchableOpacity>
    );
  });

  //Ouverture de la modale du jeu sélectionné
  const handleShowGame = (game) => {
    setSelectedGame(game);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.icons}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <FontAwesome5 name="arrow-left" size={30} color="#335561" solid />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Vos histoires</Text>
      <ScrollView style={styles.gamesList}>
        {gamesList.length > 0 ? (
          gamesList
        ) : (
          <Text style={{ textAlign: "center" }}>Aucune partie terminée</Text>
        )}
      </ScrollView>
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <FontAwesome5 name="times" size={24} color="#333" />
            </TouchableOpacity>
            <ScrollView style={styles.scrollArea}>
              <Text style={styles.modalText}>
                {selectedGame?.fullstory || "Chargement de l'histoire..."}
              </Text>
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
    padding: 20,
    paddingBottom: 40,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    height: 80,
    marginTop: 20,
    justifyContent: "center",
  },
  buttonText: {
    color: "#EADDFF",
    fontSize: 20,
    fontFamily: "NotoSans_700Bold",
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: "NotoSans_700Bold",
    color: "#335561",
    fontWeight: "bold",
    textAlign: "center",
  },
  gamesList: {
    width: "100%",
    marginVertical: 20,
  },
  modalText: {
    fontSize: 16,
    fontFamily: "NotoSans_400Regular",
    textAlign: "center",
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxHeight: "80%",
  },

  scrollArea: {
    marginTop: 30,
  },

  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
});
