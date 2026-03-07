import { create } from 'zustand';
import { api, type Product, type User, type ScanResult } from '@/services/api';
import { authStorage } from '@/services/auth';
import { storage, type LocalHistoryItem } from '@/services/storage';

async function migrateLocalFavoritesToServer() {
  const local = await storage.getLocalFavorites();
  if (local.length === 0) return;
  await Promise.allSettled(local.map((f) => api.addFavorite(f.id)));
  await storage.clearLocalFavorites();
}

type ProductStore = {
  // Auth
  user: User | null;
  isLoadingUser: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  googleLogin: (accessToken: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;

  // Scan
  scanProduct: (barcode: string) => Promise<ScanResult>;

  // History
  history: LocalHistoryItem[];
  isLoadingHistory: boolean;
  loadHistory: () => Promise<void>;
  refreshHistoryItem: (product: Product) => Promise<void>;

  // Favorites
  favorites: Product[];
  isLoadingFavorites: boolean;
  loadFavorites: () => Promise<void>;
  addFavorite: (product: Product) => Promise<void>;
  removeFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
};

export const useProductStore = create<ProductStore>((set, get) => ({
  // ── Auth ──────────────────────────────────────────────────────────────────
  user: null,
  isLoadingUser: false,

  login: async (email, password) => {
    const data = await api.login(email, password);
    await authStorage.saveToken(data.access_token);
    set({ user: data.user });
    await migrateLocalFavoritesToServer();
    get().loadFavorites();
    get().loadHistory();
  },

  googleLogin: async (accessToken) => {
    const data = await api.googleLogin(accessToken);
    await authStorage.saveToken(data.access_token);
    set({ user: data.user });
    await migrateLocalFavoritesToServer();
    get().loadFavorites();
    get().loadHistory();
  },

  register: async (email, password, name) => {
    const data = await api.register(email, password, name);
    await authStorage.saveToken(data.access_token);
    set({ user: data.user });
    await migrateLocalFavoritesToServer();
    get().loadFavorites();
  },

  logout: async () => {
    await authStorage.deleteToken();
    set({ user: null, favorites: [], history: [] });
  },

  loadUser: async () => {
    // Cargar favoritos locales siempre (sin importar sesión)
    get().loadFavorites();
    const token = await authStorage.getToken();
    if (!token) return;
    set({ isLoadingUser: true });
    try {
      const user = await api.getMe();
      set({ user });
      // Recargar favoritos del servidor al autenticarse
      get().loadFavorites();
    } catch {
      await authStorage.deleteToken();
    } finally {
      set({ isLoadingUser: false });
    }
  },

  // ── Scan ──────────────────────────────────────────────────────────────────
  scanProduct: async (barcode) => {
    const result = await api.scan(barcode);
    // Guardar en historial local siempre (sin importar si hay sesión)
    await storage.addToLocalHistory(result.product);
    // Si no hay sesión, actualizar también el snapshot guardado en AsyncStorage
    if (!get().user) {
      await storage.refreshLocalFavorite(result.product);
    }
    // Actualizar historial y favoritos en memoria con datos frescos
    const history = await storage.getLocalHistory();
    set((state) => ({
      history,
      favorites: state.favorites.map((f) =>
        f.id === result.product.id ? result.product : f
      ),
    }));
    return result;
  },

  // ── History ───────────────────────────────────────────────────────────────
  history: [],
  isLoadingHistory: false,

  loadHistory: async () => {
    set({ isLoadingHistory: true });
    try {
      const { user } = get();
      if (user) {
        // Historial del servidor para usuarios autenticados
        const data = await api.getHistory();
        const items = data.results
          .filter((r: any) => r.product)
          .map((r: any) => ({ ...r.product, scanned_at: r.scanned_at }));
        set({ history: items });
      } else {
        // Historial local para usuarios sin sesión
        const local = await storage.getLocalHistory();
        set({ history: local });
      }
    } catch {
      const local = await storage.getLocalHistory();
      set({ history: local });
    } finally {
      set({ isLoadingHistory: false });
    }
  },

  refreshHistoryItem: async (product) => {
    await storage.refreshLocalHistoryItem(product);
    set((state) => ({
      history: state.history.map((h) =>
        h.barcode === product.barcode ? { ...h, ...product } : h
      ),
    }));
  },

  // ── Favorites ─────────────────────────────────────────────────────────────
  favorites: [],
  isLoadingFavorites: false,

  loadFavorites: async () => {
    const { user } = get();
    set({ isLoadingFavorites: true });
    try {
      if (user) {
        const favorites = await api.getFavorites();
        set({ favorites });
      } else {
        // Sin sesión: cargar desde AsyncStorage
        const favorites = await storage.getLocalFavorites();
        set({ favorites });
      }
    } finally {
      set({ isLoadingFavorites: false });
    }
  },

  addFavorite: async (product) => {
    const { user } = get();
    if (user) {
      await api.addFavorite(product.id);
    } else {
      await storage.addLocalFavorite(product);
    }
    set((state) => ({ favorites: [product, ...state.favorites.filter((f) => f.id !== product.id)] }));
  },

  removeFavorite: async (productId) => {
    const { user } = get();
    if (user) {
      await api.removeFavorite(productId);
    } else {
      await storage.removeLocalFavorite(productId);
    }
    set((state) => ({
      favorites: state.favorites.filter((f) => f.id !== productId),
    }));
  },

  isFavorite: (productId) => {
    return get().favorites.some((f) => f.id === productId);
  },
}));
