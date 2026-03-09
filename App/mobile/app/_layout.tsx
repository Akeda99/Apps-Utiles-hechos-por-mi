import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { Colors } from '@/constants/colors';
import { storage } from '@/services/storage';

function TermsConsentModal({ onAccept }: { onAccept: () => void }) {
  const [showingTerms, setShowingTerms] = useState(false);

  const [hasReadAll, setHasReadAll] = useState(false);

  if (showingTerms) {
    return (
      <Modal visible transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={[styles.card, styles.cardFull]}>
            <Text style={styles.cardTitle}>Términos y Privacidad</Text>
            {!hasReadAll && (
              <Text style={styles.scrollHint}>Desplázate hasta el final para aceptar</Text>
            )}
            <ScrollView
              style={styles.termsScroll}
              showsVerticalScrollIndicator
              onScroll={({ nativeEvent }) => {
                const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
                if (isBottom) setHasReadAll(true);
              }}
              scrollEventThrottle={16}
            >
              <Text style={styles.termsSectionTitle}>DESCARGO DE RESPONSABILIDAD</Text>
              <Text style={styles.termsText}>
                La información proporcionada en AlimentaPerú tiene fines informativos y educativos
                únicamente. No constituye asesoramiento médico, nutricional ni profesional.{'\n\n'}
                Para recomendaciones específicas sobre salud, dieta o condiciones médicas, consulte
                a un profesional de la salud calificado.
              </Text>

              <Text style={styles.termsSectionTitle}>FUENTE DE LOS DATOS</Text>
              <Text style={styles.termsText}>
                Parte de la información proviene de Open Food Facts, base de datos pública
                contribuida por la comunidad. No se garantiza que toda la información sea
                completamente precisa o actualizada.{'\n\n'}
                Siempre verifique la información en el etiquetado físico del producto.
              </Text>

              <Text style={styles.termsSectionTitle}>PRECISIÓN DE LA INFORMACIÓN</Text>
              <Text style={styles.termsText}>
                La aplicación puede contener errores u omisiones. Los usuarios deben verificar
                la información directamente en el etiquetado del producto antes de tomar
                decisiones de consumo.
              </Text>

              <Text style={styles.termsSectionTitle}>USO BAJO RESPONSABILIDAD DEL USUARIO</Text>
              <Text style={styles.termsText}>
                AlimentaPerú no se responsabiliza por decisiones de consumo tomadas con base
                en la información mostrada en la aplicación.
              </Text>

              <Text style={styles.termsSectionTitle}>CONTENIDO GENERADO POR USUARIOS</Text>
              <Text style={styles.termsText}>
                Los usuarios que envíen contribuciones o reportes son responsables del contenido
                que proporcionen. Nos reservamos el derecho de eliminar contenido incorrecto
                o inapropiado.
              </Text>

              <Text style={styles.termsSectionTitle}>LIMITACIÓN DE RESPONSABILIDAD</Text>
              <Text style={styles.termsText}>
                En la medida permitida por la ley, los desarrolladores no serán responsables
                por daños derivados del uso de la aplicación.
              </Text>

              <Text style={styles.termsSectionTitle}>PRIVACIDAD</Text>
              <Text style={styles.termsText}>
                Recopilamos: correo electrónico, historial de escaneos, favoritos y
                contribuciones. Usamos esta información únicamente para brindar las funciones
                de la app. No vendemos ni compartimos tu información con terceros.{'\n\n'}
                Puedes solicitar la eliminación de tu cuenta escribiendo a:
                nutriscanperu@gmail.com
              </Text>

              <Text style={styles.termsSectionTitle}>MODIFICACIONES</Text>
              <Text style={styles.termsText}>
                Nos reservamos el derecho de modificar estos términos en cualquier momento.
                Los cambios serán publicados dentro de la aplicación.{'\n\n'}
                AlimentaPerú © 2025
              </Text>
            </ScrollView>

            <View style={styles.cardButtons}>
              <Pressable style={styles.secondaryBtn} onPress={() => setShowingTerms(false)}>
                <Text style={styles.secondaryBtnText}>Volver</Text>
              </Pressable>
              <Pressable
                style={[styles.acceptBtn, !hasReadAll && styles.acceptBtnDisabled]}
                onPress={onAccept}
                disabled={!hasReadAll}
              >
                <Text style={styles.acceptBtnText}>
                  {hasReadAll ? 'Aceptar y continuar' : 'Lee hasta el final'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bienvenido a AlimentaPerú</Text>
          <Text style={styles.cardBody}>
            Esta app analiza productos alimenticios con fines informativos y educativos únicamente.
            No constituye asesoramiento médico ni nutricional.{'\n\n'}
            Al continuar aceptas nuestros{' '}
            <Text style={styles.link}>Términos de uso</Text>
            {' '}y{' '}
            <Text style={styles.link}>Política de privacidad</Text>.
          </Text>
          <View style={styles.cardButtons}>
            <Pressable style={styles.secondaryBtn} onPress={() => setShowingTerms(true)}>
              <Text style={styles.secondaryBtnText}>Leer términos</Text>
            </Pressable>
            <Pressable style={styles.acceptBtn} onPress={onAccept}>
              <Text style={styles.acceptBtnText}>Aceptar y continuar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function RootLayout() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    storage.hasAcceptedTerms().then((accepted) => {
      if (!accepted) setShowConsent(true);
    });
  }, []);

  const handleAccept = async () => {
    await storage.acceptTerms();
    setShowConsent(false);
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="dark" />
      {showConsent && <TermsConsentModal onAccept={handleAccept} />}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="product/[barcode]"
          options={{
            headerShown: true,
            headerTitle: 'Detalle del producto',
            headerBackTitle: 'Atrás',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="auth/login"
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="contribute/[barcode]"
          options={{
            headerShown: true,
            headerTitle: 'Agregar producto',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="leaderboard"
          options={{
            headerShown: true,
            headerTitle: 'Ranking',
            headerBackTitle: 'Perfil',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="terms"
          options={{
            headerShown: true,
            headerTitle: 'Términos y privacidad',
            headerBackTitle: 'Atrás',
            presentation: 'card',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    zIndex: 999,
  },
  card: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    gap: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
  },
  cardBody: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 23,
    textAlign: 'center',
  },
  link: {
    color: Colors.primary,
    fontWeight: '600',
  },
  cardButtons: {
    gap: 10,
    marginTop: 8,
  },
  secondaryBtn: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600',
  },
  acceptBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  acceptBtnText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '700',
  },
  cardFull: {
    maxHeight: '90%',
  },
  scrollHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  acceptBtnDisabled: {
    backgroundColor: Colors.textLight,
  },
  termsScroll: {
    flexGrow: 0,
    marginBottom: 12,
  },
  termsSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 6,
  },
  termsText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
