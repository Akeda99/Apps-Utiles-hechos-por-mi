import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import type { Product } from '@/services/api';

type TrafficColor = 'green' | 'yellow' | 'red';

type NutrientConfig = {
  key: keyof Product;
  label: string;
  solidHigh: number;
  solidMedium: number;
  liquidHigh: number;
  liquidMedium: number;
};

const NUTRIENTS: NutrientConfig[] = [
  { key: 'fat_total',       label: 'Grasas',     solidHigh: 17.5, solidMedium: 3.0,  liquidHigh: 8.75, liquidMedium: 1.5 },
  { key: 'fat_saturated',   label: 'Sat.',        solidHigh: 6.0,  solidMedium: 3.0,  liquidHigh: 3.0,  liquidMedium: 1.5 },
  { key: 'sugars',          label: 'Azúcares',    solidHigh: 22.5, solidMedium: 12.5, liquidHigh: 6.0,  liquidMedium: 3.0 },
  { key: 'sodium_mg',       label: 'Sodio',       solidHigh: 800,  solidMedium: 400,  liquidHigh: 300,  liquidMedium: 150 },
];

function getColor(value: number, high: number, medium: number): TrafficColor {
  if (value >= high) return 'red';
  if (value >= medium) return 'yellow';
  return 'green';
}

const TRAFFIC_COLORS: Record<TrafficColor, string> = {
  green: Colors.scoreGreen,
  yellow: Colors.scoreYellow,
  red: Colors.scoreRed,
};

type Props = { product: Product };

export function NutrientTrafficLight({ product }: Props) {
  const isLiquid = product.is_liquid ?? false;

  return (
    <View style={styles.container}>
      {NUTRIENTS.map((n) => {
        const value = (product[n.key] as number) ?? 0;
        const high = isLiquid ? n.liquidHigh : n.solidHigh;
        const medium = isLiquid ? n.liquidMedium : n.solidMedium;
        const color = getColor(value, high, medium);
        const bgColor = TRAFFIC_COLORS[color];

        return (
          <View key={n.key} style={[styles.nutrientBox, { backgroundColor: bgColor }]}>
            <Text style={styles.nutrientLabel}>{n.label}</Text>
            <Text style={styles.nutrientValue}>
              {value.toFixed(1)}{n.key === 'sodium_mg' ? 'mg' : 'g'}
            </Text>
            <Text style={styles.nutrientLevel}>
              {color === 'green' ? 'Bajo' : color === 'yellow' ? 'Medio' : 'Alto'}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  nutrientBox: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  nutrientLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
  },
  nutrientValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.white,
  },
  nutrientLevel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
});
