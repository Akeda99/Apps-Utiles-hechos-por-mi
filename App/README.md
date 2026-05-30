<p align="right">
  <a href="#english">English</a> · <a href="#español">Español</a>
</p>

---

## Español

# NutriScan Peru — Sistema Full-Stack

App de nutrición que escanea productos peruanos por código de barras y calcula un **health score** basado en aditivos.  
Sistema completo: app móvil publicada en Google Play + API REST propia desplegada en Railway.

### Stack

| Capa | Tecnología |
|---|---|
| App móvil | React Native · Expo SDK 54 · expo-router v6 |
| Estado global | Zustand |
| Backend | FastAPI · async SQLAlchemy · asyncpg |
| Base de datos | PostgreSQL (Supabase) |
| Autenticación | JWT (bcrypt) · Google Sign-In |
| Deploy | Railway (backend) · EAS Build (APK/AAB) |

### Estructura

```
App/
├── mobile/          # App React Native / Expo
│   ├── app/         # Rutas (expo-router)
│   ├── services/    # Cliente HTTP
│   └── store/       # Estado Zustand
└── backend/         # API REST FastAPI
    └── app/
        ├── api/         # Endpoints
        └── services/    # Health score, aditivos, alternativas
```

### Lógica de puntuación

- Aditivo **rojo** → score = 0 automáticamente
- Aditivo **amarillo** → −25 pts (máx −75)
- Base 100 pts, descuento por aditivos detectados

### Correr localmente

```bash
# Backend
cd App/backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# Swagger → http://localhost:8000/docs

# App móvil
cd App/mobile
npm install
npx expo start
```

### Backend en producción
```
https://nutriscan-backend-production-d2d6.up.railway.app/docs
```

---

## English

# NutriScan Peru — Full-Stack System

Nutrition app that scans Peruvian products by barcode and calculates a **health score** based on food additives.  
Complete system: mobile app published on Google Play + custom REST API deployed on Railway.

### Stack

| Layer | Technology |
|---|---|
| Mobile app | React Native · Expo SDK 54 · expo-router v6 |
| Global state | Zustand |
| Backend | FastAPI · async SQLAlchemy · asyncpg |
| Database | PostgreSQL (Supabase) |
| Auth | JWT (bcrypt) · Google Sign-In |
| Deploy | Railway (backend) · EAS Build (APK/AAB) |

### Structure

```
App/
├── mobile/          # React Native / Expo app
│   ├── app/         # Routes (expo-router)
│   ├── services/    # HTTP client
│   └── store/       # Zustand state
└── backend/         # FastAPI REST API
    └── app/
        ├── api/         # Endpoints
        └── services/    # Health score, additives, alternatives
```

### Scoring logic

- **Red** additive → score = 0 automatically
- **Yellow** additive → −25 pts (max −75)
- Base 100 pts, discounted per detected additive

### Run locally

```bash
# Backend
cd App/backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# Swagger → http://localhost:8000/docs

# Mobile app
cd App/mobile
npm install
npx expo start
```

### Production backend
```
https://nutriscan-backend-production-d2d6.up.railway.app/docs
```

---

© 2026 Ray Cardenas. All rights reserved.
