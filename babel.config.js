module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // 👇 Enables Reanimated support for gestures and animations
      "react-native-reanimated/plugin",
    ],
  };
};
