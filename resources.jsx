import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeProvider'; // ✅ Import theme context

export default function ResourcesScreen() {
  const { theme, themeColors: rawThemeColors } = useTheme() || {};

  // ✅ Fully dark-mode-safe fallback colors
  const colors = rawThemeColors || {
    background: theme === 'dark' ? '#111827' : '#ffffff',
    text: theme === 'dark' ? '#f9fafb' : '#000000',
    secondaryText: theme === 'dark' ? '#e5e7eb' : '#555555',
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background }, // ✅ Dynamic background
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: colors.text }, // ✅ Dynamic text color
        ]}
      >
        📚 Resources Screen
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.secondaryText || colors.text + '99' }, // ✅ Muted secondary text
        ]}
      >
        Explore guides, articles, and tools to boost your financial literacy.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 320,
  },
});
