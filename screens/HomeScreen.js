import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { removeToken, updateAvatar } from "../reducers/user";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const token = user.token;
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (token) {
      fetch(`${BACKEND_URL}/users/${token}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.result && data.user.avatar) {
            // Si l'avatar du serveur est différent de celui dans Redux, mettre à jour Redux
            if (data.user.avatar !== user.avatar) {
              dispatch(updateAvatar(data.user.avatar));
            }
          } else {
            console.log("Erreur de récupération de l'image");
          }
        });
    }
  }, [token]);

  const avatarUrl = user.avatar;

  const handleLogout = () => {
    dispatch(removeToken());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image style={styles.user} source={{ uri: avatarUrl }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLogout()}>
          <FontAwesome5 name="sign-out-alt" size={30} color="#335561" />
        </TouchableOpacity>
      </View>
      <View>
        <Image style={styles.image} source={require("../assets/logo.png")} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("CreateGame")}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textbutton}>NOUVELLE PARTIE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("JoinGame")}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textbutton}>REJOINDRE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("StartingGame")}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textbutton}>CONTINUER</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          <Button title="Votes" onPress={() => navigation.navigate("Voting")} />
          <Button
            title="VOte winner"
            onPress={() => navigation.navigate("VoteWinner")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF1F1",
    padding: 20,
  },
  user: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },
  image: {
    width: "50%",
    resizeMode: "contain",
    alignSelf: "center",
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#65558F",
    borderRadius: 6,
    marginVertical: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    width: "90%",
  },
  textbutton: {
    color: "#EADDFF",
    fontFamily: "NotoSans_700Bold",
    fontSize: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
