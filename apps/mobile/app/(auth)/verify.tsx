import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography } from '../../theme/colors';

const { width } = Dimensions.get('window');

export default function VerifyNumberScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('2055550145');

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
            <Text style={styles.subtitle}>
              Lorem ipsum dolor sit amet, consetetur{'\n'}
              sadipscing elitr, sed diam nonumy
            </Text>

            {/* Phone Field */}
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.countryCodeContainer}>
                {/* Generic flag placeholder */}
                <View style={styles.flagPlaceholder} />
                <Text style={styles.countryCodeText}>+1</Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
              
              <View style={styles.divider} />
              
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor={colors.placeholder}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>

            {/* Next Button */}
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(auth)/otp')}>
              <Text style={styles.primaryButtonText}>Next</Text>
            </TouchableOpacity>
            
            <Text style={styles.resendText}>Resend confirmation code (1:23)</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F5F9',
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 5,
    height: 60,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: '100%',
  },
  flagPlaceholder: {
    width: 24,
    height: 16,
    backgroundColor: '#ccc',
    marginRight: 8,
    borderRadius: 2,
  },
  countryCodeText: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: '500',
    marginRight: 5,
  },
  dropdownIcon: {
    fontSize: 10,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: colors.border,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: typography.body,
    color: colors.text,
    paddingHorizontal: 15,
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
  resendText: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
});

