// components/GameHeader.js
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useSelector } from "react-redux";

export default function GameHeader({ navigation, onGameDataLoaded }) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const game = useSelector((state) => state.game.value);
  const code = game.code;

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [totalScenesNb, setTotalScenesNb] = useState(null);
  const [playersNb, setPlayersNb] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/games/game/${code}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setTitle(data.game.title);
          setImage(data.game.image);
          setTotalScenesNb(data.game.nbScenes);
          setPlayersNb(data.game.nbPlayers);

          if (onGameDataLoaded) {
            onGameDataLoaded(data.game);
          }
        } else {
          console.error("Error fetching game data:", data.error);
        }
      });
  }, []);

  return (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={() => navigation.navigate("PlayersList")}>
        <Image
          source={{ uri: image }}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconHistory}
        onPress={() => navigation.navigate("GameHistory")}
      >
        <FontAwesome5 name="history" size={35} color="#335561" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  iconHistory: {
    padding: 5,
  },
});
