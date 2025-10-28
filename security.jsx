// app/SecurityScreen.jsx
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
import { useAuth } from "../context/AuthProvider";
import { useTheme } from "../context/ThemeProvider";

export default function SecurityScreen() {
  const { user } = useAuth();
  const { theme, themeColors: rawThemeColors } = useTheme() || {};
  const colors = rawThemeColors || {
    background: theme === "dark" ? "#0F172A" : "#ffffff",
    text: theme === "dark" ? "#F9FAFB" : "#111827",
    subtext: theme === "dark" ? "#CBD5E1" : "#6B7280",
    card: theme === "dark" ? "#1E293B" : "#f3f4f6",
    tint: theme === "dark" ? "#3B82F6" : "#2563EB",
    border: theme === "dark" ? "#334155" : "#e5e7eb",
  };

  // Local state placeholders (replace with real persisted values)
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [appLockEnabled, setAppLockEnabled] = useState(false);

  const confirmChangePassword = () => {
    // navigate to change password screen or show modal
    Alert.alert("Change Password", "Navigate to change password flow (implement).");
  };

  const manageSessions = () => {
    // open sessions page (implement)
    Alert.alert("Active Sessions", "Open device/session manager (implement).");
  };

  const toggle2FA = async (val) => {
    // TODO: call backend to enable/disable 2FA
    setTwoFactorEnabled(val);
    Alert.alert("Two-factor authentication", val ? "Enabled" : "Disabled");
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.heading, { color: colors.text }]}>Security</Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity style={styles.row} onPress={confirmChangePassword}>
          <View style={styles.left}>
            <Ionicons name="key-outline" size={20} color={colors.tint} />
            <Text style={[styles.label, { color: colors.text }]}>Change password</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
        </TouchableOpacity>

        <View style={styles.row}>
          <View style={styles.left}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.tint} />
            <Text style={[styles.label, { color: colors.text }]}>Two-factor authentication</Text>
          </View>
          <Switch
            value={twoFactorEnabled}
            onValueChange={toggle2FA}
            trackColor={{ false: "#d1d5db", true: colors.tint }}
            thumbColor={twoFactorEnabled ? "#fff" : undefined}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.left}>
            <Ionicons name="finger-print-outline" size={20} color={colors.tint} />
            <Text style={[styles.label, { color: colors.text }]}>Biometric sign-in</Text>
          </View>
          <Switch
            value={biometricEnabled}
            onValueChange={(v) => setBiometricEnabled(v)}
            trackColor={{ false: "#d1d5db", true: colors.tint }}
            thumbColor={biometricEnabled ? "#fff" : undefined}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.left}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.tint} />
            <Text style={[styles.label, { color: colors.text }]}>App lock (PIN)</Text>
          </View>
          <Switch
            value={appLockEnabled}
            onValueChange={(v) => setAppLockEnabled(v)}
            trackColor={{ false: "#d1d5db", true: colors.tint }}
            thumbColor={appLockEnabled ? "#fff" : undefined}
          />
        </View>

        <TouchableOpacity style={styles.row} onPress={manageSessions}>
          <View style={styles.left}>
            <Ionicons name="phone-portrait-outline" size={20} color={colors.tint} />
            <Text style={[styles.label, { color: colors.text }]}>Active sessions & devices</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() => Alert.alert("Security log", "Open security activity log (implement).")}
        >
          <View style={styles.left}>
            <Ionicons name="time-outline" size={20} color={colors.tint} />
            <Text style={[styles.label, { color: colors.text }]}>Security activity</Text>
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
  card: {
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: 1,
  },
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
