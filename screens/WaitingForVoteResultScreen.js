import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import useBackButtonHandler from "../hooks/useBackButtonHandler";

export default function WaitingForVoteResultScreen({ navigation }) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const game = useSelector((state) => state.game.value);
  const code = game.code;
  const nbPlayers = game.nbPlayers;

  const scene = useSelector((state) => state.scene.value);
  const sceneNumber = scene.sceneNumber;

  // Gestion du bouton retour Android
  useBackButtonHandler(navigation);

  // Vérification si tous les joueurs ont voté
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${BACKEND_URL}/scenes/code/${code}/scene/${sceneNumber}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.result) {
            const allPlayersHaveVoted = (data) => {
              const totalVotes = data.data.propositions.reduce(    //on compte le nombre de votes dans chaque proposition
                (acc, proposition) => acc + proposition.votes,
                0
              );
              return totalVotes === nbPlayers;      //on compare le nombre de votes et le nombre de joueurs
            };
            if (allPlayersHaveVoted(data)) {
              clearInterval(interval);
              if (allPlayersHaveVoted(data)) {
                clearInterval(interval);

                // on modifie la collection pour ajouter le gagnant du vote
                fetch(
                  `${BACKEND_URL}/scenes/voteWinner/${code}/${sceneNumber}`,
                  {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                  }
                )
                  .then((response) => response.json())
                  .then(() => {
                    console.log("Winner successfully calculated");
                  });
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
    textAlign: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
