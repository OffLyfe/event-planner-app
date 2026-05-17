import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function CreateEventScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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

      <View style={{ marginTop: 10 }} />
      <Button title="View Events" onPress={() => navigation.navigate("Events")} />
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