// app/NotificationsScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeProvider";

export default function NotificationsScreen() {
  const { theme, themeColors: rawThemeColors } = useTheme() || {};
  const colors = rawThemeColors || {
    background: theme === "dark" ? "#0F172A" : "#ffffff",
    text: theme === "dark" ? "#F9FAFB" : "#111827",
    subtext: theme === "dark" ? "#CBD5E1" : "#6B7280",
    card: theme === "dark" ? "#1E293B" : "#f3f4f6",
    tint: theme === "dark" ? "#3B82F6" : "#2563EB",
    border: theme === "dark" ? "#334155" : "#e5e7eb",
  };

  // toggles: channels + categories + preview
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [accountAlerts, setAccountAlerts] = useState(true);
  const [financialUpdates, setFinancialUpdates] = useState(true);
  const [offers, setOffers] = useState(false);
  const [previewEnabled, setPreviewEnabled] = useState(true);
  const [dndEnabled, setDndEnabled] = useState(false);

  const configureDND = () => {
    Alert.alert("Do Not Disturb", "Open DND schedule picker (implement).");
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.heading, { color: colors.text }]}>Notifications</Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Channels</Text>

        <View style={styles.row}>
          <View style={styles.left}>
            <Ionicons name="notifications-outline" size={20} color={colors.tint} />
            <Text style={[styles.label, { color: colors.text }]}>Push notifications</Text>
          </View>
          <Switch value={pushEnabled} onValueChange={setPushEnabled} trackColor={{ true: colors.tint }} />
        </View>

        <View style={styles.row}>
          <View style={styles.left}>
            <Ionicons name="mail-outline" size={20} color={colors.tint} />
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
          </View>
          <Switch value={emailEnabled} onValueChange={setEmailEnabled} trackColor={{ true: colors.tint }} />
        </View>

        <View style={styles.row}>
          <View style={styles.left}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.tint} />
            <Text style={[styles.label, { color: colors.text }]}>SMS</Text>
          </View>
          <Switch value={smsEnabled} onValueChange={setSmsEnabled} trackColor={{ true: colors.tint }} />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 8 }]}>Categories</Text>

        <View style={styles.row}>
          <View style={styles.left}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.tint} />
            <Text style={[styles.label, { color: colors.text }]}>Account alerts</Text>
          </View>
          <Switch value={accountAlerts} onValueChange={setAccountAlerts} trackColor={{ true: colors.tint }} />
        </View>

        <View style={styles.row}>
          <View style={styles.left}>
            <Ionicons name="trending-up-outline" size={20} color={colors.tint} />
            <Text style={[styles.label, { color: colors.text }]}>Financial updates</Text>
          </View>
          <Switch value={financialUpdates} onValueChange={setFinancialUpdates} trackColor={{ true: colors.tint }} />
        </View>

        <View style={styles.row}>
          <View style={styles.left}>
            <Ionicons name="pricetag-outline" size={20} color={colors.tint} />
            <Text style={[styles.label, { color: colors.text }]}>Offers & promotions</Text>
          </View>
          <Switch value={offers} onValueChange={setOffers} trackColor={{ true: colors.tint }} />
        </View>

        <View style={styles.row}>
          <View style={styles.left}>
            <Ionicons name="eye-off-outline" size={20} color={colors.tint} />
            <Text style={[styles.label, { color: colors.text }]}>Preview sensitive content</Text>
          </View>
          <Switch value={previewEnabled} onValueChange={setPreviewEnabled} trackColor={{ true: colors.tint }} />
        </View>

        <TouchableOpacity style={styles.row} onPress={configureDND}>
          <View style={styles.left}>
            <Ionicons name="moon-outline" size={20} color={colors.tint} />
            <Text style={[styles.label, { color: colors.text }]}>Do Not Disturb (schedule)</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  card: { borderRadius: 12, paddingVertical: 8, borderWidth: 1 },
  sectionTitle: { fontSize: 15, fontWeight: "600", marginBottom: 6, paddingHorizontal: 6 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  left: { flexDirection: "row", alignItems: "center" },
  label: { marginLeft: 12, fontSize: 15, fontWeight: "500" },
});
