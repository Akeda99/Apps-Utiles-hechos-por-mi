import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

import { api } from '@/services/api';
import { Colors } from '@/constants/colors';
import { useProductStore } from '@/store/useProductStore';

type LeaderboardEntry = {
  rank: number;
  display_name: string;
  points: number;
  contribution_count: number;
};

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardScreen() {
  const { user } = useProductStore();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLeaderboard()
      .then(setEntries)
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <Stack.Screen options={{ title: 'Ranking', headerBackTitle: 'Perfil' }} />

      <View style={styles.header}>
        <Text style={styles.title}>Top Contribuidores</Text>
        <Text style={styles.subtitle}>Los usuarios que más aportan a AlimentaPerú</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : entries.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="trophy-outline" size={56} color={Colors.textLight} />
          <Text style={styles.emptyText}>Aún no hay contribuidores</Text>
          <Text style={styles.emptySubtext}>¡Sé el primero en agregar productos!</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => String(item.rank)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const isMe = user?.display_name === item.display_name || false;
            const medal = MEDALS[item.rank - 1];
            return (
              <View style={[styles.row, isMe && styles.rowMe]}>
                <Text style={styles.rank}>
                  {medal ?? `#${item.rank}`}
                </Text>
                <View style={styles.info}>
                  <Text style={[styles.name, isMe && styles.nameMe]}>
                    {item.display_name}{isMe ? ' (tú)' : ''}
                  </Text>
                  <Text style={styles.contribs}>
                    {item.contribution_count} contribución{item.contribution_count !== 1 ? 'es' : ''}
                  </Text>
                </View>
                <View style={styles.pointsBadge}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.points}>{item.points}</Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  list: { paddingHorizontal: 16, gap: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  rowMe: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  rank: { fontSize: 22, width: 36, textAlign: 'center' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: Colors.text },
  nameMe: { color: Colors.primary },
  contribs: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  points: { fontSize: 15, fontWeight: '700', color: '#B8860B' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyText: { fontSize: 18, fontWeight: '700', color: Colors.text },
  emptySubtext: { fontSize: 14, color: Colors.textSecondary },
});
