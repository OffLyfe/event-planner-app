import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./screens/LoginScreen";
import CreateEventScreen from "./screens/CreateEventScreen";
import EventList from "./EventList";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen
          name="Events"
          component={EventList}
          options={{ headerBackVisible: false }}
        />

        <Stack.Screen name="Create Event" component={CreateEventScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}