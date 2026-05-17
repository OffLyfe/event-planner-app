import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { auth, db } from "../firebaseConfig";
import { colors, spacing, radius } from "../theme";

export default function CreateEventScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const pickEventImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const takeEventImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      alert("Camera permission is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const handleCreateEvent = async () => {
    if (!title.trim() || !location.trim()) {
      alert("Please fill in title and location.");
      return;
    }

    if (!auth.currentUser) {
      alert("Please log in first.");
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const userData = userDoc.data();

      await addDoc(collection(db, "events"), {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        imageUrl: imageUrl.trim(),
        date: date.toDateString(),
        time: time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        participants: [],
        createdBy: auth.currentUser.uid,
        creatorName: userData?.username || userData?.name || "unknown",
        creatorAvatar: userData?.avatarUrl || "",
        createdAt: new Date(),
      });

      alert("Event created!");

      setTitle("");
      setDescription("");
      setLocation("");
      setImageUrl("");
      setDate(new Date());
      setTime(new Date());

      navigation.navigate("Events");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create Event</Text>

        <View style={styles.imageBox}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.previewImage} />
          ) : (
            <>
              <Text style={styles.imageIcon}>🖼️</Text>
              <Text style={styles.imageText}>Add Event Image</Text>
            </>
          )}
        </View>

        <View style={styles.imageActions}>
          <Pressable style={styles.imageButton} onPress={pickEventImage}>
            <Text style={styles.imageButtonText}>Gallery</Text>
          </Pressable>

          <Pressable style={styles.imageButtonSecondary} onPress={takeEventImage}>
            <Text style={styles.imageButtonSecondaryText}>Camera</Text>
          </Pressable>
        </View>

        <TextInput
          placeholder="Event Title"
          placeholderTextColor={colors.muted}
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          returnKeyType="next"
        />

        <TextInput
          placeholder="Description"
          placeholderTextColor={colors.muted}
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
        />

        <TextInput
          placeholder="Location"
          placeholderTextColor={colors.muted}
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          returnKeyType="done"
        />

        <View style={styles.row}>
          <Pressable
            style={styles.dateButton}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.dateButtonText}>📅 {date.toDateString()}</Text>
          </Pressable>

          <Pressable
            style={styles.dateButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              🕒{" "}
              {time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </Pressable>
        </View>

        <DateTimePickerModal
          isVisible={showPicker}
          mode="date"
          date={date}
          isDarkModeEnabled={false}
          themeVariant="light"
          onConfirm={(selectedDate) => {
            setDate(selectedDate);
            setShowPicker(false);
          }}
          onCancel={() => setShowPicker(false)}
        />

        <DateTimePickerModal
          isVisible={showTimePicker}
          mode="time"
          date={time}
          isDarkModeEnabled={false}
          themeVariant="light"
          onConfirm={(selectedTime) => {
            setTime(selectedTime);
            setShowTimePicker(false);
          }}
          onCancel={() => setShowTimePicker(false)}
        />

        <Pressable style={styles.primaryButton} onPress={handleCreateEvent}>
          <Text style={styles.primaryButtonText}>Create Event</Text>
        </Pressable>
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
    flexGrow: 1,
    padding: spacing.lg,
    paddingBottom: 120,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.lg,
  },

  imageBox: {
    height: 170,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.primary,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    backgroundColor: "#FFF9E8",
    overflow: "hidden",
  },

  previewImage: {
    width: "100%",
    height: "100%",
  },

  imageIcon: {
    fontSize: 30,
    marginBottom: spacing.sm,
  },

  imageText: {
    color: colors.primaryDark,
    fontWeight: "900",
  },

  imageActions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  imageButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 13,
    borderRadius: radius.md,
    alignItems: "center",
  },

  imageButtonText: {
    color: colors.text,
    fontWeight: "900",
  },

  imageButtonSecondary: {
    flex: 1,
    backgroundColor: colors.secondary,
    padding: 13,
    borderRadius: radius.md,
    alignItems: "center",
  },

  imageButtonSecondaryText: {
    color: "#fff",
    fontWeight: "900",
  },

  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 15,
    marginBottom: spacing.md,
    color: colors.text,
  },

  textArea: {
    minHeight: 90,
  },

  row: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  dateButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
  },

  dateButtonText: {
    color: colors.text,
    fontWeight: "700",
  },

  primaryButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: spacing.md,
  },

  primaryButtonText: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 16,
  },
});