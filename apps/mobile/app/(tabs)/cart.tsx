import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useAuthStore } from '../../store/useAuthStore';
import { colors, typography } from '../../theme/colors';
import { useCartStore } from '../../store/useCartStore';
import CartItem from '../../components/CartItem';
import { fetchApi } from '../../utils/api';

export default function CartScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  }, [items]);

  const shipping = items.length > 0 ? 1.6 : 0;
  const total = subtotal + shipping;

  const handleClearAll = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      Toast.show({ type: 'error', text1: 'Cart is empty', position: 'top' });
      return;
    }
    
    if (!user || (!user.email && !user.phoneNumber)) {
      Toast.show({ type: 'error', text1: 'Please login to checkout', position: 'top' });
      router.push('/(auth)/welcome');
      return;
    }

    setIsProcessing(true);
    try {
      const mappedItems = items.map(item => ({
        product_id: item.id,
        name: item.name,
        price: item.is_gpm_product && item.gpm_price ? item.gpm_price : item.price,
        quantity: item.quantity,
        vendor_id: item.vendor_id || "general",
        is_gpm: !!item.is_gpm_product
      }));
      
      const payload = {
        items: mappedItems,
        customer_id: user.uid,
        customer_name: user.displayName || user.phoneNumber || "Customer"
      };

      const res = await fetchApi('/transactions/place-order', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      });
      
      Toast.show({ type: 'success', text1: 'Order placed successfully!', position: 'top' });
      clearCart();
      
      // Navigate to success screen which will show the QR Code
      if (res && res.orderId) {
        router.push(`/order-success?orderId=${res.orderId}` as any);
      } else {
        router.push('/profile/orders');
      }
    } catch (e) {
      console.error(e);
      Toast.show({ type: 'error', text1: 'Failed to place order', text2: 'Please try again later', position: 'top' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        {items.length > 0 ? (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* Cart List */}
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CartItem
            product={item}
            onRemove={() => {
              removeItem(String(item.id));
              Toast.show({ type: 'success', text1: 'Item removed', position: 'top' });
            }}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyContent}>
              <Feather name="shopping-bag" size={100} color={colors.primary} />
              <Text style={styles.emptyTitle}>Your cart is empty !</Text>
              <Text style={styles.emptySubtitle}>You will get a response within{"\n"}a few minutes.</Text>
            </View>
            <TouchableOpacity style={styles.startShoppingButton} onPress={() => router.replace('/')}>
              <Text style={styles.startShoppingText}>Start shopping</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Bottom Summary & Checkout */}
      {items.length > 0 ? (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping charges</Text>
            <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>

          <TouchableOpacity 
            style={[styles.checkoutButton, !user && styles.checkoutButtonDisabled]} 
            onPress={handleCheckout}
            disabled={isProcessing}
          >
            {isProcessing ? (
               <ActivityIndicator color="#FFFFFF" />
            ) : (
               <Text style={styles.checkoutButtonText}>{user ? 'Checkout' : 'Login to Checkout'}</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : null}
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
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500', 
    color: colors.text,
  },
  listContent: {
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
  },
  clearButton: {
    padding: 8,
    marginRight: -8,
  },
  clearText: {
    color: '#F56262',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 80,
    backgroundColor: '#FFFFFF',
  },
  emptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingBottom: 40,
  },
  emptyTitle: {
    marginTop: 24,
    fontSize: 20,
    color: '#000000',
    fontWeight: '600',
  },
  emptySubtitle: {
    marginTop: 12,
    fontSize: 15,
    color: '#868889',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  startShoppingButton: {
    backgroundColor: colors.primary,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  startShoppingText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#868889',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '700',
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    height: 54,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
