import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="dark" />
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
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
