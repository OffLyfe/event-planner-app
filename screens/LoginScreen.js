import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";

import { auth, db } from "../firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { colors, spacing, radius } from "../theme";

export default function LoginScreen({ navigation }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
        alert("Please fill in all fields.");
        return;
      }

      const cleanUsername = username.trim().toLowerCase();

      const usernameQuery = query(
        collection(db, "users"),
        where("username", "==", cleanUsername)
      );

      const usernameSnapshot = await getDocs(usernameQuery);

      if (!usernameSnapshot.empty) {
        alert("Username is already taken.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: name.trim(),
        username: cleanUsername,
        email: email.trim().toLowerCase(),
        friends: [],
        avatarUrl: "",
        createdAt: new Date(),
      });

      alert("Account created! Please log in.");

      setName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setIsRegister(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);

      setEmail("");
      setPassword("");

      navigation.replace("Main");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.decorTop} />
        <View style={styles.decorBottom} />

        <View style={styles.card}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />

          <Text style={styles.tagline}>Meet people. Share moments.</Text>

          <Text style={styles.title}>
            {isRegister ? "Create account" : "Welcome back"}
          </Text>

          {isRegister && (
            <>
              <TextInput
                placeholder="Name"
                placeholderTextColor={colors.muted}
                style={styles.input}
                value={name}
                onChangeText={setName}
              />

              <TextInput
                placeholder="Username"
                placeholderTextColor={colors.muted}
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </>
          )}

          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.muted}
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Pressable
            style={styles.primaryButton}
            onPress={isRegister ? handleRegister : handleLogin}
          >
            <Text style={styles.primaryButtonText}>
              {isRegister ? "Create Account" : "Sign In"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => setIsRegister(!isRegister)}
          >
            <Text style={styles.secondaryButtonText}>
              {isRegister ? "Already have an account? Sign In" : "Create Account"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },

  decorTop: {
    position: "absolute",
    top: -80,
    right: -70,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.primary,
    opacity: 0.9,
  },

  decorBottom: {
    position: "absolute",
    bottom: -80,
    left: -80,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: colors.secondary,
    opacity: 0.9,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },

  logo: {
    width: 170,
    height: 120,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: spacing.sm,
  },

  tagline: {
    color: colors.muted,
    textAlign: "center",
    marginBottom: spacing.xl,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.lg,
  },

  input: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 15,
    marginBottom: spacing.md,
    color: colors.text,
  },

  primaryButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: radius.lg,
    alignItems: "center",
    marginTop: spacing.sm,
  },

  primaryButtonText: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 16,
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    borderRadius: radius.lg,
    alignItems: "center",
    marginTop: spacing.md,
    backgroundColor: "#fff",
  },

  secondaryButtonText: {
    color: colors.text,
    fontWeight: "700",
  },
});