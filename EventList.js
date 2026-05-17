import { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";

import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { signOut } from "firebase/auth";
import { db, auth } from "./firebaseConfig";
import { colors, spacing, radius } from "./theme";

export default function EventList({ navigation }) {
  const [events, setEvents] = useState([]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      alert(error.message);
    }
  };

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

      if (!user) {
        alert("Please log in first.");
        return;
      }

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

      if (!user) {
        alert("Please log in first.");
        return;
      }

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
      <View style={styles.topRow}>
        <Text style={styles.title}>Events</Text>

        <View style={styles.topButtons}>
          <Pressable
            style={styles.friendsButton}
            onPress={() => navigation.navigate("Friends")}
          >
            <Text style={styles.friendsButtonText}>Friends</Text>
          </Pressable>

          <Pressable
            style={styles.createButton}
            onPress={() => navigation.navigate("Create Event")}
          >
            <Text style={styles.createButtonText}>+ Create</Text>
          </Pressable>
        </View>
      </View>

      {events.length === 0 ? (
        <Text style={styles.emptyText}>No events yet.</Text>
      ) : (
        events.map((event) => {
          const isGoing = event.participants?.includes(auth.currentUser?.uid);

          return (
            <Pressable
              key={event.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate("Event Detail", { eventId: event.id })
              }
            >
              <Text style={styles.eventTitle}>{event.title}</Text>

              <Text style={styles.description}>{event.description}</Text>

              <Text style={styles.infoText}>📍 {event.location}</Text>

              <Text style={styles.infoText}>
                📅 {event.date} • 🕒 {event.time}
              </Text>

              <Text style={styles.infoText}>
                👥 {event.participants?.length || 0} going
              </Text>

              <View style={styles.buttonRow}>
                {isGoing ? (
                  <Pressable
                    style={[styles.actionButton, styles.leaveButton]}
                    onPress={() => handleLeaveEvent(event.id)}
                  >
                    <Text style={styles.actionButtonText}>Leave</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={[styles.actionButton, styles.joinButton]}
                    onPress={() => handleJoinEvent(event.id)}
                  >
                    <Text style={styles.actionButtonText}>I'm Going</Text>
                  </Pressable>
                )}

                {event.createdBy === auth.currentUser?.uid && (
                  <Pressable
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteEvent(event.id)}
                  >
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </Pressable>
                )}
              </View>
            </Pressable>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  topButtons: {
    flexDirection: "row",
    gap: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
  },

  createButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.md,
  },

  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  friendsButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.md,
  },

  friendsButtonText: {
    color: colors.primary,
    fontWeight: "bold",
  },

  headerLogout: {
    color: colors.primary,
    fontWeight: "bold",
    marginRight: 10,
  },

  emptyText: {
    fontSize: 16,
    color: colors.muted,
  },

  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    marginBottom: 12,
    backgroundColor: colors.card,
  },

  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: colors.text,
  },

  description: {
    fontSize: 15,
    marginBottom: 8,
    color: colors.text,
  },

  infoText: {
    color: colors.muted,
    marginTop: 4,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: radius.md,
    alignItems: "center",
  },

  joinButton: {
    backgroundColor: colors.primary,
  },

  leaveButton: {
    backgroundColor: colors.danger,
  },

  deleteButton: {
    backgroundColor: "#111827",
  },

  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});