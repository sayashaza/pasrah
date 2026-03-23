import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather, Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { colors, typography } from '../../theme/colors';
import { fetchApi } from '../../utils/api';
import { useCartStore } from '../../store/useCartStore';
import { useFavoriteStore } from '../../store/useFavoriteStore';

const { width, height } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const addItem = useCartStore((state) => state.addItem);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const getItemQuantity = useCartStore((state) => state.getItemQuantity);

  const isFavorite = useFavoriteStore((state) => state.isFavorite(id));
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);

  useEffect(() => {
    // Fetch all products and find the matching one as a fallback implementation
    fetchApi('/products')
      .then((data) => {
        const found = data.find((p: any) => String(p.id) === id || p.id === Number(id));
        setProduct(found);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: colors.text }}>Product not found</Text>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.back()}>
          <Text style={{ color: colors.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const quantityInCart = getItemQuantity(id);

  return (
    <View style={styles.container}>
      {/* Top Image Section */}
      <View style={styles.imageContainer}>
        <SafeAreaView edges={['top']} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
        </SafeAreaView>
        <Image 
          source={{ uri: product.image }} 
          style={styles.mainImage} 
          contentFit="contain"
        />
      </View>

      {/* Bottom Sheet Section */}
      <View style={styles.bottomSheet}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Title, Price, Weight */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>${Number(product.price).toFixed(2)}</Text>
          </View>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.weight}>{product.stock || '1.0'} units</Text>
          </View>
          
          {/* Ratings (Static as per Figma) */}
          <View style={styles.ratingRow}>
            <Text style={styles.ratingText}>4.5</Text>
            <View style={styles.stars}>
              {[1,2,3,4,5].map(i => <Ionicons key={i} name="star" size={14} color="#FFC107" />)}
            </View>
            <Text style={styles.reviewCount}>(89 reviews)</Text>
          </View>

          {/* Description */}
          <Text style={styles.description}>
            {product.description || `Organic Mountain works as a seller for many organic growers...`}
            <Text style={styles.readMore}> more</Text>
          </Text>

          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantityControls}>
               {quantityInCart > 0 ? (
                  <>
                    <TouchableOpacity onPress={() => decrementQuantity(id)} style={styles.qBtn}>
                      <Feather name="minus" size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <Text style={styles.qText}>{quantityInCart}</Text>
                    <TouchableOpacity onPress={() => incrementQuantity(id)} style={styles.qBtn}>
                      <Feather name="plus" size={20} color={colors.primary} />
                    </TouchableOpacity>
                  </>
               ) : (
                  <>
                    <TouchableOpacity style={styles.qBtn} disabled>
                      <Feather name="minus" size={20} color="#EBEBEB" />
                    </TouchableOpacity>
                    <Text style={styles.qText}>0</Text>
                    <TouchableOpacity onPress={() => {
                      addItem({ ...product, id });
                      Toast.show({ type: 'success', text1: 'Added to cart', position: 'top' });
                    }} style={styles.qBtn}>
                      <Feather name="plus" size={20} color={colors.primary} />
                    </TouchableOpacity>
                  </>
               )}
            </View>
          </View>
          
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>

      {/* Sticky Bottom Actions */}
      <View style={styles.bottomActions}>
         <TouchableOpacity style={styles.favButton} onPress={() => {
           toggleFavorite(id);
           Toast.show({ type: 'success', text1: isFavorite ? 'Removed from favorites' : 'Added to favorites', position: 'top' });
         }}>
           <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "#F56262" : "#868889"} />
         </TouchableOpacity>
         
         <TouchableOpacity 
           style={styles.addButton} 
           onPress={() => {
             if (quantityInCart === 0) {
               addItem({ ...product, id });
                Toast.show({ type: 'success', text1: 'Added to cart', position: 'top' });
              } else {
               router.back();
             }
           }}
         >
           <Feather name="shopping-bag" size={20} color={colors.white} style={{ marginRight: 8 }} />
           <Text style={styles.addButtonText}>
             {quantityInCart > 0 ? "In Cart - Continue" : "Add to cart"}
           </Text>
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    height: Math.max(height * 0.45, 380),
    backgroundColor: '#FFFFFF',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  mainImage: {
    width: width * 0.7,
    height: width * 0.7,
    marginTop: 20,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: '#F4F5F9',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: -20,
  },
  scrollContent: {
    padding: 20,
  },
  priceRow: {
    alignItems: 'flex-end',
    marginBottom: -5,
  },
  price: {
    fontSize: 18,
    color: '#28b446',
    fontWeight: '600',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  weight: {
    fontSize: 12,
    color: '#868889',
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    marginRight: 4,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 12,
    color: '#868889',
    fontWeight: '500',
  },
  description: {
    fontSize: 12,
    color: '#868889',
    lineHeight: 20,
    marginBottom: 24,
  },
  readMore: {
    color: colors.text,
    fontWeight: '600',
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 12,
    color: '#868889',
    fontWeight: '500',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qBtn: {
    padding: 8,
  },
  qText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    marginHorizontal: 16,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F4F5F9',
    paddingHorizontal: 20,
    paddingBottom: 30, // Safe area roughly
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  favButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    marginRight: 16,
  },
  addButton: {
    flex: 1,
    height: 60,
    backgroundColor: colors.primaryDark,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
  }
});
