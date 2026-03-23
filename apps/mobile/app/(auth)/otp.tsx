import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography } from '../../theme/colors';

const { width } = Dimensions.get('window');

export default function OtpScreen() {
  const router = useRouter();
  // 6 digits setup
  const [otp, setOtp] = useState(['9', '5', '', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Verify Number</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Verify your number</Text>
            <Text style={styles.subtitle}>Enter your OTP code below</Text>

            {/* OTP Fields */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { inputs.current[index] = ref; }}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(val) => handleOtpChange(val, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                />
              ))}
            </View>

            {/* Next Button */}
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/(tabs)' as any)}>
              <Text style={styles.primaryButtonText}>Next</Text>
            </TouchableOpacity>
            
            <View style={styles.resendContainer}>
              <Text style={styles.resendTextBase}>Did’nt receive the code ?</Text>
              <TouchableOpacity>
                <Text style={styles.resendTextLink}>Resend a new code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F5F9', // App wide off-white
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F5F9',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    padding: 10,
    marginTop: -5,
  },
  backButtonText: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.title,
    color: colors.text,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.header,
    fontWeight: '600',
    color: '#000',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  otpInput: {
    width: (width - 40 - 5 * 10) / 6, // 6 boxes, 5 gaps
    height: 60,
    backgroundColor: colors.white,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    height: 60,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: '600',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  resendTextBase: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  resendTextLink: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: '500',
  },
});

