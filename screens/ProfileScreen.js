import { View, StyleSheet, Text } from "react-native";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function ProfileScreen() {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [nickname, setNickname] = useState(null);
  const user = useSelector((state) => state.user.value);
  const token = user.token;
  const BACKEND_URL = "http:///10.0.3.229:3000";

  useEffect(() => {
    fetch(`${BACKEND_URL}/users/${token}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setAvatarUrl(data.user.avatar);
          setNickname(data.user.nickname);
        } else {
          console.log("Erreur de récupération de l'image");
        }
      });
  }, []);
  return <SafeAreaView style={styles.container}></SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF1F1",
    paddingTop: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
});
