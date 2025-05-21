import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import HomeScreen from "./screens/HomeScreen";
import ConnexionScreen from "./screens/ConnexionScreen";
import GamesScreen from "./screens/GamesScreen";
import InscriptionScreen from "./screens/InscriptionScreen";
import CreateProfileScreen from "./screens/CreateProfileScreen";
import JoinGameScreen from "./screens/JoinGameScreen";
import ProfileScreen from "./screens/ProfileScreen";

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

// Tab navigator (Home, Games, etc.)
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        const iconName = route.name === "Home" ? "home" : "book-open";
        return <FontAwesome5 name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#ec6e5b",
      tabBarInactiveTintColor: "#335561",
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Games" component={GamesScreen} />
  </Tab.Navigator>
);

// Auth flow (Connexion, Inscription, CreateProfile)
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Connexion" component={ConnexionScreen} />
    <Stack.Screen name="Inscription" component={InscriptionScreen} />
    <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
  </Stack.Navigator>
);

// Main app navigation (after login)
const RootApp = () => (
  <RootStack.Navigator screenOptions={{ headerShown: false }}>
    <RootStack.Screen name="MainTabs" component={TabNavigator} />
    <RootStack.Screen name="JoinGame" component={JoinGameScreen} />
    <RootStack.Screen name="Profile" component={ProfileScreen} />
    {/* Ajouter ici d'autres écrans comme Continuer, Profil, etc. */}
  </RootStack.Navigator>
);

// Main navigation switcher
const MainNavigator = () => {
  const user = useSelector((state) => state.user.value);

  return (
    <NavigationContainer>
      {!user.token ? (
        <AuthStack />
      ) : !user.hasProfile ? (
        <CreateProfileScreen />
      ) : (
        <RootApp />
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
