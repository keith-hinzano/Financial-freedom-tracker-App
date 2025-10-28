// components/SocialAuthButtons.js
import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getThemeColors } from "../constants/Colors";

export default function SocialAuthButtons({ onGoogle, onFacebook, onApple }) {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);

  return (
    <View style={styles.container}>
      {/* Google */}
      <TouchableOpacity
        style={[styles.socialButton, styles.google, { shadowColor: colors.shadowColor }]}
        activeOpacity={0.85}
        onPress={onGoogle}
      >
        <Ionicons name="logo-google" size={20} color="#DB4437" />
        <Text style={[styles.socialText, { color: "#000" }]}>
          Continue with Google
        </Text>
      </TouchableOpacity>

      {/* Facebook */}
      <TouchableOpacity
        style={[styles.socialButton, styles.facebook, { shadowColor: colors.shadowColor }]}
        activeOpacity={0.85}
        onPress={onFacebook}
      >
        <Ionicons name="logo-facebook" size={20} color="#fff" />
        <Text style={[styles.socialText, { color: "#fff" }]}>
          Continue with Facebook
        </Text>
      </TouchableOpacity>

      {/* Apple */}
      <TouchableOpacity
        style={[styles.socialButton, styles.apple, { shadowColor: colors.shadowColor }]}
        activeOpacity={0.85}
        onPress={onApple}
      >
        <Ionicons name="logo-apple" size={20} color="#fff" />
        <Text style={[styles.socialText, { color: "#fff" }]}>
          Continue with Apple
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    width: "100%",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  socialText: {
    fontSize: 15,
    fontWeight: "600",
  },
  google: {
    backgroundColor: "#fff",
  },
  facebook: {
    backgroundColor: "#1877F2",
  },
  apple: {
    backgroundColor: "#000",
  },
});
