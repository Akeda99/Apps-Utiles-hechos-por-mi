import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors, ScoreColors } from '@/constants/colors';
import type { ScoreLabel } from '@/constants/colors';
import type { Product } from '@/services/api';

type Props = { product: Product };

export function AlternativeCard({ product }: Props) {
  const scoreColor = ScoreColors[product.score_label as ScoreLabel] ?? Colors.scoreGreen;

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/product/${product.barcode}`)}
    >
      <Image
        source={{ uri: product.image_url }}
        style={styles.image}
        contentFit="contain"
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.brand}>{product.brand}</Text>
      </View>
      <View style={styles.scoreSection}>
        <View style={[styles.scoreBadge, { backgroundColor: scoreColor }]}>
          <Text style={styles.scoreText}>{product.health_score}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  image: { width: 56, height: 56, borderRadius: 8 },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '600', color: Colors.text },
  brand: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  scoreSection: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  scoreBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: { color: Colors.white, fontWeight: '800', fontSize: 14 },
});
