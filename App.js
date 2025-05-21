import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import HomeScreen from "./screens/HomeScreen";
import ConnexionScreen from "./screens/ConnexionScreen";
import GamesScreen from "./screens/GamesScreen";
import InscriptionScreen from "./screens/InscriptionScreen";
import CreateProfileScreen from "./screens/CreateProfileScreen";

import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Provider } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";
import { useSelector } from "react-redux";

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

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Games") {
            iconName = "book-open";
          }

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
};

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Connexion" component={ConnexionScreen} />
    <Stack.Screen name="Inscription" component={InscriptionScreen} />
    <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
  </Stack.Navigator>
);

const MainNavigator = () => {
  const token = useSelector((state) => state.user.value.token);

  return (
    <NavigationContainer>
      {token ? <TabNavigator /> : <AuthStack />}
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
