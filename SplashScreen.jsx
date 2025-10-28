// components/SplashScreen.jsx
import React, { useEffect, useRef } from "react";
import { View, Image, Text, StyleSheet, Animated, Dimensions, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function SplashScreen({ onFinish, title = "Empower your financial journey" }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const animationCompleted = useRef(false);

  useEffect(() => {
    // Prevent multiple onFinish calls
    if (animationCompleted.current) return;

    const runAnimation = Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 90,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(1000), // hold for ~1s
    ]);

    runAnimation.start(({ finished }) => {
      if (finished && !animationCompleted.current) {
        animationCompleted.current = true;
        onFinish?.();
      }
    });

    // Fallback: ensure onFinish is called even if animation fails
    const fallbackTimer = setTimeout(() => {
      if (!animationCompleted.current) {
        animationCompleted.current = true;
        console.log("SplashScreen: Fallback timer triggered");
        onFinish?.();
      }
    }, 4000); // 4 second fallback

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [fadeAnim, scaleAnim, onFinish]);

  return (
    <LinearGradient
      colors={["#0f0c29", "#302b63", "#24243e"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.logoContainer,
          { 
            opacity: fadeAnim, 
            transform: [{ scale: scaleAnim }] 
          },
        ]}
      >
        <Image
          source={require("../assets/images/splash-logo.png")}
          style={styles.logo}
          onError={(error) => console.log("Failed to load splash logo:", error.nativeEvent.error)}
          resizeMode="contain"
        />
        <Text style={styles.text}>{title}</Text>
      </Animated.View>
      
      {/* Optional: Loading indicator */}
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
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
  logoContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    maxWidth: 200,
    maxHeight: 200,
  },
  text: {
    marginTop: 18,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  loadingContainer: {
    position: "absolute",
    bottom: 50,
    alignItems: "center",
  },
  loadingText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
});