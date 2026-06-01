import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { colors } from '../theme/colors';
import { useCartStore } from '../store/useCartStore';
import { useFavoriteStore } from '../store/useFavoriteStore';

const { width } = Dimensions.get('window');

const COLORS = [
  "#E6F2EA",
  "#FFE9E5",
  "#FFF6E3",
  "#F3E5F5",
  "#E0F7FA",
  "#FFEBEE",
];

interface ProductCardProps {
  prod: any;
  index: number;
}

export default function ProductCard({ prod, index }: ProductCardProps) {
  const router = useRouter();
  
  const addItem = useCartStore((state) => state.addItem);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const getItemQuantity = useCartStore((state) => state.getItemQuantity);

  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const isFavorite = useFavoriteStore((state) => state.isFavorite);

  const productId = String(prod.id || index);
  const quantityInCart = getItemQuantity(productId);
  const isFav = isFavorite(productId);
  
  const circleColor = prod.color || COLORS[index % COLORS.length];

  return (
    <View style={styles.productCard}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push(`/product/${productId}` as any)}
      >
        {/* Product Background Circle */}
        <View style={[styles.productCircle, { backgroundColor: circleColor }]} />

        {/* Product Header Badges */}
        {prod.is_gpm_product ? (
          <View style={[styles.discountBadge, { backgroundColor: '#dcfce7' }]}>
            <Text style={[styles.discountText, { color: '#166534' }]}>GPM</Text>
          </View>
        ) : prod.discount ? (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{prod.discount}</Text>
          </View>
        ) : prod.isNew ? (
          <View style={styles.newBadge}>
            <Text style={styles.newText}>NEW</Text>
          </View>
        ) : null}

        {/* Product Image */}
        <Image
          source={{ uri: prod.image }}
          style={styles.productImage}
          contentFit="contain"
        />

        {/* Product Details */}
        <Text style={styles.productPrice}>
          Rp{(prod.is_gpm_product && prod.gpm_price ? prod.gpm_price : prod.price)?.toLocaleString('id-ID')}
        </Text>
        <Text style={styles.productName}>{prod.name}</Text>
        <Text style={styles.productWeight}>{prod.stock} units</Text>
      </TouchableOpacity>

      {/* Heart Icon */}
      <TouchableOpacity
        style={styles.heartButton}
        onPress={() => {
          toggleFavorite(productId);
          Toast.show({ type: 'success', text1: isFav ? 'Removed from favorites' : 'Added to favorites', position: 'top' });
        }}
      >
        <Ionicons
          name={isFav ? "heart" : "heart-outline"}
          size={20}
          color={isFav ? "#F56262" : "#868889"}
        />
      </TouchableOpacity>

      {/* Add to Cart Divider & Button */}
      <View style={styles.divider} />
      {quantityInCart > 0 ? (
        <View style={styles.cartCounterContainer}>
          <TouchableOpacity
            onPress={() => decrementQuantity(productId)}
            style={styles.counterButton}
          >
            <Feather name="minus" size={20} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.counterText}>{quantityInCart}</Text>
          <TouchableOpacity
            onPress={() => incrementQuantity(productId)}
            style={styles.counterButton}
          >
            <Feather name="plus" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => {
            addItem({ ...prod, id: productId });
            Toast.show({ type: 'success', text1: 'Added to cart', position: 'top' });
          }}
        >
          <Feather
            name="shopping-bag"
            size={16}
            color={colors.primary}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.addToCartText}>Add to cart</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    width: (width - 32 - 18) / 2, // responsive exact 18px horizontal gap
    height: 234,
    backgroundColor: colors.white,
    borderRadius: 5,
    marginBottom: 20, // 20px vertical gap as per Figma
    position: "relative",
    overflow: "hidden",
  },
  productCircle: {
    position: "absolute",
    top: 21,
    alignSelf: "center",
    width: 85,
    height: 85,
    borderRadius: 42.5,
  },
  discountBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#fee4e4",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderBottomRightRadius: 5,
  },
  discountText: {
    color: "#F56262",
    fontSize: 10,
    fontWeight: "600",
  },
  newBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#FDEFD5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderBottomRightRadius: 5,
  },
  newText: {
    color: "#E8AD41",
    fontSize: 10,
    fontWeight: "600",
  },
  heartButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  productImage: {
    position: "absolute",
    top: 35,
    alignSelf: "center",
    width: 90,
    height: 90,
  },
  productPrice: {
    position: "absolute",
    top: 123,
    width: "100%",
    fontSize: 12,
    color: "#6cc51d",
    fontWeight: "500",
    textAlign: "center",
  },
  productName: {
    position: "absolute",
    top: 140,
    width: "100%",
    fontSize: 15,
    color: colors.text,
    fontWeight: "600",
    textAlign: "center",
  },
  productWeight: {
    position: "absolute",
    top: 164,
    width: "100%",
    fontSize: 12,
    color: "#868889",
    textAlign: "center",
  },
  divider: {
    position: "absolute",
    top: 193,
    width: "100%",
    height: 1,
    backgroundColor: "#F0F0F0",
  },
  addToCartButton: {
    position: "absolute",
    top: 194,
    width: "100%",
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addToCartText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "500",
  },
  cartCounterContainer: {
    position: "absolute",
    top: 194,
    width: "100%",
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  counterButton: {
    padding: 8,
  },
  counterText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
});
