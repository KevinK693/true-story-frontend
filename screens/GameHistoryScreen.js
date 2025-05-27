import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

export default function VotingScreen() {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
  const navigation = useNavigation();
  const game = useSelector((state) => state.game.value);
  const code = game.code;
  const [gameImage, setGameImage] = useState(null);
  const [gameTitle, setGameTitle] = useState("");
  const [playedScenes, setPlayedScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedScene, setSelectedScene] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/games/game/${code}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setGameImage(data.game.image);
          setGameTitle(data.game.title);
        } else {
          console.log("Error user data recovery");
        }
      })
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/scenes/${code}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          const playedScenesOnly = data.scenes
          const sortedScenes = playedScenesOnly.sort(
            (a, b) => a.sceneNumber - b.sceneNumber
          );
          setPlayedScenes(sortedScenes);
        } else {
          console.log("Error in recovering scenes played");
        }
        setLoading(false);
      })
  }, [code]);

  const openModal = (scene) => {
    setSelectedScene(scene);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedScene(null);
  };

  const getWinnerProposition = (scene) => {
    if (!scene.propositions ) return null;
    return scene.propositions.reduce((prev, current) =>
      current.votes > prev.votes ? current : prev
    );
  };

  const renderSceneCard = (scene) => (
     

    <TouchableOpacity
      key={scene._id}
      style={styles.sceneCard}
      onPress={() => openModal(scene)}
      >
      <Text style={styles.sceneCardTitle}>Scène n°{scene.sceneNumber}</Text>
      <Text numberOfLines={2} style={styles.sceneCardText}>
        {scene.text}
      </Text>
    </TouchableOpacity>
   
  );

  const currentScene = playedScenes[playedScenes.length - 1];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Image source={{ uri: gameImage }} style={styles.gameImage} />
        <TouchableOpacity
          style={styles.iconHistory}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="arrow-left" size={35} color="#335561" />
        </TouchableOpacity>
      </View>

      <Text style={styles.gameTitle}>{gameTitle}</Text>
      <Text style={styles.subtitle}>Résumé de la partie</Text>

      <ScrollView style={{ width: "100%" }}>
        <View style={styles.playedScenesContainer}>
          {loading ? (
            <Text style={styles.loadingText}>Chargement des scènes...</Text>
          ) : playedScenes.length > 0 ? (
            playedScenes.map((scene) => renderSceneCard(scene))
          ) : (
            <Text style={styles.noScenesText}>
              Aucune scène jouée pour le moment
            </Text>
          )}
        </View>

        {currentScene && (
          <View style={styles.currentSceneContainer}>
            <Text style={styles.currentSceneTitle}>Scène actuelle</Text>
            <View style={styles.currentSceneCard}>
              <Text style={styles.currentSceneNumber}>
                Scène n°{currentScene.sceneNumber}
              </Text>
         
                <Text style={styles.currentSceneText}>
                  {currentScene.text}
                </Text>
       
            </View>
          </View>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
            >
              <FontAwesome5 name="times" size={24} color="#335561" />
            </TouchableOpacity>

            {selectedScene && (
              <ScrollView style={{ maxHeight: 350 }}>
                <Text style={styles.modalTitle}>
                  Scène n°{selectedScene.sceneNumber}
                </Text>
                <Text style={styles.modalText}>{selectedScene.text}</Text>
              </ScrollView>
            )}
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
    borderRadius: 10,
  },
  iconHistory: {
    padding: 5,
  },
  gameTitle: {
    fontSize: 25,
    fontFamily: "NotoSans_700Bold",
    color: "#335561",
    paddingTop: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "NotoSans_400Regular",
    color: "#335561",
    marginBottom: 20,
  },
  playedScenesContainer: {
    width: "100%",
    alignItems: "center",
  },
  sceneCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    width: "95%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sceneCardTitle: {
    fontSize: 18,
    fontFamily: "NotoSans_700Bold",
    color: "#335561",
    marginBottom: 5,
  },
  sceneCardText: {
    fontSize: 14,
    fontFamily: "NotoSans_400Regular",
    color: "#335561",
    lineHeight: 20,
  },
  winnerText: {
    fontSize: 14,
    fontFamily: "NotoSans_400Regular",
    color: "#335561",
    fontStyle: "italic",
  },
  currentSceneContainer: {
    marginTop: 25,
    width: "100%",
    alignItems: "center",
  },
  currentSceneTitle: {
    fontSize: 22,
    fontFamily: "NotoSans_700Bold",
    color: "#335561",
    marginBottom: 15,
  },
  currentSceneCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "95%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 20,
  },
  currentSceneNumber: {
    fontSize: 20,
    fontFamily: "NotoSans_700Bold",
    color: "#335561",
    marginBottom: 10,
  },
  currentSceneTextContainer: {
    maxHeight: 200,
    marginBottom: 15,
  },
  currentSceneText: {
    fontSize: 16,
    fontFamily: "NotoSans_400Regular",
    color: "#335561",
    lineHeight: 22,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "NotoSans_400Regular",
    color: "#335561",
    textAlign: "center",
    marginTop: 20,
  },
  noScenesText: {
    fontSize: 16,
    fontFamily: "NotoSans_400Regular",
    color: "#335561",
    textAlign: "center",
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  modalScrollView: {
    flex: 1,
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
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontFamily: "NotoSans_700Bold",
    color: "#335561",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    fontFamily: "NotoSans_400Regular",
    color: "#335561",
    lineHeight: 22,
  },
  propositionItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginVertical: 5,
    borderLeftWidth: 3,
    borderLeftColor: "#335561",
  },
  propositionText: {
    fontSize: 14,
    fontFamily: "NotoSans_400Regular",
    color: "#335561",
    marginBottom: 5,
  },
  propositionVotes: {
    fontSize: 12,
    fontFamily: "NotoSans_700Bold",
    color: "#335561",
  },
});