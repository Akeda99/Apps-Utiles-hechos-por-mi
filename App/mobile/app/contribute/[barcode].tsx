import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, Pressable, ActivityIndicator, Alert, Image,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { apiClient, api } from '@/services/api';
import { Colors } from '@/constants/colors';
import { useProductStore } from '@/store/useProductStore';

type Field = { key: string; label: string; unit?: string; numeric?: boolean };

// Campos nutricionales: la base (100g, 200g, personalizada) se aplica como factor antes de enviar,
// así el backend siempre recibe valores normalizados por 100g/ml sin necesitar cambios.
const NUTRIENT_FIELDS: Field[] = [
  { key: 'energy_kcal', label: 'Energía', unit: 'kcal', numeric: true },
  { key: 'fat_total', label: 'Grasas totales', unit: 'g', numeric: true },
  { key: 'fat_saturated', label: 'Grasas saturadas', unit: 'g', numeric: true },
  { key: 'carbohydrates', label: 'Carbohidratos', unit: 'g', numeric: true },
  { key: 'sugars', label: 'Azúcares', unit: 'g', numeric: true },
  { key: 'fiber', label: 'Fibra', unit: 'g', numeric: true },
  { key: 'protein', label: 'Proteínas', unit: 'g', numeric: true },
  { key: 'sodium_mg', label: 'Sodio', unit: 'mg', numeric: true },
];

const FIELDS: Field[] = [
  { key: 'name', label: 'Nombre del producto' },
  { key: 'brand', label: 'Marca' },
  ...NUTRIENT_FIELDS,
];

const BASIS_PRESETS = [100, 200];

export default function ContributeScreen() {
  const { barcode } = useLocalSearchParams<{ barcode: string }>();
  const { refreshUser } = useProductStore();
  const [form, setForm] = useState<Record<string, string>>({});
  const [additives, setAdditives] = useState<string[]>([]);
  const [additiveInput, setAdditiveInput] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [basisAmount, setBasisAmount] = useState<number>(100);
  const [basisUnit, setBasisUnit] = useState<'g' | 'ml'>('g');
  const [customBasis, setCustomBasis] = useState(false);
  const [customBasisInput, setCustomBasisInput] = useState('');

  const addAdditive = () => {
    const code = additiveInput.trim().toUpperCase();
    if (!code) return;
    const normalized = code.startsWith('E') ? code : `E${code}`;
    if (!additives.includes(normalized)) {
      setAdditives((prev) => [...prev, normalized]);
    }
    setAdditiveInput('');
  };

  const removeAdditive = (code: string) => {
    setAdditives((prev) => prev.filter((a) => a !== code));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para agregar una foto.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu cámara.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleImagePress = () => {
    Alert.alert('Foto del producto', 'Elige una opción', [
      { text: 'Tomar foto', onPress: takePhoto },
      { text: 'Elegir de galería', onPress: pickImage },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleSubmit = async () => {
    if (!form.name) {
      Alert.alert('Error', 'El nombre del producto es obligatorio');
      return;
    }
    if (basisAmount <= 0) {
      Alert.alert('Error', 'La cantidad de referencia debe ser mayor a 0');
      return;
    }
    setLoading(true);
    try {
      // Normaliza a "por 100g/ml" según la base que eligió el usuario (100g, 200g, personalizada),
      // así el backend siempre recibe los valores en la misma escala sin necesitar cambios.
      const scale = 100 / basisAmount;
      const scaled = (key: string) =>
        form[key] ? Math.round(parseFloat(form[key]) * scale * 100) / 100 : undefined;

      await apiClient.post('/contributions/', {
        barcode,
        ...form,
        energy_kcal: scaled('energy_kcal'),
        fat_total: scaled('fat_total'),
        fat_saturated: scaled('fat_saturated'),
        carbohydrates: scaled('carbohydrates'),
        sugars: scaled('sugars'),
        fiber: scaled('fiber'),
        protein: scaled('protein'),
        sodium_mg: scaled('sodium_mg'),
        additives,
      });

      // Subir foto si el usuario seleccionó una
      if (imageUri) {
        try {
          await api.uploadProductImage(barcode!, imageUri);
        } catch {
          // No bloquear el flujo si la foto falla
        }
      }

      await refreshUser();

      Alert.alert(
        '¡Gracias! +10 puntos',
        'Tu contribución fue enviada y ya está visible en la app.',
        [{ text: 'Ver producto', onPress: () => router.replace(`/product/${barcode}?viewOnly=true`) }]
      );
    } catch {
      Alert.alert('Error', 'No pudimos enviar tu contribución. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.barcodeBox}>
          <Text style={styles.barcodeLabel}>Código de barras</Text>
          <Text style={styles.barcodeValue}>{barcode}</Text>
        </View>

        <Text style={styles.instructions}>
          Completa los datos desde la etiqueta nutricional.
          Solo el nombre es obligatorio. Ganas +10 puntos al contribuir.
        </Text>

        {/* Foto del producto */}
        <Pressable style={styles.imagePicker} onPress={handleImagePress}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={36} color={Colors.textLight} />
              <Text style={styles.imagePlaceholderText}>Agregar foto del producto</Text>
              <Text style={styles.imagePlaceholderSub}>Toca para tomar o elegir</Text>
            </View>
          )}
          {imageUri && (
            <View style={styles.imageChangeOverlay}>
              <Ionicons name="camera" size={20} color={Colors.white} />
            </View>
          )}
        </Pressable>

        {/* Cantidad de referencia para los valores nutricionales */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Cantidad de referencia</Text>
          <Text style={styles.fieldHint}>Ingresa los valores tal como aparecen en la etiqueta, para esta cantidad</Text>
          <View style={styles.basisRow}>
            {BASIS_PRESETS.map((preset) => (
              <Pressable
                key={preset}
                style={[styles.basisChip, !customBasis && basisAmount === preset && styles.basisChipActive]}
                onPress={() => { setCustomBasis(false); setBasisAmount(preset); }}
              >
                <Text style={[styles.basisChipText, !customBasis && basisAmount === preset && styles.basisChipTextActive]}>
                  {preset}{basisUnit}
                </Text>
              </Pressable>
            ))}
            <Pressable
              style={[styles.basisChip, customBasis && styles.basisChipActive]}
              onPress={() => setCustomBasis(true)}
            >
              <Text style={[styles.basisChipText, customBasis && styles.basisChipTextActive]}>Personalizado</Text>
            </Pressable>
            <Pressable
              style={styles.unitToggle}
              onPress={() => setBasisUnit((u) => (u === 'g' ? 'ml' : 'g'))}
            >
              <Text style={styles.unitToggleText}>{basisUnit}</Text>
            </Pressable>
          </View>
          {customBasis && (
            <TextInput
              style={[styles.input, { marginTop: 8 }]}
              placeholder={`Cantidad en ${basisUnit} (ej: 30)`}
              placeholderTextColor={Colors.textLight}
              value={customBasisInput}
              onChangeText={(v) => {
                setCustomBasisInput(v);
                const n = parseFloat(v);
                setBasisAmount(Number.isFinite(n) && n > 0 ? n : 0);
              }}
              keyboardType="decimal-pad"
            />
          )}
        </View>

        {FIELDS.map((field) => (
          <View key={field.key} style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              {field.label}
              {field.unit ? (
                <Text style={styles.fieldUnit}> ({field.unit}/{basisAmount || '?'}{basisUnit})</Text>
              ) : null}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={field.label}
              placeholderTextColor={Colors.textLight}
              value={form[field.key] || ''}
              onChangeText={(v) => setForm((prev) => ({ ...prev, [field.key]: v }))}
              keyboardType={field.numeric ? 'decimal-pad' : 'default'}
            />
          </View>
        ))}

        {/* Lista de ingredientes */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Lista de ingredientes</Text>
          <TextInput
            style={styles.inputLarge}
            placeholder="Escribe la lista de ingredientes del producto..."
            placeholderTextColor={Colors.textLight}
            value={form.ingredients_text || ''}
            onChangeText={(v) => setForm((prev) => ({ ...prev, ingredients_text: v }))}
            multiline
            textAlignVertical="top"
            scrollEnabled
          />
        </View>

        {/* Aditivos */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Aditivos (E-numbers)</Text>
          <Text style={styles.fieldHint}>Escribe el código (ej: E211) y presiona Agregar</Text>
          <View style={styles.additiveRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="E211, E330..."
              placeholderTextColor={Colors.textLight}
              value={additiveInput}
              onChangeText={setAdditiveInput}
              autoCapitalize="characters"
              onSubmitEditing={addAdditive}
            />
            <Pressable style={styles.addBtn} onPress={addAdditive}>
              <Text style={styles.addBtnText}>Agregar</Text>
            </Pressable>
          </View>
          {additives.length > 0 && (
            <View style={styles.tagContainer}>
              {additives.map((code) => (
                <Pressable key={code} style={styles.tag} onPress={() => removeAdditive(code)}>
                  <Text style={styles.tagText}>{code}</Text>
                  <Ionicons name="close" size={14} color={Colors.primary} />
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.submitText}>Enviar contribución</Text>
          )}
        </Pressable>
      </ScrollView>
      </KeyboardAvoidingView>
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
  imagePicker: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
    height: 160,
  },
  imagePreview: { width: '100%', height: '100%', resizeMode: 'cover' },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  imagePlaceholderText: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary },
  imagePlaceholderSub: { fontSize: 13, color: Colors.textLight },
  imageChangeOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    padding: 6,
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
  inputLarge: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    height: 180,
    textAlignVertical: 'top',
  },
  fieldHint: { fontSize: 12, color: Colors.textLight, marginTop: -4 },
  basisRow: { flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' },
  basisChip: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  basisChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  basisChipText: { fontSize: 13, fontWeight: '600', color: Colors.text },
  basisChipTextActive: { color: Colors.white },
  unitToggle: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  unitToggleText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  additiveRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: { color: Colors.primary, fontWeight: '600', fontSize: 13 },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
