import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

type Props = {
  feature?: string;
};

export function PremiumGate({ feature }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⭐</Text>
      <Text style={styles.title}>Función Premium</Text>
      <Text style={styles.description}>
        {feature
          ? `${feature} está disponible para usuarios premium.`
          : 'Esta función está disponible para usuarios premium.'}
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/premium/plans')}>
        <Text style={styles.buttonText}>Ver planes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 8,
  },
  icon: { fontSize: 32 },
  title: { fontSize: 18, fontWeight: '700', color: '#92400E' },
  description: { fontSize: 14, color: '#78350F', textAlign: 'center', lineHeight: 20 },
  button: {
    marginTop: 8,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
