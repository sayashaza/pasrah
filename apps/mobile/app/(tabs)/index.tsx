import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import ProductCard from "../../components/ProductCard";
import { colors, typography } from "../../theme/colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useCartStore } from "../../store/useCartStore";
import { useFavoriteStore } from "../../store/useFavoriteStore";

const { width } = Dimensions.get("window");

// Fallback static data temporarily removed from globals
import { fetchApi } from "../../utils/api";

const COLORS = [
  "#E6F2EA",
  "#FFE9E5",
  "#FFF6E3",
  "#F3E5F5",
  "#E0F7FA",
  "#FFEBEE",
];
const ICONS = ["leaf", "aperture", "coffee", "shopping-bag", "droplet", "home"];

export default function HomeScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);

  const router = useRouter();

  const addItem = useCartStore((state) => state.addItem);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const getItemQuantity = useCartStore((state) => state.getItemQuantity);

  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const isFavorite = useFavoriteStore((state) => state.isFavorite);

  useEffect(() => {
    fetchApi("/categories").then(setCategories).catch(console.error);
    fetchApi("/products").then(setProducts).catch(console.error);
    fetchApi("/banners").then(setBanners).catch(console.error);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather
            name="search"
            size={20}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search keywords.."
            placeholderTextColor={colors.textSecondary}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Feather name="sliders" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Banner */}
        {banners.length > 0 ? (
          banners.map((banner, index) => (
            <View key={banner.id || index} style={styles.bannerContainer}>
              <Image
                source={{ uri: banner.image }}
                style={[styles.bannerImage, { opacity: 0.8 }]}
                contentFit="cover"
              />
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>{banner.title}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.bannerContainer}>
            <Image
              source={require("../../assets/images/icon.png")}
              style={styles.bannerImage}
              contentFit="cover"
            />
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Loading Banners...</Text>
            </View>
          </View>
        )}

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity>
            <Feather
              name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((cat, index) => {
            const color = cat.color || COLORS[index % COLORS.length];
            const icon = cat.icon || ICONS[index % ICONS.length];
            return (
              <TouchableOpacity
                key={cat.id || index}
                style={styles.categoryItem}
                onPress={() =>
                  router.push({
                    pathname: "/category/[id]",
                    params: { id: cat.id, name: cat.name },
                  })
                }
              >
                <View
                  style={[
                    styles.categoryIconContainer,
                    { backgroundColor: color, overflow: "hidden" },
                  ]}
                >
                  {cat.image ? (
                    <Image
                      source={{ uri: cat.image }}
                      style={{ width: 32, height: 32 }}
                      contentFit="cover"
                    />
                  ) : (
                    <Feather name={icon as any} size={24} color={colors.text} />
                  )}
                </View>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured Products Section */}
        <View style={[styles.sectionHeader, { marginTop: 30 }]}>
          <Text style={styles.sectionTitle}>Featured products</Text>
          <TouchableOpacity>
            <Feather
              name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.productsContainer}>
          {products.map((prod, index) => (
            <ProductCard key={prod.id || index} prod={prod} index={index} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5F9",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 10,
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: typography.body,
    color: colors.text,
  },
  filterButton: {
    marginLeft: 10,
  },
  bannerContainer: {
    marginHorizontal: 16,
    marginTop: 20,
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#E2F1D3", // Placeholder color if image fails
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    opacity: 0.2, // dim it a bit so text stands out if using placeholder
  },
  bannerTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    lineHeight: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
    width: 60,
  },
  categoryIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 10,
    color: "#868889",
    fontWeight: "500",
    textAlign: "center",
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
