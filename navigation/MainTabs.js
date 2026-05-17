import React from "react";
import { Image, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import EventList from "../EventList";
import CreateEventScreen from "../screens/CreateEventScreen";
import FriendsScreen from "../screens/FriendsScreen";
import ProfileScreen from "../screens/ProfileScreen";

import { colors } from "../theme";

const Tab = createBottomTabNavigator();

function HeaderLogo() {
  return (
    <Image
      source={require("../assets/logo.png")}
      style={styles.logo}
    />
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitle: () => <HeaderLogo />,
        headerTitleAlign: "center",

        headerStyle: {
          backgroundColor: colors.background,
        },

        headerShadowVisible: false,

        headerLeft: () => null,
        headerRight: () => null,

        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 8,
          height: 76,
          paddingBottom: 10,
          paddingTop: 8,
        },

        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.muted,

        tabBarLabelStyle: {
          fontWeight: "800",
        },

        tabBarIcon: ({ color, size }) => {
          let iconName = "ellipse";

          if (route.name === "Events") iconName = "home";
          if (route.name === "Create") iconName = "add-circle";
          if (route.name === "Friends") iconName = "people";
          if (route.name === "Profile") iconName = "person";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Events" component={EventList} />
      <Tab.Screen name="Create" component={CreateEventScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 190,
    height: 58,
    resizeMode: "contain",
  },
});