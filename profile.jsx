import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Switch,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthProvider";
import { useTheme } from "../../context/ThemeProvider";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { profile, logout } = useAuth();
  const { theme, themeColors: rawThemeColors, toggleTheme } = useTheme() || {};
  const router = useRouter();

  // 🪄 Animation setup
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // ✅ Fallback theme
  const themeColors = rawThemeColors || {
    background: "#ffffff",
    card: "#f3f4f6",
    softCard: "#e5e7eb",
    text: "#000000",
    subtext: "#555555",
    accent: "#2563eb",
    primarySoft: "#dbeafe",
  };

  const avatarUri =
    profile?.photoURL ||
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  // 🧠 Helpers
  const getCardBackground = (lightColor) =>
    theme === "dark" ? "#1f2937" : lightColor;
  const getTextColor = (lightColor) =>
    theme === "dark" ? "#f3f4f6" : lightColor;

  // ✅ Animated Logout
  const handleLogout = async () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 700,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start(async () => {
      try {
        await logout();
        router.replace("/"); // Redirect to Welcome page
      } catch (error) {
        console.warn("Logout failed:", error);
        fadeAnim.setValue(1); // Restore if logout fails
      }
    });
  };

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: themeColors.background, opacity: fadeAnim }]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* ===== Header Section ===== */}
          <View
            style={[styles.headerContainer, { backgroundColor: themeColors.card }]}
          >
            <View style={styles.leftSection}>
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
              <Text
                style={[styles.name, { color: getTextColor(themeColors.text) }]}
              >
                {profile?.username || "Madison Lee"}
              </Text>
              <Text
                style={[
                  styles.username,
                  { color: getTextColor(themeColors.subtext) },
                ]}
              >
                @{(profile?.username || "madison")
                  .toLowerCase()
                  .replace(/\s+/g, "_")}
              </Text>
            </View>

            <View style={styles.rightSection}>
              <TouchableOpacity
                style={[
                  styles.smallCard,
                  { backgroundColor: getCardBackground(themeColors.softCard) },
                ]}
              >
                <Ionicons
                  name="qr-code-outline"
                  size={16}
                  color={getTextColor(themeColors.accent)}
                />
                <Text
                  style={[
                    styles.smallCardText,
                    { color: getTextColor(themeColors.accent) },
                  ]}
                >
                  Get paid with QR
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.smallCard,
                  styles.proCard,
                  { opacity: theme === "dark" ? 0.9 : 1 },
                ]}
              >
                <Text style={styles.proCardText}>Upgrade to PRO</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ===== Plan Card ===== */}
          <View
            style={[
              styles.planCard,
              { backgroundColor: getCardBackground(themeColors.softCard) },
            ]}
          >
            <View
              style={[
                styles.planIconBox,
                { backgroundColor: themeColors.primarySoft || "#dbeafe" },
              ]}
            />
            <View>
              <Text
                style={[styles.planTitle, { color: getTextColor(themeColors.text) }]}
              >
                Starter Plan
              </Text>
              <Text
                style={[
                  styles.planSub,
                  { color: getTextColor(themeColors.subtext) },
                ]}
              >
                Renews on October 10
              </Text>
            </View>
          </View>

          {/* ===== General Section ===== */}
          <View style={styles.sectionContainer}>
            <Text
              style={[
                styles.sectionTitle,
                { color: getTextColor(themeColors.text) },
              ]}
            >
              General
            </Text>
            <SettingItem
              icon="help-circle-outline"
              label="Help"
              colors={themeColors}
              theme={theme}
              onPress={() => router.push("/help")}
            />
            <SettingItem
              icon="settings-outline"
              label="Account settings"
              colors={themeColors}
              theme={theme}
              onPress={() => router.push("/AccountSetting")}
            />
            <SettingItem
              icon="link-outline"
              label="Linked Accounts"
              colors={themeColors}
              theme={theme}
              onPress={() => router.push("/LinkedAccounts")}
            />
            <SettingItem
              icon="document-text-outline"
              label="Documents & statements"
              colors={themeColors}
              theme={theme}
              onPress={() => router.push("/DocumentsAndStatements")}
            />
            <SettingItem
              icon="mail-outline"
              label="Inbox"
              badge
              colors={themeColors}
              theme={theme}
              onPress={() => router.push("/inbox")}
            />
          </View>

          {/* ===== Group Settings Section ===== */}
          <View style={styles.sectionContainer}>
            <Text
              style={[
                styles.sectionTitle,
                { color: getTextColor(themeColors.text) },
              ]}
            >
              Group Settings
            </Text>
            <SettingItem
              icon="shield-checkmark-outline"
              label="Security"
              colors={themeColors}
              theme={theme}
              onPress={() => router.push("/security")}
            />
            <SettingItem
              icon="lock-closed-outline"
              label="Privacy"
              colors={themeColors}
              theme={theme}
              onPress={() => router.push("/privacy")}
            />
            <SettingItem
              icon="notifications-outline"
              label="Notifications"
              colors={themeColors}
              theme={theme}
              onPress={() => router.push("/notifications")}
            />

            {/* Theme Toggle */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name="color-palette-outline"
                  size={20}
                  color={getTextColor(themeColors.subtext)}
                />
                <Text
                  style={[
                    styles.settingText,
                    { color: getTextColor(themeColors.text) },
                  ]}
                >
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={theme === "dark"}
                onValueChange={toggleTheme}
                trackColor={{ false: "#d1d5db", true: themeColors.accent }}
                thumbColor={theme === "dark" ? "#f9fafb" : "#111827"}
              />
            </View>

            {/* ✅ Logout Button with Animation */}
            <TouchableOpacity
              onPress={handleLogout}
              activeOpacity={0.85}
              style={[
                styles.logoutButton,
                { backgroundColor: themeColors.accent },
              ]}
            >
              <Ionicons name="log-out-outline" size={18} color="#fff" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

// 🧩 Reusable Setting Item
const SettingItem = ({ icon, label, badge, colors, theme, onPress }) => {
  const iconColor = theme === "dark" ? "#f3f4f6" : colors.subtext;
  const textColor = theme === "dark" ? "#f3f4f6" : colors.text;

  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={20} color={iconColor} />
        <Text style={[styles.settingText, { color: textColor }]}>{label}</Text>
      </View>
      {badge ? (
        <View style={styles.redDot} />
      ) : (
        <Ionicons name="chevron-forward" size={18} color={textColor} />
      )}
    </TouchableOpacity>
  );
};

// 🎨 Styles (unchanged layout)
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
  },
  leftSection: { alignItems: "center", justifyContent: "center" },
  avatar: { width: 80, height: 80, borderRadius: 20, marginBottom: 8 },
  name: { fontSize: 18, fontWeight: "700", textAlign: "center" },
  username: { fontSize: 13, fontWeight: "500", textAlign: "center", marginTop: 2 },
  rightSection: { alignItems: "flex-end" },
  smallCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
  },
  smallCardText: { fontSize: 12, fontWeight: "600", marginLeft: 6 },
  proCard: { backgroundColor: "#2563eb" },
  proCardText: { fontSize: 12, fontWeight: "700", color: "#fff" },
  planCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  planIconBox: { width: 40, height: 40, borderRadius: 10, marginRight: 10 },
  planTitle: { fontSize: 15, fontWeight: "700" },
  planSub: { fontSize: 12 },
  sectionContainer: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: "700", marginBottom: 10 },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  settingLeft: { flexDirection: "row", alignItems: "center" },
  settingText: { marginLeft: 12, fontSize: 15, fontWeight: "500" },
  redDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#ef4444" },
  logoutButton: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 12,
    gap: 6,
  },
  logoutText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});
