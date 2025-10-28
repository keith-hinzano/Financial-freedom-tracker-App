import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeProvider'; // ✅ Access theme context
import { getThemeColors } from '../../constants/Colors'; // ✅ Import color palette

export default function HomeScreen() {
  const { theme } = useTheme() || {};

  // ✅ Dynamic theme colors with proper dark mode fallback
  const themeColors = getThemeColors(theme) || {
    background: theme === 'dark' ? '#111827' : '#ffffff',
    text: theme === 'dark' ? '#f9fafb' : '#000000',
    subtext: theme === 'dark' ? '#d1d5db' : '#555555', // Optional if needed
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeColors.background }, // ✅ Dynamic background
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: themeColors.text }, // ✅ Dynamic text color
        ]}
      >
        🏠 Home Screen
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 20 },
});
