import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeProvider";
import { useRouter } from "expo-router";

export default function DocumentsAndStatements() {
  const { theme, themeColors: colors } = useTheme() || {};
  const router = useRouter();

  // ✅ Helper for theme adaptation
  const getText = (light) => (theme === "dark" ? "#f3f4f6" : light);
  const getCard = (light) => (theme === "dark" ? "#1f2937" : light);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ===== Header ===== */}
        <Text style={[styles.header, { color: getText(colors.text) }]}>
          Documents & Statements
        </Text>

        {/* ===== Section 1: Monthly & Annual Statements ===== */}
        <Section title="Financial Statements" colors={colors} theme={theme}>
          <DocumentItem
            icon="calendar-outline"
            title="Monthly Statements"
            description="View and download your monthly summaries"
            onPress={() => {}}
            colors={colors}
            theme={theme}
          />
          <DocumentItem
            icon="bar-chart-outline"
            title="Annual Reports"
            description="Review your yearly financial performance"
            onPress={() => {}}
            colors={colors}
            theme={theme}
          />
        </Section>

        {/* ===== Section 2: Tax & Compliance ===== */}
        <Section title="Tax & Compliance" colors={colors} theme={theme}>
          <DocumentItem
            icon="receipt-outline"
            title="Tax Reports"
            description="Download tax-ready summaries and receipts"
            onPress={() => {}}
            colors={colors}
            theme={theme}
          />
          <DocumentItem
            icon="folder-outline"
            title="Receipts Archive"
            description="Access or export all uploaded receipts"
            onPress={() => {}}
            colors={colors}
            theme={theme}
          />
        </Section>

        {/* ===== Section 3: Investment Reports ===== */}
        <Section title="Portfolio Reports" colors={colors} theme={theme}>
          <DocumentItem
            icon="pie-chart-outline"
            title="Portfolio Performance"
            description="Track portfolio performance across categories"
            onPress={() => {}}
            colors={colors}
            theme={theme}
          />
          <DocumentItem
            icon="stats-chart-outline"
            title="ROI and Benchmark"
            description="Compare your growth against key financial benchmarks"
            onPress={() => {}}
            colors={colors}
            theme={theme}
          />
        </Section>

        {/* ===== Section 4: Transaction History ===== */}
        <Section title="Transaction History" colors={colors} theme={theme}>
          <DocumentItem
            icon="list-outline"
            title="View Transactions"
            description="Search and filter by category or date"
            onPress={() => {}}
            colors={colors}
            theme={theme}
          />
          <DocumentItem
            icon="cloud-download-outline"
            title="Export Data"
            description="Export transactions as CSV, PDF, or Excel"
            onPress={() => {}}
            colors={colors}
            theme={theme}
          />
        </Section>

        {/* ===== Section 5: Document Vault ===== */}
        <Section title="Document Vault" colors={colors} theme={theme}>
          <DocumentItem
            icon="cloud-upload-outline"
            title="Upload Documents"
            description="Store financial records securely"
            onPress={() => {}}
            colors={colors}
            theme={theme}
          />
          <DocumentItem
            icon="lock-closed-outline"
            title="Secure Cloud Sync"
            description="Sync with Google Drive or iCloud"
            onPress={() => {}}
            colors={colors}
            theme={theme}
          />
        </Section>

        {/* ===== Optional: AI Smart Insights ===== */}
        <Section title="Smart Insights (AI)" colors={colors} theme={theme}>
          <DocumentItem
            icon="sparkles-outline"
            title="AI Financial Summary"
            description="Get automatic insights from your spending and investments"
            onPress={() => {}}
            colors={colors}
            theme={theme}
          />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ===================== 🔹 Reusable Components ===================== */

const Section = ({ title, children, colors, theme }) => (
  <View style={styles.section}>
    <Text
      style={[
        styles.sectionTitle,
        { color: theme === "dark" ? "#f3f4f6" : colors.text },
      ]}
    >
      {title}
    </Text>
    {children}
  </View>
);

const DocumentItem = ({ icon, title, description, onPress, colors, theme }) => (
  <TouchableOpacity
    style={[
      styles.card,
      { backgroundColor: theme === "dark" ? "#1f2937" : colors.cardBackground },
    ]}
    onPress={onPress}
  >
    <View style={styles.cardLeft}>
      <Ionicons
        name={icon}
        size={22}
        color={theme === "dark" ? "#93c5fd" : colors.tint}
      />
      <View style={{ marginLeft: 12 }}>
        <Text
          style={[
            styles.cardTitle,
            { color: theme === "dark" ? "#f9fafb" : colors.text },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.cardDesc,
            { color: theme === "dark" ? "#94a3b8" : colors.textSecondary },
          ]}
        >
          {description}
        </Text>
      </View>
    </View>
    <Ionicons
      name="chevron-forward"
      size={18}
      color={theme === "dark" ? "#f3f4f6" : colors.subtext}
    />
  </TouchableOpacity>
);

/* ===================== 💅 Styles ===================== */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 15, fontWeight: "600", marginBottom: 8 },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "rgba(0,0,0,0.08)",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: "600" },
  cardDesc: { fontSize: 12, marginTop: 2 },
});
