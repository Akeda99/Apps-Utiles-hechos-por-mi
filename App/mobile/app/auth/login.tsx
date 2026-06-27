import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  Pressable, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// Carga diferida y tolerante: el módulo nativo no existe en Expo Go (solo en dev/production builds).
let GoogleSignin: typeof import('@react-native-google-signin/google-signin').GoogleSignin | null = null;
let statusCodes: typeof import('@react-native-google-signin/google-signin').statusCodes | Record<string, never> = {};
try {
  const googleSignin = require('@react-native-google-signin/google-signin');
  GoogleSignin = googleSignin.GoogleSignin;
  statusCodes = googleSignin.statusCodes;
} catch {
  // No disponible en este entorno (ej. Expo Go) — el botón de Google queda deshabilitado.
}

import { useProductStore } from '@/store/useProductStore';
import { api } from '@/services/api';
import { Colors } from '@/constants/colors';

type Screen = 'login' | 'register' | 'forgot' | 'reset';

function PasswordInput({
  value, onChangeText, placeholder, visible, onToggleVisible,
}: {
  value: string; onChangeText: (v: string) => void; placeholder: string;
  visible: boolean; onToggleVisible: () => void;
}) {
  return (
    <View style={styles.passwordWrapper}>
      <TextInput
        style={styles.passwordInput}
        placeholder={placeholder}
        placeholderTextColor={Colors.textLight}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!visible}
      />
      <Pressable style={styles.passwordToggle} onPress={onToggleVisible} hitSlop={8}>
        <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textLight} />
      </Pressable>
    </View>
  );
}

export default function LoginScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const [screen, setScreen] = useState<Screen>(mode === 'register' ? 'register' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const { login, register, googleLogin } = useProductStore();

  useEffect(() => {
    GoogleSignin?.configure({
      webClientId: '32565345224-9mf40u0j8f9n5dbcc8o5q7vvtqg1ggds.apps.googleusercontent.com',
    });
  }, []);

  const handleGoogleSignIn = async () => {
    if (!GoogleSignin) {
      setError('Inicio de sesión con Google no disponible en este entorno.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      await googleLogin(tokens.accessToken);
      router.back();
    } catch (error: any) {
      if (error.code !== statusCodes.SIGN_IN_CANCELLED) {
        setError('Error al iniciar sesión con Google. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (screen === 'login') {
      if (!email || !password) { setError('Completa todos los campos'); return; }
      setLoading(true);
      try {
        await login(email, password);
        router.back();
      } catch (e: any) {
        setError(e?.response?.data?.detail || 'Credenciales incorrectas');
      } finally { setLoading(false); }

    } else if (screen === 'register') {
      if (!email || !password) { setError('Completa todos los campos'); return; }
      if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return; }
      if (password !== confirmPassword) { setError('Las contraseñas no coinciden'); return; }
      setLoading(true);
      try {
        await register(email, password, name);
        router.back();
      } catch (e: any) {
        setError(e?.response?.data?.detail || 'Error al crear la cuenta');
      } finally { setLoading(false); }

    } else if (screen === 'forgot') {
      if (!email) { setError('Ingresa tu correo electrónico'); return; }
      setLoading(true);
      try {
        await api.forgotPassword(email);
        setSuccess('Si el correo existe, recibirás un código de 6 dígitos.');
        setScreen('reset');
      } catch {
        setSuccess('Si el correo existe, recibirás un código de 6 dígitos.');
        setScreen('reset');
      } finally { setLoading(false); }

    } else if (screen === 'reset') {
      if (!resetToken || !newPassword) { setError('Completa todos los campos'); return; }
      if (newPassword.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return; }
      if (newPassword !== confirmNewPassword) { setError('Las contraseñas no coinciden'); return; }
      setLoading(true);
      try {
        await api.resetPassword(resetToken, newPassword);
        setSuccess('¡Contraseña actualizada! Ahora puedes iniciar sesión.');
        setScreen('login');
      } catch (e: any) {
        setError(e?.response?.data?.detail || 'Código inválido o expirado');
      } finally { setLoading(false); }
    }
  };

  const titles: Record<Screen, string> = {
    login: 'Iniciar sesión',
    register: 'Crear cuenta',
    forgot: 'Recuperar contraseña',
    reset: 'Nueva contraseña',
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inner}
      >
        <Text style={styles.logo}>AlimentaPerú</Text>
        <Text style={styles.title}>{titles[screen]}</Text>

        <View style={styles.form}>
          {screen === 'register' && (
            <TextInput
              style={styles.input}
              placeholder="Tu nombre"
              placeholderTextColor={Colors.textLight}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          )}

          {(screen === 'login' || screen === 'register' || screen === 'forgot') && (
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor={Colors.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}

          {(screen === 'login' || screen === 'register') && (
            <PasswordInput
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              visible={showPassword}
              onToggleVisible={() => setShowPassword((v) => !v)}
            />
          )}

          {screen === 'register' && (
            <PasswordInput
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              visible={showConfirmPassword}
              onToggleVisible={() => setShowConfirmPassword((v) => !v)}
            />
          )}

          {screen === 'reset' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Código de 6 dígitos"
                placeholderTextColor={Colors.textLight}
                value={resetToken}
                onChangeText={setResetToken}
                keyboardType="number-pad"
              />
              <PasswordInput
                placeholder="Nueva contraseña"
                value={newPassword}
                onChangeText={setNewPassword}
                visible={showNewPassword}
                onToggleVisible={() => setShowNewPassword((v) => !v)}
              />
              <PasswordInput
                placeholder="Confirmar nueva contraseña"
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                visible={showConfirmNewPassword}
                onToggleVisible={() => setShowConfirmNewPassword((v) => !v)}
              />
            </>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.successText}>{success}</Text> : null}

          <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.submitText}>{titles[screen]}</Text>
            )}
          </Pressable>

          {screen === 'login' && (
            <Pressable onPress={() => { setError(''); setSuccess(''); setScreen('forgot'); }}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </Pressable>
          )}

          {(screen === 'login' || screen === 'register') && (
            <>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>o</Text>
                <View style={styles.dividerLine} />
              </View>
              <Pressable
                style={styles.googleButton}
                onPress={handleGoogleSignIn}
                disabled={loading}
              >
                <Text style={styles.googleButtonText}>Continuar con Google</Text>
              </Pressable>
            </>
          )}
        </View>

        {(screen === 'login' || screen === 'register') && (
          <Pressable onPress={() => { setError(''); setSuccess(''); setScreen(screen === 'login' ? 'register' : 'login'); }}>
            <Text style={styles.switchText}>
              {screen === 'register'
                ? '¿Ya tienes cuenta? Inicia sesión'
                : '¿No tienes cuenta? Regístrate gratis'}
            </Text>
          </Pressable>
        )}

        {(screen === 'forgot' || screen === 'reset') && (
          <Pressable onPress={() => { setError(''); setSuccess(''); setScreen('login'); }}>
            <Text style={styles.switchText}>Volver al inicio de sesión</Text>
          </Pressable>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { flex: 1, justifyContent: 'center', padding: 28, gap: 8 },
  logo: { fontSize: 32, fontWeight: '900', color: Colors.primary, textAlign: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: Colors.text, textAlign: 'center', marginBottom: 16 },
  form: { gap: 12 },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
  },
  passwordWrapper: { position: 'relative', justifyContent: 'center' },
  passwordInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 44,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
  },
  passwordToggle: {
    position: 'absolute',
    right: 14,
    height: '100%',
    justifyContent: 'center',
  },
  error: { color: Colors.red, fontSize: 14, textAlign: 'center' },
  successText: { color: Colors.green, fontSize: 14, textAlign: 'center' },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  forgotText: { color: Colors.textLight, fontSize: 14, textAlign: 'center', marginTop: 4 },
  switchText: { color: Colors.primary, fontSize: 15, textAlign: 'center', marginTop: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { color: Colors.textLight, fontSize: 13 },
  googleButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  googleButtonText: { color: Colors.text, fontSize: 15, fontWeight: '600' },
});
