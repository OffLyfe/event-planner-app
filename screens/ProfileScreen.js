import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { auth, db } from "../firebaseConfig";
import { colors, spacing, radius } from "../theme";

export default function ProfileScreen({ navigation }) {
  const user = auth.currentUser;

  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");

  const loadProfile = async () => {
    if (!user) return;

    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists()) {
      const data = userDoc.data();
      setProfile(data);
      setBio(data.bio || "");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const saveAvatar = async (uri) => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        avatarUrl: uri,
      });

      await loadProfile();
    } catch (error) {
      alert(error.message);
    }
  };

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      await saveAvatar(result.assets[0].uri);
    }
  };

  const takeAvatar = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      alert("Camera permission is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      await saveAvatar(result.assets[0].uri);
    }
  };

  const saveBio = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        bio: bio.trim(),
      });

      alert("Profile updated.");
      await loadProfile();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);

      navigation.getParent()?.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
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
        <View style={styles.profileCard}>
          <Image
            source={
              profile?.avatarUrl
                ? { uri: profile.avatarUrl }
                : require("../assets/default-avatar.png")
            }
            style={styles.avatar}
          />

          <Text style={styles.name}>{profile?.name || "User"}</Text>
          <Text style={styles.username}>@{profile?.username || "username"}</Text>
          <Text style={styles.email}>{profile?.email || user?.email}</Text>

          <View style={styles.avatarButtons}>
            <Pressable style={styles.smallButton} onPress={pickAvatar}>
              <Text style={styles.smallButtonText}>Gallery</Text>
            </Pressable>

            <Pressable style={styles.smallButtonSecondary} onPress={takeAvatar}>
              <Text style={styles.smallButtonSecondaryText}>Camera</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Bio</Text>

          <TextInput
            placeholder="Write something about yourself..."
            placeholderTextColor={colors.muted}
            style={styles.bioInput}
            value={bio}
            onChangeText={setBio}
            multiline
            returnKeyType="done"
          />

          <Pressable style={styles.primaryButton} onPress={saveBio}>
            <Text style={styles.primaryButtonText}>Save Profile</Text>
          </Pressable>
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
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
    backgroundColor: colors.background,
    padding: spacing.lg,
  },

  profileCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    marginBottom: spacing.md,
  },

  avatar: {
    width: 135,
    height: 135,
    borderRadius: 68,
    marginBottom: spacing.md,
    backgroundColor: colors.border,
  },

  name: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.text,
  },

  username: {
    color: colors.primaryDark,
    fontWeight: "800",
    marginTop: 4,
  },

  email: {
    color: colors.muted,
    marginTop: 4,
    marginBottom: spacing.lg,
  },

  avatarButtons: {
    flexDirection: "row",
    gap: spacing.sm,
    width: "100%",
  },

  smallButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 13,
    borderRadius: radius.md,
    alignItems: "center",
  },

  smallButtonText: {
    color: colors.text,
    fontWeight: "900",
  },

  smallButtonSecondary: {
    flex: 1,
    backgroundColor: colors.secondary,
    padding: 13,
    borderRadius: radius.md,
    alignItems: "center",
  },

  smallButtonSecondaryText: {
    color: "#fff",
    fontWeight: "900",
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.text,
    marginBottom: spacing.md,
  },

  bioInput: {
    minHeight: 100,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
    color: colors.text,
    textAlignVertical: "top",
    marginBottom: spacing.md,
  },

  primaryButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: radius.md,
    alignItems: "center",
  },

  primaryButtonText: {
    color: colors.text,
    fontWeight: "900",
  },

  logoutButton: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: radius.md,
    alignItems: "center",
  },

  logoutButtonText: {
    color: "#fff",
    fontWeight: "900",
  },
});