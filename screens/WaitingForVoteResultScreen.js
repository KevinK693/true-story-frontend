import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  BackHandler,
  Alert,
} from "react-native";import { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";

export default function WaitingForVoteResultScreen({ navigation }) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const game = useSelector((state) => state.game.value);
  const code = game.code;
  const nbPlayers = game.nbPlayers;

  const scene = useSelector((state) => state.scene.value);
  const sceneNumber = scene.sceneNumber;

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
            style: "cancel"
          },
          {
            text: "Quitter",
            onPress: () => {           
              navigation.goBack();
            }
          }
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

  // Vérification si tous les joueurs ont voté
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${BACKEND_URL}/scenes/code/${code}/scene/${sceneNumber}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.result) {
            const allPlayersHaveVoted = (data) => {
              const totalVotes = data.data.propositions.reduce(
                (acc, proposition) => acc + proposition.votes,
                0
              );
              console.log("TOTAL VOTES", totalVotes, 'NBPLAYERS', nbPlayers)
              return totalVotes === nbPlayers;
            };
            if (allPlayersHaveVoted(data)) {
              clearInterval(interval);
              if (allPlayersHaveVoted(data)) {
                clearInterval(interval);

                fetch(
                  `${BACKEND_URL}/scenes/voteWinner/${code}/${sceneNumber}`,
                  {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                  }
                ).then(response => response.json())
                .then(data => {
                  console.log('WINNER CALCULE')
                })
              }
              navigation.replace("VoteWinner");
            }
          }
        });
    }, 3000);

    return () => clearInterval(interval);
  }, [sceneNumber]);

  return (
    <View style={styles.container}>
      <View style={styles.loaderContainer}>
        <Text style={styles.text}>
          En attente des votes des autres joueurs...
        </Text>
        <ActivityIndicator size="large" color="#65558F" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF1F1",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "#335561",
    fontWeight: "bold",
    textAlign: 'center'
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
})
