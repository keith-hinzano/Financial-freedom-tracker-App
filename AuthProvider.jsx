// context/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../src/firebaseConfig";
import { useRouter, useSegments } from "expo-router";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { Platform } from "react-native";
import LoadingScreen from "../components/LoadingScreen";
import RetryScreen from "../components/RetryScreen";

// --- Secure storage helpers ---
export const storageGet = async (key) => {
  try {
    if (Platform.OS === "web") return localStorage.getItem(key);
    const { default: SecureStore } = await import("expo-secure-store");
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
};

export const storageSet = async (key, value) => {
  try {
    if (Platform.OS === "web") localStorage.setItem(key, value);
    else {
      const { default: SecureStore } = await import("expo-secure-store");
      await SecureStore.setItemAsync(key, value);
    }
  } catch {}
};

export const storageDelete = async (key) => {
  try {
    if (Platform.OS === "web") localStorage.removeItem(key);
    else {
      const { default: SecureStore } = await import("expo-secure-store");
      await SecureStore.deleteItemAsync(key);
    }
  } catch {}
};

// --- Context ---
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const segments = useSegments();
  const redirectedRef = useRef(false);

  // --- Firebase Auth + Firestore listener ---
  useEffect(() => {
    setInitializing(true);
    setProfileLoading(true);

    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser || null);

        if (!currentUser) {
          setProfile(null);
          setInitializing(false);
          setProfileLoading(false);
          return;
        }

        try {
          const snap = await getDoc(doc(db, "users", currentUser.uid));
          let data = snap.exists() ? snap.data() : null;

          // ✅ Ensure at least minimal fallback profile
          if (!data) {
            data = {
              email: currentUser.email,
              username: currentUser.displayName || "User",
              completedOnboarding: false,
              createdAt: serverTimestamp(),
            };
            await setDoc(doc(db, "users", currentUser.uid), data);
          }

          setProfile(data);

          if (data?.completedOnboarding)
            await storageSet("onboardingCompleted", "true");
          else await storageDelete("onboardingCompleted");
        } catch (fireErr) {
          console.error("Firestore error:", fireErr);
          setProfile(null);
        } finally {
          setProfileLoading(false);
          setInitializing(false);
        }
      },
      (authErr) => {
        console.error("Auth listener error:", authErr);
        setError("Authentication error. Please try again.");
        setInitializing(false);
        setProfileLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // --- Safe redirects ---
  useEffect(() => {
    if (initializing || profileLoading) return;
    if (redirectedRef.current) return;

    redirectedRef.current = true;

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";
    const inOnboarding = segments[0] === "onboarding";
    const inWelcome = segments[0] === "welcome";

    if (!user) {
      if (!inAuthGroup && !inWelcome) router.replace("/welcome");
    } else {
      if (!profile) return;

      if (profile.completedOnboarding) {
        if (!inTabsGroup) router.replace("/(tabs)/home");
      } else {
        if (!inOnboarding) router.replace("/onboarding");
      }
    }
  }, [user, profile, segments, initializing, profileLoading]);

  // --- Auth actions ---
  const login = async (email, password, remember = false) => {
    try {
      setError(null);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (remember)
        await storageSet("savedCredentials", JSON.stringify({ email, password }));
      else await storageDelete("savedCredentials");
      return cred;
    } catch (err) {
      console.error("Login error:", err);
      throw new Error("Login failed. Check your credentials.");
    }
  };

  const signup = async (email, password, username = "") => {
    try {
      setError(null);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = cred.user;

      const userProfile = {
        email,
        username,
        createdAt: serverTimestamp(),
        completedOnboarding: false,
      };

      await setDoc(doc(db, "users", newUser.uid), userProfile);
      setProfile(userProfile);
      await storageDelete("onboardingCompleted");

      return cred;
    } catch (err) {
      console.error("Signup error:", err);
      throw new Error("Signup failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      await storageDelete("savedCredentials");
      setProfile(null);
      setUser(null);
      redirectedRef.current = false;
      router.replace("/welcome"); // Force redirect on logout
    } catch (err) {
      console.error("Logout error:", err);
      throw new Error("Logout failed.");
    }
  };

  const updateProfile = async (forceReload = false, updates = {}) => {
    if (Object.keys(updates).length > 0) {
      setProfile((prev) => ({ ...prev, ...updates }));
    }

    if (forceReload && user) {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) setProfile(snap.data());
      } catch (err) {
        console.error("Error reloading profile:", err);
      }
    }
  };

  const retry = () => {
    setError(null);
    setInitializing(true);
    setProfileLoading(true);
    redirectedRef.current = false;
  };

  if (initializing || profileLoading) return <LoadingScreen />;
  if (error) return <RetryScreen message={error} onRetry={retry} />;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        login,
        signup,
        logout,
        updateProfile,
        initializing,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
