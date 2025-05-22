import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as ImagePicker from "expo-image-picker";
import { updateAvatar } from "../reducers/user";

export default function ProfileScreen({navigation}) {
  const dispatch = useDispatch();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [image, setImage] = useState(null);
  const [modified, setModified] = useState(false);

  const user = useSelector((state) => state.user.value);
  const token = user.token;
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  useEffect(() => {
    fetch(`${BACKEND_URL}/users/${token}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setAvatarUrl(data.user.avatar);
          setNickname(data.user.nickname);
        } else {
          console.log("Erreur de récupération des données utilisateur");
        }
      });
  }, []);

  const handleShowGames = () => {
    console.log("Afficher les jeux");
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission requise pour accéder à la galerie.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
      base64: true,
      selectionLimit: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selected = result.assets[0];
      setImage(selected.uri);
      setAvatarUrl(selected.uri);
    }
  };

  const handleModifications = () => {
    const formData = new FormData();
    formData.append("token", token);
    formData.append("nickname", nickname);

    if (image) {
      formData.append("photoFromFront", {
        uri: image,
        name: "photo.jpg",
        type: "image/jpeg",
      });
    }
    fetch(`${BACKEND_URL}/users/profile`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setAvatarUrl(data.url);
          dispatch(updateAvatar(data.url));
          setModified(true);
        } else {
          console.log("Erreur lors de la modification du profil :", data.error);
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.icons}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
        >
          <FontAwesome5 name="arrow-left" size={30} color="#335561" solid />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleShowGames()}>
          <FontAwesome5 name="book-open" size={30} color="#335561" solid />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={pickImage}>
        <Image style={styles.image} source={{ uri: avatarUrl }} />
        <View style={styles.editIcon}>
          <FontAwesome5 name="edit" size={26} color="#EADDFF" />
        </View>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder={nickname}
        placeholderTextColor="#A0A0A0"
        autoCapitalize="none"
        value={nickname}
        onChangeText={(text) => setNickname(text)}
      />
      <View style={styles.stats}>
        <View style={styles.statsText}>
          <Text style={styles.text}>Nombre de parties jouées</Text>
          <Text style={styles.text}>Nombre de parties gagnées</Text>
          <Text style={styles.text}>Nombre de votes reçus</Text>
        </View>
        <View style={styles.statsNumber}>
          <Text style={styles.text}>0</Text>
          <Text style={styles.text}>0</Text>
          <Text style={styles.text}>0</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => handleModifications()}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Enregistrer modifications</Text>
      </TouchableOpacity>
      {modified ? <Text>Modifications enregistrées !</Text> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF1F1",
    padding: 20,
    alignItems: "center",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 10,
    marginVertical: 30,
    fontSize: 16,
    color: "#335561",
    height: 50,
    width: "70%",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 20,
  },
  text: {
    fontSize: 20,
    color: "#335561",
    fontWeight: "600",
    marginVertical: 20,
    fontFamily: "NotoSans_500Medium",
  },
  button: {
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    height: 50,
    marginTop: 60,
    justifyContent: "center",
  },
  buttonText: {
    color: "#EADDFF",
    fontSize: 20,
    fontFamily: "NotoSans_700Bold",
    textAlign: "center",
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
    alignItems: "center",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#65558F",
    borderRadius: 5,
    paddingRight: 2,
    paddingTop: 3,
    paddingLeft: 8,
    paddingBottom: 8,
  },
});
