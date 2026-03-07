import { View, Text, StyleSheet } from 'react-native';
import { WARNING_LABELS } from '@/constants/warnings';
import { Colors } from '@/constants/colors';

type Props = { warning: string };

export function WarningBadge({ warning }: Props) {
  const info = WARNING_LABELS[warning];
  if (!info) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.icon}>{info.icon}</Text>
      <Text style={styles.label}>{info.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF3CD',
    borderWidth: 1,
    borderColor: '#FFEAA7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  icon: { fontSize: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#856404' },
});
