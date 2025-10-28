import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthProvider";
import { db } from "../src/firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useTheme } from "../context/ThemeProvider"; // ✅ theme hook

const { width } = Dimensions.get("window");

export default function SignupScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { signup } = useAuth();
  const { themeColors } = useTheme(); // ✅ use theme colors

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (!accepted) {
      Alert.alert("Error", "You must accept the Terms & Conditions.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signup(email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        createdAt: serverTimestamp(),
      });

      router.replace("/onboarding");
    } catch (error) {
      console.error("Signup Error:", error.message);
      Alert.alert("Signup Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeColors.background }, // ✅ dynamic bg
      ]}
    >
      <View
        style={[
          styles.signupBox,
          {
            backgroundColor: themeColors.card,
            borderColor: themeColors.softCard,
          },
        ]}
      >
        <Text style={[styles.title, { color: themeColors.text }]}>
          Create Account
        </Text>

        {/* Username */}
        <View
          style={[
            styles.inputGroup,
            {
              backgroundColor: themeColors.primarySoft,
              borderColor: themeColors.softCard,
            },
          ]}
        >
          <Svg width={20} height={20} fill={themeColors.text} viewBox="0 0 24 24">
            <Path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
          </Svg>
          <TextInput
            placeholder="Username"
            placeholderTextColor={themeColors.secondaryText}
            style={[styles.input, { color: themeColors.text }]}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        {/* Email */}
        <View
          style={[
            styles.inputGroup,
            {
              backgroundColor: themeColors.primarySoft,
              borderColor: themeColors.softCard,
            },
          ]}
        >
          <Svg width={20} height={20} fill={themeColors.text} viewBox="0 0 24 24">
            <Path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </Svg>
          <TextInput
            placeholder="Email"
            placeholderTextColor={themeColors.secondaryText}
            style={[styles.input, { color: themeColors.text }]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View
          style={[
            styles.inputGroup,
            {
              backgroundColor: themeColors.primarySoft,
              borderColor: themeColors.softCard,
            },
          ]}
        >
          <Svg width={20} height={20} fill={themeColors.text} viewBox="0 0 24 24">
            <Path d="M17 8h-1V6c0-2.8-2.2-5-5-5S6 3.2 6 6v2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-5 8c-.8 0-1.5-.7-1.5-1.5S11.2 13 12 13s1.5.7 1.5 1.5S12.8 16 12 16zm3-8H9V6c0-1.7 1.3-3 3-3s3 1.3 3 3v2z" />
          </Svg>
          <TextInput
            placeholder="Password"
            placeholderTextColor={themeColors.secondaryText}
            secureTextEntry={!passwordVisible}
            style={[styles.input, { color: themeColors.text }]}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Ionicons
              name={passwordVisible ? "eye-off" : "eye"}
              size={20}
              color={themeColors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <View
          style={[
            styles.inputGroup,
            {
              backgroundColor: themeColors.primarySoft,
              borderColor: themeColors.softCard,
            },
          ]}
        >
          <Svg width={20} height={20} fill={themeColors.text} viewBox="0 0 24 24">
            <Path d="M17 8h-1V6c0-2.8-2.2-5-5-5S6 3.2 6 6v2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-5 8c-.8 0-1.5-.7-1.5-1.5S11.2 13 12 13s1.5.7 1.5 1.5S12.8 16 12 16zm3-8H9V6c0-1.7 1.3-3 3-3s3 1.3 3 3v2z" />
          </Svg>
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor={themeColors.secondaryText}
            secureTextEntry={!confirmPasswordVisible}
            style={[styles.input, { color: themeColors.text }]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          >
            <Ionicons
              name={confirmPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color={themeColors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setAccepted(!accepted)}
        >
          <Ionicons
            name={accepted ? "checkbox" : "square-outline"}
            size={20}
            color={themeColors.text}
          />
          <Text style={[styles.termsText, { color: themeColors.text }]}>
            I accept Terms & Conditions
          </Text>
        </TouchableOpacity>

        {/* Signup Button */}
        <TouchableOpacity
          style={[
            styles.signupBtn,
            {
              backgroundColor: themeColors.accent,
              opacity: accepted ? 1 : 0.5,
            },
          ]}
          disabled={!accepted || loading}
          onPress={handleSignup}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[styles.signupBtnText, { color: "#fff" }]}>
              Sign Up
            </Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View
            style={[styles.divider, { backgroundColor: themeColors.secondaryText }]}
          />
          <Text style={[styles.dividerText, { color: themeColors.text }]}>OR</Text>
          <View
            style={[styles.divider, { backgroundColor: themeColors.secondaryText }]}
          />
        </View>

        {/* Social Buttons */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-google" size={22} color="#DB4437" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-facebook" size={22} color="#1877F2" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-apple" size={22} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  signupBox: {
    width: width * 0.9,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "700",
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  signupBtn: {
    marginTop: 15,
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  signupBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontWeight: "700",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  termsText: {
    marginLeft: 8,
    fontSize: 13,
  },
});
