import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { resetScene } from "../reducers/scene";


export default function JoinGame({ navigation }) {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
 
  const dispatch = useDispatch();
  const [code, setCode] = useState("");
  const [incorrectCode, setIncorrectCode] = useState(false)
  const user = useSelector((state) => state.user.value);
  const token = user.token;

  const handleJoinGame = () => {
    fetch(`${BACKEND_URL}/games/join`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        code: code,
        token: token,
      })
    }).then(response => response.json())
    .then(data => {
      if (data.result) {
        navigation.navigate('WaitingForPlayers', { code: code })
        setCode('')
        dispatch(resetScene())
      } else {
        console.log('Erreur de récupération de la partie', data.error)
        setIncorrectCode(true)
      }
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <FontAwesome5 name="arrow-left" size={30} color="#335561" solid />
        </TouchableOpacity>
        
      </View>
      <View style={{ alignItems: "center", marginTop: 100 }}>
        <Text style={styles.textJoin}>Rejoindre une partie</Text>
        <Text style={styles.textEnter}>Entrez un code</Text>
        <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          autoCapitalize="characters"
          placeholder="Code de la partie"
          placeholderTextColor="#335561"
          onChangeText={(text) => setCode(text)}
          value={code}
        />
        <Text style={styles.inputLabel}>Code</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleJoinGame()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Rejoindre</Text>
        </TouchableOpacity>
        {incorrectCode ? <Text>Code incorrect</Text> : null}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textJoin: {
    fontSize: 30,
    fontFamily: "NotoSans_700Bold",
    color: "#65558F",
    marginBottom: 10,
  },
  textEnter: {
    fontSize: 20,
    color: "#65558F",
    marginBottom: 20,
    fontFamily: "NotoSans_400Regular",
  },
  input: {
    borderWidth: 1,
    borderColor: "#65558F",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
    fontFamily: "NotoSans_400Regular",
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: "white",
    color: "#335561",
  },
  inputContainer: {
    width: '80%',
    position: "relative",
    marginTop: 20,
  },
  inputLabel: {
    position: 'absolute',
    top: -5,
    left: 10,
    borderRadius: 5,
    color: "#335561",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 8,
    width: "80%",
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
});
