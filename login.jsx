import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import AuthInput from "../components/AuthInput";
import SocialAuthButtons from "../components/SocialAuthButtons";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthProvider";
import { useTheme } from "../context/ThemeProvider"; // ✅ Added theme context
import { getThemeColors } from "../constants/Colors"; // ✅ Import new modern palette

export default function Login() {
  const { login } = useAuth();
  const { theme } = useTheme(); // ✅ Use global theme
  const colors = getThemeColors(theme); // ✅ Pull from new system
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Load saved credentials
  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const saved = await SecureStore.getItemAsync("savedCredentials");
        if (saved) {
          const { email, password } = JSON.parse(saved);
          setEmail(email);
          setPassword(password);
          setRememberMe(true);
        }
      } catch (error) {
        console.log("⚠️ Failed to load secure credentials:", error.message);
      }
    };
    loadCredentials();
  }, []);

  // ✅ Handle login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);

      if (rememberMe) {
        await SecureStore.setItemAsync(
          "savedCredentials",
          JSON.stringify({ email, password })
        );
      } else {
        await SecureStore.deleteItemAsync("savedCredentials");
      }

      router.replace("/onboarding");
    } catch (error) {
      console.error("Login Error:", error.message);
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={
        theme === "dark"
          ? [colors.gradientDarkStart, colors.gradientDarkMid, colors.gradientDarkEnd]
          : [colors.gradientLightStart, colors.gradientLightMid, colors.gradientLightEnd]
      }
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.loginBox,
            {
              backgroundColor: colors.cardBackgroundTransparent,
              borderColor: colors.borderColor,
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>Welcome Back 👋</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Login to continue your journey
          </Text>

          <AuthInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AuthInput label="Password" secure value={password} onChangeText={setPassword} />

          {/* ✅ Remember Me */}
          <TouchableOpacity
            style={styles.rememberRow}
            onPress={() => setRememberMe((prev) => !prev)}
          >
            <Ionicons
              name={rememberMe ? "checkbox" : "square-outline"}
              size={20}
              color={colors.tint}
            />
            <Text style={[styles.rememberText, { color: colors.text }]}>
              Remember Me
            </Text>
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() =>
              Alert.alert("Coming Soon", "Password reset feature coming soon.")
            }
          >
            <Text style={[styles.forgotText, { color: colors.tint }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.tint },
              loading && { opacity: 0.6 },
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View
              style={[styles.divider, { backgroundColor: colors.separatorColor }]}
            />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>OR</Text>
            <View
              style={[styles.divider, { backgroundColor: colors.separatorColor }]}
            />
          </View>

          <SocialAuthButtons />

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Don’t have an account?{" "}
            </Text>
            <Link href="/signup" asChild>
              <TouchableOpacity>
                <Text style={[styles.link, { color: colors.tint }]}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  loginBox: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  rememberText: {
    marginLeft: 8,
    fontSize: 14,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  forgotText: {
    fontSize: 14,
    textDecorationLine: "underline",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
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
    fontWeight: "600",
  },
  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 14,
  },
  link: {
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
