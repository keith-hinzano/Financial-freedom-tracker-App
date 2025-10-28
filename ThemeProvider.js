import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useColorScheme, Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getThemeColors } from "../constants/Colors"; // 🎨 Your Material 3 palette

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState(systemScheme || "light");
  const [isReady, setIsReady] = useState(false);

  // 🧠 Load saved theme or fallback to system
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("appTheme");
        if (isMounted) {
          setTheme(savedTheme || systemScheme || "light");
          setIsReady(true);
        }
      } catch (error) {
        console.warn("Theme load error:", error);
        setIsReady(true);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [systemScheme]);

  // 🧩 Sync with system theme dynamically (mobile + web)
  useEffect(() => {
    const listener = Appearance.addChangeListener(async ({ colorScheme }) => {
      const savedTheme = await AsyncStorage.getItem("appTheme");
      // Only update if user hasn’t manually set a theme
      if (!savedTheme) {
        setTheme(colorScheme || "light");
      }
    });
    return () => listener.remove();
  }, []);

  // 🔄 Toggle between light and dark themes manually
  const toggleTheme = useCallback(async () => {
    try {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);
      await AsyncStorage.setItem("appTheme", newTheme);
    } catch (error) {
      console.warn("Theme toggle error:", error);
    }
  }, [theme]);

  // ♻️ Reset theme back to system default
  const resetThemeToSystem = useCallback(async () => {
    try {
      await AsyncStorage.removeItem("appTheme");
      const systemTheme = Appearance.getColorScheme() || "light";
      setTheme(systemTheme);
    } catch (error) {
      console.warn("Theme reset error:", error);
    }
  }, []);

  // 🎨 Compute and memoize theme colors
  const themeColors = useMemo(() => {
    try {
      const colors = getThemeColors(theme);
      if (!colors) throw new Error("Color palette not found");
      return colors;
    } catch {
      // Fallbacks to ensure graceful behavior
      return theme === "dark"
        ? {
            background: "#0F172A",
            text: "#F9FAFB",
            subtext: "#CBD5E1",
            card: "#1E293B",
            border: "#334155",
            tint: "#3B82F6",
            error: "#EF4444",
            placeholder: "#94A3B8",
            surfaceVariant: "#1E293B",
            cardBackground: "#111827",
          }
        : {
            background: "#F9FAFB",
            text: "#111827",
            subtext: "#4B5563",
            card: "#FFFFFF",
            border: "#E5E7EB",
            tint: "#2563EB",
            error: "#DC2626",
            placeholder: "#9CA3AF",
            surfaceVariant: "#F3F4F6",
            cardBackground: "#FFFFFF",
          };
    }
  }, [theme]);

  // 🚀 Provide everything to consumers
  const value = useMemo(
    () => ({
      theme,
      themeColors,
      toggleTheme,
      resetThemeToSystem,
    }),
    [theme, themeColors, toggleTheme, resetThemeToSystem]
  );

  // 🧩 Avoid flicker before theme loads
  if (!isReady) return null;

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// 🎯 Custom hooks for components
export const useTheme = () => useContext(ThemeContext);
export const useColor = (colorKey) => {
  const { themeColors } = useTheme();
  return themeColors[colorKey];
};
