import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

// Los 4 octógonos oficiales de la Ley 30021 (Manual de Advertencias Publicitarias, Perú).
// Cualquier otra advertencia de la app (aditivos, grasas trans, etc.) NO es un octógono oficial
// y se sigue mostrando como WarningBadge normal.
const OCTAGON_TEXT: Record<string, string> = {
  alto_en_azucar: 'ALTO EN\nAZÚCAR',
  alto_en_sodio: 'ALTO EN\nSODIO',
  alto_en_grasas_saturadas: 'ALTO EN\nGRASAS\nSATURADAS',
  alto_en_calorias: 'ALTO EN\nCALORÍAS',
};

export const OFFICIAL_OCTAGON_WARNINGS = Object.keys(OCTAGON_TEXT);

const SIZE = 76;
const CUT = SIZE * 0.3;
const OCTAGON_POINTS = [
  `${CUT},0`, `${SIZE - CUT},0`,
  `${SIZE},${CUT}`, `${SIZE},${SIZE - CUT}`,
  `${SIZE - CUT},${SIZE}`, `${CUT},${SIZE}`,
  `0,${SIZE - CUT}`, `0,${CUT}`,
].join(' ');

export function WarningOctagon({ warning }: { warning: string }) {
  const text = OCTAGON_TEXT[warning];
  if (!text) return null;

  return (
    <View style={styles.wrapper}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={StyleSheet.absoluteFill}>
        <Polygon points={OCTAGON_POINTS} fill="#000000" stroke="#FFFFFF" strokeWidth={2.5} />
      </Svg>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  text: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 10,
    paddingHorizontal: 8,
  },
});
