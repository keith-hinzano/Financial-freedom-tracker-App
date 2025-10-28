import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeProvider";
import { useAuth } from "../context/AuthProvider";

export default function AccountSettingsScreen() {
  const { themeColors } = useTheme();
  const { profile } = useAuth(); // assuming your AuthProvider provides this
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [language, setLanguage] = useState("English (US)");
  const [region, setRegion] = useState("Kenya");

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert("Changes Saved", "Your account settings have been updated successfully.");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>Account Settings</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Ionicons
            name={isEditing ? "checkmark-done-circle" : "create-outline"}
            size={24}
            color={themeColors.tint}
          />
        </TouchableOpacity>
      </View>

      {/* Personal Information */}
      <View style={[styles.section, { backgroundColor: themeColors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Personal Information</Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: themeColors.textSecondary }]}>Full Name</Text>
          <TextInput
            style={[
              styles.input,
              { color: themeColors.text, borderColor: themeColors.borderColor },
            ]}
            editable={isEditing}
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            placeholderTextColor={themeColors.placeholder}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: themeColors.textSecondary }]}>Email</Text>
          <TextInput
            style={[
              styles.input,
              { color: themeColors.text, borderColor: themeColors.borderColor },
            ]}
            editable={false}
            value={email}
          />
          <Text style={[styles.verified, { color: themeColors.success }]}>
            <Ionicons name="checkmark-circle" size={14} /> Verified
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: themeColors.textSecondary }]}>Phone</Text>
          <TextInput
            style={[
              styles.input,
              { color: themeColors.text, borderColor: themeColors.borderColor },
            ]}
            editable={isEditing}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            placeholderTextColor={themeColors.placeholder}
          />
        </View>
      </View>

      {/* Language & Region */}
      <View style={[styles.section, { backgroundColor: themeColors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Language & Region</Text>

        <View style={styles.row}>
          <Text style={[styles.label, { color: themeColors.textSecondary }]}>Language</Text>
          <Text style={[styles.value, { color: themeColors.text }]}>{language}</Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, { color: themeColors.textSecondary }]}>Region</Text>
          <Text style={[styles.value, { color: themeColors.text }]}>{region}</Text>
        </View>
      </View>

      {/* Account Management */}
      <View style={[styles.section, { backgroundColor: themeColors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Account Management</Text>

        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => Alert.alert("Export Data", "Exporting your account data...")}
        >
          <Ionicons name="download-outline" size={22} color={themeColors.tint} />
          <Text style={[styles.actionText, { color: themeColors.text }]}>
            Export Account Data
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => Alert.alert("Deactivate Account", "Your account will be temporarily deactivated.")}
        >
          <Ionicons name="pause-circle-outline" size={22} color={themeColors.warning} />
          <Text style={[styles.actionText, { color: themeColors.text }]}>
            Deactivate Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionRow}
          onPress={() =>
            Alert.alert(
              "Delete Account",
              "Are you sure you want to permanently delete your account?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive" },
              ]
            )
          }
        >
          <Ionicons name="trash-outline" size={22} color={themeColors.error} />
          <Text style={[styles.actionText, { color: themeColors.error }]}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>

      {isEditing && (
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: themeColors.tint }]}
          onPress={handleSave}
        >
          <Text style={[styles.saveText, { color: themeColors.buttonText }]}>Save Changes</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  verified: {
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 10,
  },
  saveButton: {
    marginTop: 10,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 40,
  },
  saveText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
