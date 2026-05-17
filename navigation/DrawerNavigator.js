import React from "react";
import { Image, Text, View, Pressable, StyleSheet } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { signOut } from "firebase/auth";

import MainTabs from "./MainTabs";
import { auth } from "../firebaseConfig";
import { colors, spacing, radius } from "../theme";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const handleLogout = async () => {
    await signOut(auth);

    props.navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawer}>
      <View style={styles.logoBox}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.subtitle}>Meet people. Plan events.</Text>
      </View>

      <DrawerItemList {...props} />

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.text,
        drawerInactiveTintColor: colors.muted,
        drawerActiveBackgroundColor: "#FFF3C4",
        drawerStyle: {
          backgroundColor: colors.background,
          width: 280,
        },
        drawerLabelStyle: {
          fontWeight: "800",
        },
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ title: "MEETR" }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    padding: spacing.md,
  },

  logoBox: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  logo: {
    width: 150,
    height: 70,
    resizeMode: "contain",
  },

  subtitle: {
    color: colors.muted,
    marginTop: spacing.sm,
    fontWeight: "600",
  },

  logoutButton: {
    marginTop: "auto",
    backgroundColor: colors.secondary,
    padding: 14,
    borderRadius: radius.md,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "900",
  },
});