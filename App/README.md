# NutriScan Peru — Sistema Full-Stack

App de nutrición que escanea productos peruanos por código de barras y calcula un **health score** basado en aditivos.  
Sistema completo: app móvil publicada en Google Play + API REST propia desplegada en Railway.

---

## Stack

| Capa | Tecnología |
|---|---|
| App móvil | React Native · Expo SDK 54 · expo-router v6 |
| Estado global | Zustand |
| Backend | FastAPI · async SQLAlchemy · asyncpg |
| Base de datos | PostgreSQL (Supabase) |
| Autenticación | JWT (bcrypt directo) · Google Sign-In |
| Deploy | Railway (backend) · EAS Build (APK/AAB) |

---

## Estructura del repositorio

```
App/
├── mobile/          # App React Native / Expo
│   ├── app/         # Rutas (expo-router)
│   ├── services/    # Cliente HTTP
│   ├── store/       # Estado Zustand
│   └── eas.json     # Perfiles: development, preview (APK), production (AAB)
└── backend/         # API REST FastAPI
    ├── app/
    │   ├── api/         # Endpoints (users, products, scores)
    │   └── services/    # Lógica de negocio (aditivos, health score, alternativas)
    └── recalculate_scores.py
```

---

## Lógica de puntuación

- Aditivo **rojo** → score = 0 automáticamente
- Aditivo **amarillo** → −25 pts cada uno (máx −75)
- Base score 100, descontando según aditivos detectados

---

## Correr el backend localmente

```bash
cd App/backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# Swagger UI → http://localhost:8000/docs
```

## Correr la app móvil

```bash
cd App/mobile
npm install
npx expo start
```

---

## Backend en producción

```
https://nutriscan-backend-production-d2d6.up.railway.app/docs
```

---

## Publicación

- **Google Play**: acceso a producción aprobado
- **Bundle ID**: `com.nutriscanperu.app`
- **EAS Project**: `6ba031ec-bf72-4199-8f85-d1e68d8b4870`

---

© 2026 Ray Cardenas. Todos los derechos reservados.
