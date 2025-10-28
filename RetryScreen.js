import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Animated,
  useColorScheme,
} from "react-native";
import { getThemeColors } from "../constants/Colors";

export default function RetryScreen({
  onRetry,
  message = "Something went wrong. Please check your connection and try again.",
  autoRetry = true,
  retryDelay = 10000, // 10 seconds
}) {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);
  const [retrying, setRetrying] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  // 🔁 Fade-in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // 🔄 Optional auto-retry after delay
  useEffect(() => {
    if (autoRetry) {
      const timer = setTimeout(() => {
        setRetrying(true);
        onRetry?.();
      }, retryDelay);
      return () => clearTimeout(timer);
    }
  }, [autoRetry, retryDelay, onRetry]);

  const handleManualRetry = async () => {
    if (retrying) return;
    setRetrying(true);
    await onRetry?.();
    setRetrying(false);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.background, opacity: fadeAnim },
      ]}
    >
      <Text style={[styles.title, { color: colors.tint }]}>⚠️ Oops!</Text>
      <Text style={[styles.message, { color: colors.text }]}>{message}</Text>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: colors.buttonBackground, opacity: retrying ? 0.6 : 1 },
        ]}
        onPress={handleManualRetry}
        activeOpacity={0.8}
        disabled={retrying}
      >
        <Text style={[styles.buttonText, { color: colors.buttonText }]}>
          {retrying ? "Retrying..." : "Retry"}
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.icon} />
        <Text style={[styles.footerText, { color: colors.icon }]}>
          Checking connection...
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },
  message: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    marginTop: 6,
  },
});
