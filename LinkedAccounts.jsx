// app/LinkedAccounts.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeProvider";

export default function LinkedAccounts({ navigation }) {
  const { themeColors } = useTheme();

  const [linkedAccounts, setLinkedAccounts] = useState({
    google: true,
    apple: false,
    facebook: true,
  });

  const [dataSync, setDataSync] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [pendingUnlink, setPendingUnlink] = useState(null);

  // 🧠 Handle toggle with confirmation on unlink
  const handleToggle = (account) => {
    if (linkedAccounts[account]) {
      // Trying to unlink — ask for confirmation
      setPendingUnlink(account);
      setModalVisible(true);
    } else {
      // Linking directly
      setLinkedAccounts((prev) => ({ ...prev, [account]: true }));
    }
  };

  // 🧩 Confirm unlinking
  const confirmUnlink = () => {
    if (pendingUnlink) {
      setLinkedAccounts((prev) => ({ ...prev, [pendingUnlink]: false }));
      setPendingUnlink(null);
      setModalVisible(false);
    }
  };

  // ❌ Cancel unlinking
  const cancelUnlink = () => {
    setPendingUnlink(null);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* 🔙 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={26} color={themeColors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>Linked Accounts</Text>
      </View>

      {/* 🌐 Social Logins */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>
          Social Logins
        </Text>

        {["google", "apple", "facebook"].map((account) => (
          <View key={account} style={styles.row}>
            <Text style={[styles.label, { color: themeColors.text }]}>
              {account.charAt(0).toUpperCase() + account.slice(1)}
            </Text>
            <Switch
              value={linkedAccounts[account]}
              onValueChange={() => handleToggle(account)}
              thumbColor={themeColors.tint}
              trackColor={{ false: themeColors.borderColor, true: themeColors.tint }}
            />
          </View>
        ))}
      </View>

      {/* 🔗 External Apps */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>
          External App Connections
        </Text>
        <TouchableOpacity style={[styles.externalApp, { borderColor: themeColors.borderColor }]}>
          <Ionicons name="link-outline" size={20} color={themeColors.tint} />
          <Text style={[styles.linkText, { color: themeColors.tint }]}>Connect New App</Text>
        </TouchableOpacity>
      </View>

      {/* ☁️ Data Sync */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>
          Sync Data Across Devices
        </Text>
        <View style={styles.row}>
          <Text style={[styles.label, { color: themeColors.text }]}>Enable Data Sync</Text>
          <Switch
            value={dataSync}
            onValueChange={setDataSync}
            thumbColor={themeColors.tint}
            trackColor={{ false: themeColors.borderColor, true: themeColors.tint }}
          />
        </View>
      </View>

      {/* ⚠️ Confirmation Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={cancelUnlink}
      >
        <View style={[styles.modalOverlay, { backgroundColor: "rgba(0,0,0,0.6)" }]}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.cardBackground }]}>
            <Ionicons
              name="alert-circle-outline"
              size={40}
              color={themeColors.warning}
              style={{ marginBottom: 10 }}
            />
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>
              Unlink {pendingUnlink && pendingUnlink.charAt(0).toUpperCase() + pendingUnlink.slice(1)} Account?
            </Text>
            <Text
              style={[styles.modalMessage, { color: themeColors.textSecondary }]}
            >
              You’ll no longer be able to sign in using this account until you relink it.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={cancelUnlink}
                style={[styles.modalButton, { backgroundColor: themeColors.surfaceVariant }]}
              >
                <Text style={[styles.modalButtonText, { color: themeColors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmUnlink}
                style={[styles.modalButton, { backgroundColor: themeColors.error }]}
              >
                <Text style={[styles.modalButtonText, { color: "#FFF" }]}>Unlink</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// 🧱 Styles
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: { fontSize: 14, fontWeight: "600", marginBottom: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  label: { fontSize: 16 },
  externalApp: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 10,
  },
  linkText: { marginLeft: 8, fontSize: 15, fontWeight: "500" },

  // 🔔 Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "600", textAlign: "center" },
  modalMessage: {
    fontSize: 14,
    textAlign: "center",
    marginVertical: 12,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalButtonText: { fontSize: 15, fontWeight: "600" },
});
