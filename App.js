import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import HomeScreen from "./screens/HomeScreen";
import ConnexionScreen from "./screens/ConnexionScreen";
import CreateGameScreen from "./screens/CreateGameScreen";
import InscriptionScreen from "./screens/InscriptionScreen";
import CreateProfileScreen from "./screens/CreateProfileScreen";
import JoinGameScreen from "./screens/JoinGameScreen";
import ProfileScreen from "./screens/ProfileScreen";
import WaitingForPlayersScreen from "./screens/WaitingForPlayersScreen";
import StartingGameScreen from "./screens/StartingGameScreen";
import UserInputScreen from "./screens/UserInputScreen";

import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Provider, useSelector } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";

const reducers = combineReducers({ user });
const persistConfig = { key: "faceup", storage: AsyncStorage };

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
const persistor = persistStore(store);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        const iconName = route.name === "Home" ? "home" : "book-open";
        return <FontAwesome5 name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#E089FF",
      tabBarInactiveTintColor: "#FBF1F1",
      headerShown: false,
      tabBarStyle: {
        height: 100,
        backgroundColor: "#65558F",
        paddingTop: 5,
        position: "absolute",
        borderTopWidth: 0,
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="CreateGame" component={CreateGameScreen} />
  </Tab.Navigator>
);

const MainNavigator = () => {
  const user = useSelector((state) => state.user.value);

  return (
    <NavigationContainer>
      {user.token ? (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="MainTabs" component={TabNavigator} />
          <RootStack.Screen name="JoinGame" component={JoinGameScreen} />
          <RootStack.Screen name="Profile" component={ProfileScreen} />
          <RootStack.Screen
            name="WaitingForPlayers"
            component={WaitingForPlayersScreen}
          />
          <RootStack.Screen
            name="StartingGame"
            component={StartingGameScreen}
          />
          <RootStack.Screen
            name="UserInput"
            component={UserInputScreen}
          />
        </RootStack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Connexion"
        >
          <Stack.Screen name="Connexion" component={ConnexionScreen} />
          <Stack.Screen name="Inscription" component={InscriptionScreen} />
          <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <MainNavigator />
      </PersistGate>
    </Provider>
  );
}
