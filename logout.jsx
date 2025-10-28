import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useTheme } from "../context/ThemeProvider";
import financialtrackerImg from "../assets/images/financialtracker.jpg";
import { useAuth } from "../context/AuthProvider";

const CustomButton = ({ text, onPress, colors }) => (
  <Pressable
    onPress={onPress}
    style={[
      styles.button,
      { backgroundColor: colors.primary, shadowColor: colors.shadow },
    ]}
  >
    <Text style={[styles.buttonText, { color: colors.buttonText }]}>{text}</Text>
  </Pressable>
);

const LogoutScreen = () => {
  const { colors } = useTheme();
  const { logout } = useAuth();
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/welcome");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ImageBackground
        source={financialtrackerImg}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[colors.overlay1, colors.overlay2, colors.overlay3]}
          style={StyleSheet.absoluteFill}
        />

        <SafeAreaView style={styles.content}>
          <Animated.View
            style={[
              styles.titleBox,
              {
                backgroundColor: colors.cardBackground,
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [40, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={[styles.title, { color: colors.text }]}>Logging Out</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Are you sure you want to log out from your Financial Freedom Tracker account?
            </Text>
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim }}>
            <CustomButton text="Confirm Logout" onPress={handleLogout} colors={colors} />
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim, marginTop: 25 }}>
            <Link href="/profile" asChild>
              <Pressable>
                <Text style={[styles.helperText, { color: colors.text }]}>
                  Cancel and Go Back
                </Text>
              </Pressable>
            </Link>
          </Animated.View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default LogoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 80,
    alignItems: "center",
  },
  titleBox: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 50,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontFamily: "Roboto_700Bold",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    fontFamily: "Roboto_400Regular",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
  },
  section: {
    alignItems: "center",
    marginVertical: 15,
  },
  helperText: {
    fontSize: 18,
    fontFamily: "Roboto_400Regular",
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    height: 55,
    width: 180,
    borderRadius: 20,
    justifyContent: "center",
    padding: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 17,
    fontFamily: "Roboto_700Bold",
    textAlign: "center",
  },
});
