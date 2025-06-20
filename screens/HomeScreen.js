import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { removeToken, updateAvatar } from "../reducers/user";
import { resetScene } from "../reducers/scene";
import { removeGame } from '../reducers/game'

export default function HomeScreen({ navigation }) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value);
  const token = user.token;

  const [nickname, setNickname] = useState(null)

  useEffect(() => {
    if (token) {
      fetch(`${BACKEND_URL}/users/${token}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.result && data.user.avatar) {
            setNickname(data.user.nickname)
            if (data.user.avatar !== user.avatar) {
              dispatch(updateAvatar(data.user.avatar));
            }
          } else {
            console.log("Failed to fetch user info");
          }
        });
    }
  }, [token]);

  const avatarUrl = user.avatar;

  const handleLogout = () => {
    dispatch(removeToken());
  };

  const handleCreateGame = () => {
    navigation.navigate("CreateGame");
    dispatch(resetScene());
    dispatch(removeGame())
  };

  const handleJoinGame = () => {
    navigation.navigate("JoinGame");
    dispatch(resetScene());
    dispatch(removeGame())
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileContainer} onPress={() => navigation.navigate("Profile")}>
          <Image style={styles.user} source={{ uri: avatarUrl }} />
          <Text style={styles.greeting}>Bonjour, {nickname}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLogout()}>
          <FontAwesome5 name="sign-out-alt" size={30} color="#335561" />
        </TouchableOpacity>
      </View>
      <View>
        <Image style={styles.image} source={require("../assets/truestory_logo.png")} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => handleCreateGame()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textbutton}>NOUVELLE PARTIE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleJoinGame()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textbutton}>REJOINDRE</Text>
        </TouchableOpacity>
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
    width: "90%",
    resizeMode: "contain",
    alignSelf: "center",
    marginVertical: 20,
    marginTop: 50,
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
    marginVertical: 15,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    width: "90%",
    marginBottom: 35
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
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  greeting: {
    color: "#65558F",
    fontFamily: "NotoSans_700Bold",
    marginLeft: 10
  }
});
