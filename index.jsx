// app/onboarding/index.jsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { db } from "../../src/firebaseConfig";
import { addDoc, collection, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { useAuth, storageGet, storageSet, storageDelete } from "../../context/AuthProvider";

export default function OnboardingQuiz() {
  const { user, profile, updateProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const questions = [
    { id: "income_stability", text: "How stable is your income?", options: ["Regular monthly income", "Irregular / project-based income"] },
    { id: "dependents", text: "Do you have any financial dependents?", options: ["No dependents", "1–2 dependents", "3–5 dependents", "More than 5"] },
    { id: "income_range", text: "What is your approximate monthly income?", options: ["Below Ksh 30,000", "Ksh 30,000 – 80,000", "Ksh 80,000 – 150,000", "Above Ksh 150,000"] },
    { id: "main_goal", text: "What is your main financial goal right now?", options: ["Build savings", "Invest for growth", "Retirement planning", "Child's education", "Business expansion", "Other"] },
    { id: "goal_timeline", text: "Target timeline for achieving your goal:", options: ["Short-term (0–3 years)", "Medium-term (3–7 years)", "Long-term (7+ years)"] },
    { id: "save_amount", text: "How much can you invest or save regularly per month?", options: ["Less than Ksh 5,000", "Ksh 5,000 – 20,000", "Ksh 20,000 – 50,000", "Above Ksh 50,000"] },
    { id: "emergency_fund", text: "Do you have an emergency fund (3–6 months of expenses)?", options: ["Yes", "No"] },
    { id: "debts", text: "Do you currently have any loans or debts?", options: ["No", "Yes – short-term", "Yes – long-term"] },
    { id: "investments", text: "Which of these savings or investments do you currently have?", options: ["Bank savings", "SACCO", "Money Market Fund", "Shares / Stocks", "Real estate", "None"] },
    { id: "market_drop", text: "If your investment lost 10% in a year, what would you do?", options: ["Withdraw immediately", "Wait for recovery", "Invest more because prices are low"] },
    { id: "risk_preference", text: "Which statement describes you best?", options: ["I prefer safety and stability (low risk, low return)", "I want moderate growth with some risk", "I'm comfortable with high risk for higher returns"] },
    { id: "liquidity", text: "Will you need to access this money soon?", options: ["Yes", "No"] },
    { id: "lock_in", text: "Are you comfortable locking your investment for at least 1 year?", options: ["Yes", "No"] },
    { id: "priorities", text: "Which of the following is most important to you?", options: ["Security of my money", "Growth of my money", "Regular income", "Liquidity (easy access)"] },
  ];

  // --- Restore progress ---
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedAnswers = await storageGet("onboarding_answers");
        const savedStep = await storageGet("onboarding_step");
        if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
        if (savedStep) setStep(Number(savedStep));
      } catch (err) {
        console.error("Failed to load saved onboarding process", err);
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, []);

  const handleSelect = async (option) => {
    const updatedAnswers = { ...answers, [questions[step].id]: option };
    const nextStep = step + 1;

    try {
      await storageSet("onboarding_answers", JSON.stringify(updatedAnswers));
      await storageSet("onboarding_step", String(nextStep));
    } catch (err) {
      console.error("Error saving progress", err);
    }

    setAnswers(updatedAnswers);
    if (nextStep < questions.length) {
      setStep(nextStep);
    } else {
      setShowResult(true);
      await storageDelete("onboarding_step");
    }
  };

  const clearProgress = async () => {
    await storageDelete("onboarding_answers");
    await storageDelete("onboarding_step");
  };

  const getProfileSummary = () => {
    const risk = answers.risk_preference || "";
    if (risk.includes("low risk")) return "Conservative Portfolio";
    if (risk.includes("moderate")) return "Balanced Portfolio";
    if (risk.includes("high risk")) return "Aggressive Portfolio";
    return "Balanced Portfolio";
  };

  const uploadToFirestore = async () => {
    if (!user) {
      Alert.alert("Authentication Required", "Please sign in to save your data.");
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, "users", user.uid, "onboarding"), {
        ...answers,
        recommended_portfolio: getProfileSummary(),
        createdAt: serverTimestamp(),
      });

      await setDoc(
        doc(db, "users", user.uid),
        { completedOnboarding: true, lastUpdated: serverTimestamp() },
        { merge: true }
      );

      await storageSet("onboardingCompleted", "true");
      await clearProgress();

      // ✅ Force refresh profile in AuthProvider to trigger redirect
      await updateProfile(true);

      Alert.alert("🎉 Success", "Your onboarding is complete!");
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      Alert.alert("Error", "Could not save your data. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 10 }}>
          Loading your progress...
        </Text>
      </SafeAreaView>
    );
  }

  if (showResult) {
    const recommended = getProfileSummary();
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Your Financial Profile Summary</Text>
          <Text style={styles.resultText}>
            Based on your responses, you appear most suited for a{" "}
            <Text style={{ fontWeight: "bold" }}>{recommended}</Text>.
          </Text>
          <Text style={styles.resultSubtext}>
            This helps us recommend the right mix of savings and investment
            options tailored to your profile.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={uploadToFirestore}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#006d77" />
            ) : (
              <Text style={styles.buttonText}>Save and Continue</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const currentQ = questions[step];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Onboarding Quiz</Text>
        <Text style={styles.question}>{currentQ.text}</Text>

        <View style={styles.options}>
          {currentQ.options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.option}
              onPress={() => handleSelect(opt)}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.progress}>
          {step + 1} / {questions.length}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#006d77" },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 26, color: "#fff", fontWeight: "700", textAlign: "center", marginBottom: 30 },
  question: { fontSize: 18, color: "#fff", marginBottom: 20, textAlign: "center" },
  options: { marginVertical: 20 },
  option: { backgroundColor: "#fff", padding: 14, borderRadius: 12, marginVertical: 8, alignItems: "center" },
  optionText: { fontSize: 16, color: "#006d77", fontWeight: "600" },
  progress: { marginTop: 30, textAlign: "center", color: "#fff", fontSize: 14 },
  resultText: { fontSize: 18, color: "#fff", marginVertical: 10, textAlign: "center" },
  resultSubtext: { fontSize: 16, color: "#f0f0f0", marginTop: 10, textAlign: "center", lineHeight: 22 },
  button: { backgroundColor: "#fff", marginTop: 30, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#006d77", fontSize: 16, fontWeight: "600" },
});
