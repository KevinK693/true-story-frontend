import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";

const avatars = [
  "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747751155/astronaut_mzo08o.png",
  "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747751158/bun_e0epoh.png",
  "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747751155/captain_lurdm1.png",
  "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747751159/clown_mtkoye.png",
  "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747751155/girl_xr1ilk.png",
  "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747751156/knight_zgjmpy.png",
  "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747751160/mage_oslowx.png",
  "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747751158/monster_aqcdkl.png",
  "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747751157/mummy_p7efwx.png",
  "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747751156/mustach_n2ycmf.png",
  "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747751155/robot_ztcpjs.png",
  "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747751155/sloth_qqpwoz.png",
  "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747751155/surgeon_dquvar.png",
  "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747751157/viking_gxsl1c.png",
  "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747751160/witch_mt3j0o.png",
  "https://res.cloudinary.com/dxgix5q4e/image/upload/v1747751159/ninja_hyowdl.png",
];

export default function CreateProfileScreen({ navigation }) {
  const BACKEND_URL = "http:///10.0.3.229:3000"; // Remplacez par l'URL de votre backend

  const [pseudo, setPseudo] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [image, setImage] = useState(null);
  const [invalidProfile, setInvalidProfile] = useState(false);
  const [avatarSelected, setAvatarSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user.value);
  const token = user.token;

  const pickImage = async () => {
    setAvatar(null);
    setAvatarSelected(null);
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
    }
  };

  const pickAvatar = (selectedAvatar) => {
    setAvatar(selectedAvatar);
    setImage(null);
    setAvatarSelected(selectedAvatar);
  };

  const handleCreateProfile = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("token", token);
    formData.append("nickname", pseudo);

    if (image) {
      formData.append("photoFromFront", {
        uri: image,
        name: "photo.jpg",
        type: "image/jpeg",
      });
      setAvatarSelected(null);
    } else if (avatar) {
      formData.append("avatarUrl", avatar);
    }

    fetch(`${BACKEND_URL}/users/profile`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.result) {
          navigation.navigate("TabNavigator");
          setImage(null);
          setAvatar(null);
          setPseudo("");
          setInvalidProfile(false);
        } else {
          console.log("Erreur lors de la création du profil :", data.error);
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Créez votre profil</Text>
      <TextInput
        style={styles.input}
        placeholder="Pseudo"
        placeholderTextColor="#A0A0A0"
        value={pseudo}
        onChangeText={(text) => setPseudo(text)}
      />
      <Text>Importez une image de votre galerie</Text>
      {image ? (
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={styles.editIcon}>
            <FontAwesome5 name="edit" size={16} color="#EADDFF" />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={pickImage} style={{ position: "relative" }}>
          <Image
            source={require("../assets/emptyAvatar.png")}
            style={styles.image}
          />
          <View style={styles.editIcon}>
            <FontAwesome5 name="edit" size={16} color="#EADDFF" />
          </View>
        </TouchableOpacity>
      )}

      <Text style={styles.text}>Ou choisissez un avatar</Text>
      <View style={styles.avatarContainer}>
        {avatars.map((avatar, index) => (
          <Pressable key={index} onPress={() => pickAvatar(avatar)}>
            <Image
              source={{ uri: avatar }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 50,
                margin: 8,
                borderWidth: avatar === avatarSelected ? 3 : 0,
                borderColor: "#65558F",
              }}
            />
          </Pressable>
        ))}
      </View>
      <TouchableOpacity
        onPress={() => handleCreateProfile()}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Créer</Text>
      </TouchableOpacity>
      {invalidProfile ? (
        <Text style={{ color: "red" }}>
          Veuillez choisir un pseudo et un avatar
        </Text>
      ) : null}
      {loading ? (
        <Text style={{ marginTop: 10, color: "#65558F" }}>Chargement...</Text>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF1F1",
    paddingTop: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#335561",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
    marginBottom: 30,
    fontSize: 16,
    color: "#335561",
    height: 50,
    width: "70%",
  },
  avatarContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#65558F",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    height: 50,
  },
  buttonText: {
    color: "#EADDFF",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  text: {
    color: "#335561",
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    marginVertical: 20,
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  editIcon: {
    position: "absolute",
    bottom: 20,
    right: 0,
    backgroundColor: "#65558F",
    borderRadius: 5,
    paddingRight: 2,
    paddingTop: 2,
    paddingLeft: 4,
    paddingBottom: 4,
  },
});
