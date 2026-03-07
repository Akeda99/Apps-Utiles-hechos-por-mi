import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, Pressable, ActivityIndicator, Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { apiClient } from '@/services/api';
import { Colors } from '@/constants/colors';

type Field = { key: string; label: string; unit?: string; numeric?: boolean };

const FIELDS: Field[] = [
  { key: 'name', label: 'Nombre del producto' },
  { key: 'brand', label: 'Marca' },
  { key: 'energy_kcal', label: 'Energía', unit: 'kcal/100g', numeric: true },
  { key: 'fat_total', label: 'Grasas totales', unit: 'g/100g', numeric: true },
  { key: 'fat_saturated', label: 'Grasas saturadas', unit: 'g/100g', numeric: true },
  { key: 'carbohydrates', label: 'Carbohidratos', unit: 'g/100g', numeric: true },
  { key: 'sugars', label: 'Azúcares', unit: 'g/100g', numeric: true },
  { key: 'fiber', label: 'Fibra', unit: 'g/100g', numeric: true },
  { key: 'protein', label: 'Proteínas', unit: 'g/100g', numeric: true },
  { key: 'sodium_mg', label: 'Sodio', unit: 'mg/100g', numeric: true },
  { key: 'ingredients_text', label: 'Lista de ingredientes' },
];

export default function ContributeScreen() {
  const { barcode } = useLocalSearchParams<{ barcode: string }>();
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name) {
      Alert.alert('Error', 'El nombre del producto es obligatorio');
      return;
    }
    setLoading(true);
    try {
      await apiClient.post('/contributions/', {
        barcode,
        ...form,
        energy_kcal: form.energy_kcal ? parseFloat(form.energy_kcal) : undefined,
        fat_total: form.fat_total ? parseFloat(form.fat_total) : undefined,
        fat_saturated: form.fat_saturated ? parseFloat(form.fat_saturated) : undefined,
        carbohydrates: form.carbohydrates ? parseFloat(form.carbohydrates) : undefined,
        sugars: form.sugars ? parseFloat(form.sugars) : undefined,
        fiber: form.fiber ? parseFloat(form.fiber) : undefined,
        protein: form.protein ? parseFloat(form.protein) : undefined,
        sodium_mg: form.sodium_mg ? parseFloat(form.sodium_mg) : undefined,
      });
      Alert.alert(
        'Gracias!',
        'Tu contribucion fue enviada. La revisaremos pronto.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch {
      Alert.alert('Error', 'No pudimos enviar tu contribucion. Intentalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.barcodeBox}>
          <Text style={styles.barcodeLabel}>Codigo de barras</Text>
          <Text style={styles.barcodeValue}>{barcode}</Text>
        </View>

        <Text style={styles.instructions}>
          Completa los datos del producto desde la etiqueta nutricional.
          Solo el nombre es obligatorio.
        </Text>

        {FIELDS.map((field) => (
          <View key={field.key} style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              {field.label}
              {field.unit ? <Text style={styles.fieldUnit}> ({field.unit})</Text> : null}
            </Text>
            <TextInput
              style={[styles.input, field.key === 'ingredients_text' && styles.inputMultiline]}
              placeholder={field.label}
              placeholderTextColor={Colors.textLight}
              value={form[field.key] || ''}
              onChangeText={(v) => setForm((prev) => ({ ...prev, [field.key]: v }))}
              keyboardType={field.numeric ? 'decimal-pad' : 'default'}
              multiline={field.key === 'ingredients_text'}
              numberOfLines={field.key === 'ingredients_text' ? 4 : 1}
            />
          </View>
        ))}

        <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.submitText}>Enviar contribucion</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  barcodeBox: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barcodeLabel: { fontSize: 14, color: Colors.textSecondary },
  barcodeValue: { fontSize: 16, fontWeight: '700', color: Colors.text },
  instructions: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
  },
  fieldGroup: { gap: 6 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: Colors.text },
  fieldUnit: { fontWeight: '400', color: Colors.textSecondary },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
  },
  inputMultiline: { height: 100, textAlignVertical: 'top' },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
