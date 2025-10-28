import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeProvider";

export default function HelpScreen() {
  const { theme, themeColors } = useTheme();

  // 🎨 Modern, theme-synced color map
  const colors = {
    background: themeColors.background,
    text: themeColors.text,
    subtext: themeColors.textSecondary || themeColors.subtext,
    card: themeColors.cardBackground,
    border: themeColors.borderColor,
    tint: themeColors.tint,
    icon: themeColors.icon,
    searchBg:
      theme === "dark"
        ? themeColors.cardBackground
        : themeColors.menuCardBg || themeColors.cardBackground,
  };

  const [expanded, setExpanded] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      q: "How do I upgrade to the PRO plan?",
      a: "You can upgrade to PRO from your Profile screen by tapping 'Upgrade to PRO'. Choose your preferred plan and complete the payment securely.",
    },
    {
      q: "How do I reset my password?",
      a: "Go to Account Settings → Security → Reset Password. Follow the prompts to set a new password.",
    },
    {
      q: "Can I export my financial data?",
      a: "Yes. Navigate to Documents & Statements → Export Data to download your financial records in CSV or PDF formats.",
    },
    {
      q: "How can I contact support?",
      a: "You can reach us through the Contact Support section below or send an email to support@financialtracker.com.",
    },
    {
      q: "Is my data safe?",
      a: "Absolutely. We use strong encryption and follow industry-standard security and privacy practices.",
    },
    {
      q: "How do I delete my account?",
      a: "Navigate to Account Settings → Privacy → Delete Account. You will be asked to confirm before permanent deletion.",
    },
  ];

  const filteredFaqs = faqs.filter((item) =>
    item.q.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* 🟦 Title */}
      <Text style={[styles.title, { color: colors.text }]}>Help & Support</Text>

      {/* 🔍 Search Bar */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.searchBg,
            borderColor: colors.border,
            shadowColor: theme === "dark" ? "#000" : "#ccc",
          },
        ]}
      >
        <Ionicons name="search-outline" size={20} color={colors.subtext} />
        <TextInput
          placeholder="Search for help..."
          placeholderTextColor={colors.subtext}
          style={[styles.searchInput, { color: colors.text }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={18} color={colors.subtext} />
          </TouchableOpacity>
        )}
      </View>

      {/* 🧠 FAQ Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Frequently Asked Questions
        </Text>

        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((item, index) => (
            <View
              key={index}
              style={[
                styles.faqItem,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  shadowColor: theme === "dark" ? "#000" : "#aaa",
                },
              ]}
            >
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => toggleExpand(index)}
              >
                <Text style={[styles.faqQuestion, { color: colors.text }]}>
                  {item.q}
                </Text>
                <Ionicons
                  name={expanded === index ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colors.tint}
                />
              </TouchableOpacity>
              {expanded === index && (
                <Text style={[styles.faqAnswer, { color: colors.subtext }]}>
                  {item.a}
                </Text>
              )}
            </View>
          ))
        ) : (
          <Text style={[styles.noResults, { color: colors.subtext }]}>
            No results found for "{searchQuery}".
          </Text>
        )}
      </View>

      {/* 📞 Contact Support */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Contact Support
        </Text>

        <TouchableOpacity
          style={styles.linkItem}
          onPress={() => Linking.openURL("mailto:support@financialtracker.com")}
        >
          <Ionicons name="mail-outline" size={20} color={colors.tint} />
          <Text style={[styles.linkText, { color: colors.tint }]}>
            Email Support
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkItem}
          onPress={() =>
            Linking.openURL("https://financialtracker.com/support/chat")
          }
        >
          <Ionicons name="chatbubbles-outline" size={20} color={colors.tint} />
          <Text style={[styles.linkText, { color: colors.tint }]}>
            Live Chat
          </Text>
        </TouchableOpacity>
      </View>

      {/* 📘 Tutorials Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Tutorials & Guides
        </Text>

        <TouchableOpacity
          style={styles.linkItem}
          onPress={() =>
            Linking.openURL(
              "https://financialtracker.com/tutorials/getting-started"
            )
          }
        >
          <Ionicons name="book-outline" size={20} color={colors.tint} />
          <Text style={[styles.linkText, { color: colors.tint }]}>
            Getting Started
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkItem}
          onPress={() =>
            Linking.openURL(
              "https://financialtracker.com/tutorials/data-visualization"
            )
          }
        >
          <Ionicons name="stats-chart-outline" size={20} color={colors.tint} />
          <Text style={[styles.linkText, { color: colors.tint }]}>
            Visualizing Your Data
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    marginBottom: 30,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },
  section: { marginBottom: 35 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 18,
    textAlign: "center",
  },
  faqItem: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 14,
    borderWidth: 1,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: { fontSize: 16, fontWeight: "500" },
  faqAnswer: { marginTop: 6, fontSize: 14, lineHeight: 20 },
  noResults: { fontSize: 14, fontStyle: "italic", marginTop: 10 },
  linkItem: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  linkText: { marginLeft: 10, fontSize: 15, fontWeight: "500" },
});
