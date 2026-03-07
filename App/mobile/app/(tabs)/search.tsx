import { useState, useCallback, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList,
  Pressable, ActivityIndicator, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { api } from '@/services/api';
import { Colors } from '@/constants/colors';

type Result = {
  id: string;
  barcode: string;
  name: string;
  brand?: string;
  image_url?: string;
  health_score?: number;
  score_label?: string;
};

function Scorebadge({ label, score }: { label?: string; score?: number }) {
  if (score == null) return null;
  const color = label === 'green' ? Colors.green : label === 'red' ? Colors.red : Colors.yellow;
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.badgeText}>{score}</Text>
    </View>
  );
}

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const data = await api.searchProducts(trimmed);
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Buscar</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={Colors.textLight} />
          <TextInput
            style={styles.input}
            placeholder="Nombre o marca del producto..."
            placeholderTextColor={Colors.textLight}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => { setQuery(''); setResults([]); setSearched(false); }}>
              <Ionicons name="close-circle" size={18} color={Colors.textLight} />
            </Pressable>
          )}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.center} color={Colors.primary} size="large" />
      ) : searched && results.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="search-outline" size={48} color={Colors.textLight} />
          <Text style={styles.emptyText}>Sin resultados para "{query}"</Text>
          <Text style={styles.emptySubtext}>Solo se muestran productos ya escaneados</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/product/${item.barcode}`)}
            >
              {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.image} />
              ) : (
                <View style={[styles.image, styles.imageFallback]}>
                  <Ionicons name="image-outline" size={24} color={Colors.textLight} />
                </View>
              )}
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                {item.brand && <Text style={styles.brand} numberOfLines={1}>{item.brand}</Text>}
              </View>
              <Scorebadge label={item.score_label} score={item.health_score} />
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 16, gap: 12 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 16, color: Colors.text },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 32 },
  emptyText: { fontSize: 16, fontWeight: '600', color: Colors.text, textAlign: 'center' },
  emptySubtext: { fontSize: 13, color: Colors.textLight, textAlign: 'center' },
  list: { padding: 16, gap: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: { width: 52, height: 52, borderRadius: 8 },
  imageFallback: { backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: Colors.text },
  brand: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
