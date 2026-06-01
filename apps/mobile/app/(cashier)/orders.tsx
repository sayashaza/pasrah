import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { fetchApi } from '../../utils/api';
import { colors, typography } from '../../theme/colors';

export default function CashierOrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // In a real implementation, we would pass the cashier's vendor ID
  // to filter the sub_orders. For the mock we just fetch all or simulate.
  useEffect(() => {
    // Simulated fetch
    setTimeout(() => {
      setOrders([
        { id: 'SUB-1001', customer: 'Budi Santoso', status: 'pending', total: 45000, items: 2 },
        { id: 'SUB-1002', customer: 'Siti Aminah', status: 'completed', total: 85000, items: 4 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>{item.id}</Text>
        <View style={[styles.statusBadge, item.status === 'completed' ? styles.statusCompleted : styles.statusPending]}>
          <Text style={[styles.statusText, item.status === 'completed' ? styles.textCompleted : styles.textPending]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>
      
      <View style={styles.orderDetails}>
        <View>
          <Text style={styles.label}>Customer</Text>
          <Text style={styles.value}>{item.customer}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.label}>Amount</Text>
          <Text style={styles.valueTotal}>Rp{item.total.toLocaleString('id-ID')}</Text>
        </View>
      </View>

      {item.status === 'pending' && (
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Confirm & Release Stock</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vendor Orders</Text>
        <Text style={styles.headerSubtitle}>Bulog Vendor</Text>
      </View>

      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Feather name="inbox" size={60} color={colors.placeholder} />
              <Text style={styles.emptyText}>No orders received yet.</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5F9' },
  header: { padding: 20, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: typography.header, fontWeight: '700', color: colors.text },
  headerSubtitle: { fontSize: typography.body, color: colors.primary, fontWeight: '600', marginTop: 4 },
  listContainer: { padding: 20 },
  orderCard: { backgroundColor: colors.white, borderRadius: 10, padding: 16, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  orderId: { fontSize: 16, fontWeight: '700', color: colors.text },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusPending: { backgroundColor: '#fff3cd' },
  statusCompleted: { backgroundColor: '#dcfce7' },
  statusText: { fontSize: 10, fontWeight: '700' },
  textPending: { color: '#856404' },
  textCompleted: { color: '#166534' },
  orderDetails: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  label: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  value: { fontSize: 14, fontWeight: '600', color: colors.text },
  valueTotal: { fontSize: 15, fontWeight: '700', color: colors.primary },
  actionButton: { backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 6, alignItems: 'center' },
  actionButtonText: { color: colors.white, fontSize: 14, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { marginTop: 15, color: colors.textSecondary, fontSize: 15 },
});
