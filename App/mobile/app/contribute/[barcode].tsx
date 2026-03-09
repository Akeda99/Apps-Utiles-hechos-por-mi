import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, Pressable, ActivityIndicator, Alert, Image,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { apiClient, api } from '@/services/api';
import { Colors } from '@/constants/colors';
import { useProductStore } from '@/store/useProductStore';

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
  const { refreshUser } = useProductStore();
  const [form, setForm] = useState<Record<string, string>>({});
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch {
      Alert.alert('Error', 'No pudimos enviar tu contribución. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
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
            <Text style={styles.submitText}>Enviar contribución</Text>
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
