import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  ActivityIndicator, Pressable, Alert, Modal,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { HealthScoreWheel } from '@/components/HealthScoreWheel';
import { NutrientTrafficLight } from '@/components/NutrientTrafficLight';
import { WarningBadge } from '@/components/WarningBadge';
import { AlternativeCard } from '@/components/AlternativeCard';
import { useProductStore } from '@/store/useProductStore';
import { Colors, ScoreColors } from '@/constants/colors';
import { api } from '@/services/api';
import type { ScoreLabel } from '@/constants/colors';
import type { Product, AdditiveDetail, DataQuality } from '@/services/api';

const RISK_COLORS = {
  green:  { bg: '#D4EDDA', border: '#C3E6CB', text: '#155724', dot: '#28a745' },
  yellow: { bg: '#FFF3CD', border: '#FFEAA7', text: '#856404', dot: '#f0ad4e' },
  red:    { bg: '#F8D7DA', border: '#F5C6CB', text: '#721C24', dot: '#dc3545' },
};

const RISK_LABELS = { green: 'Seguro', yellow: 'Precaución', red: 'Riesgo' };

const ADDITIVE_TYPE_LABELS: Record<string, string> = {
  colorante: 'Colorante',
  conservante: 'Conservante',
  antioxidante: 'Antioxidante',
  emulsionante: 'Emulsionante',
  espesante: 'Espesante',
  estabilizador: 'Estabilizador',
  gelificante: 'Gelificante',
  potenciador_sabor: 'Potenciador de sabor',
  edulcorante: 'Edulcorante',
  acidulante: 'Acidulante',
  regulador_acidez: 'Regulador de acidez',
  humectante: 'Humectante',
  leudante: 'Leudante',
  antiaglomerante: 'Antiaglomerante',
  agente_glaseado: 'Agente de glaseado',
  agente_mejorante: 'Mejorador',
  antiespumante: 'Antiespumante',
  gas_empaquetado: 'Gas de empaque',
  desconocido: 'Aditivo',
};

const REPORT_REASONS = [
  { value: 'nutricion_incorrecta', label: 'Información nutricional incorrecta' },
  { value: 'ingredientes_incorrectos', label: 'Ingredientes incorrectos' },
  { value: 'producto_equivocado', label: 'Producto equivocado' },
  { value: 'datos_falsos', label: 'Datos falsos o inventados' },
  { value: 'otro', label: 'Otro motivo' },
];

function buildQuickSummary(
  product: Product,
  additiveDetails: AdditiveDetail[],
): { icon: string; text: string; color: string; bg: string }[] {
  const chips: { icon: string; text: string; color: string; bg: string }[] = [];

  // Aditivos
  const redAdditives = additiveDetails.filter((a) => a.risk_level === 'red').length;
  const yellowAdditives = additiveDetails.filter((a) => a.risk_level === 'yellow').length;
  if (redAdditives > 0) {
    chips.push({ icon: 'warning', text: `${redAdditives} aditivo${redAdditives > 1 ? 's' : ''} de riesgo`, color: '#721C24', bg: '#F8D7DA' });
  } else if (yellowAdditives > 0) {
    chips.push({ icon: 'alert-circle', text: `${yellowAdditives} aditivo${yellowAdditives > 1 ? 's' : ''} con precaución`, color: '#856404', bg: '#FFF3CD' });
  } else if (additiveDetails.length === 0) {
    chips.push({ icon: 'checkmark-circle', text: 'Sin aditivos detectados', color: '#155724', bg: '#D4EDDA' });
  } else {
    chips.push({ icon: 'checkmark-circle', text: 'Aditivos seguros', color: '#155724', bg: '#D4EDDA' });
  }

  // Sodio
  if (product.sodium_mg >= 600) {
    chips.push({ icon: 'alert-circle', text: 'Muy alto en sodio', color: '#721C24', bg: '#F8D7DA' });
  } else if (product.sodium_mg >= 300) {
    chips.push({ icon: 'alert-circle', text: 'Alto en sodio', color: '#856404', bg: '#FFF3CD' });
  }

  // Azúcares
  if (product.sugars >= 22.5) {
    chips.push({ icon: 'alert-circle', text: 'Muy alto en azúcares', color: '#721C24', bg: '#F8D7DA' });
  } else if (product.sugars >= 12) {
    chips.push({ icon: 'alert-circle', text: 'Alto en azúcares', color: '#856404', bg: '#FFF3CD' });
  }

  // Grasas saturadas
  if (product.fat_saturated >= 5) {
    chips.push({ icon: 'alert-circle', text: 'Alto en grasas saturadas', color: '#856404', bg: '#FFF3CD' });
  }

  // Grasas trans
  if (product.fat_trans > 0) {
    chips.push({ icon: 'close-circle', text: 'Contiene grasas trans', color: '#721C24', bg: '#F8D7DA' });
  }

  // Proteína positiva
  if (product.protein >= 10) {
    chips.push({ icon: 'trending-up', text: 'Buena fuente de proteína', color: '#155724', bg: '#D4EDDA' });
  }

  // Fibra positiva
  if (product.fiber >= 3) {
    chips.push({ icon: 'leaf', text: 'Buena fuente de fibra', color: '#155724', bg: '#D4EDDA' });
  }

  return chips;
}

export default function ProductDetailScreen() {
  const { barcode } = useLocalSearchParams<{ barcode: string }>();
  const { scanProduct, addFavorite, removeFavorite, isFavorite } = useProductStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [alternatives, setAlternatives] = useState<Product[]>([]);
  const [additiveDetails, setAdditiveDetails] = useState<AdditiveDetail[]>([]);
  const [dataQuality, setDataQuality] = useState<DataQuality | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedAdditive, setExpandedAdditive] = useState<string | null>(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);

  const isFav = product ? isFavorite(product.id) : false;

  useEffect(() => {
    if (!barcode) return;
    (async () => {
      try {
        const result = await scanProduct(barcode);
        setProduct(result.product);
        setAlternatives(result.alternatives || []);
        setAdditiveDetails(result.additive_details || []);
        setDataQuality(result.data_quality || null);
      } catch (e: any) {
        const detail = e?.response?.data?.detail;
        if (detail?.can_contribute) {
          setError('not_found');
        } else {
          setError('error');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [barcode]);

  const handleReport = async (reason: string) => {
    if (!barcode) return;
    setReportSubmitting(true);
    try {
      await api.reportProduct(barcode, reason);
      setReportModalVisible(false);
      Alert.alert('Reporte enviado', 'Gracias por ayudar a mejorar NutriScan Peru.');
    } catch {
      Alert.alert('Error', 'No se pudo enviar el reporte. Intenta nuevamente.');
    } finally {
      setReportSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Analizando producto...</Text>
      </View>
    );
  }

  if (error === 'not_found') {
    return (
      <SafeAreaView style={styles.centered}>
        <Ionicons name="search-outline" size={64} color={Colors.textLight} />
        <Text style={styles.notFoundTitle}>Producto no encontrado</Text>
        <Text style={styles.notFoundText}>
          Este producto no está en nuestra base de datos todavía.
        </Text>
        <Pressable
          style={styles.contributeButton}
          onPress={() => router.push(`/contribute/${barcode}`)}
        >
          <Text style={styles.contributeButtonText}>Agregar este producto</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundTitle}>Error al cargar el producto</Text>
      </View>
    );
  }

  const scoreColor = ScoreColors[product.score_label as ScoreLabel] ?? Colors.textLight;
  const quickSummary = buildQuickSummary(product, additiveDetails);

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={[styles.productHeader, { borderBottomColor: scoreColor + '40' }]}>
          <Image
            source={{ uri: product.image_url ?? undefined }}
            style={styles.productImage}
            contentFit="contain"
          />
          <View style={styles.productTitleSection}>
            <Text style={styles.productName}>{product.name}</Text>
            {product.brand ? <Text style={styles.brand}>{product.brand}</Text> : null}
          </View>
          <Pressable
            style={styles.favoriteButton}
            onPress={() => isFav ? removeFavorite(product.id) : addFavorite(product)}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={28}
              color={isFav ? Colors.red : Colors.textLight}
            />
          </Pressable>
        </View>

        {/* Health Score */}
        <View style={styles.scoreSection}>
          <HealthScoreWheel score={product.health_score ?? 0} label={product.score_label as ScoreLabel} />
          <View style={styles.explanationBox}>
            <Text style={styles.explanation}>
              {product.score_details?.explanation ?? ''}
            </Text>
          </View>
        </View>

        {/* Resumen rápido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <View style={styles.chipsContainer}>
            {quickSummary.map((chip, i) => (
              <View key={i} style={[styles.chip, { backgroundColor: chip.bg }]}>
                <Ionicons name={chip.icon as any} size={14} color={chip.color} />
                <Text style={[styles.chipText, { color: chip.color }]}>{chip.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Aviso de datos sospechosos */}
        {dataQuality?.is_suspicious && (
          <View style={styles.qualityWarningBox}>
            <Ionicons name="warning-outline" size={20} color="#856404" />
            <View style={{ flex: 1 }}>
              <Text style={styles.qualityWarningTitle}>Datos posiblemente incorrectos</Text>
              {dataQuality.issues.map((issue, i) => (
                <Text key={i} style={styles.qualityWarningItem}>• {issue}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Advertencias (octágonos) */}
        {product.warnings && product.warnings.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Advertencias Ley 30021</Text>
            <View style={styles.warningsRow}>
              {product.warnings.map((w) => (
                <WarningBadge key={w} warning={w} />
              ))}
            </View>
          </View>
        )}

        {/* Semáforo nutricional */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrición</Text>
          <Text style={styles.sectionSubtitle}>Por cada 100g / 100ml</Text>
          <NutrientTrafficLight product={product} />

          {/* Tabla colapsable */}
          <Pressable style={styles.toggleButton} onPress={() => setShowNutrition(!showNutrition)}>
            <Text style={styles.toggleButtonText}>
              {showNutrition ? 'Ocultar tabla completa' : 'Ver tabla completa'}
            </Text>
            <Ionicons
              name={showNutrition ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={Colors.primary}
            />
          </Pressable>

          {showNutrition && (
            <View style={styles.nutritionTable}>
              <NutritionRow label="Energía" value={`${product.energy_kcal?.toFixed(0) ?? 0} kcal`} />
              <NutritionRow label="Grasas totales" value={`${product.fat_total?.toFixed(1) ?? 0} g`} />
              <NutritionRow label="Grasas saturadas" value={`${product.fat_saturated?.toFixed(1) ?? 0} g`} indent />
              <NutritionRow label="Grasas trans" value={`${product.fat_trans?.toFixed(1) ?? 0} g`} indent />
              <NutritionRow label="Carbohidratos" value={`${product.carbohydrates?.toFixed(1) ?? 0} g`} />
              <NutritionRow label="Azúcares" value={`${product.sugars?.toFixed(1) ?? 0} g`} indent />
              <NutritionRow label="Fibra" value={`${product.fiber?.toFixed(1) ?? 0} g`} />
              <NutritionRow label="Proteínas" value={`${product.protein?.toFixed(1) ?? 0} g`} />
              <NutritionRow label="Sodio" value={`${product.sodium_mg?.toFixed(0) ?? 0} mg`} />
            </View>
          )}
        </View>

        {/* Aditivos */}
        {additiveDetails.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Aditivos</Text>
            <Text style={styles.sectionSubtitle}>
              {additiveDetails.length} detectado{additiveDetails.length !== 1 ? 's' : ''} · Toca para ver detalles
            </Text>
            <View style={styles.additivesList}>
              {additiveDetails.map((additive) => (
                <AdditiveCard
                  key={additive.e_number}
                  additive={additive}
                  expanded={expandedAdditive === additive.e_number}
                  onToggle={() =>
                    setExpandedAdditive(
                      expandedAdditive === additive.e_number ? null : additive.e_number
                    )
                  }
                />
              ))}
            </View>
          </View>
        )}

        {/* Ingredientes colapsables */}
        {product.ingredients_text && (
          <View style={styles.section}>
            <Pressable style={styles.toggleButton} onPress={() => setShowIngredients(!showIngredients)}>
              <Text style={styles.sectionTitle}>Ingredientes</Text>
              <Ionicons
                name={showIngredients ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={Colors.primary}
              />
            </Pressable>
            {showIngredients && (
              <Text style={styles.ingredientsText}>{product.ingredients_text}</Text>
            )}
          </View>
        )}

        {/* Alternativas */}
        {alternatives.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alternativas más saludables</Text>
            <View style={styles.alternativesList}>
              {alternatives.map((alt) => (
                <AlternativeCard key={alt.id} product={alt} />
              ))}
            </View>
          </View>
        )}

        {/* Botón de reportar */}
        <View style={styles.section}>
          <Pressable style={styles.reportButton} onPress={() => setReportModalVisible(true)}>
            <Ionicons name="flag-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.reportButtonText}>Reportar información incorrecta</Text>
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal de reporte */}
      <Modal
        visible={reportModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setReportModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setReportModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <Text style={styles.modalTitle}>Reportar información incorrecta</Text>
            <Text style={styles.modalSubtitle}>¿Cuál es el problema con este producto?</Text>
            {REPORT_REASONS.map((r) => (
              <Pressable
                key={r.value}
                style={({ pressed }) => [styles.reportReasonButton, pressed && { opacity: 0.7 }]}
                onPress={() => handleReport(r.value)}
                disabled={reportSubmitting}
              >
                <Text style={styles.reportReasonText}>{r.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
              </Pressable>
            ))}
            <Pressable style={styles.cancelButton} onPress={() => setReportModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function AdditiveCard({
  additive, expanded, onToggle,
}: {
  additive: AdditiveDetail;
  expanded: boolean;
  onToggle: () => void;
}) {
  const colors = RISK_COLORS[additive.risk_level];
  const typeLabel = ADDITIVE_TYPE_LABELS[additive.type] ?? additive.type;

  return (
    <Pressable
      style={[styles.additiveCard, { borderColor: colors.border, backgroundColor: colors.bg }]}
      onPress={onToggle}
    >
      <View style={styles.additiveCardHeader}>
        <View style={[styles.riskDot, { backgroundColor: colors.dot }]} />
        <View style={styles.additiveCardTitles}>
          <Text style={[styles.additiveName, { color: colors.text }]}>{additive.name}</Text>
          <Text style={[styles.additiveSubtitle, { color: colors.text + 'AA' }]}>
            {additive.e_number} · {typeLabel}
          </Text>
        </View>
        <View style={[styles.riskBadge, { backgroundColor: colors.dot }]}>
          <Text style={styles.riskBadgeText}>{RISK_LABELS[additive.risk_level]}</Text>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.text}
          style={{ marginLeft: 6 }}
        />
      </View>

      {expanded && (
        <View style={styles.additiveExpanded}>
          <Text style={[styles.additiveDetailLabel, { color: colors.text }]}>¿Qué es?</Text>
          <Text style={[styles.additiveDetailText, { color: colors.text }]}>
            {additive.description}
          </Text>
          <Text style={[styles.additiveDetailLabel, { color: colors.text, marginTop: 10 }]}>
            Posibles efectos en la salud
          </Text>
          <Text style={[styles.additiveDetailText, { color: colors.text }]}>
            {additive.possible_health_effects}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

function NutritionRow({
  label, value, indent = false,
}: {
  label: string; value: string; indent?: boolean;
}) {
  return (
    <View style={[styles.nutritionRow, indent && styles.nutritionRowIndented]}>
      <Text style={[styles.nutritionLabel, indent && styles.nutritionLabelIndented]}>
        {label}
      </Text>
      <Text style={styles.nutritionValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 32 },
  loadingText: { color: Colors.textSecondary, fontSize: 16 },
  notFoundTitle: { fontSize: 20, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  notFoundText: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  contributeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  contributeButtonText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  productHeader: {
    backgroundColor: Colors.surface,
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    gap: 12,
  },
  productImage: { width: 140, height: 140 },
  productTitleSection: { alignItems: 'center' },
  productName: { fontSize: 20, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  brand: { fontSize: 15, color: Colors.textSecondary, marginTop: 4 },
  favoriteButton: { position: 'absolute', top: 20, right: 20 },
  scoreSection: { alignItems: 'center', padding: 24, gap: 16 },
  explanationBox: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  explanation: { fontSize: 15, color: Colors.text, lineHeight: 22, textAlign: 'center' },
  // Resumen rápido
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipText: { fontSize: 13, fontWeight: '600' },
  // Quality warning
  qualityWarningBox: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    backgroundColor: '#FFF3CD',
    borderWidth: 1,
    borderColor: '#FFEAA7',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
  },
  qualityWarningTitle: { fontSize: 14, fontWeight: '700', color: '#856404', marginBottom: 4 },
  qualityWarningItem: { fontSize: 13, color: '#856404', lineHeight: 20 },
  section: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, color: Colors.textSecondary, marginBottom: 12 },
  warningsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  // Toggle button
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleButtonText: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  // Nutrition
  nutritionTable: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  nutritionRowIndented: { paddingLeft: 28, backgroundColor: Colors.background },
  nutritionLabel: { fontSize: 15, color: Colors.text },
  nutritionLabelIndented: { fontSize: 14, color: Colors.textSecondary },
  nutritionValue: { fontSize: 15, fontWeight: '600', color: Colors.text },
  ingredientsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  // Aditivos
  additivesList: { gap: 10 },
  additiveCard: {
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  additiveCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  riskDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  additiveCardTitles: { flex: 1 },
  additiveName: { fontSize: 14, fontWeight: '700' },
  additiveSubtitle: { fontSize: 12, marginTop: 1 },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  riskBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  additiveExpanded: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
    padding: 12,
  },
  additiveDetailLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  additiveDetailText: { fontSize: 13, lineHeight: 20, marginTop: 4 },
  alternativesList: { gap: 12 },
  // Report
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reportButtonText: { fontSize: 14, color: Colors.textSecondary },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 8,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  modalSubtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 8 },
  reportReasonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reportReasonText: { fontSize: 15, color: Colors.text },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
  },
  cancelButtonText: { fontSize: 15, color: Colors.textSecondary, fontWeight: '600' },
});
