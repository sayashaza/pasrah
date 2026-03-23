import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';

const mockTransactions = [
  { id: '1', type: 'mastercard', title: 'Master Card', date: 'Dec 12 2021 at 10:00 pm', amount: 89 },
  { id: '2', type: 'visa', title: 'Visa', date: 'Dec 12 2021 at 10:00 pm', amount: 109 },
  { id: '3', type: 'paypal', title: 'Paypal', date: 'Dec 12 2021 at 10:00 pm', amount: 567 },
  { id: '4', type: 'paypal', title: 'Paypal', date: 'Dec 12 2021 at 10:00 pm', amount: 567 },
  { id: '5', type: 'visa', title: 'Visa', date: 'Dec 12 2021 at 10:00 pm', amount: 109 },
  { id: '6', type: 'mastercard', title: 'Master Card', date: 'Dec 12 2021 at 10:00 pm', amount: 89 },
];

export default function TransactionsScreen() {
  const router = useRouter();

  const renderIcon = (type: string) => {
    switch (type) {
      case 'mastercard':
        return <FontAwesome5 name="cc-mastercard" size={24} color="#EB001B" />;
      case 'visa':
        return <FontAwesome5 name="cc-visa" size={24} color="#1A1F71" />;
      case 'paypal':
        return <FontAwesome5 name="cc-paypal" size={24} color="#003087" />;
      default:
        return <Feather name="credit-card" size={24} color={colors.primary} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transactions</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {mockTransactions.map((tx) => (
          <View key={tx.id} style={styles.txCard}>
            <View style={styles.txLeft}>
              <View style={styles.iconCircle}>
                {renderIcon(tx.type)}
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
            </View>
            <View style={styles.txRight}>
              <Text style={styles.txAmount}>${tx.amount}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    height: 60,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  scrollContent: {
    padding: 20,
  },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F4F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  txInfo: {
    justifyContent: 'center',
  },
  txTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  txDate: {
    fontSize: 13,
    color: '#868889',
  },
  txRight: {
    justifyContent: 'center',
  },
  txAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
});
