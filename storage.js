// src/utils/storage.js
import { Platform } from "react-native";

let SecureStore;
if (Platform.OS !== "web") {
  SecureStore = require("expo-secure-store").default;
}

/**
 * Get an item from storage
 * @param {string} key
 * @returns {Promise<string | null>}
 */
export const storageGet = async (key) => {
  try {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (err) {
    console.error(`Failed to get storage key "${key}"`, err);
    return null;
  }
};

/**
 * Set an item in storage
 * @param {string} key
 * @param {string} value
 */
export const storageSet = async (key, value) => {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (err) {
    console.error(`Failed to set storage key "${key}"`, err);
  }
};

/**
 * Delete an item from storage
 * @param {string} key
 */
export const storageDelete = async (key) => {
  try {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (err) {
    console.error(`Failed to delete storage key "${key}"`, err);
  }
};
