import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { auth, db } from "../firebaseConfig";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { colors, spacing, radius } from "../theme";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

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
        email,
        password
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: name.trim(),
        username: cleanUsername,
        email: email.trim().toLowerCase(),
        friends: [],
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
      await signInWithEmailAndPassword(auth, email, password);

      setEmail("");
      setPassword("");

      navigation.replace("Events");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>🎉</Text>

        <Text style={styles.title}>
          {isRegister ? "Create account" : "Welcome back"}
        </Text>

        <Text style={styles.subtitle}>
          {isRegister
            ? "Create your profile and start planning events."
            : "Login to continue to Event Planner."}
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
            {isRegister ? "Create account" : "Login"}
          </Text>
        </Pressable>

        <Pressable onPress={() => setIsRegister(!isRegister)}>
          <Text style={styles.switchText}>
            {isRegister
              ? "Already have an account? Login"
              : "Don't have an account? Create account"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logo: {
    fontSize: 44,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: spacing.md,
    color: colors.text,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  switchText: {
    color: colors.primary,
    textAlign: "center",
    marginTop: spacing.md,
    fontWeight: "600",
  },
});