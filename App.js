import React from "react";
import {
  useFonts,
  NotoSans_400Regular,
  NotoSans_700Bold,
  NotoSans_500Medium,
} from "@expo-google-fonts/noto-sans";
import * as SplashScreen from "expo-splash-screen";
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
import VotingScreen from './screens/VotingScreen'
import GameHistoryScreen from "./screens/GameHistoryScreen";
import VoteWinnerScreen from "./screens/VoteWinnerScreen";
import EndGameScreen from "./screens/EndGameScreen";
import UserPastGamesScreen from "./screens/UserPastGamesScreen";
import PlayersListScreen from "./screens/PlayersListScreen";
import WaitingForVoteResultScreen from "./screens/WaitingForVoteResultScreen";

import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Provider, useSelector } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";
import game from './reducers/game'
import scene from './reducers/scene';
import PlayersList from "./screens/PlayersListScreen";

const reducers = combineReducers({ user, game, scene });
const persistConfig = { key: "faceup", storage: AsyncStorage };

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
const persistor = persistStore(store);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const MainStack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

const MainStackScreen = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name="Home" component={HomeScreen} />
    <MainStack.Screen name="JoinGame" component={JoinGameScreen} />
    <MainStack.Screen name="Profile" component={ProfileScreen} />
    <MainStack.Screen
      name="WaitingForPlayers"
      component={WaitingForPlayersScreen}
    />
    <MainStack.Screen name="StartingGame" component={StartingGameScreen} />
    <MainStack.Screen name="Voting" component={VotingScreen} />
    <MainStack.Screen name="GameHistory" component={GameHistoryScreen} />
    <MainStack.Screen name="VoteWinner" component={VoteWinnerScreen} />
    <MainStack.Screen name="EndGame" component={EndGameScreen} />
    <MainStack.Screen name="UserPastGames" component={UserPastGamesScreen} />
    <MainStack.Screen name="PlayersList" component={PlayersListScreen} />
    <MainStack.Screen name="WaitingForVoteResult" component={WaitingForVoteResultScreen} />
  </MainStack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        const iconName = route.name === "Main" ? "home" : "book-open";
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
        fontFamily: "NotoSans_400Regular",
      },
    })}
  >
    <Tab.Screen
      name="Main"
      component={MainStackScreen}
      options={{ title: "Home" }}
    />
    <Tab.Screen
      name="CreateGame"
      component={CreateGameScreen}
      options={{ title: "Create Game" }}
    />
  </Tab.Navigator>
);

const MainNavigator = () => {
  const user = useSelector((state) => state.user.value);

  return (
    <NavigationContainer>
      {user.token ? (
        <TabNavigator />
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
  const [fontsLoaded] = useFonts({
    NotoSans_400Regular,
    NotoSans_700Bold,
    NotoSans_500Medium,
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <MainNavigator />
      </PersistGate>
    </Provider>
  );
}
