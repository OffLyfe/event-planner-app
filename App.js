import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { auth } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import EventList from "./EventList";
import { signOut } from "firebase/auth";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleRegister = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("User registered!");
  } catch (error) {
    alert(error.message);
  }
};

const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Logged in!");
  } catch (error) {
    alert(error.message);
  }
};

const handleCreateEvent = async () => {
  try {
    await addDoc(collection(db, "events"), {
      title: title,
      description: description,
      createdAt: new Date(),
    });

    alert("Event created!");

    setTitle("");
    setDescription("");
  } catch (error) {
    alert(error.message);
  }
};

const handleLogout = async () => {
  try {
    await signOut(auth);
    alert("Logged out!");
  } catch (error) {
    alert(error.message);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event Planner App</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Register" onPress={handleRegister} />
      <View style={{ marginTop: 10 }} />
      <Button title="Login" onPress={handleLogin} />
      <View style={{ marginTop: 10 }} />
      <Button title="Logout" onPress={handleLogout} />
      <TextInput
  placeholder="Event title"
  style={styles.input}
  value={title}
  onChangeText={setTitle}
/>

<TextInput
  placeholder="Event description"
  style={styles.input}
  value={description}
  onChangeText={setDescription}
/>

<Button title="Create Event" onPress={handleCreateEvent} />
<EventList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
});