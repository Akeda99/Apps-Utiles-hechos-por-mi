import { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Pressable, ActivityIndicator, Modal, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { useProductStore } from '@/store/useProductStore';
import { api, type CompareResult, type CompareProduct } from '@/services/api';
import { Colors, ScoreColors } from '@/constants/colors';
import type { ScoreLabel } from '@/constants/colors';

const NUTRIENT_ROWS: { key: keyof CompareProduct; label: string; unit: string; lowerIsBetter: boolean }[] = [
  { key: 'health_score',   label: 'Score',          unit: '/100', lowerIsBetter: false },
  { key: 'energy_kcal',    label: 'Calorías',        unit: 'kcal', lowerIsBetter: true },
  { key: 'sugars',         label: 'Azúcar',          unit: 'g',    lowerIsBetter: true },
  { key: 'sodium_mg',      label: 'Sodio',           unit: 'mg',   lowerIsBetter: true },
  { key: 'fat_saturated',  label: 'Grasas sat.',     unit: 'g',    lowerIsBetter: true },
  { key: 'protein',        label: 'Proteína',        unit: 'g',    lowerIsBetter: false },
  { key: 'fiber',          label: 'Fibra',           unit: 'g',    lowerIsBetter: false },
  { key: 'additives_count',label: 'Aditivos',        unit: '',     lowerIsBetter: true },
];

export default function CompareScreen() {
  const { barcode: initialBarcode } = useLocalSearchParams<{ barcode: string }>();
  const { history, user } = useProductStore();

  const [selected, setSelected] = useState<string[]>(
    initialBarcode ? [initialBarcode] : []
  );
  const [result, setResult] = useState<CompareResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);

  // Map barcode → history item for quick lookup
  const historyMap = useMemo(
    () => Object.fromEntries(history.map((h) => [h.barcode, h])),
    [history]
  );

  // Unique barcodes from history, excluding already selected
  const availableHistory = useMemo(
    () => history.filter((h, i, arr) =>
      arr.findIndex((x) => x.barcode === h.barcode) === i &&
      !selected.includes(h.barcode)
    ),
    [history, selected]
  );

  if (!user?.premium) {
    return (
      <SafeAreaView style={styles.centered}>
        <Ionicons name="star" size={64} color={Colors.info} />
        <Text style={styles.wallTitle}>Función Premium</Text>
        <Text style={styles.wallText}>
          El comparador de productos es exclusivo para usuarios Premium.
        </Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const toggleSelect = (barcode: string) => {
    setSelected((prev) =>
      prev.includes(barcode)
        ? prev.filter((b) => b !== barcode)
        : prev.length < 3 ? [...prev, barcode] : prev
    );
    setResult(null);
    setError(null);
  };

  const handleCompare = async () => {
    if (selected.length < 2) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await api.compareProducts(selected);
      setResult(data);
    } catch {
      setError('No se pudo comparar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const getBestValue = (key: keyof CompareProduct, lowerIsBetter: boolean) => {
    if (!result) return null;
    const vals = result.products.map((p) => p[key] as number);
    return lowerIsBetter ? Math.min(...vals) : Math.max(...vals);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Comparar Productos</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Selected products */}
        <Text style={styles.sectionLabel}>Productos seleccionados ({selected.length}/3)</Text>
        <View style={styles.selectedList}>
          {selected.map((barcode) => {
            const item = historyMap[barcode];
            return (
              <View key={barcode} style={styles.selectedCard}>
                {item?.image_url ? (
                  <Image source={{ uri: item.image_url }} style={styles.selectedImage} contentFit="contain" />
                ) : (
                  <View style={[styles.selectedImage, styles.imagePlaceholder]}>
                    <Ionicons name="cube-outline" size={24} color={Colors.textLight} />
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.selectedName} numberOfLines={2}>
                    {item?.name ?? barcode}
                  </Text>
                  {item?.brand ? <Text style={styles.selectedBrand}>{item.brand}</Text> : null}
                </View>
                <Pressable onPress={() => toggleSelect(barcode)} hitSlop={8}>
                  <Ionicons name="close-circle" size={22} color={Colors.textLight} />
                </Pressable>
              </View>
            );
          })}

          {selected.length < 3 && (
            <Pressable style={styles.addSlot} onPress={() => setPickerVisible(true)}>
              <Ionicons name="add-circle-outline" size={22} color={Colors.primary} />
              <Text style={styles.addSlotText}>
                {selected.length === 0 ? 'Agregar producto' : 'Agregar otro producto'}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Compare button */}
        <Pressable
          style={[styles.compareBtn, selected.length < 2 && styles.compareBtnDisabled]}
          onPress={handleCompare}
          disabled={selected.length < 2 || loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <>
              <Ionicons name="git-compare-outline" size={18} color={Colors.white} />
              <Text style={styles.compareBtnText}>Comparar</Text>
            </>
          )}
        </Pressable>

        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Results */}
        {result && (
          <View style={styles.resultsSection}>
            {/* Recommendation banner */}
            <View style={styles.recommendationBanner}>
              <Ionicons name="trophy" size={20} color={Colors.info} />
              <Text style={styles.recommendationText}>{result.recommendation}</Text>
            </View>

            {/* Comparison table */}
            <View style={styles.table}>
              {/* Header row */}
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableLabelCell]} />
                {result.products.map((p) => (
                  <View
                    key={p.barcode}
                    style={[
                      styles.tableHeaderCell,
                      p.barcode === result.best_barcode && styles.bestHeaderCell,
                    ]}
                  >
                    <Text style={styles.tableHeaderName} numberOfLines={2}>{p.name}</Text>
                    {p.barcode === result.best_barcode && (
                      <View style={styles.bestBadge}>
                        <Text style={styles.bestBadgeText}>Mejor</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>

              {/* Score row with colored badge */}
              <View style={[styles.tableRow, styles.tableRowAlt]}>
                <Text style={[styles.tableCell, styles.tableLabelCell]}>Score</Text>
                {result.products.map((p) => (
                  <View key={p.barcode} style={styles.tableCell}>
                    <View style={[styles.scoreBadge, { backgroundColor: ScoreColors[p.score_label as ScoreLabel] }]}>
                      <Text style={styles.scoreBadgeText}>{p.health_score}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Nutrient rows */}
              {NUTRIENT_ROWS.slice(1).map((row, idx) => {
                const best = getBestValue(row.key, row.lowerIsBetter);
                return (
                  <View key={row.key} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}>
                    <Text style={[styles.tableCell, styles.tableLabelCell]}>{row.label}</Text>
                    {result.products.map((p) => {
                      const val = p[row.key] as number;
                      const isBest = val === best;
                      return (
                        <Text
                          key={p.barcode}
                          style={[styles.tableCell, styles.tableValueCell, isBest && styles.bestValue]}
                        >
                          {typeof val === 'number' ? val.toFixed(row.unit === 'mg' || row.unit === '' ? 0 : 1) : val}
                          {row.unit ? ` ${row.unit}` : ''}
                        </Text>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* History picker modal */}
      <Modal
        visible={pickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setPickerVisible(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Seleccionar producto</Text>
            <Text style={styles.modalSubtitle}>Elige un producto de tu historial</Text>
            {availableHistory.length === 0 ? (
              <View style={styles.emptyPicker}>
                <Ionicons name="time-outline" size={48} color={Colors.textLight} />
                <Text style={styles.emptyPickerText}>
                  {selected.length >= 3
                    ? 'Máximo 3 productos'
                    : 'Escanea más productos para compararlos'}
                </Text>
              </View>
            ) : (
              <FlatList
                data={availableHistory}
                keyExtractor={(item, i) => `${item.barcode}-${i}`}
                style={{ maxHeight: 400 }}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.pickerItem}
                    onPress={() => {
                      toggleSelect(item.barcode);
                      setPickerVisible(false);
                    }}
                  >
                    {item.image_url ? (
                      <Image source={{ uri: item.image_url }} style={styles.pickerImage} contentFit="contain" />
                    ) : (
                      <View style={[styles.pickerImage, styles.imagePlaceholder]}>
                        <Ionicons name="cube-outline" size={20} color={Colors.textLight} />
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.pickerName} numberOfLines={1}>{item.name}</Text>
                      {item.brand ? <Text style={styles.pickerBrand}>{item.brand}</Text> : null}
                    </View>
                    <View style={[styles.miniScore, { backgroundColor: ScoreColors[item.score_label as ScoreLabel] }]}>
                      <Text style={styles.miniScoreText}>{item.health_score}</Text>
                    </View>
                  </Pressable>
                )}
              />
            )}
            <Pressable style={styles.closeModalBtn} onPress={() => setPickerVisible(false)}>
              <Text style={styles.closeModalText}>Cancelar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 16, backgroundColor: Colors.background },
  wallTitle: { fontSize: 22, fontWeight: '800', color: Colors.text, textAlign: 'center' },
  wallText: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  backButton: { backgroundColor: Colors.primary, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 10, marginTop: 8 },
  backButtonText: { color: Colors.white, fontWeight: '700', fontSize: 15 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { fontSize: 18, fontWeight: '800', color: Colors.text },
  content: { padding: 16, gap: 12 },

  sectionLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },

  selectedList: { gap: 8 },
  selectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedImage: { width: 52, height: 52, borderRadius: 8 },
  imagePlaceholder: { justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  selectedName: { fontSize: 14, fontWeight: '600', color: Colors.text },
  selectedBrand: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },

  addSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  addSlotText: { fontSize: 14, fontWeight: '600', color: Colors.primary },

  compareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
  },
  compareBtnDisabled: { opacity: 0.4 },
  compareBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },

  errorText: { color: Colors.red, fontSize: 14, textAlign: 'center' },

  resultsSection: { gap: 12 },
  recommendationBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.infoBg,
    borderWidth: 1,
    borderColor: Colors.infoBorder,
    borderRadius: 12,
    padding: 14,
  },
  recommendationText: { flex: 1, fontSize: 14, color: Colors.infoText, fontWeight: '600', lineHeight: 20 },

  table: { backgroundColor: Colors.surface, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.border },
  tableRowAlt: { backgroundColor: Colors.background },
  tableCell: { flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center' },
  tableLabelCell: { flex: 1.2, alignItems: 'flex-start', justifyContent: 'center' },
  tableHeaderCell: { flex: 1, padding: 10, alignItems: 'center', gap: 4 },
  bestHeaderCell: { backgroundColor: Colors.primaryLight },
  tableHeaderName: { fontSize: 12, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  bestBadge: { backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  bestBadgeText: { color: Colors.white, fontSize: 10, fontWeight: '700' },
  scoreBadge: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  scoreBadgeText: { color: Colors.white, fontWeight: '800', fontSize: 13 },
  tableValueCell: { fontSize: 13, color: Colors.text, textAlign: 'center' },
  bestValue: { color: Colors.primary, fontWeight: '700' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 4,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  modalSubtitle: { fontSize: 13, color: Colors.textSecondary, marginBottom: 12 },
  emptyPicker: { alignItems: 'center', paddingVertical: 32, gap: 10 },
  emptyPickerText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerImage: { width: 44, height: 44, borderRadius: 8 },
  pickerName: { fontSize: 14, fontWeight: '600', color: Colors.text },
  pickerBrand: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  miniScore: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  miniScoreText: { color: Colors.white, fontWeight: '800', fontSize: 12 },
  closeModalBtn: { marginTop: 12, paddingVertical: 12, alignItems: 'center' },
  closeModalText: { fontSize: 15, color: Colors.textSecondary, fontWeight: '600' },
});
