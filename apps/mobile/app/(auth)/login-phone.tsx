import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { colors, typography } from "../../theme/colors";

const { width, height } = Dimensions.get("window");

export default function LoginPhoneScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);

  // In a real app, you would make an API call here.
  // For the frontend template we just redirect.
  const handleLogin = () => {
    // Basic mock of role-based redirection for the Cashier implementation
    // E.g. If it's a specific phone, go to cashier. Otherwise tabs.
    if (phone === "08111" || pin === "111111") {
       router.replace("/(cashier)" as any);
    } else {
       router.replace("/(tabs)" as any);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <ImageBackground
           source={require('../../assets/images/icon.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.gradientOverlay}>
            <SafeAreaView style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Phone Login</Text>
            </SafeAreaView>
          </View>
        </ImageBackground>

        <View style={styles.bottomSheet}>
          <Text style={styles.title}>GPM Login</Text>
          <Text style={styles.subtitle}>Enter your phone number & 6-digit PIN</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Phone Number (e.g. 08123...)"
              placeholderTextColor={colors.placeholder}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="6-Digit PIN"
              placeholderTextColor={colors.placeholder}
              value={pin}
              onChangeText={setPin}
              keyboardType="number-pad"
              secureTextEntry={!showPin}
              maxLength={6}
            />
            <TouchableOpacity
              onPress={() => setShowPin(!showPin)}
              style={styles.eyeIcon}
            >
              <Text style={{fontSize: 10}}>{showPin ? "HIDE" : "SHOW"}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupLinkContainer}
            onPress={() => router.push("/(auth)/welcome")}
          >
            <Text style={styles.signupText}>
              Need an account ?{" "}
              <Text style={styles.signupTextBold}>Register Phone</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scrollContent: { flexGrow: 1 },
  backgroundImage: { width: "100%", height: height * 0.4 },
  gradientOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 20 },
  backButton: { position: "absolute", left: 20, top: 20, zIndex: 10, padding: 10 },
  backButtonText: { color: colors.white, fontSize: 24, fontWeight: "bold" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: typography.title, color: colors.white, fontWeight: "500", marginTop: 10 },
  bottomSheet: { marginTop: -30, backgroundColor: colors.background, borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingHorizontal: 20, paddingTop: 30, paddingBottom: 40, minHeight: height * 0.6 },
  title: { fontSize: typography.header, fontWeight: "600", color: "#000000", marginBottom: 5 },
  subtitle: { fontSize: typography.body, color: colors.textSecondary, marginBottom: 30 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: 5, height: 60, marginBottom: 15, paddingHorizontal: 15 },
  input: { flex: 1, height: "100%", fontSize: typography.body, color: colors.text },
  eyeIcon: { padding: 5 },
  loginButton: { backgroundColor: colors.primary, height: 60, borderRadius: 5, justifyContent: "center", alignItems: "center", marginBottom: 20, marginTop: 10 },
  loginButtonText: { color: colors.white, fontSize: typography.body, fontWeight: "600" },
  signupLinkContainer: { alignItems: "center", paddingTop: 10 },
  signupText: { fontSize: typography.body, color: colors.textSecondary },
  signupTextBold: { fontWeight: "500", color: "#000000" },
});
