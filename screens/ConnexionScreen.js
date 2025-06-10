import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { updateToken, updateAvatar, updateNickname } from "../reducers/user";
import Constants from 'expo-constants';

export default function ConnexionScreen({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [wrongInfo, setWrongInfo] = useState(false)

  const BACKEND_URL = Constants.expoConfig.extra.EXPO_PUBLIC_BACKEND_URL;

  const handleLogin = () => {
    fetch(`${BACKEND_URL}/users/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(updateToken(data.token));
          dispatch(updateAvatar(data.avatar));
          dispatch(updateNickname(data.nickname));
          setEmail("");
          setPassword("");
        } else {
          setWrongInfo(true)
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardview} behavior="padding">
        <Image source={require("../assets/truestory_logo.png")} />
        <Text style={styles.title}>Se connecter</Text>
          {wrongInfo ? <Text style={{textAlign: 'center', color: 'red'}}>Identifiant ou mot de passe incorrect</Text> : null}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#335561"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Text style={styles.inputLabel}>Email</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#335561"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <Text style={styles.inputLabel}>Mot de passe</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleLogin()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Connexion</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Inscription")}>
          <Text style={styles.link}>Pas encore de compte ? Inscrivez-vous</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF1F1",
    alignItems: "center",
    padding: 20
  },
  title: {
    fontSize: 34,
    fontFamily: "NotoSans_700Bold",
    marginTop: 40,
    color: "#335561",
  },
  button: {
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    marginTop: 50,
    marginBottom: 10,
    height: 50,
  },
  buttonText: {
    color: "#EADDFF",
    fontSize: 20,
    fontFamily: "NotoSans_700Bold",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#335561",
    fontFamily: "NotoSans_400Regular",
  },
  inputContainer: {
    width: "80%",
    marginVertical: 20,
    position: "relative"
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
    fontSize: 16,
    color: "#335561",
    height: 50,
    fontFamily: "NotoSans_400Regular",
    borderWidth: 1,
    borderColor: "#65558F",
  },
  inputLabel: {
    position: 'absolute',
    top: -5,
    left: 10,
    borderRadius: 5,
    color: "#335561",
    fontSize: 16,
  },
  link: {
    fontSize: 18,
    color: "#335561",
    textDecorationLine: "underline",
    fontFamily: "NotoSans_400Regular",
    marginTop: 15,
    textAlign: 'center'
  },
  accountsContainer: {
    flexDirection: "row",
    height: 100,
  },
  keyboardview: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
