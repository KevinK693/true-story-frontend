import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserPastGamesScreen() {
  return(
    <SafeAreaView style={styles.container}>
      <Text>Vos histoires</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF1F1",
    alignItems: "center",
    padding: 20,
  }
})