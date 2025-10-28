/**
 * 🎨 Global Theme Colors — Modern Material 3 Inspired Palette
 *
 * Clean, accessible, and visually elegant for both light and dark modes.
 * Inspired by Notion, Spotify, and Google Material 3.
 * Optimized for readability, depth, and modern interface balance.
 */

const tintColorLight = "#2563EB"; // Vibrant but soft blue (Google Material primary)
const tintColorDark = "#3B82F6";  // Softer blue for dark mode readability

export const Colors = {
  light: {
    // 🌞 General UI
    text: "#111827",
    textSecondary: "#4B5563",
    placeholder: "#9CA3AF",
    background: "#F9FAFB",
    backgroundColor: "#F9FAFB", // alias for compatibility
    tint: tintColorLight,
    icon: "#374151",
    tabIconDefault: "#9CA3AF",
    tabIconSelected: tintColorLight,

    // 🧱 Cards, containers, and borders
    cardBackground: "#FFFFFF",
    borderColor: "#E5E7EB",
    shadowColor: "rgba(0, 0, 0, 0.05)",

    // 🧾 Menus and lists
    menuCardBg: "#FFFFFF",
    menuText: "#111827",
    menuDescription: "#6B7280",
    separatorColor: "#E5E7EB",

    // 🔘 Buttons and touchables
    buttonBackground: tintColorLight,
    buttonText: "#FFFFFF",
    pressedOverlay: "rgba(0, 0, 0, 0.05)",

    // 🧩 Surfaces and feedback
    surfaceVariant: "#F3F4F6",
    success: "#16A34A",
    warning: "#F59E0B",
    error: "#DC2626",

    // 🌈 Overlays and gradients
    overlay1: "rgba(255, 255, 255, 0.2)",
    overlay2: "rgba(255, 255, 255, 0.4)",
    overlay3: "rgba(255, 255, 255, 0.6)",

    // ✨ Accent elements
    primary: "#4B9CD3",
    subtext: "#6B7280",
    shadow: "#000000",
  },

  dark: {
    // 🌙 General UI
    text: "#F9FAFB",
    textSecondary: "#CBD5E1",
    placeholder: "#94A3B8",
    background: "#0F172A",
    backgroundColor: "#0F172A", // alias for compatibility
    tint: tintColorDark,
    icon: "#E2E8F0",
    tabIconDefault: "#64748B",
    tabIconSelected: tintColorDark,

    // 🧱 Cards, containers, and borders
    cardBackground: "#1E293B",
    borderColor: "#334155",
    shadowColor: "rgba(255, 255, 255, 0.05)",

    // 🧾 Menus and lists
    menuCardBg: "#1E293B",
    menuText: "#F1F5F9",
    menuDescription: "#94A3B8",
    separatorColor: "#334155",

    // 🔘 Buttons and touchables
    buttonBackground: tintColorDark,
    buttonText: "#FFFFFF",
    pressedOverlay: "rgba(255, 255, 255, 0.08)",

    // 🧩 Surfaces and feedback
    surfaceVariant: "#334155",
    success: "#22C55E",
    warning: "#FACC15",
    error: "#EF4444",

    // 🌈 Overlays and gradients
    overlay1: "rgba(0, 0, 0, 0.8)",
    overlay2: "rgba(0, 0, 0, 0.6)",
    overlay3: "rgba(0, 0, 0, 0.5)",

    // ✨ Accent elements
    primary: "#FF6B6B",
    subtext: "#CBD5E1",
    shadow: "#000000",
  },
};

/**
 * ✅ Safe theme resolver
 * Ensures valid output even if colorScheme is null or invalid.
 *
 * @param {('light' | 'dark')} colorScheme - from useColorScheme()
 * @returns {object} - valid color palette
 */
export const getThemeColors = (colorScheme) => {
  if (colorScheme === "dark") return Colors.dark;
  if (colorScheme === "light") return Colors.light;
  return Colors.light; // fallback to light mode
};
