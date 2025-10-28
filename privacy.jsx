// app/PrivacyScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeProvider";
import { useAuth } from "../context/AuthProvider";

export default function PrivacyScreen() {
  const { theme, themeColors: rawThemeColors } = useTheme() || {};
  const colors = rawThemeColors || {
    background: theme === "dark" ? "#0F172A" : "#ffffff",
    text: theme === "dark" ? "#F9FAFB" : "#111827",
    subtext: theme === "dark" ? "#CBD5E1" : "#6B7280",
    card: theme === "dark" ? "#1E293B" : "#f3f4f6",
    tint: theme === "dark" ? "#3B82F6" : "#2563EB",
    border: theme === "dark" ? "#334155" : "#e5e7eb",
  };
  const { user } = useAuth();

  // preferences (local state, wire to backend)
  const [analyticsOptIn, setAnalyticsOptIn] = useState(true);
  const [profilePublic, setProfilePublic] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  const exportData = () => {
    Alert.alert("Export data", "Trigger data export flow (implement).");
  };

  const deleteAccount = () => {
    Alert.alert(
      "Delete account",
      "This action is irreversible. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: call backend to delete account
            Alert.alert("Deleted", "Account deletion requested (implement).");
          },
        },
      ]
    );
  };

  const manageLinkedApps = () => {
    Alert.alert("Linked Accounts", "Manage Google / Apple / Facebook (implement).");
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.heading, { color: colors.text }]}>Privacy</Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.row}>
          <View style={styles.left}>
            <Ionicons name="person-outline" size={20} color={colors.tint} />
            <Text style={[styles.label, { color: colors.text }]}>Profile visibility</Text>
          </View>
          <Switch
            value={profilePublic}
            onValueChange={(v) => setProfilePublic(v)}
            trackColor={{ false: "#d1d5db", true: colors.tint }}
            thumbColor={profilePublic ? "#fff" : undefined}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.left}>
            <Ionicons name="analytics-outline" size={20} color={colors.tint} />
            <Text style={[styles.label, { color: colors.text }]}>Analytics & usage</Text>
          </View>
          <Switch
            value={analyticsOptIn}
            onValueChange={(v) => setAnalyticsOptIn(v)}
            trackColor={{ false: "#d1d5db", true: colors.tint }}
            thumbColor={analyticsOptIn ? "#fff" : undefined}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.left}>
            <Ionicons name="mail-outline" size={20} color={colors.tint} />
            <Text style={[styles.label, { color: colors.text }]}>Marketing communications</Text>
          </View>
          <Switch
            value={marketingOptIn}
            onValueChange={(v) => setMarketingOptIn(v)}
            trackColor={{ false: "#d1d5db", true: colors.tint }}
            thumbColor={marketingOptIn ? "#fff" : undefined}
          />
        </View>

        <TouchableOpacity style={styles.row} onPress={manageLinkedApps}>
          <View style={styles.left}>
            <Ionicons name="link-outline" size={20} color={colors.tint} />
            <Text style={[styles.label, { color: colors.text }]}>Connected / Linked accounts</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={exportData}>
          <View style={styles.left}>
            <Ionicons name="download-outline" size={20} color={colors.tint} />
            <Text style={[styles.label, { color: colors.text }]}>Export my data</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={deleteAccount}>
          <View style={styles.left}>
            <Ionicons name="trash-outline" size={20} color={colors.tint} />
            <Text style={[styles.label, { color: colors.text }]}>Delete my account</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.note, { color: colors.subtext }]}>
        You can always review our full Privacy Policy in the About section. Export and deletion requests may take up to 30 days to process depending on backend confirmation.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  card: { borderRadius: 12, paddingVertical: 8, borderWidth: 1 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  left: { flexDirection: "row", alignItems: "center" },
  label: { marginLeft: 12, fontSize: 15, fontWeight: "500" },
  note: { marginTop: 14, fontSize: 13, lineHeight: 18 },
});
