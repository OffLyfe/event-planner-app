import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import {collection, onSnapshot, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";
import { colors } from "./theme";

export default function EventList() {
  const [events, setEvents] = useState([]);

  const handleDeleteEvent = async (id) => {
    try {
      await deleteDoc(doc(db, "events", id));
      alert("Event deleted!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleJoinEvent = async (eventId) => {
    try {
      const user = auth.currentUser;
  
      await updateDoc(doc(db, "events", eventId), {
        participants: arrayUnion(user.uid),
      });
    } catch (error) {
      alert(error.message);
    }
  };
  
  const handleLeaveEvent = async (eventId) => {
    try {
      const user = auth.currentUser;
  
      await updateDoc(doc(db, "events", eventId), {
        participants: arrayRemove(user.uid),
      });
    } catch (error) {
      alert(error.message);
    }
  };

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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Events</Text>

      {events.length === 0 ? (
        <Text style={styles.emptyText}>No events yet.</Text>
      ) : (
        events.map((event) => (
          <View key={event.id} style={styles.card}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.description}>{event.description}</Text>
            <Text style={styles.infoText}>
              👥 {event.participants?.length || 0} going
            </Text>
            <Text style={styles.infoText}>📍 {event.location}</Text>
            <Text style={styles.infoText}>
              📅 {event.date} • 🕒 {event.time}
            </Text>
            <View style={{ marginTop: 10 }} />
            <Button title="Delete" onPress={() => handleDeleteEvent(event.id)} />
            {event.participants?.includes(auth.currentUser?.uid) ? (<Button title="Leave" onPress={() => handleLeaveEvent(event.id)} />) : (<Button title="I'm Going" onPress={() => handleJoinEvent(event.id)} />)}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  emptyText: {
    fontSize: 16,
    color: "#666",
  },

  infoText: {
    color: colors.muted,
    marginTop: 4,
  },

  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 12,
  },

  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },

  description: {
    fontSize: 15,
  },
});