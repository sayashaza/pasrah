import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, typography } from '../../theme/colors';
import { fetchApi } from '../../utils/api';

const { width } = Dimensions.get('window');

const COLORS = ['#E6F2EA', '#FFE9E5', '#FFF6E3', '#F3E5F5', '#E0F7FA', '#FFEBEE'];
const ICONS = ['leaf', 'aperture', 'coffee', 'shopping-bag', 'droplet', 'home'];

export default function CategoryScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchApi('/categories').then(setCategories).catch(console.error);
  }, []);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const color = item.color || COLORS[index % COLORS.length];
    const icon = item.icon || ICONS[index % ICONS.length];
    
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push({ pathname: '/category/[id]', params: { id: item.id, name: item.name } })}
      >
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          {item.image ? (
            <Image 
              source={{ uri: item.image }} 
              style={styles.categoryImage} 
              contentFit="cover" 
            />
          ) : (
            <Feather name={icon as any} size={24} color={colors.text} />
          )}
        </View>
        <Text style={styles.cardText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Grid */}
      <FlatList
        data={categories}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderItem}
        numColumns={3}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Actually, Figma shows white bg for the main layout, wait I will check design again. It looks like white bg or #F4F5F9. I will use White.
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
  headerSpacer: {
    width: 40,
  },
  listContent: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 40, // space to account for tabs
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16, // space between rows
  },
  card: {
    width: (width - 32 - 32) / 3, // gap roughly 16 between columns
    aspectRatio: 1, 
    backgroundColor: '#fffbfb',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 66,
    height: 66,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  cardText: {
    fontSize: 10,
    color: '#868889',
    fontWeight: '500',
    textAlign: 'center',
  },
});
