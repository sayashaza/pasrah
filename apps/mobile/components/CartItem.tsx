import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useCartStore } from '../store/useCartStore';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width; // We will use full width minus padding by styling the inner container
const ACTION_WIDTH = 75; // width of the delete button

interface CartItemProps {
  product: any;
  onRemove: () => void;
}

export default function CartItem({ product, onRemove }: CartItemProps) {
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const getItemQuantity = useCartStore((state) => state.getItemQuantity);

  const productId = String(product.id);
  const quantity = getItemQuantity(productId);

  const scrollViewRef = useRef<ScrollView>(null);

  const closeSwipe = () => {
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  };

  const handleRemove = () => {
    closeSwipe();
    onRemove();
  };

  if (quantity === 0 && product.isCartItem) return null; // Fallback

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ACTION_WIDTH}
        snapToAlignment="end"
        decelerationRate="fast"
        contentContainerStyle={{ width: width + ACTION_WIDTH }}
      >
        <View style={styles.mainContent}>
          <TouchableOpacity activeOpacity={1} style={styles.cardInner}>
            {/* Left Box */}
            <View style={[styles.imageContainer, { backgroundColor: product.color || '#E6F2EA' }]}>
              <Image source={{ uri: product.image }} style={styles.image} contentFit="contain" />
            </View>

            {/* Middle Info */}
            <View style={styles.infoContainer}>
              <Text style={styles.priceText}>${Number(product.price).toFixed(2)}</Text>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productWeight}>{product.stock || '1.50 lbs'}</Text>
            </View>

            {/* Right Controls */}
            <View style={styles.controlsContainer}>
              <TouchableOpacity onPress={() => incrementQuantity(productId)} style={styles.iconButton}>
                <Feather name="plus" size={20} color={colors.primary} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={() => decrementQuantity(productId)} style={styles.iconButton}>
                <Feather name="minus" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
        </View>

        {/* Swipe Action Area */}
        <TouchableOpacity style={styles.deleteAction} onPress={handleRemove} activeOpacity={0.8}>
          <Feather name="trash-2" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F5F9', // optional divider per Figma
  },
  mainContent: {
    width: width,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 45,
    height: 45,
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 15,
  },
  priceText: {
    color: '#6cc51d',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  productName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productWeight: {
    color: '#868889',
    fontSize: 12,
  },
  controlsContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
  },
  iconButton: {
    padding: 2,
  },
  quantityText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginVertical: 4,
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 1,
    backgroundColor: '#F4F5F9',
  },
  deleteAction: {
    width: ACTION_WIDTH,
    backgroundColor: '#F56262',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
