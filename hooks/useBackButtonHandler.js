import { useEffect } from "react";
import { BackHandler, Alert } from "react-native";

export default function useBackButtonHandler(navigation, message = "Êtes-vous sûr de vouloir quitter la partie en cours ?") {
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Quitter la partie",
        message,
        [
          { text: "Annuler", onPress: () => null, style: "cancel" },
          { text: "Quitter", onPress: () => navigation.goBack() },
        ]
      );
      return true; // Empêche le comportement par défaut
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, [navigation, message]);
}
