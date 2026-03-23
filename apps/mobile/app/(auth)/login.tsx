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

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Top Image Section */}
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
                {/* Generic text back button since we don't have SVG */}
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Welcome</Text>
            </SafeAreaView>
          </View>
        </ImageBackground>

        {/* Bottom Sheet Section */}
        <View style={styles.bottomSheet}>
          <Text style={styles.title}>Welcome back !</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          {/* Email Field */}
          <View style={styles.inputContainer}>
            <View style={styles.iconPlaceholder}></View>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={colors.placeholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Field */}
          <View style={styles.inputContainer}>
            <View style={styles.iconPlaceholder}></View>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.placeholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <View style={styles.iconPlaceholderSmall}></View>
            </TouchableOpacity>
          </View>

          {/* Remember me & Forgot Password */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.rememberMeContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.toggle, rememberMe && styles.toggleActive]}>
                {rememberMe && <View style={styles.toggleKnobActive} />}
                {!rememberMe && <View style={styles.toggleKnobInactive} />}
              </View>
              <Text style={styles.rememberMeText}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Forgot password</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.replace("/(tabs)" as any)}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <TouchableOpacity
            style={styles.signupLinkContainer}
            onPress={() => router.push("/(auth)/welcome")}
          >
            <Text style={styles.signupText}>
              Don’t have an account ?{" "}
              <Text style={styles.signupTextBold}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  backgroundImage: {
    width: "100%",
    height: height * 0.55,
  },
  gradientOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 20, // Adjust for safe area ideally
    zIndex: 10,
    padding: 10,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "bold",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: typography.title,
    color: colors.white,
    fontWeight: "500",
    marginTop: 10,
  },
  bottomSheet: {
    // Overlapping the background image slightly
    marginTop: -40,
    backgroundColor: colors.background,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
    minHeight: height * 0.5,
  },
  title: {
    fontSize: typography.header,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 5,
    height: 60,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  iconPlaceholder: {
    width: 20,
    height: 20,
    backgroundColor: "#d9d9d9",
    borderRadius: 10,
    marginRight: 10,
  },
  iconPlaceholderSmall: {
    width: 16,
    height: 16,
    backgroundColor: "#d9d9d9",
    borderRadius: 8,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: typography.body,
    color: colors.text,
  },
  eyeIcon: {
    padding: 5,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 5,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggle: {
    width: 32,
    height: 18,
    borderRadius: 10,
    backgroundColor: "#e2e2e2",
    justifyContent: "center",
    paddingHorizontal: 2,
    marginRight: 8,
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  toggleKnobInactive: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.white,
    alignSelf: "flex-start",
  },
  toggleKnobActive: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.white,
    alignSelf: "flex-end",
  },
  rememberMeText: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  forgotPasswordText: {
    fontSize: typography.body,
    color: "#407EC7",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: colors.primary,
    height: 60,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: "600",
  },
  signupLinkContainer: {
    alignItems: "center",
    paddingTop: 10,
  },
  signupText: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  signupTextBold: {
    fontWeight: "500",
    color: "#000000",
  },
});
