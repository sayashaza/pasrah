import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, LayoutAnimation, UIManager, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useAuthStore } from '../../store/useAuthStore';
import { colors } from '../../theme/colors';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function MyOrdersScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.email) {
        setLoading(false);
        return;
      }
      try {
        const ordersRef = collection(db, 'orders', user.email, 'userOrders');
        const q = query(ordersRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        
        const fetchedOrders = snapshot.docs.map(doc => {
          const data = doc.data();
          const d = new Date(data.createdAt);
          const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          
          return {
            id: doc.id.substring(0, 6).toUpperCase(),
            fullId: doc.id,
            date: formattedDate,
            itemsCount: data.items?.length || 0,
            price: data.total || 0,
            status: data.status?.toLowerCase() || 'processing',
            timeline: [
              { status: 'Order placed', date: formattedDate, completed: true },
              { status: 'Order confirmed', date: data.status !== 'Processing' ? formattedDate : 'pending', completed: data.status !== 'Processing' },
              { status: 'Out for delivery', date: 'pending', completed: data.status === 'Out for Delivery' || data.status === 'Delivered' },
              { status: 'Order delivered', date: 'pending', completed: data.status === 'Delivered' },
            ]
          };
        });
        
        setOrders(fetchedOrders);
        if (fetchedOrders.length > 0) {
          setExpandedOrders([fetchedOrders[0].fullId]); // Auto-expand first order
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedOrders(prev => 
      prev.includes(id) ? prev.filter(orderId => orderId !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Order</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="sliders" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centerContainer}>
          <Feather name="package" size={64} color="#E0E0E0" />
          <Text style={styles.emptyText}>No orders found</Text>
          <TouchableOpacity style={styles.shopNowButton} onPress={() => router.push('/')}>
            <Text style={styles.shopNowText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {orders.map((order, index) => {
            const isExpanded = expandedOrders.includes(order.fullId);
            return (
              <View key={order.fullId} style={[styles.orderCard, index === 0 ? { marginTop: 20 } : null]}>
                {/* Order Top Bar */}
                <TouchableOpacity style={styles.orderTopBar} onPress={() => toggleExpand(order.fullId)} activeOpacity={0.7}>
                  <View style={styles.orderLeft}>
                    <View style={styles.orderIconBox}>
                      <Feather name="package" size={24} color={colors.primary} />
                    </View>
                    <View style={styles.orderInfo}>
                      <Text style={styles.orderNumber}>Order #{order.id}</Text>
                      <Text style={styles.orderDate}>Placed on {order.date}</Text>
                      <View style={styles.orderStats}>
                        <Text style={styles.orderItems}>Items: <Text style={styles.boldProp}>{order.itemsCount}</Text></Text>
                        <Text style={styles.orderItemsDivider}>  Total: <Text style={styles.boldProp}>${order.price.toFixed(2)}</Text></Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.chevronWrapper}>
                    <Feather name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.primary} />
                  </View>
                </TouchableOpacity>

                {/* Order Expanded Details */}
                {isExpanded && order.timeline.length > 0 && (
                  <View style={styles.timelineContainer}>
                    {order.timeline.map((step: any, idx: number) => (
                      <View key={idx} style={styles.timelineStep}>
                        <View style={styles.timelineLineWrapper}>
                          <View style={[styles.timelineDot, step.completed ? styles.timelineDotComplete : styles.timelineDotPending]} />
                          {idx !== order.timeline.length - 1 && (
                            <View style={[styles.timelineLine, step.completed ? styles.timelineLineComplete : styles.timelineLinePending]} />
                          )}
                        </View>
                        <View style={styles.timelineContent}>
                          <Text style={[styles.timelineStatus, step.completed ? styles.timelineStatusComplete : null]}>{step.status}</Text>
                          <Text style={[styles.timelineDate, step.completed ? styles.timelineDateComplete : null]}>{step.date}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {/* Order Collapsed Delivered details */}
                {!isExpanded && order.status === 'delivered' && (
                  <View style={styles.collapsedDelivery}>
                    <View style={styles.timelineLineWrapper}>
                      <View style={styles.timelineDotPending} />
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineStatus}>Order Delivered</Text>
                      <Text style={styles.timelineDateComplete}>{order.date}</Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
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
  filterButton: {
    padding: 8,
    marginRight: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: '#868889',
    fontWeight: '500',
  },
  shopNowButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopNowText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
  },
  orderTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderLeft: {
    flexDirection: 'row',
  },
  orderIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ebfdf0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  orderInfo: {
    justifyContent: 'center',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: '#868889',
    marginBottom: 4,
  },
  orderStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderItems: {
    fontSize: 13,
    color: '#868889',
  },
  boldProp: {
    fontWeight: '700',
    color: colors.text,
  },
  orderItemsDivider: {
    fontSize: 13,
    color: '#868889',
  },
  chevronWrapper: {
    marginTop: 5,
  },
  timelineContainer: {
    marginTop: 25,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F4F5F9',
  },
  timelineStep: {
    flexDirection: 'row',
    marginBottom: 0,
    minHeight: 45,
  },
  timelineLineWrapper: {
    alignItems: 'center',
    width: 20,
    marginRight: 15,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 1,
  },
  timelineDotComplete: {
    backgroundColor: colors.primary,
  },
  timelineDotPending: {
    backgroundColor: '#EAEAEA',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: -2,
    marginBottom: -2,
  },
  timelineLineComplete: {
    backgroundColor: colors.primary,
  },
  timelineLinePending: {
    backgroundColor: '#EAEAEA',
  },
  timelineContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 25,
    marginTop: -2,
  },
  timelineStatus: {
    fontSize: 15,
    fontWeight: '600',
    color: '#868889',
  },
  timelineStatusComplete: {
    color: colors.text,
  },
  timelineDate: {
    fontSize: 14,
    color: '#868889',
  },
  timelineDateComplete: {
    color: '#868889',
  },
  collapsedDelivery: {
    flexDirection: 'row',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F4F5F9',
  }
});
