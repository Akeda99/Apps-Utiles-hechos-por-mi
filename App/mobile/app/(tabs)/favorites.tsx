import { useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  ActivityIndicator, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useProductStore } from '@/store/useProductStore';
import { Colors, ScoreColors } from '@/constants/colors';
import type { ScoreLabel } from '@/constants/colors';

export default function FavoritesScreen() {
  const { favorites, loadFavorites, removeFavorite, isLoadingFavorites } = useProductStore();

  // Recargar favoritos cada vez que el usuario vuelve a esta pestaña
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  if (isLoadingFavorites) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Favoritos</Text>
        <Text style={styles.subtitle}>{favorites.length} productos guardados</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={64} color={Colors.textLight} />
          <Text style={styles.emptyTitle}>Sin favoritos aún</Text>
          <Text style={styles.emptyText}>
            Guarda tus productos favoritos para encontrarlos rápidamente
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/product/${item.barcode}?from=saved` as any)}
            >
              <Image
                source={{ uri: item.image_url }}
                style={styles.image}
                contentFit="contain"
              />
              <View style={styles.info}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.brand}>{item.brand}</Text>
                <View
                  style={[
                    styles.labelBadge,
                    { backgroundColor: ScoreColors[item.score_label as ScoreLabel] + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.labelText,
                      { color: ScoreColors[item.score_label as ScoreLabel] },
                    ]}
                  >
                    {item.score_label === 'green' ? 'Saludable' : item.score_label === 'yellow' ? 'Moderado' : 'Poco saludable'}
                  </Text>
                </View>
              </View>
              <View style={styles.rightSection}>
                <View
                  style={[
                    styles.scoreBadge,
                    { backgroundColor: ScoreColors[item.score_label as ScoreLabel] ?? Colors.textLight },
                  ]}
                >
                  <Text style={styles.scoreText}>{item.health_score}</Text>
                </View>
                <Pressable
                  onPress={() => removeFavorite(item.id)}
                  hitSlop={8}
                >
                  <Ionicons name="heart" size={22} color={Colors.red} />
                </Pressable>
              </View>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  list: { paddingHorizontal: 16, paddingBottom: 24, gap: 12 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: { width: 60, height: 60, borderRadius: 8 },
  info: { flex: 1 },
  productName: { fontSize: 15, fontWeight: '600', color: Colors.text },
  brand: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  labelBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginTop: 6 },
  labelText: { fontSize: 12, fontWeight: '600' },
  rightSection: { alignItems: 'center', gap: 8 },
  scoreBadge: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  scoreText: { color: Colors.white, fontWeight: '800', fontSize: 15 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.text },
  emptyText: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
});
