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


export default function ConnexionScreen({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);

  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const handleSignup = () => {
    if (EMAIL_REGEX.test(email)) {
      setInvalidEmail(false);
      fetch(`${BACKEND_URL}/users/signup`, {
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
            console.log("Inscription réussie");
            navigation.navigate("CreateProfile", { token: data.token })
            setEmail("");
            setPassword("");
          } else {
            console.log("Erreur d'inscription");
          }
        });
    } else {
      setInvalidEmail(true)
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardview} behavior="padding">
        <Image source={require("../assets/logo.png")} />
        <Text style={styles.title}>S'inscrire</Text>
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
          {invalidEmail ? <Text style={{color: "red"}}>Email invalide</Text> : null }
          </View>
          <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#335561"
            secureTextEntry
            value={password}
            autoCapitalize="none"
            onChangeText={(text) => setPassword(text)}
          />
          <Text style={styles.inputLabel}>Mot de passe</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleSignup()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Inscription</Text>
        </TouchableOpacity>
        <Text style={styles.text}>Ou inscrivez-vous via un autre compte</Text>
        <View style={styles.accountsContainer}></View>
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
    marginBottom: 20,
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
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 10,
    marginTop: 30,
    fontSize: 16,
    color: "#335561",
    height: 50,
    fontFamily: "NotoSans_400Regular",
    borderWidth: 1,
    borderColor: "#65558F",
  },
  inputLabel: {
    position: 'absolute',
    top: 5,
    left: 10,
    borderRadius: 5,
    color: "#335561",
    fontSize: 16,
  },
  link: {
    fontSize: 16,
    color: "#335561",
    textDecorationLine: "underline",
    fontFamily: "NotoSans_400Regular",
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
