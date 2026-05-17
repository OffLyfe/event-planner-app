import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  getDoc,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "../firebaseConfig";
import { colors, spacing, radius } from "../theme";

const fallbackImage =
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800";

export default function EventDetailScreen({ route }) {
  const eventId = route?.params?.eventId;

  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  const chatScrollRef = useRef(null);

  useEffect(() => {
    if (!eventId) return;

    const unsubscribe = onSnapshot(doc(db, "events", eventId), (eventDoc) => {
      if (eventDoc.exists()) {
        setEvent({
          id: eventDoc.id,
          ...eventDoc.data(),
        });
      }
    });

    return unsubscribe;
  }, [eventId]);

  useEffect(() => {
    const loadCurrentUserProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        setCurrentUserProfile(userDoc.data());
      }
    };

    loadCurrentUserProfile();
  }, []);

  useEffect(() => {
    if (!eventId) return;

    const messagesQuery = query(
      collection(db, "events", eventId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      setMessages(messagesData);
    });

    return unsubscribe;
  }, [eventId]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        chatScrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleJoinEvent = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, "events", eventId), {
      participants: arrayUnion(user.uid),
    });
  };

  const handleLeaveEvent = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, "events", eventId), {
      participants: arrayRemove(user.uid),
    });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, "events", eventId, "messages"), {
      text: message.trim(),
      senderUid: user.uid,
      senderUsername:
        currentUserProfile?.username || currentUserProfile?.name || "User",
      senderAvatar: currentUserProfile?.avatarUrl || "",
      createdAt: new Date(),
    });

    setMessage("");
  };

  if (!eventId) {
    return (
      <View style={styles.center}>
        <Text>Event was not found.</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.center}>
        <Text>Loading event...</Text>
      </View>
    );
  }

  const isParticipant = event.participants?.includes(auth.currentUser?.uid);
  const eventImage = event.imageUrl || fallbackImage;

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={{ uri: eventImage }} style={styles.heroImage} />

        <View style={styles.card}>
          <Text style={styles.title}>{event.title}</Text>

          <Text style={styles.creatorText}>
            Created by @{event.creatorName || "unknown"}
          </Text>

          <Text style={styles.description}>{event.description}</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>📍 {event.location}</Text>
            <Text style={styles.infoText}>
              📅 {event.date} • 🕒 {event.time}
            </Text>
            <Text style={styles.infoText}>
              👥 {event.participants?.length || 0} going
            </Text>
          </View>

          <Pressable
            style={[
              styles.joinButton,
              isParticipant ? styles.leaveButton : styles.goingButton,
            ]}
            onPress={isParticipant ? handleLeaveEvent : handleJoinEvent}
          >
            <Text style={styles.joinButtonText}>
              {isParticipant ? "Leave Event" : "I'm Going"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Event Chat</Text>

          {!isParticipant ? (
            <Text style={styles.mutedText}>
              Join this event to access chat.
            </Text>
          ) : (
            <>
              <ScrollView
                ref={chatScrollRef}
                style={styles.chatList}
                nestedScrollEnabled
              >
                {messages.length === 0 ? (
                  <Text style={styles.mutedText}>No messages yet.</Text>
                ) : (
                  messages.map((item) => {
                    const isMine = item.senderUid === auth.currentUser?.uid;

                    return (
                      <View
                        key={item.id}
                        style={[
                          styles.messageRow,
                          isMine ? styles.myMessageRow : styles.otherMessageRow,
                        ]}
                      >
                        {!isMine && (
                          <Image
                            source={
                              item.senderAvatar
                                ? { uri: item.senderAvatar }
                                : require("../assets/default-avatar.png")
                            }
                            style={styles.chatAvatar}
                          />
                        )}

                        <View
                          style={[
                            styles.messageBubble,
                            isMine
                              ? styles.myMessageBubble
                              : styles.otherMessageBubble,
                          ]}
                        >
                          <Text
                            style={[
                              styles.messageSender,
                              isMine
                                ? styles.myMessageSender
                                : styles.otherMessageSender,
                            ]}
                          >
                            @{item.senderUsername || "user"}
                          </Text>

                          <Text
                            style={[
                              styles.messageText,
                              isMine
                                ? styles.myMessageText
                                : styles.otherMessageText,
                            ]}
                          >
                            {item.text}
                          </Text>
                        </View>
                      </View>
                    );
                  })
                )}
              </ScrollView>

              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Write a message..."
                  placeholderTextColor={colors.muted}
                  style={styles.input}
                  value={message}
                  onChangeText={setMessage}
                  returnKeyType="send"
                  onSubmitEditing={handleSendMessage}
                />

                <Pressable style={styles.sendButton} onPress={handleSendMessage}>
                  <Ionicons name="send" size={20} color={colors.text} />
                </Pressable>
              </View>
            </>
          )}
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

  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },

  center: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  heroImage: {
    width: "100%",
    height: 220,
    borderRadius: radius.xl,
    marginBottom: spacing.md,
    backgroundColor: colors.border,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.text,
  },

  creatorText: {
    color: colors.muted,
    marginTop: 4,
    marginBottom: spacing.md,
  },

  description: {
    fontSize: 15,
    color: colors.text,
    marginBottom: spacing.md,
  },

  infoBox: {
    backgroundColor: "#FFF9E8",
    borderRadius: radius.md,
    padding: spacing.md,
  },

  infoText: {
    color: colors.text,
    marginBottom: 4,
    fontWeight: "700",
  },

  joinButton: {
    padding: 15,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: spacing.lg,
  },

  goingButton: {
    backgroundColor: colors.primary,
  },

  leaveButton: {
    backgroundColor: colors.secondary,
  },

  joinButtonText: {
    color: colors.text,
    fontWeight: "900",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.text,
    marginBottom: spacing.md,
  },

  mutedText: {
    color: colors.muted,
  },

  chatList: {
    height: 320,
    marginBottom: spacing.md,
  },

  messageRow: {
    flexDirection: "row",
    marginBottom: spacing.sm,
    alignItems: "flex-end",
  },

  myMessageRow: {
    justifyContent: "flex-end",
  },

  otherMessageRow: {
    justifyContent: "flex-start",
  },

  chatAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: spacing.sm,
  },

  messageBubble: {
    maxWidth: "82%",
    borderRadius: radius.lg,
    padding: 12,
  },

  myMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },

  otherMessageBubble: {
    backgroundColor: "#F3F4F6",
    borderBottomLeftRadius: 4,
  },

  messageSender: {
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 4,
  },

  myMessageSender: {
    color: colors.text,
  },

  otherMessageSender: {
    color: colors.muted,
  },

  messageText: {
    fontSize: 15,
  },

  myMessageText: {
    color: colors.text,
  },

  otherMessageText: {
    color: colors.text,
  },

  inputRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
  },

  input: {
    flex: 1,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    color: colors.text,
  },

  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});