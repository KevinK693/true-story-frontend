import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector} from 'react-redux'

export default function WaitingForVoteResultScreen({ navigation }) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const game = useSelector((state) => state.game.value);
  const code = game.code;
  const scene = useSelector((state) => state.scene.value);
  const sceneNumber = scene.sceneNumber;

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${BACKEND_URL}/scenes/code/${code}/scene/${sceneNumber}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          if (data.result) {
            clearInterval(interval);
            navigation.replace("VoteWinner");
          }
        });
    }, 3000);

    return () => clearInterval(interval);
  }, [sceneNumber]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>En attente des votes des autres joueurs...</Text>
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
  },
});
