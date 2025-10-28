import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, StyleSheet, useColorScheme } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getThemeColors } from "../constants/Colors";

export default function LoadingScreen({ timeout = 10000 }) {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);
  const gradientColors =
    colorScheme === "dark"
      ? ["#0f0c29", "#302b63", "#24243e"]
      : ["#e0eafc", "#cfdef3", "#a1c4fd"];

  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), timeout);
    return () => clearTimeout(timer);
  }, [timeout]);

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <View style={styles.loaderBox}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={[styles.text, { color: colors.text }]}>
          {timedOut
            ? "Still loading... please check your internet connection."
            : "Loading your experience..."}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderBox: {
    alignItems: "center",
    padding: 20,
  },
  text: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    opacity: 0.85,
  },
});
