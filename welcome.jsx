import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Animated,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import financialtrackerImg from "../assets/images/financialtracker.jpg";
import { useTheme } from "../context/ThemeProvider";

const CustomButton = ({ text, href, colors }) => (
  <Link href={href} asChild>
    <Pressable
      style={[
        styles.button,
        { backgroundColor: colors.primary, shadowColor: colors.shadow },
      ]}
    >
      <Text style={[styles.buttonText, { color: colors.buttonText }]}>{text}</Text>
    </Pressable>
  </Link>
);

const Welcome = () => {
  const { colors } = useTheme();
  const { status } = useLocalSearchParams(); // Check if user came from logout
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ✅ Fade-in animation for logout success
  useEffect(() => {
    if (status === "loggedOut") {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [status]);

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
          <View style={[styles.titleBox, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.title, { color: colors.text }]}>
              Financial Freedom Tracker
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              True financial freedom heavily depends on your ability to secure Lifestyle,
              Security, Aspirational, and Legacy portfolios using multiple streams of
              passive income.
            </Text>
          </View>

          {/* ✅ Logout confirmation message */}
          {status === "loggedOut" && (
            <Animated.View style={{ opacity: fadeAnim, marginBottom: 20 }}>
              <Text
                style={{
                  color: colors.accent,
                  fontSize: 16,
                  fontFamily: "Roboto_500Medium",
                  textAlign: "center",
                }}
              >
                You have successfully logged out.
              </Text>
            </Animated.View>
          )}

          <View style={styles.section}>
            <Text style={[styles.helperText, { color: colors.text }]}>
              New Member?
            </Text>
            <CustomButton text="Join Now" href="/signup" colors={colors} />
          </View>

          <View style={styles.section}>
            <Text style={[styles.helperText, { color: colors.text }]}>
              Already Have An Account?
            </Text>
            <CustomButton text="Login" href="/login" colors={colors} />
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default Welcome;

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
    width: 160,
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
