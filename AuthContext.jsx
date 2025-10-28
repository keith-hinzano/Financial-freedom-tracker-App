import React, { createContext, useState, useContext, useEffect } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../src/firebaseConfig";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";

// --- Create the context ---
const AuthContext = createContext();

// --- Provider component ---
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null); // 🔹 Store user Firestore info (like onboarding status)

  // --- Listen for Firebase auth changes ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            setUserData(null);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // --- Signup ---
  const signup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      await setDoc(doc(db, "users", newUser.uid), {
        email,
        uid: newUser.uid,
        createdAt: serverTimestamp(),
        completedOnboarding: false, // ✅ add default onboarding status
      });

      setUser(newUser);
      setUserData({
        email,
        completedOnboarding: false,
      });
    } catch (error) {
      console.error("Signup error:", error.message);
      throw error;
    }
  };

  // --- Login ---
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  // --- Logout ---
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  // --- Provide state and functions globally ---
  return (
    <AuthContext.Provider
      value={{
        user,
        userData, // 🔹 includes extra Firestore info
        signup,
        login,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// --- Hook for easy access ---
export const useAuth = () => useContext(AuthContext);
