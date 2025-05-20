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

const avatars = [
  require("../assets/avatars/astronaut.png"),
  require("../assets/avatars/bun.png"),
  require("../assets/avatars/captain.png"),
  require("../assets/avatars/clown.png"),
  require("../assets/avatars/girl.png"),
  require("../assets/avatars/knight.png"),
  require("../assets/avatars/mage.png"),
  require("../assets/avatars/monster.png"),
  require("../assets/avatars/mummy.png"),
  require("../assets/avatars/mustach.png"),
  require("../assets/avatars/robot.png"),
  require("../assets/avatars/sloth.png"),
  require("../assets/avatars/surgeon.png"),
  require("../assets/avatars/viking.png"),
  require("../assets/avatars/witch.png"),
  require("../assets/avatars/ninja.png"),
];

export default function CreateProfileScreen({ navigation }) {
  const [pseudo, setPseudo] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [image, setImage] = useState("");
  const [invalidProfile, setInvalidProfile] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission requise pour accéder à la galerie.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
      selectionLimit: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selected = result.assets[0];
      setImage(selected.uri);
      setAvatar(null);
    }
  };

  const handleCreateProfile = () => {
    if (
      (image === "" && pseudo.length === 0) ||
      (pseudo.length === 0 && avatar === null)
    ) {
      setInvalidProfile(true);
    } else {
      navigation.navigate("TabNavigator");
    }
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
      <Text style={styles.text}>Importez une image de votre galerie</Text>
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
            source={require("../assets/Avatar.png")}
            style={styles.image}
          />
          <View style={styles.editIcon}>
            <FontAwesome5 name="edit" size={16} color="#EADDFF"/>
          </View>
        </TouchableOpacity>
      )}

      <Text style={styles.text}>Ou choisissez un avatar</Text>
      <View style={styles.avatarContainer}>
        {avatars.map((avatar, index) => (
          <Pressable key={index} onPress={() => setAvatar(avatar)}>
            <Image
              source={avatar}
              style={{
                width: 60,
                height: 60,
                borderRadius: 25,
                margin: 8,
                borderWidth: avatar === image ? 2 : 0,
                borderColor: "#335561",
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
