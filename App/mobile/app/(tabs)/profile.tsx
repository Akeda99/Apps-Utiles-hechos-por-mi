import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useProductStore } from '@/store/useProductStore';
import { api } from '@/services/api';
import { Colors } from '@/constants/colors';

type MenuItemProps = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  color?: string;
};

function MenuItem({ icon, label, onPress, color = Colors.text }: MenuItemProps) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={[styles.menuLabel, { color }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
    </Pressable>
  );
}

const BADGES = [
  { label: 'Explorador', minPoints: 1, icon: '🌱' },
  { label: 'Colaborador', minPoints: 30, icon: '🤝' },
  { label: 'Experto', minPoints: 100, icon: '⭐' },
  { label: 'Leyenda', minPoints: 300, icon: '🏆' },
];

function getBadges(points: number) {
  return BADGES.filter((b) => points >= b.minPoints);
}

export default function ProfileScreen() {
  const { user, logout } = useProductStore();

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar cuenta',
      'Esta acción es permanente. Se borrarán todos tus datos: historial, favoritos y contribuciones.\n\n¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar cuenta',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirmación final',
              '¿Confirmas que quieres eliminar tu cuenta permanentemente?',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Sí, eliminar',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await api.deleteAccount();
                      logout();
                    } catch {
                      Alert.alert('Error', 'No se pudo eliminar la cuenta. Intenta de nuevo.');
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.guestContainer}>
          <Ionicons name="person-circle-outline" size={80} color={Colors.textLight} />
          <Text style={styles.guestTitle}>¿Tienes una cuenta?</Text>
          <Text style={styles.guestText}>
            Inicia sesión para guardar tu historial y favoritos en todos tus dispositivos.
          </Text>
          <Pressable
            style={styles.loginButton}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/auth/login?mode=register')}>
            <Text style={styles.registerText}>Crear cuenta gratis</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        {/* Avatar y nombre */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>
              {(user.display_name || user.email).charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.displayName}>{user.display_name || 'Usuario'}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {user.premium && (
            <View style={styles.premiumBadge}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.contribution_count}</Text>
            <Text style={styles.statLabel}>Contribuciones</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.pointsValue}>
              <Ionicons name="star" size={18} color="#F59E0B" />
              <Text style={styles.statValue}>{user.points ?? 0}</Text>
            </View>
            <Text style={styles.statLabel}>Puntos</Text>
          </View>
        </View>

        {/* Badges */}
        {getBadges(user.points ?? 0).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Logros</Text>
            <View style={styles.badgesRow}>
              {getBadges(user.points ?? 0).map((b) => (
                <View key={b.label} style={styles.badge}>
                  <Text style={styles.badgeIcon}>{b.icon}</Text>
                  <Text style={styles.badgeLabel}>{b.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Menú */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuenta</Text>
          {!user.premium && (
            <MenuItem
              icon="star-outline"
              label="Hazte Premium"
              onPress={() => Alert.alert('Premium', 'Próximamente disponible')}
              color={Colors.yellow}
            />
          )}
          {user.premium && (
            <MenuItem
              icon="heart-outline"
              label="Perfil de salud"
              onPress={() => router.push('/premium/health-profile')}
            />
          )}
          <MenuItem
            icon="trophy-outline"
            label="Ranking de contribuidores"
            onPress={() => router.push('/leaderboard')}
          />
          <MenuItem
            icon="notifications-outline"
            label="Notificaciones"
            onPress={() => Alert.alert('Notificaciones', 'Próximamente')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          <MenuItem
            icon="information-circle-outline"
            label="Acerca de AlimentaPerú"
            onPress={() => Alert.alert('AlimentaPerú', 'Versión 1.0.0\nHecho con amor para Peru')}
          />
          <MenuItem
            icon="shield-checkmark-outline"
            label="Privacidad y términos"
            onPress={() => router.push('/terms')}
          />
        </View>

        <View style={styles.section}>
          <MenuItem
            icon="log-out-outline"
            label="Cerrar sesión"
            onPress={handleLogout}
            color={Colors.red}
          />
          <MenuItem
            icon="trash-outline"
            label="Eliminar cuenta"
            onPress={handleDeleteAccount}
            color={Colors.red}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  guestTitle: { fontSize: 22, fontWeight: '700', color: Colors.text },
  guestText: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  loginButtonText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
  registerText: { color: Colors.primary, fontWeight: '600', fontSize: 15 },
  profileHeader: { alignItems: 'center', paddingVertical: 24 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: { color: Colors.white, fontSize: 32, fontWeight: '800' },
  displayName: { fontSize: 22, fontWeight: '700', color: Colors.text, marginTop: 12 },
  email: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  premiumText: { color: '#B8860B', fontWeight: '700', fontSize: 13 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, backgroundColor: Colors.border, alignSelf: 'stretch' },
  pointsValue: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statValue: { fontSize: 24, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  section: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  menuLabel: { flex: 1, fontSize: 16 },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    padding: 16,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },
  badgeIcon: { fontSize: 24 },
  badgeLabel: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
});
