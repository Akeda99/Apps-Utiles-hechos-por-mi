import { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  Dimensions, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

export const ONBOARDING_KEY = 'onboarding_done';

const slides = [
  {
    icon: 'scan-outline' as const,
    color: Colors.primary,
    title: 'Escanea cualquier producto',
    description: 'Apunta la cámara al código de barras y obtén al instante el perfil nutricional completo.',
  },
  {
    icon: 'flask-outline' as const,
    color: Colors.red,
    title: 'Conoce los aditivos',
    description: 'Identificamos aditivos peligrosos y te explicamos qué contiene realmente tu comida.',
  },
  {
    icon: 'heart-outline' as const,
    color: Colors.green,
    title: 'Elige lo más saludable',
    description: 'Compara productos y descubre alternativas más saludables para ti y tu familia.',
  },
];

export default function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      finish();
    }
  };

  const finish = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/(tabs)/scanner');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Pressable style={styles.skipBtn} onPress={finish}>
        <Text style={styles.skipText}>Saltar</Text>
      </Pressable>

      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon} size={80} color={item.color} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>

        <Pressable style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextText}>
            {activeIndex === slides.length - 1 ? 'Empezar' : 'Siguiente'}
          </Text>
          <Ionicons
            name={activeIndex === slides.length - 1 ? 'checkmark' : 'arrow-forward'}
            size={20}
            color={Colors.white}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  skipBtn: { alignSelf: 'flex-end', padding: 16 },
  skipText: { color: Colors.textSecondary, fontSize: 15 },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 24,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 24,
    alignItems: 'center',
  },
  dots: { flexDirection: 'row', gap: 8 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    width: '100%',
    justifyContent: 'center',
  },
  nextText: { color: Colors.white, fontSize: 17, fontWeight: '700' },
});
