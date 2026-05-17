import React, { useEffect, useRef, useState } from "react";
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
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { auth, db } from "../firebaseConfig";
import { colors, spacing, radius } from "../theme";

export default function EventDetailScreen({ route }) {
  const { eventId } = route.params;

  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  const chatScrollRef = useRef(null);

  useEffect(() => {
    const loadEvent = async () => {
      const eventDoc = await getDoc(doc(db, "events", eventId));

      if (eventDoc.exists()) {
        setEvent({
          id: eventDoc.id,
          ...eventDoc.data(),
        });
      }
    };

    loadEvent();
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

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const user = auth.currentUser;

    if (!user) {
      alert("Please log in first.");
      return;
    }

    await addDoc(collection(db, "events", eventId, "messages"), {
      text: message.trim(),
      senderUid: user.uid,
      senderUsername:
        currentUserProfile?.username || currentUserProfile?.name || "User",
      createdAt: new Date(),
    });

    setMessage("");
  };

  if (!event) {
    return (
      <View style={styles.container}>
        <Text>Loading event...</Text>
      </View>
    );
  }

  const isParticipant = event.participants?.includes(auth.currentUser?.uid);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{event.title}</Text>

        <Text style={styles.description}>{event.description}</Text>

        <Text style={styles.infoText}>📍 {event.location}</Text>

        <Text style={styles.infoText}>
          📅 {event.date} • 🕒 {event.time}
        </Text>

        <Text style={styles.infoText}>
          👥 {event.participants?.length || 0} going
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Event Chat</Text>

        {!isParticipant ? (
          <Text style={styles.mutedText}>Join this event to access chat.</Text>
        ) : (
          <>
            {messages.length === 0 ? (
              <Text style={styles.mutedText}>No messages yet.</Text>
            ) : (
              <ScrollView
                ref={chatScrollRef}
                style={styles.chatList}
                nestedScrollEnabled
              >
                {messages.map((item) => {
                  const isMine = item.senderUid === auth.currentUser?.uid;

                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.messageWrapper,
                        isMine
                          ? styles.myMessageWrapper
                          : styles.otherMessageWrapper,
                      ]}
                    >
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
                })}
              </ScrollView>
            )}

            <View style={styles.inputRow}>
              <TextInput
                placeholder="Write a message..."
                placeholderTextColor={colors.muted}
                style={styles.input}
                value={message}
                onChangeText={setMessage}
              />

              <Pressable style={styles.sendButton} onPress={handleSendMessage}>
                <Text style={styles.sendButtonText}>Send</Text>
              </Pressable>
            </View>
          </>
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

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.sm,
  },

  description: {
    fontSize: 15,
    color: colors.text,
    marginBottom: spacing.md,
  },

  infoText: {
    color: colors.muted,
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.md,
  },

  mutedText: {
    color: colors.muted,
  },

  chatList: {
    maxHeight: 300,
    marginBottom: spacing.md,
  },

  messageWrapper: {
    marginBottom: spacing.sm,
  },

  myMessageWrapper: {
    alignItems: "flex-end",
  },

  otherMessageWrapper: {
    alignItems: "flex-start",
  },

  messageBubble: {
    maxWidth: "85%",
    borderRadius: radius.md,
    padding: 12,
  },

  myMessageBubble: {
    backgroundColor: colors.primary,
  },

  otherMessageBubble: {
    backgroundColor: "#F3F4F6",
  },

  messageSender: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "bold",
  },

  myMessageSender: {
    color: "#E0E7FF",
  },

  otherMessageSender: {
    color: colors.muted,
  },

  messageText: {
    fontSize: 15,
  },

  myMessageText: {
    color: "#FFFFFF",
  },

  otherMessageText: {
    color: colors.text,
  },

  inputRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: spacing.md,
  },

  input: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
    color: colors.text,
  },

  sendButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
  },

  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});