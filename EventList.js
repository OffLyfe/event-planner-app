import { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from "react-native";

import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { db, auth } from "./firebaseConfig";
import { colors, spacing, radius } from "./theme";

const fallbackImage =
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800";

export default function EventList({ navigation }) {
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
      const eventsData = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      setEvents(eventsData);
    });

    return unsubscribe;
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {events.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>🎉</Text>

          <Text style={styles.emptyTitle}>
            No events yet
          </Text>

          <Text style={styles.emptyText}>
            Create your first event and invite friends.
          </Text>
        </View>
      ) : (
        events.map((event) => {
          const isParticipant =
            event.participants?.includes(auth.currentUser?.uid);

          const eventImage = event.imageUrl || fallbackImage;

          return (
            <Pressable
              key={event.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate("Event Detail", {
                  eventId: event.id,
                })
              }
            >
              <Image
                source={{ uri: eventImage }}
                style={styles.cardImage}
              />

              <View style={styles.cardContent}>
                <View style={styles.creatorRow}>
                  <Image
                    source={
                      event.creatorAvatar
                        ? { uri: event.creatorAvatar }
                        : require("./assets/default-avatar.png")
                    }
                    style={styles.creatorAvatar}
                  />

                  <View>
                    <Text style={styles.creatorName}>
                      @{event.creatorName || "unknown"}
                    </Text>

                    <Text style={styles.creatorSubtext}>
                      created this event
                    </Text>
                  </View>
                </View>

                <Text style={styles.eventTitle}>
                  {event.title}
                </Text>

                <Text
                  style={styles.description}
                  numberOfLines={2}
                >
                  {event.description}
                </Text>

                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>
                    📍 {event.location}
                  </Text>

                  <Text style={styles.infoText}>
                    📅 {event.date} • 🕒 {event.time}
                  </Text>

                  <Text style={styles.infoText}>
                    👥 {event.participants?.length || 0} going
                  </Text>
                </View>

                <View style={styles.actions}>
                  {event.createdBy === auth.currentUser?.uid && (
                    <Pressable
                      style={styles.deleteButton}
                      onPress={() => handleDeleteEvent(event.id)}
                    >
                      <Text style={styles.deleteButtonText}>
                        Delete
                      </Text>
                    </Pressable>
                  )}

                  <Pressable
                    style={[
                      styles.joinButton,
                      isParticipant
                        ? styles.leaveButton
                        : styles.goingButton,
                    ]}
                    onPress={() =>
                      isParticipant
                        ? handleLeaveEvent(event.id)
                        : handleJoinEvent(event.id)
                    }
                  >
                    <Text style={styles.joinButtonText}>
                      {isParticipant
                        ? "Leave"
                        : "I'm Going"}
                    </Text>
                  </Pressable>
                </View>
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
  },

  content: {
    padding: spacing.lg,
    paddingBottom: 120,
  },

  emptyBox: {
    alignItems: "center",
    marginTop: 120,
  },

  emptyEmoji: {
    fontSize: 60,
    marginBottom: spacing.md,
  },

  emptyTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.text,
    marginBottom: spacing.sm,
  },

  emptyText: {
    color: colors.muted,
    textAlign: "center",
    paddingHorizontal: spacing.lg,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    overflow: "hidden",
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  cardImage: {
    width: "100%",
    height: 210,
    backgroundColor: colors.border,
  },

  cardContent: {
    padding: spacing.lg,
  },

  creatorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  creatorAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: spacing.sm,
    backgroundColor: colors.border,
  },

  creatorName: {
    fontWeight: "900",
    color: colors.text,
  },

  creatorSubtext: {
    color: colors.muted,
    fontSize: 12,
  },

  eventTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
    marginBottom: spacing.sm,
  },

  description: {
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.md,
  },

  infoBox: {
    backgroundColor: "#FFF9E8",
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  infoText: {
    color: colors.text,
    marginBottom: 4,
    fontWeight: "700",
  },

  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },

  deleteButton: {
    flex: 1,
    backgroundColor: colors.secondary,
    padding: 14,
    borderRadius: radius.md,
    alignItems: "center",
  },

  deleteButtonText: {
    color: "#fff",
    fontWeight: "900",
  },

  joinButton: {
    flex: 1,
    padding: 14,
    borderRadius: radius.md,
    alignItems: "center",
  },

  goingButton: {
    backgroundColor: colors.primary,
  },

  leaveButton: {
    backgroundColor: "#FACC15",
  },

  joinButtonText: {
    color: colors.text,
    fontWeight: "900",
  },
});