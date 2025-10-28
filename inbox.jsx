import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../src/firebaseConfig";
import { useAuth } from "../context/AuthProvider";
import { useTheme } from "../context/ThemeProvider";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";

export default function Inbox() {
  const { user } = useAuth();
  const { theme, themeColors: colors } = useTheme() || {};
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  // 🧭 Load inbox messages
  const loadMessages = useCallback(async () => {
    if (!user) return;
    const messagesRef = collection(db, "users", user.uid, "messages");

    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(
        data.sort(
          (a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)
        )
      );
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    let unsub;
    if (user) {
      const init = async () => {
        unsub = await loadMessages();
      };
      init();
    }
    return () => unsub && unsub();
  }, [user, loadMessages]);

  // ✨ Filters
  const filteredMessages = useMemo(() => {
    if (activeFilter === "All") return messages;
    return messages.filter((msg) => msg.type === activeFilter);
  }, [messages, activeFilter]);

  // ✅ Mark as Read
  const handleMarkAsRead = async (id) => {
    try {
      const messageRef = doc(db, "users", user.uid, "messages", id);
      await updateDoc(messageRef, { isRead: true });
    } catch (error) {
      console.log("Error marking message as read:", error);
    }
  };

  // ✅ Mark All as Read
  const handleMarkAllAsRead = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "users", user.uid, "messages")
      );
      const batch = snapshot.docs.map((d) => updateDoc(d.ref, { isRead: true }));
      await Promise.all(batch);
    } catch (error) {
      console.log("Error marking all messages as read:", error);
    }
  };

  // 🗑️ Delete Message
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", user.uid, "messages", id));
    } catch (error) {
      console.log("Error deleting message:", error);
    }
  };

  // 🗂️ Archive Message
  const handleArchive = async (id) => {
    try {
      const messageRef = doc(db, "users", user.uid, "messages", id);
      await updateDoc(messageRef, { archived: true });
    } catch (error) {
      console.log("Error archiving message:", error);
    }
  };

  // 🔁 Refresh Control
  const onRefresh = async () => {
    setRefreshing(true);
    await loadMessages();
    setTimeout(() => setRefreshing(false), 800);
  };

  // 🔥 Swipeable Action Buttons
  const renderRightActions = (id) =>
    Platform.OS !== "web" ? (
      <View style={styles.swipeActions}>
        <TouchableOpacity
          onPress={() => handleArchive(id)}
          style={[styles.actionButton, { backgroundColor: colors.tint }]}
        >
          <Ionicons name="archive-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(id)}
          style={[styles.actionButton, { backgroundColor: colors.error }]}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    ) : null; // ❌ disable Swipe on web for stability

  // 🔁 Loading State
  if (loading) {
    return (
      <SafeAreaView
        style={[styles.loader, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator color={colors.tint} size="large" />
      </SafeAreaView>
    );
  }

  // 💬 Render Single Message
  const renderItem = ({ item }) => {
    const messageCard = (
      <TouchableOpacity
        onPress={() => handleMarkAsRead(item.id)}
        style={[
          styles.messageContainer,
          {
            backgroundColor: item.isRead
              ? colors.cardBackground
              : colors.surfaceVariant,
            borderColor: colors.borderColor,
          },
        ]}
        activeOpacity={0.8}
      >
        <View style={styles.messageHeader}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          {!item.isRead && (
            <Ionicons name="ellipse" size={10} color={colors.tint} />
          )}
        </View>
        <Text
          style={[styles.message, { color: colors.textSecondary }]}
          numberOfLines={3}
        >
          {item.message}
        </Text>
        <Text style={[styles.timestamp, { color: colors.placeholder }]}>
          {item.timestamp?.seconds
            ? new Date(item.timestamp.seconds * 1000).toLocaleString()
            : "—"}
        </Text>
      </TouchableOpacity>
    );

    // 🧩 Wrap with Swipeable only on mobile
    return Platform.OS !== "web" ? (
      <Swipeable renderRightActions={() => renderRightActions(item.id)}>
        {messageCard}
      </Swipeable>
    ) : (
      messageCard
    );
  };

  // 🧭 Filter Bar
  const filters = ["All", "Financial Update", "Alert", "System"];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="mail-outline" size={22} color={colors.tint} />
          <Text style={[styles.headerText, { color: colors.text }]}>Inbox</Text>

          {/* Mark all as read */}
          {messages.some((m) => !m.isRead) && (
            <TouchableOpacity onPress={handleMarkAllAsRead}>
              <Ionicons name="checkmark-done" size={20} color={colors.tint} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Bar */}
        <View style={styles.filterBar}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterButton,
                {
                  backgroundColor:
                    activeFilter === filter
                      ? colors.tint
                      : colors.surfaceVariant,
                },
              ]}
            >
              <Text
                style={{
                  color:
                    activeFilter === filter ? "#fff" : colors.textSecondary,
                  fontWeight: "500",
                }}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Message List */}
        <FlatList
          data={filteredMessages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.placeholder }]}>
              No messages yet.
            </Text>
          }
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.tint}
            />
          }
          contentContainerStyle={{
            paddingBottom: Platform.OS === "ios" ? 80 : 100,
          }}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    flex: 1,
    marginLeft: 8,
  },
  filterBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 3,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  swipeActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginLeft: 4,
  },
  messageContainer: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  message: {
    marginTop: 4,
    fontSize: 14,
  },
  timestamp: {
    marginTop: 6,
    fontSize: 12,
    alignSelf: "flex-end",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
  },
});
