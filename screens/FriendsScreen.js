import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";

import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { auth, db } from "../firebaseConfig";
import { colors, spacing, radius } from "../theme";

export default function FriendsScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [events, setEvents] = useState([]);

  const sendFriendRequest = async () => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        alert("Please log in first.");
        return;
      }

      if (!username.trim()) {
        alert("Enter username.");
        return;
      }

      const cleanUsername = username.trim().toLowerCase();

      const userQuery = query(
        collection(db, "users"),
        where("username", "==", cleanUsername)
      );

      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        alert("User not found.");
        return;
      }

      const targetDoc = userSnapshot.docs[0];
      const targetUid = targetDoc.id;

      if (targetUid === currentUser.uid) {
        alert("You cannot add yourself.");
        return;
      }

      const currentUserDoc = await getDoc(doc(db, "users", currentUser.uid));

      if (!currentUserDoc.exists()) {
        alert("Current user profile was not found.");
        return;
      }

      const currentUserData = currentUserDoc.data();

      await addDoc(collection(db, "friendRequests"), {
        fromUid: currentUser.uid,
        fromName: currentUserData.name,
        fromUsername: currentUserData.username,
        toUid: targetUid,
        status: "pending",
        createdAt: new Date(),
      });

      alert("Friend request sent.");
      setUsername("");
    } catch (error) {
      alert(error.message);
    }
  };

  const acceptRequest = async (request) => {
    try {
      const currentUser = auth.currentUser;

      await updateDoc(doc(db, "users", currentUser.uid), {
        friends: arrayUnion(request.fromUid),
      });

      await updateDoc(doc(db, "users", request.fromUid), {
        friends: arrayUnion(currentUser.uid),
      });

      await updateDoc(doc(db, "friendRequests", request.id), {
        status: "accepted",
      });

      alert("Friend added.");
    } catch (error) {
      alert(error.message);
    }
  };

  const declineRequest = async (requestId) => {
    try {
      await updateDoc(doc(db, "friendRequests", requestId), {
        status: "declined",
      });
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (!currentUser) return;

    const requestsQuery = query(
      collection(db, "friendRequests"),
      where("toUid", "==", currentUser.uid)
    );

    const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
      const requestsData = snapshot.docs
        .map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }))
        .filter((request) => request.status === "pending");

      setIncomingRequests(requestsData);
    });

    const unsubscribeUser = onSnapshot(
      doc(db, "users", currentUser.uid),
      async (userDoc) => {
        const userData = userDoc.data();

        if (!userData?.friends || userData.friends.length === 0) {
          setFriends([]);
          return;
        }

        const friendProfiles = [];

        for (const friendUid of userData.friends) {
          const friendDoc = await getDoc(doc(db, "users", friendUid));

          if (friendDoc.exists()) {
            friendProfiles.push({
              id: friendUid,
              ...friendDoc.data(),
            });
          }
        }

        setFriends(friendProfiles);
      }
    );

    return () => {
      unsubscribeRequests();
      unsubscribeUser();
    };
  }, []);

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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Friends</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Add friend</Text>

        <TextInput
          placeholder="Enter username"
          placeholderTextColor={colors.muted}
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Pressable style={styles.primaryButton} onPress={sendFriendRequest}>
          <Text style={styles.primaryButtonText}>Send request</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Friend requests</Text>

        {incomingRequests.length === 0 ? (
          <Text style={styles.mutedText}>No incoming requests.</Text>
        ) : (
          incomingRequests.map((request) => (
            <View key={request.id} style={styles.requestBox}>
              <Text style={styles.friendName}>
                {request.fromName} (@{request.fromUsername})
              </Text>

              <View style={styles.row}>
                <Pressable
                  style={[styles.smallButton, styles.acceptButton]}
                  onPress={() => acceptRequest(request)}
                >
                  <Text style={styles.smallButtonText}>Accept</Text>
                </Pressable>

                <Pressable
                  style={[styles.smallButton, styles.declineButton]}
                  onPress={() => declineRequest(request.id)}
                >
                  <Text style={styles.smallButtonText}>Decline</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>My friends</Text>

        {friends.length === 0 ? (
          <Text style={styles.mutedText}>No friends yet.</Text>
        ) : (
          friends.map((friend) => {
            const friendEvents = events.filter((event) =>
              event.participants?.includes(friend.id)
            );

            return (
              <View key={friend.id} style={styles.friendBox}>
                <Text style={styles.friendName}>{friend.name}</Text>
                <Text style={styles.mutedText}>@{friend.username}</Text>

                <Text style={styles.goingTitle}>Going to:</Text>

                {friendEvents.length === 0 ? (
                  <Text style={styles.mutedText}>No joined events.</Text>
                ) : (
                  friendEvents.map((event) => (
                    <Pressable
                      key={event.id}
                      style={styles.eventItemBox}
                      onPress={() =>
                        navigation.navigate("Event Detail", {
                          eventId: event.id,
                        })
                      }
                    >
                      <Text style={styles.eventItemTitle}>{event.title}</Text>

                      <Text style={styles.eventItemMeta}>
                        📍 {event.location} • 📅 {event.date}
                      </Text>
                    </Pressable>
                  ))
                )}
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.md,
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
    padding: 14,
    borderRadius: radius.md,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  mutedText: {
    color: colors.muted,
  },
  requestBox: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.md,
  },
  friendBox: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.md,
  },
  friendName: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: spacing.md,
  },
  smallButton: {
    flex: 1,
    padding: 12,
    borderRadius: radius.md,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: colors.primary,
  },
  declineButton: {
    backgroundColor: colors.danger,
  },
  smallButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  goingTitle: {
    marginTop: spacing.sm,
    fontWeight: "bold",
    color: colors.text,
  },
  eventItemBox: {
    marginTop: spacing.sm,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: colors.border,
  },
  eventItemTitle: {
    color: colors.text,
    fontWeight: "bold",
  },
  eventItemMeta: {
    color: colors.muted,
    marginTop: 4,
    fontSize: 12,
  },
});