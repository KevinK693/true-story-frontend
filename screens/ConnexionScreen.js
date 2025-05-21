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
import { updateToken } from "../reducers/user";

export default function ConnexionScreen({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const BACKEND_URL = "http:///10.0.3.229:3000"; // Remplacez par l'URL de votre backend

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
          console.log("Connexion réussie");
          navigation.navigate("TabNavigator");
          dispatch(updateToken(data.token));
          setEmail("");
          setPassword("");
        } else {
          console.log("Erreur de connexion");
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardview} behavior="padding">
        <Image source={require("../assets/logo.png")} />
        <Text style={styles.title}>Se connecter</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A0A0A0"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#A0A0A0"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <Text style={styles.link}>Mot de passe oublié ?</Text>
        <TouchableOpacity
          onPress={() => handleLogin()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Connexion</Text>
        </TouchableOpacity>
        <Text style={styles.text}>Ou connectez-vous via un autre compte</Text>
        <View style={styles.accountsContainer}></View>
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
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
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
    fontWeight: "600",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#335561",
  },
  inputContainer: {
    width: "80%",
    marginVertical: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
    fontSize: 16,
    color: "#335561",
    height: 50,
  },
  link: {
    fontSize: 16,
    color: "#335561",
    textDecorationLine: "underline",
  },
  accountsContainer: {
    flexDirection: "row",
    height: 130,
  },
  keyboardview: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
