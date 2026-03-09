import { useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  ActivityIndicator, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useProductStore } from '@/store/useProductStore';
import { Colors, ScoreColors } from '@/constants/colors';
import type { ScoreLabel } from '@/constants/colors';

export default function HistoryScreen() {
  const { history, loadHistory, isLoadingHistory } = useProductStore();

  useEffect(() => {
    loadHistory();
  }, []);

  if (isLoadingHistory) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial</Text>
        <Text style={styles.subtitle}>{history.length} productos escaneados</Text>
      </View>

      {history.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="time-outline" size={64} color={Colors.textLight} />
          <Text style={styles.emptyTitle}>Sin historial aún</Text>
          <Text style={styles.emptyText}>
            Escanea un producto y aparecerá aquí
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, i) => `${item.barcode}-${i}`}
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
                placeholder={{ uri: 'https://via.placeholder.com/60' }}
              />
              <View style={styles.info}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.brand}>{item.brand}</Text>
                <Text style={styles.date}>
                  {new Date(item.scanned_at).toLocaleDateString('es-PE', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                  })}
                </Text>
              </View>
              {item.health_score != null && (
                <View
                  style={[
                    styles.scoreBadge,
                    { backgroundColor: ScoreColors[item.score_label as ScoreLabel] ?? Colors.textLight },
                  ]}
                >
                  <Text style={styles.scoreText}>{item.health_score}</Text>
                </View>
              )}
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
  date: { fontSize: 12, color: Colors.textLight, marginTop: 4 },
  scoreBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: { color: Colors.white, fontWeight: '800', fontSize: 15 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.text },
  emptyText: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center' },
});
