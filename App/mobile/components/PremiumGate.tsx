import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';

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
    backgroundColor: Colors.infoBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.infoBorder,
    gap: 8,
  },
  icon: { fontSize: 32 },
  title: { fontSize: 18, fontWeight: '700', color: Colors.infoText },
  description: { fontSize: 14, color: Colors.infoText, textAlign: 'center', lineHeight: 20 },
  button: {
    marginTop: 8,
    backgroundColor: Colors.info,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
});
