import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather, Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { colors, typography } from '../../theme/colors';
import { fetchApi } from '../../utils/api';
import { useCartStore } from '../../store/useCartStore';
import { useFavoriteStore } from '../../store/useFavoriteStore';
import ProductCard from '../../components/ProductCard';

const { width } = Dimensions.get('window');

const COLORS = [
  "#E6F2EA",
  "#FFE9E5",
  "#FFF6E3",
  "#F3E5F5",
  "#E0F7FA",
  "#FFEBEE",
];

export default function CategorySingleScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const addItem = useCartStore((state) => state.addItem);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const getItemQuantity = useCartStore((state) => state.getItemQuantity);

  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const isFavorite = useFavoriteStore((state) => state.isFavorite);

  useEffect(() => {
    fetchApi('/products')
      .then((data) => {
        const filteredProducts = data.filter((p: any) => p.categoryId === id || p.category === id || p.category === name || p.categoryId === name);
        setProducts(filteredProducts);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id, name]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name || 'Category'}</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="sliders" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : products.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.productsContainer}>
            {products.map((prod, index) => (
              <ProductCard key={prod.id || index} prod={prod} index={index} />
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products found in this category</Text>
        </View>
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
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: '#FFFFFF',
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
  filterButton: {
    padding: 8,
    marginRight: -8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 16,
  },
  productsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
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
    paddingHorizontal: 20,
  },
  counterButton: {
    padding: 8,
  },
  counterText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
});
