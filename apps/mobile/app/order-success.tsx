import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, typography } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)' as any)}>
          <Feather name="x" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.successIconContainer}>
          <Feather name="check-circle" size={80} color={colors.primary} />
        </View>
        <Text style={styles.title}>Order placed successfully!</Text>
        <Text style={styles.subtitle}>Show this QR code to the cashier/vendor at the GPM event to collect your items.</Text>

        <View style={styles.qrContainer}>
          {/* In a real app we'd use react-native-qrcode-svg. Simulating it here. */}
          <View style={styles.qrPlaceholder}>
            <Feather name="maximize" size={150} color={colors.text} />
            <Text style={styles.qrText}>{orderId || 'GPM-ORDER-ID'}</Text>
          </View>
        </View>

        <Text style={styles.instruction}>
          Your order ID: <Text style={styles.orderIdBold}>{orderId}</Text>
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.replace('/(tabs)' as any)}
        >
          <Text style={styles.primaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F9',
  },
  header: {
    padding: 16,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: typography.header,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  qrContainer: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 30,
  },
  qrPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    letterSpacing: 1,
  },
  instruction: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  orderIdBold: {
    fontWeight: 'bold',
    color: colors.text,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    height: 60,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
