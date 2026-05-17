import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";

export default function EventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEvents(eventsData);
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events</Text>

      {events.map((event) => (
        <View key={event.id} style={styles.card}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text>{event.description}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },

  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});