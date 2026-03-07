import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { Colors, ScoreColors, ScoreEmoji } from '@/constants/colors';
import type { ScoreLabel } from '@/constants/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RADIUS = 56;
const STROKE_WIDTH = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SIZE = (RADIUS + STROKE_WIDTH) * 2 + 4;

type Props = {
  score: number;
  label: ScoreLabel;
};

export function HealthScoreWheel({ score, label }: Props) {
  const progress = useSharedValue(0);
  const color = ScoreColors[label] ?? Colors.textLight;

  useEffect(() => {
    progress.value = withTiming(score / 100, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [score]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {/* Pista de fondo */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color + '25'}
          strokeWidth={STROKE_WIDTH}
        />
        {/* Arco de progreso */}
        <AnimatedCircle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={CIRCUMFERENCE}
          animatedProps={animatedProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </Svg>

      {/* Texto central */}
      <View style={[StyleSheet.absoluteFillObject, styles.centerText]}>
        <Text style={[styles.scoreNumber, { color }]}>{score}</Text>
        <Text style={styles.scoreMax}>/100</Text>
      </View>

      {/* Label debajo */}
      <View style={[styles.labelBadge, { backgroundColor: color + '20' }]}>
        <Text style={[styles.labelText, { color }]}>{ScoreEmoji[label]}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 12 },
  centerText: { justifyContent: 'center', alignItems: 'center' },
  scoreNumber: { fontSize: 36, fontWeight: '900', lineHeight: 40 },
  scoreMax: { fontSize: 14, color: Colors.textSecondary },
  labelBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  labelText: { fontSize: 15, fontWeight: '700' },
});
