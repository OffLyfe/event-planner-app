import React, { useLayoutEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { colors, spacing, radius } from "../theme";

export default function CreateEventScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerRight: () => (
        <Pressable onPress={handleLogout}>
          <Text style={styles.headerLogout}>Logout</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCreateEvent = async () => {
    try {
      await addDoc(collection(db, "events"), {
        title,
        description,
        createdAt: new Date(),
      });

      alert("Event created!");
      setTitle("");
      setDescription("");
      navigation.navigate("Events");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Event</Text>

      <TextInput
        placeholder="Event title"
        placeholderTextColor={colors.muted}
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Event description"
        placeholderTextColor={colors.muted}
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <Pressable style={styles.primaryButton} onPress={handleCreateEvent}>
        <Text style={styles.primaryButtonText}>Create Event</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("Events")}
      >
        <Text style={styles.secondaryButtonText}>View Events</Text>
      </Pressable>
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
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.text,
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
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 15,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: spacing.md,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  headerLogout: {
    color: colors.primary,
    fontWeight: "bold",
    marginRight: 10,
  },
});