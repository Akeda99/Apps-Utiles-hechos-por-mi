import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Product } from './api';

const HISTORY_KEY     = 'scan_history_local';
const FAVORITES_KEY   = 'favorites_local';
const SUGGESTIONS_KEY = 'product_suggestions_local';
const MAX_LOCAL_HISTORY = 50;

export type LocalHistoryItem = Product & { scanned_at: string };

export type LocalSuggestion = {
  barcode: string;
  product_name: string;
  changes: Record<string, string>;
  comment?: string;
  submitted_at: string;
};

export const storage = {
  // ── Historial ────────────────────────────────────────────────────────────
  async getLocalHistory(): Promise<LocalHistoryItem[]> {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  async addToLocalHistory(product: Product): Promise<void> {
    const history = await storage.getLocalHistory();
    const filtered = history.filter((h) => h.barcode !== product.barcode);
    const updated: LocalHistoryItem[] = [
      { ...product, scanned_at: new Date().toISOString() },
      ...filtered,
    ].slice(0, MAX_LOCAL_HISTORY);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  },

  async clearLocalHistory(): Promise<void> {
    await AsyncStorage.removeItem(HISTORY_KEY);
  },

  // ── Favoritos locales (sin sesión) ───────────────────────────────────────
  async getLocalFavorites(): Promise<Product[]> {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  async addLocalFavorite(product: Product): Promise<void> {
    const favs = await storage.getLocalFavorites();
    if (favs.some((f) => f.id === product.id)) return;
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify([product, ...favs]));
  },

  async removeLocalFavorite(productId: string): Promise<void> {
    const favs = await storage.getLocalFavorites();
    await AsyncStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favs.filter((f) => f.id !== productId))
    );
  },

  async refreshLocalFavorite(product: Product): Promise<void> {
    const favs = await storage.getLocalFavorites();
    if (!favs.some((f) => f.id === product.id)) return;
    await AsyncStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favs.map((f) => (f.id === product.id ? product : f)))
    );
  },

  async clearLocalFavorites(): Promise<void> {
    await AsyncStorage.removeItem(FAVORITES_KEY);
  },

  // ── Sugerencias enviadas ─────────────────────────────────────────────────
  async getLocalSuggestions(): Promise<LocalSuggestion[]> {
    const raw = await AsyncStorage.getItem(SUGGESTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  async addLocalSuggestion(suggestion: LocalSuggestion): Promise<void> {
    const list = await storage.getLocalSuggestions();
    await AsyncStorage.setItem(SUGGESTIONS_KEY, JSON.stringify([suggestion, ...list]));
  },
};
