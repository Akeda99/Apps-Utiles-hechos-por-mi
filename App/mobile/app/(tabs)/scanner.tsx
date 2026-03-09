import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { BarcodeScanner } from '@/components/BarcodeScanner';
import { Colors } from '@/constants/colors';
import { useProductStore } from '@/store/useProductStore';
import { storage, FREE_DAILY_LIMIT } from '@/services/storage';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scansUsed, setScansUsed] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const { user } = useProductStore();

  const isFreePlan = !user?.premium;

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      if (isFreePlan) {
        storage.getDailyScansUsed().then(setScansUsed);
      }
      return () => {
        setIsFocused(false);
      };
    }, [isFreePlan])
  );

  const handleScan = useCallback(
    async (barcode: string) => {
      if (scanned) return;
      setScanned(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push(`/product/${barcode}`);
      setTimeout(() => setScanned(false), 2500);
    },
    [scanned]
  );

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Acceso a la cámara</Text>
        <Text style={styles.permissionText}>
          Necesitamos acceso a tu cámara para escanear los códigos de barras de los productos.
        </Text>
        <Pressable style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Dar permiso</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && <BarcodeScanner onScan={handleScan} />}

      {/* Header flotante */}
      <SafeAreaView style={styles.header} edges={['top']}>
        <Text style={styles.headerTitle}>NutriScan Peru</Text>
        <Text style={styles.headerSubtitle}>Escanea el código de barras</Text>
      </SafeAreaView>

      {/* Instrucciones inferiores */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Apunta la cámara al código de barras del producto
        </Text>
        {isFreePlan && (
          <View style={[
            styles.scanCountBadge,
            scansUsed >= FREE_DAILY_LIMIT - 2 && styles.scanCountBadgeWarning,
          ]}>
            <Text style={styles.scanCountText}>
              {FREE_DAILY_LIMIT - scansUsed} escaneos restantes hoy
            </Text>
          </View>
        )}
        {scanned && (
          <View style={styles.scanningBadge}>
            <Text style={styles.scanningText}>Buscando producto...</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.background,
    gap: 16,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  permissionButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 12,
  },
  footerText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  scanCountBadge: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  scanCountBadgeWarning: {
    backgroundColor: 'rgba(220,38,38,0.75)',
    borderColor: 'rgba(255,100,100,0.4)',
  },
  scanCountText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '600',
  },
  scanningBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scanningText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});
