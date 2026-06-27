import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { api } from '@/services/api';
import type { HealthCondition } from '@/services/api';
import { Colors } from '@/constants/colors';

export default function HealthProfileScreen() {
  const [conditions, setConditions] = useState<string[]>([]);
  const [supported, setSupported] = useState<HealthCondition[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getHealthProfile()
      .then(({ conditions: c, supported_conditions: s }) => {
        setConditions(c);
        setSupported(s);
      })
      .catch(() => Alert.alert('Error', 'No se pudo cargar tu perfil de salud.'))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (key: string) => {
    setConditions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateHealthProfile(conditions);
      Alert.alert('Guardado', 'Tu perfil de salud fue actualizado.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Error', 'No se pudo guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Perfil de salud</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.description}>
              Selecciona tus condiciones de salud para recibir alertas personalizadas al escanear productos.
            </Text>

            {supported.map((c) => {
              const active = conditions.includes(c.key);
              return (
                <Pressable key={c.key} style={[styles.item, active && styles.itemActive]} onPress={() => toggle(c.key)}>
                  <Text style={[styles.itemLabel, active && styles.itemLabelActive]}>{c.label}</Text>
                  {active && <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />}
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={[styles.saveButton, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
              {saving
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.saveButtonText}>Guardar cambios</Text>
              }
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: { width: 40 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16, gap: 10 },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  itemActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  itemLabel: { fontSize: 16, color: Colors.text },
  itemLabelActive: { fontWeight: '600', color: Colors.primary },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
