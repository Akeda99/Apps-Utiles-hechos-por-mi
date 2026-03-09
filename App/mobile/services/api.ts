import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://nutriscan-backend-production-d2d6.up.railway.app';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para agregar el token JWT automáticamente
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type ScoreLabel = 'green' | 'yellow' | 'red';

export type Product = {
  id: string;
  barcode: string;
  name: string;
  brand: string | null;
  categories: string[];
  image_url: string | null;
  energy_kcal: number;
  fat_total: number;
  fat_saturated: number;
  fat_trans: number;
  carbohydrates: number;
  sugars: number;
  fiber: number;
  protein: number;
  sodium_mg: number;
  ingredients_text: string | null;
  additives: string[];
  allergens: string[];
  health_score: number | null;
  score_label: ScoreLabel;
  score_details: {
    score: number;
    label: ScoreLabel;
    explanation: string;
    warnings: string[];
    breakdown: { negative_points: number; positive_points: number };
  } | null;
  warnings: string[];
  source: string;
  verified: boolean;
  is_liquid: boolean;
};

export type AdditiveDetail = {
  name: string;
  e_number: string;
  type: string;
  description: string;
  possible_health_effects: string;
  risk_level: 'green' | 'yellow' | 'red';
};

export type DataQuality = {
  is_suspicious: boolean;
  issues: string[];
  confidence: 'high' | 'medium' | 'low';
};

export type ScanResult = {
  product: Product;
  alternatives: Product[];
  additive_details: AdditiveDetail[];
  data_quality: DataQuality;
};

export type User = {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  premium: boolean;
  premium_until: string | null;
  health_conditions: string[] | null;
  contribution_count: number;
  points: number;
};

export type ConfirmationStatus = {
  confirm_count: number;
  reject_count: number;
  needed: number;
  user_action: 'confirm' | 'reject' | null;
};

export type NutrientAnalysis = {
  field: string;
  name: string;
  value: number;
  unit: string;
  level: 'high' | 'medium' | 'low';
  explanation: string;
};

export type AdditiveAnalysis = {
  code: string;
  name: string;
  risk_level: 'green' | 'yellow' | 'red';
  type: string;
  explanation: string;
};

export type AdvancedAnalysis = {
  barcode: string;
  product_name: string;
  nutrients: NutrientAnalysis[];
  additives: AdditiveAnalysis[];
  summary: string;
};

export type HealthAlert = {
  condition: string;
  label: string;
  message: string;
  severity: 'high' | 'medium';
};

export type HealthCheckResult = {
  alerts: HealthAlert[];
  is_safe: boolean;
  message: string;
};

export type HealthCondition = {
  key: string;
  label: string;
};

export type CompareProduct = {
  barcode: string;
  name: string;
  brand: string | null;
  image_url: string | null;
  health_score: number;
  score_label: ScoreLabel;
  sugars: number;
  sodium_mg: number;
  fat_saturated: number;
  energy_kcal: number;
  protein: number;
  fiber: number;
  additives_count: number;
};

export type CompareResult = {
  products: CompareProduct[];
  best_barcode: string;
  best_name: string;
  recommendation: string;
};

export type HistoryItem = Product & {
  scanned_at: string;
};

// ── API calls ─────────────────────────────────────────────────────────────────

export const api = {
  scan: (barcode: string, viewOnly = false): Promise<ScanResult> =>
    apiClient.get(`/scan/${barcode}`, viewOnly ? { params: { view_only: true } } : {}).then((r) => r.data),

  getProduct: (barcode: string): Promise<Product> =>
    apiClient.get(`/products/${barcode}`).then((r) => r.data),

  searchProducts: (q: string) =>
    apiClient.get('/products/', { params: { q } }).then((r) => r.data),

  login: (email: string, password: string) => {
    const form = new URLSearchParams();
    form.append('username', email);
    form.append('password', password);
    return apiClient
      .post('/users/login', form.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .then((r) => r.data);
  },

  register: (email: string, password: string, display_name?: string) =>
    apiClient.post('/users/register', { email, password, display_name }).then((r) => r.data),

  getMe: (): Promise<User> =>
    apiClient.get('/users/me').then((r) => r.data),

  getHistory: (page = 1) =>
    apiClient.get('/users/me/history', { params: { page } }).then((r) => r.data),

  getFavorites: (): Promise<Product[]> =>
    apiClient.get('/users/me/favorites').then((r) => r.data),

  addFavorite: (productId: string) =>
    apiClient.post(`/users/me/favorites/${productId}`).then((r) => r.data),

  removeFavorite: (productId: string) =>
    apiClient.delete(`/users/me/favorites/${productId}`),

  contribute: (data: Record<string, unknown>) =>
    apiClient.post('/contributions/', data).then((r) => r.data),

  reportProduct: (barcode: string, reason: string, comment?: string) =>
    apiClient.post(`/reports/${barcode}`, { reason, comment }).then((r) => r.data),

  googleLogin: (access_token: string) =>
    apiClient.post('/users/google-login', { access_token }).then((r) => r.data),

  forgotPassword: (email: string) =>
    apiClient.post('/users/forgot-password', { email }).then((r) => r.data),

  resetPassword: (token: string, new_password: string) =>
    apiClient.post('/users/reset-password', { token, new_password }).then((r) => r.data),

  suggestProductEdit: (barcode: string, changes: Record<string, string>, comment?: string) =>
    apiClient.post('/suggestions/', { barcode, changes, comment }).then((r) => r.data),

  searchAdditives: (q: string): Promise<{ e_number: string; name: string; risk_level: string; type: string; description: string; possible_health_effects: string }[]> =>
    apiClient.get('/products/additives/search', { params: { q } }).then((r) => r.data),

  // ── Premium ───────────────────────────────────────────────────────────────
  getAdvancedAnalysis: (barcode: string): Promise<AdvancedAnalysis> =>
    apiClient.get(`/premium/products/${barcode}/advanced-analysis`).then((r) => r.data),

  getHealthProfile: (): Promise<{ conditions: string[]; supported_conditions: HealthCondition[] }> =>
    apiClient.get('/premium/me/health-profile').then((r) => r.data),

  updateHealthProfile: (conditions: string[]) =>
    apiClient.put('/premium/me/health-profile', { conditions }).then((r) => r.data),

  getHealthCheck: (barcode: string): Promise<HealthCheckResult> =>
    apiClient.get(`/premium/products/${barcode}/health-check`).then((r) => r.data),

  compareProducts: (barcodes: string[]): Promise<CompareResult> =>
    apiClient.post('/premium/products/compare', { barcodes }).then((r) => r.data),

  confirmProduct: (barcode: string, action: 'confirm' | 'reject') =>
    apiClient.post(`/contributions/${barcode}/confirm`, { action }).then((r) => r.data),

  getConfirmationStatus: (barcode: string): Promise<ConfirmationStatus> =>
    apiClient.get(`/contributions/${barcode}/confirmation-status`).then((r) => r.data),

  deleteAccount: () =>
    apiClient.delete('/users/me'),

  getLeaderboard: (): Promise<{ rank: number; display_name: string; points: number; contribution_count: number }[]> =>
    apiClient.get('/users/leaderboard').then((r) => r.data),

  uploadProductImage: async (barcode: string, imageUri: string): Promise<string> => {
    const formData = new FormData();
    const filename = imageUri.split('/').pop() ?? 'photo.jpg';
    const ext = filename.split('.').pop()?.toLowerCase() ?? 'jpg';
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
    formData.append('file', { uri: imageUri, name: filename, type: mimeType } as any);
    const res = await apiClient.post(`/products/${barcode}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.image_url;
  },
};
