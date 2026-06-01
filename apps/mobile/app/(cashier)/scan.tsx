import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { fetchApi } from '../../utils/api';
import { colors, typography } from '../../theme/colors';

// In a real implementation, we would use expo-camera or expo-barcode-scanner here.
// For the UI template we provide a simulated interface.

const { height } = Dimensions.get('window');

export default function CashierScanScreen() {
  const [manualCode, setManualCode] = useState('');
  const [activeTab, setActiveTab] = useState<'scan' | 'manual'>('scan');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyOrder = async () => {
    if (!manualCode) {
      Toast.show({ type: 'error', text1: 'Please enter an order code' });
      return;
    }
    
    setIsVerifying(true);
    try {
      await fetchApi(`/transactions/sub-orders/${manualCode}/pay`, {
        method: 'POST'
      });
      Toast.show({ type: 'success', text1: 'Order Verified & Paid', text2: 'Stock has been updated automatically' });
      setManualCode('');
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Verification Failed', text2: err.message });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cashier Dashboard</Text>
        <Text style={styles.headerSubtitle}>Bulog Vendor</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'scan' && styles.activeTab]}
          onPress={() => setActiveTab('scan')}
        >
          <Text style={[styles.tabText, activeTab === 'scan' && styles.activeTabText]}>Scan QR</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'manual' && styles.activeTab]}
          onPress={() => setActiveTab('manual')}
        >
          <Text style={[styles.tabText, activeTab === 'manual' && styles.activeTabText]}>Manual Input</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'scan' ? (
        <View style={styles.content}>
          <View style={styles.cameraFramePlaceholder}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
            
            <Feather name="camera" size={40} color={colors.textSecondary} style={{ opacity: 0.5 }} />
            <Text style={styles.cameraText}>Camera Preview</Text>
          </View>
          <Text style={styles.instructionText}>Point the camera at the customer's QR Code</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.manualCard}>
            <Text style={styles.manualCardTitle}>Input Order Code</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. SUB-12345..."
              placeholderTextColor={colors.placeholder}
              value={manualCode}
              onChangeText={setManualCode}
            />
            <TouchableOpacity style={styles.primaryButton} onPress={handleVerifyOrder} disabled={isVerifying}>
              {isVerifying ? (
                 <ActivityIndicator color="#fff" />
              ) : (
                 <Text style={styles.primaryButtonText}>Verify Order</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Create New Walk-in Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5F9' },
  header: { padding: 20, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: typography.header, fontWeight: '700', color: colors.text },
  headerSubtitle: { fontSize: typography.body, color: colors.primary, fontWeight: '600', marginTop: 4 },
  tabContainer: { flexDirection: 'row', backgroundColor: colors.white, paddingHorizontal: 20 },
  tab: { flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: colors.primary },
  tabText: { fontSize: 15, color: colors.textSecondary, fontWeight: '500' },
  activeTabText: { color: colors.primary, fontWeight: '600' },
  content: { flex: 1, padding: 20, alignItems: 'center' },
  cameraFramePlaceholder: { width: 280, height: 280, backgroundColor: '#e0e0e0', borderRadius: 20, justifyContent: 'center', alignItems: 'center', position: 'relative', marginTop: 40 },
  cameraText: { marginTop: 10, color: colors.textSecondary, fontWeight: '500' },
  cornerTopLeft: { position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderTopWidth: 4, borderLeftWidth: 4, borderColor: colors.primary, borderRadius: 4 },
  cornerTopRight: { position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderTopWidth: 4, borderRightWidth: 4, borderColor: colors.primary, borderRadius: 4 },
  cornerBottomLeft: { position: 'absolute', bottom: 20, left: 20, width: 40, height: 40, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: colors.primary, borderRadius: 4 },
  cornerBottomRight: { position: 'absolute', bottom: 20, right: 20, width: 40, height: 40, borderBottomWidth: 4, borderRightWidth: 4, borderColor: colors.primary, borderRadius: 4 },
  instructionText: { marginTop: 30, fontSize: 15, color: colors.textSecondary, textAlign: 'center' },
  manualCard: { width: '100%', backgroundColor: colors.white, borderRadius: 10, padding: 20, marginTop: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  manualCardTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 15 },
  input: { height: 50, backgroundColor: '#F4F5F9', borderRadius: 8, paddingHorizontal: 15, fontSize: 15, marginBottom: 15, color: colors.text },
  primaryButton: { backgroundColor: colors.primary, height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  primaryButtonText: { color: colors.white, fontSize: 15, fontWeight: '600' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  divider: { flex: 1, height: 1, backgroundColor: '#eee' },
  dividerText: { marginHorizontal: 15, color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  secondaryButton: { backgroundColor: '#e6f2ea', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.primary },
  secondaryButtonText: { color: colors.primary, fontSize: 15, fontWeight: '600' },
});
