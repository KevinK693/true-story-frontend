import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import React from "react";
import { Dropdown } from "react-native-element-dropdown";

export default function GamesScreen() {
  return (
    <View style={styles.container}>
      <View>
        <Image style={styles.user} source={require("../assets/avatar.png")} />
        <Image
          style={styles.user}
          source={require("../assets/tag_square.png")}
        />
      </View>
      <View>
        <TextInput
          placeholder="Ecrivez un titre..."
          // onChangeText={(value) => setTitle(value)}
          value={title}
          style={styles.input}
        />
      </View>
      <View>
        <Text style={styles.text}>Nombre de joueurs</Text>
        <View style={styles.modalView}>
          <TouchableOpacity
            // onPress={() => handleShowText()}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.textButton}>explanation</Text>
          </TouchableOpacity>
        </View>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={playersOptions}
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder="Sélectionner"
          value={selectedPlayers}
          onChange={(item) => {
            setSelectedPlayers(item.value);
          }}
        />

      </View>
      <View>
        <Text style={styles.text}>Nombre de scènes</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={scenesOptions}
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder="Sélectionner"
          value={selectedScenes}
          onChange={(item) => {
            setSelectedScenes(item.value);
          }}
        />
      </View>
      <View>
        <Text style={styles.text}>Choisir un genre</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={scenesOptions}
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder="Sélectionner"
          value={selectedScenes}
          // onChange={(item) => {
          //   setSelectedScenes(item.value);
          // }}
        />
      </View>
      <View>
        <TouchableOpacity
          // onPress={() => handleSubmit()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textbutton}>REJOINDRE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 40,
    justifyContent: "center",
  },
  placeholderStyle: {
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
  }
})